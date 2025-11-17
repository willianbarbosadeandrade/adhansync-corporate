# 11. Implantação e DevOps

Este documento descreve o processo de implantação, automação, pipeline e boas práticas DevOps aplicadas ao sistema **AdhanSync Corporate**, com foco em infraestrutura como código, versionamento de schema, publicação da extensão e monitoramento.

---

## 11.1 Visão Geral

Objetivos do pipeline DevOps:
- Garantir entregas rápidas e seguras entre squads distribuídas.
- Automatizar build, testes, análise e deploy para API, painel, workers e extensão.
- Fornecer monitoramento, alertas e plano de rollback claro.

---

## 11.2 Arquitetura de Deploy

Serviços principais:
```text
AdhanSync.Api          → API central (ASP.NET Core)
AdhanSync.Admin.Web    → Painel administrativo (Blazor Server)
AdhanSync.Workers      → Serviços agendados (Worker/Hangfire)
PostgreSQL             → Banco de dados multi-tenant
Redis                  → Cache/distribuição de sessões
Chrome Extension       → Distribuição via Chrome Web Store
```

Ambientes: **Desenvolvimento (local + containers)**, **Homologação** e **Produção**. Cada ambiente possui variáveis e segredos separados.

---

## 11.3 Infraestrutura como Código

- **Terraform** (preferencial) ou **Bicep** para provisionar recursos (App Service/Azure Container Apps, PostgreSQL, Redis, Storage, Application Insights).
- Repositório `infra/` com módulos reutilizáveis; revisões obrigatórias antes de aplicar.
- `terraform.tfstate` armazenado em backend remoto seguro (Azure Storage / S3).
- Ambientes criados via pipelines `terraform plan` + `apply` com aprovação manual.

---

## 11.4 Gestão de Segredos

- Segredos armazenados em **Azure Key Vault** (ou AWS Secrets Manager) e referenciados por variáveis de ambiente.
- GitHub Actions usa `azure/login` + `keyvault` para recuperar segredos durante o deploy.
- Proíbe-se armazenar chaves em repositório; dependabot verifica leaks.

---

## 11.5 Estrutura de Pipelines (GitHub Actions)

Workflow típico (`.github/workflows/ci.yml`):
1. Trigger: PR em `dev` e pushes em `main`.
2. Etapas: `dotnet restore`, `dotnet build -c Release`, `dotnet test`, análise estática (opcional).
3. Build Docker (`docker build`) e push para registry (GHCR ou ACR).
4. Deploy automatizado para ambiente de homologação; produção requer aprovação manual.

Workflow `extension.yml`:
- Build com `npm install && npm run build`.
- Geração de pacote `.zip` assinado.
- Upload automático para Chrome Web Store via API (necessita chave/refresh token) com `publishTarget=draft` para revisão.

---

## 11.6 Banco de Dados e Versionamento de Schema

- Migrations EF Core versionadas; cada release incrementa `schema_version` em tabela própria.
- Pipeline executa `dotnet ef database update` em modo offline antes de subir containers.
- Estratégia de rollback: manter scripts `downgrade` e snapshots; usar feature flags para mudanças destrutivas.
- Backups automáticos diários (retain 30 dias) + testes mensais de restauração.

### Migração Zero-Downtime
- Aplicar migrations compatíveis com código antigo (ex.: adicionar colunas nullable).
- Deploy segue ordem: banco → API/Workers → painel/extensão.

---

## 11.7 Publicação da Extensão

1. Build gera pacote `.zip` com manifesto versionado (`x.y.z`).
2. Script `ci/publish-extension.sh` chama API do Chrome Web Store com `client_id`, `client_secret`, `refresh_token` armazenados como segredo.
3. Pipeline envia para `draft`; PO valida e aciona publicação.
4. Registro de versão + changelog em `docs/release-notes.md`.

---

## 11.8 Monitoramento, Alertas e Responsividade

- **Logs**: Serilog → consola + Application Insights/Grafana. Logs estruturados com `tenantId`, `traceId`, `userId`.
- **Métricas**: requisições/s, latência, erros 4xx/5xx, jobs executados, notificações enviadas.
- **Alertas**: configurados para latência > 1s, taxa de erro > 2%, job falho consecutivo, consumo de recursos > 80%.
- **Matriz RACI de incidentes**:
  - **P1** (API fora do ar): DevOps + Backend (responsáveis), PO informado, QA valida correção. Tempo de resposta ≤ 30 min.
  - **P2** (Extensão sem sincronizar): Frontend lidera, Backend apoia. Resposta ≤ 1h.
  - **P3** (Job atrasado): Workers/Backend cuidam; resolução ≤ 4h.

---

## 11.9 Segurança

- TLS obrigatório (HTTPS). 
- JWT validado em todo request; refresh tokens protegidos. 
- Rate limiting (ASP.NET) + WAF básico.
- CORS restrito às origens conhecidas (painel/extensões corporativas).
- Scans SAST/DAST periódicos.

---

## 11.10 Rollback e Disaster Recovery

- Deploys versionados (`main` tag `vX.Y.Z`). Se falha, revert para imagem anterior através de `az webapp deployment slot swap --swap-with-preview` ou rollback de container.
- Banco: restore point-in-time + reaplicação das últimas migrations se necessário.
- Extensão: manter versão anterior aprovada pronta para re-publicação emergencial (Chrome permite reverter).

---

## 11.11 Conclusão

O pipeline DevOps do AdhanSync Corporate cobre IaC, gestão de segredos, versionamento de schema, publicação da extensão e monitoramento granular, garantindo rastreabilidade, segurança, resiliência e possibilidade de escalabilidade real alinhada às práticas modernas de entrega contínua.
