# 11. Implantação e DevOps

Este documento descreve o processo de implantação, automação, pipeline e boas práticas DevOps aplicadas ao sistema **AdhanSync Corporate**.

---

# 11.1 Visão Geral

Objetivos do pipeline DevOps:

- Garantir entregas rápidas com segurança.
- Automatizar build, testes, análise e deploy.
- Fornecer monitoramento e logging estruturado.
- Manter arquitetura escalável em cloud.

---

# 11.2 Arquitetura de Deploy

Serviços:

```text
AdhanSync.Api          → API central (ASP.NET Core)
AdhanSync.Admin.Web    → Painel administrativo (Blazor Server)
AdhanSync.Workers      → Serviços agendados (Worker Service / Hangfire)
PostgreSQL             → Banco de dados multi-tenant
Chrome Extension       → Distribuição via ZIP / Chrome Web Store
Ambientes:

Desenvolvimento (local)

Homologação

Produção

11.3 Dockerização
Cada projeto possui seu Dockerfile.

Exemplo simplificado da API:

Dockerfile
Copiar código
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AdhanSync.Api.dll"]
Orquestração via docker-compose.yml ligando:

API

Admin

Workers

Banco

11.4 CI/CD com GitHub Actions
Pipeline típico:

Trigger: push em dev ou main.

Build:

dotnet restore

dotnet build --configuration Release

Testes automáticos:

dotnet test

Docker Build & Push:

Imagens enviadas para container registry.

Deploy:

Azure Web App / Railway / AWS ECS (a ser definido).

Notificações:

Sucesso ou falha na pipeline.

11.5 Logging e Monitoramento
Uso de:

Serilog

Logs em:

Console

Arquivo

Banco (tabela de logs)

Futuro:

Integração com:

Grafana

Kibana

Azure Application Insights

11.6 Segurança
TLS obrigatório (HTTPS).

JWT validado em todos endpoints.

Políticas de CORS restritivas.

Rate limiting.

Segregação por OrganizationId em todas consultas.

Armazenamento seguro de secrets (variáveis de ambiente, Azure Key Vault, etc.).

11.7 Backup e Recuperação
Banco PostgreSQL:

Backup diário.

Retenção mínima: 7–30 dias.

Testes periódicos de restauração.

Registro de rotinas de backup e restore.

11.8 Conclusão
O pipeline DevOps do AdhanSync Corporate garante rastreabilidade, segurança, resiliência e possibilidade de escalabilidade real, alinhando-se às práticas modernas de entrega contínua.
