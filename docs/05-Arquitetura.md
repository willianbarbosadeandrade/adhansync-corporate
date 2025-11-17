5.3 Camadas da Arquitetura
5.3.1 Camada de Domínio (AdhanSync.Core)

Contém:

Entidades

Value Objects

Regras de negócio

Interfaces de Repositório

Serviços de cálculo

Entidades principais:

Organization

User

PrayerSettings

PrayerTime

Location

NotificationPolicy

NotificationLog

5.3.2 Camada de Infraestrutura (AdhanSync.Infrastructure)

Responsável por:

Implementações de repositórios (EF Core)

Migrações

Conexão com o banco (PostgreSQL)

Serviços externos:

Geolocalização

E-mail

Logging (Serilog)

Filtros multi-tenant (OrganizationId)

5.3.3 Camada de Aplicação / API (AdhanSync.Api)

Responsável por:

Endpoints REST

Autenticação JWT

Validações de entrada

Mapeamento DTO ↔ Domínio

Versionamento da API (/api/v1/...)

Documentação via Swagger/OpenAPI

5.3.4 Painel Administrativo (AdhanSync.Admin.Web – Blazor Server)

Responsável por:

Interface para administradores e gestores.

Configurações corporativas (métodos de cálculo, madhhab, locais).

CRUD de usuários.

Dashboards e visualização de horários.

Acesso seguro via autenticação integrada à API.

5.3.5 Extensão de Navegador (TypeScript/Manifest V3)

Responsável por:

UI simplificada para o colaborador.

Consumo da API para obter horários de oração.

Exibir contagem regressiva até a próxima oração.

Exibir notificações no navegador.

Armazenar dados em chrome.storage para uso off-line limitado.

5.3.6 Worker (AdhanSync.Workers)

Responsável por:

Recalcular horários diariamente para todas as organizações.

Enviar notificações e lembretes.

Executar rotinas específicas (ex.: durante Ramadan).

Limpeza de tokens expirados e dados temporários.

Registrar logs e métricas.

5.4 Multi-Tenant

Implementado por:

Campo OrganizationId em todas as entidades principais.

Filtros globais no EF Core para isolar dados por tenant.

Inclusão de OrganizationId no JWT.

Políticas de autorização que garantem que o usuário só acesse dados da própria organização.

5.5 Segurança

JWT + Refresh Token.

Hash de senha (ex.: bcrypt).

Políticas de CORS restritivas (origens confiáveis).

Rate limiting.

Logging estruturado e auditoria.

Papéis e permissões:

Admin

Manager

Employee

5.6 Comunicação Entre Componentes

Extensão → API: HTTPS + JSON.

Painel Blazor → API: comunicação direta via HTTP/JSON.

API ↔ Banco: EF Core com Migrations.

Worker → Banco: acesso direto para rotinas agendadas.

Worker → Serviços Externos: SMTP / APIs REST.

5.7 Conclusão

A arquitetura do AdhanSync Corporate é moderna, escalável e preparada para expansão, atendendo a padrões de mercado e às necessidades acadêmicas, permitindo evolução futura para mobile, IoT e integrações avançadas.
