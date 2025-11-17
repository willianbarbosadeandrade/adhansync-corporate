# 3. Objetivos e Escopo

## 3.1 Objetivo Geral

Desenvolver uma plataforma corporativa multiplataforma — composta por API em C#/.NET, painel administrativo em Blazor Server e extensão de navegador — capaz de calcular, sincronizar e gerenciar horários de oração (Adhan) para equipes e organizações, promovendo inclusão religiosa, organização de rotinas e integração com sistemas corporativos. O objetivo geral será considerado atingido quando o MVP entregar:
- SLA de sincronização ≤ 5 minutos entre API e extensão para 95% das requisições;
- Taxa de adoção de 60% dos colaboradores convidados em empresas piloto após 60 dias;
- NPS ≥ +30 entre personas Amina, Omar e Fatima (ver Documento 02).

---

## 3.2 Objetivos Específicos e KPIs

| # | Objetivo | KPI associado | Dependências / Critérios de aceite |
|---|----------|---------------|------------------------------------|
| 1 | **Centralizar configurações corporativas** | 100% dos tenants com métodos de cálculo e madhhab configurados via painel sem intervenção do backend. | Requer endpoints seguros (API) e UX intuitiva (frontend). Aceite: Admin consegue alterar política e ver propagação em até 2 minutos. |
| 2 | **Oferecer experiência simples na extensão** | ≥ 70% dos usuários ativos interagindo com a extensão ao menos 1 vez/dia útil. | A extensão depende da API para login/refresh e do worker para dados atualizados. Aceite: persona Fatima consegue instalar, logar e receber notificações sem suporte técnico. |
| 3 | **Sincronizar horários automaticamente** | Recalcular horários diários antes das 00:05 do fuso correspondente; 0 falhas críticas nos jobs. | Workers precisam de acesso ao banco e filas de mensagens (futuro). Aceite: logs registram sucesso para todos os locais configurados. |
| 4 | **Integrar com ferramentas corporativas** | Disponibilizar pelo menos 1 integração piloto (calendário ou e-mail) com latência < 2s. | Backend expõe endpoints e frontend disponibiliza configurações; depende da squad de integrações. |
| 5 | **Garantir multi-tenant seguro** | Zero vazamentos entre tenants; auditoria mostrando isolamento em testes de QA. | API + infra devem incluir OrganizationId em claims e filtros; front mostra apenas dados do tenant. |
| 6 | **Automatizar comunicações** | 95% das notificações enviadas com sucesso e registradas em log com status. | Workers + API + extensão. Aceite: Omar recebe alertas antes das janelas críticas. |
| 7 | **Atender ao modelo acadêmico** | 100% dos capítulos 01–13 entregues e revisados. | Depende da squad de documentação. |

---

## 3.3 Escopo do Projeto

### 3.3.1 Funcionalidades incluídas (IN-SCOPE – priorização MoSCoW)

| Prioridade | Componente | Funcionalidade |
|------------|------------|----------------|
| **Must** | Backend | Cadastro/autenticação, multi-tenant, cálculo de horários, endpoints REST, integração básica de geolocalização. |
| **Must** | Painel Blazor | Login, dashboard, CRUD usuários, políticas de oração, visualização de horários, logs básicos. |
| **Must** | Extensão | Login, dashboard de horários, notificações, idioma EN/AR/PT, tema claro/escuro. |
| **Must** | Workers | Recalcular horários diário, notificações, limpeza de tokens. |
| **Should** | Backend | Configurações avançadas (Ramadan, ajustes finos por local), APIs para integrações futuras. |
| **Should** | Painel | Configuração de notificações globais, monitoramento simplificado. |
| **Should** | Extensão | Cache offline 12h, contagem regressiva e sincronização silenciosa. |
| **Could** | Todos | Integração básica com calendário corporativo e relatórios resumidos. |
| **Won't (V2)** | Todos | Apps mobile nativos, IoT, pagamentos SaaS, relatórios avançados, chatbots. |

### 3.3.2 Funcionalidades fora do escopo inicial (OUT-OF-SCOPE)

Permanecem como visão para V2 ou releases futuros: aplicativos mobile, integrações IoT, billing SaaS, relatórios avançados, chatbots, machine learning, geofencing avançado. Esses itens dependem de validação de mercado e recursos adicionais.

---

## 3.4 Dependências Entre Squads e Critérios por Persona

- **Frontend (Extensão + Blazor)** depende da **API** para autenticação, preferências, horários e notificações. Contratos definidos em `docs/07` são mandatórios antes de iniciar implementações de UI.  
- **Workers** dependem da mesma camada de domínio (cálculo, repositórios) e precisam de filas/cron jobs configurados pela equipe de infraestrutura.  
- **Critérios de aceite por persona**:
  - *Amina (RH)*: consegue configurar métodos, gerar log simples e exportar dados; tempo total < 10 minutos.  
  - *Omar (Gestor)*: visualiza usuários/locais da sua organização sem vazamento, recebe alertas configuráveis.  
  - *Fatima (Colaboradora)*: instala extensão, faz login em < 2 minutos e recebe notificações no idioma escolhido.

---

## 3.5 Premissas

- Backend em **C#/.NET 8** com Clean Architecture.
- Banco relacional (PostgreSQL) com suporte a multi-tenant.
- Extensões em **TypeScript** (Manifest V3) com internacionalização.
- Hospedagem em cloud com CI/CD via GitHub Actions.
- Documentação e versionamento compartilhados no repositório GitHub.

---

## 3.6 Restrições

- Extensão não calcula horários; depende da API.
- Navegadores suportados apenas Chromium no MVP.
- Painel exclusivamente web responsivo; sem mobile nativo.
- Conectividade necessária para sincronização; cache limitado.
- Prazos acadêmicos da PUC Minas devem ser cumpridos.

---

## 3.7 Definição do MVP vs. V2

| Release | Escopo resumido |
|---------|-----------------|
| **MVP (Must/Should)** | API com auth + multi-tenant + cálculo; Blazor com CRUD e políticas; extensão com exibição/notifications; worker diário; documentação 01–13; métricas básicas (logs, adoção). |
| **V2 (Could/Won't)** | Integrações avançadas (calendários, chatbots), analytics para RH, app mobile, pagamento SaaS, IoT, personalização completa por tenant, relatórios ESG. |

---

## 3.8 Critérios de Sucesso

O MVP será considerado bem-sucedido se:

- Calcular corretamente os horários de oração em qualquer local do mundo e provar tal acurácia por meio de testes automatizados + validação manual com consultores religiosos.
- Permitir que uma empresa configure métodos e políticas corporativas sem intervenção da TI.
- Garantir SLA de sincronização de 5 minutos entre API e extensão, com monitoramento ativo.
- Administradores conseguirem gerenciar usuários e preferências, com auditoria básica.
- Obter pelo menos uma empresa piloto com 50 usuários ativos e feedback NPS ≥ +30.
- Base tecnológica estável para evolução (V2) e compliance mínimo com LGPD/GDPR.
