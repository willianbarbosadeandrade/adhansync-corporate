# 5. Arquitetura do Sistema

A arquitetura do AdhanSync Corporate segue princípios de Clean Architecture, multi-tenant e separação clara entre contexto de domínio, serviços de aplicação e interfaces (API, painel Blazor e extensão). Esta versão descreve um panorama C4-lite, camadas, decisões tecnológicas e fluxos de sequência principais.

---

## 5.1 Visão de Contexto (C4 Nível 1)

```text
[Usuários RH/Gestores] ──(HTTPS/Browser)──> [Painel Blazor]
[Colaboradores] ──(Extensão Chromium)──> [API AdhanSync]
[Workers] ──> [Banco PostgreSQL / Cache]
[API] ──> [Serviços externos: Geolocalização, SMTP, Calendários]
```

- Todos os canais autenticam via API (JWT + refresh + OrganizationId).
- Painel e extensão consomem a API pública `/api/v1/...`. Workers utilizam o mesmo domínio de aplicação, executados como serviços hospedados ou Hangfire.

---

## 5.2 Visão de Contêineres (C4 Nível 2)

| Contêiner | Tecnologia | Responsabilidades |
|-----------|------------|-------------------|
| **AdhanSync.Api** | ASP.NET Core 8, Minimal APIs/Controllers | Autenticação, endpoints REST, validações, versionamento, documentação (Swagger). |
| **AdhanSync.Core** | .NET Class Library | Entidades, Value Objects, regras de negócio, serviços de cálculo, contratos de repositório. |
| **AdhanSync.Infrastructure** | .NET Class Library + EF Core | Implementações de repositório, DbContext multi-tenant com filtros globais, integração com serviços externos (geolocalização, e-mail), Serilog. |
| **AdhanSync.Admin.Web** | Blazor Server | UI administrativa, consumo da API, state management, controle de acesso baseado em papéis. |
| **AdhanSync.Workers** | .NET Worker Service / Hangfire | Jobs recorrentes (cálculo, notificações, limpeza). |
| **Extensão de Navegador** | TypeScript, Manifest V3 | Interface simplificada para colaboradores, armazenamento local, notificações do navegador. |
| **Banco de Dados** | PostgreSQL | Persistência multi-tenant; partições por data para `PrayerTime`. |
| **Cache** | Redis (planejado) | Armazena horários calculados e tokens de sessão para reduzir latência. |

---

## 5.3 Camadas da Arquitetura

### 5.3.1 Camada de Domínio (AdhanSync.Core)

Contém:
- Entidades: `Organization`, `User`, `PrayerSettings`, `PrayerTime`, `Location`, `NotificationPolicy`, `NotificationLog`, `UserPreference`, `RefreshToken`, `AuditLog`.
- Value Objects: `GeoCoordinates`, `PrayerCalculationConfig`, `TenantContext`.
- Serviços de cálculo baseados em bibliotecas como **PrayTimes.NET** ou algoritmos próprios validados com dados oficiais.
- Interfaces de repositório (`IOrganizationRepository`, `IPrayerTimeRepository`, etc.).
- Estratégias para suporte multi-tenant e eventos de domínio (ex.: `PrayerPolicyChangedEvent`).

### 5.3.2 Camada de Infraestrutura (AdhanSync.Infrastructure)

- EF Core + PostgreSQL com `DbContext` configurado para filtros de tenant.
- Migrações versionadas; `schema_version` controlado para rollback.
- Providers externos:
  - **Geolocalização**: Google Maps Geocoding ou OpenCage (com fallback).
  - **Cálculo de horários**: PrayTimes.NET adaptado + validações.
  - **Envio de e-mail**: SMTP corporativo ou SendGrid.
- Redis para caching de horários e tokens de refresh revogados.
- Serilog com sinks para console, arquivos e Application Insights (futuro).
- Mensageria opcional (RabbitMQ/Azure Service Bus) planejada para fases posteriores.

### 5.3.3 Camada de Aplicação / API (AdhanSync.Api)

- Exposição de endpoints REST `/api/v1/...` com versionamento por rota.
- Middleware multi-tenant que injeta OrganizationId a partir do JWT.
- Autenticação JWT + refresh; suporte a MFA quando habilitado.
- DTOs e mapeamentos (AutoMapper) garantindo contratos estáveis com clientes.
- Políticas de autorização baseadas em papéis e claims específicas (ex.: `Policies.CanManagePolicies`).

### 5.3.4 Painel Administrativo (AdhanSync.Admin.Web)

- Blazor Server com componentes Razor, autenticação contra API usando tokens armazenados com segurança.
- Consumo de APIs via HttpClient tipado.
- State management com `AuthenticationStateProvider` customizado.
- Componentes compartilhados (cards, tabelas, wizard de configuração) respeitando guidelines de acessibilidade e internacionalização.

### 5.3.5 Extensão de Navegador

- TypeScript + Vite (build) seguindo Manifest V3.
- Armazenamento em `chrome.storage.sync` para preferências e `chrome.storage.local` para cache de horários.
- Comunicação com API via fetch + tokens armazenados no storage seguro; refresh silencioso via `alarms` API.
- UI em Lit/React lightweight (a definir) com suporte LTR/RTL.

### 5.3.6 Worker (AdhanSync.Workers)

- HostedService ou Hangfire executando jobs:
  - `DailyPrayerCalculationJob` (00h local por tenant).
  - `NotificationDispatchJob` (antes de cada oração, com fila).
  - `RamadanPolicyJob` (ajustes específicos). 
  - `TokenCleanupJob` (revogação e limpeza). 
- Observabilidade via Serilog + métricas (Prometheus ou Application Insights).

---

## 5.4 Diagramas Textuais de Componentes (C4 Nível 3)

### 5.4.1 API

```text
[Controller/Endpoint]
   → [Application Service]
      → [Domain Service / Aggregates]
         → [Repository Interface]
            → [EF Core Implementation]
               → [PostgreSQL]
   ↘ [Notification Service] → [SMTP / Push]
```

### 5.4.2 Extensão

```text
[Popup UI Component]
   → [ScheduleStore]
      → [API Client]
         ↔ [AdhanSync.Api]
   → [NotificationManager]
      ↔ [chrome.notifications]
   → [SettingsProvider]
      ↔ [chrome.storage]
```

---

## 5.5 Fluxos de Sequência Principais

1. **Login e obtenção de horários (Fatima)**:
   - Extensão envia `POST /api/v1/auth/login` → API valida credenciais → gera JWT com OrganizationId → responde.
   - Extensão chama `GET /api/v1/prayer-times/today?locationId=...` → API consulta cache Redis; se não existir, aciona domínio/BD → retorna horários e carimbo `calculatedAt`.
   - Extensão armazena em cache e agenda `chrome.alarms` para refresh/notifications.

2. **Alteração de política (Amina)**:
   - Painel chama `PUT /api/v1/prayer-settings` → API valida papel Admin → cria evento `PrayerPolicyChangedEvent` → salva em BD e AuditLog.
   - Worker escuta evento (via fila ou tabela) e dispara recalculo imediato; logs enviados para Serilog.
   - Extensão recebe novos horários na próxima sincronização; painel mostra status “Política aplicada”.

3. **Notificação próxima oração (Omar)**:
   - Worker consulta `NotificationPolicy` e `PrayerTime` → gera mensagens → envia via SMTP/push → registra `NotificationLog`.
   - Extensão recebe push (browser) e destaca contagem regressiva; se offline, utiliza cache e mostra aviso.

---

## 5.6 Multi-Tenant e Resiliência

- **Tenancy**: coluna `OrganizationId` em todas as entidades principais; filtros globais no EF Core; claims no JWT. Painel e extensão incluem esse ID nas requisições automaticamente.
- **Segurança**: Hash de senha (bcrypt/Argon2), JWT + refresh, políticas de CORS restritivas (origens conhecidas), rate limiting (ASP.NET Core middleware), MFA opcional.
- **Resiliência**:
  - Circuit breaker para serviços externos (geolocalização, e-mail) com Polly.
  - Retry/backoff configuráveis nos workers.
  - Cache Redis para reduzir dependência do BD em horários consultados com frequência.
  - Fallback para dados em cache caso a API esteja degradada, informando o usuário.

---

## 5.7 Contratos Entre Camadas

- **DTOs e Mapeamentos**: contratos definidos em `docs/07`. AutoMapper garante conversão entre entidades e DTOs; versionamento por `v1`, `v2` quando necessário.
- **Eventos**: `PrayerPolicyChanged`, `LocationUpdated`, `NotificationSent` utilizados pelos workers ou futuros microserviços.
- **Autenticação**: middleware extrai JWT do header `Authorization: Bearer <token>`; refresh tokens armazenados na tabela `RefreshToken` e invalidados após uso ou logout.

---

## 5.8 Decisões Tecnológicas Relevantes

| Tema | Decisão | Justificativa |
|------|---------|---------------|
| Cálculo de horários | Base em PrayTimes.NET adaptada, com testes unitários e validações contra dados oficiais. | Evita reimplementação complexa e garante acurácia. |
| Geolocalização | Provider primário Google Maps; fallback OpenCage; armazenar coordenadas para evitar chamadas repetidas. | Reduz custos e dependência. |
| Caching | Redis (ou MemoryCache em dev) para horários, listas de tenants e tokens revogados. | Melhora tempo de resposta e reduz carga no BD. |
| Mensageria | Inicialmente jobs diretos (Hangfire). Evoluir para fila (RabbitMQ/Azure Service Bus) se volume aumentar. | Simplicidade no MVP com caminho claro de escalabilidade. |
| Observabilidade | Serilog + OpenTelemetry (planejado) exportando para Application Insights / Grafana. | Visibilidade ponta a ponta. |

---

## 5.9 Conclusão

A arquitetura proposta combina clareza conceitual (C4) com decisões práticas de tecnologia, garantindo isolamento multi-tenant, segurança corporativa e flexibilidade para evolução. Os fluxos documentados orientam o desenvolvimento paralelo entre squads, enquanto estratégias de resiliência e contratos bem definidos reduzem riscos durante o MVP e futuras fases do AdhanSync Corporate.
