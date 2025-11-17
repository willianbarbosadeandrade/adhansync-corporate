# 📌 AdhanSync Corporate  

Plataforma corporativa para **cálculo e sincronização de horários de oração (Adhan)** em ambientes empresariais, com foco em equipes globais, diversidade religiosa e bem-estar no trabalho.

Este repositório contém a nova arquitetura oficial do **AdhanSync Corporate**, reescrita em **C# / .NET**, seguindo princípios de Clean Architecture, multi-tenant e integração com extensões de navegador.

---

## 🧱 Arquitetura

```text
adhansync-corporate/
├── src/
│   ├── AdhanSync.Core            → Domínio e regras de negócio
│   ├── AdhanSync.Infrastructure  → EF Core, repositórios e integrações externas
│   ├── AdhanSync.Api             → API REST ASP.NET Core
│   ├── AdhanSync.Workers         → Jobs de notificação e sincronização
│   └── AdhanSync.Admin.Web       → Painel administrativo (Blazor Server)
│
├── docs/                         → Arquivos + documentação técnica
├── AdhanSync.sln                 → Solution principal
└── README.md


---

## 🚀 Tecnologias Principais

- **C# / .NET 8**
- **ASP.NET Core Web API**
- **Entity Framework Core**
- **Blazor Server**
- **JWT Authentication**
- **Serilog**
- **Hangfire / Quartz.NET**
- **Docker e GitHub Actions**

---

## ▶️ Como rodar localmente

### Instalar dependências

\`\`\`sh
dotnet restore
\`\`\`

### Rodar a API

\`\`\`sh
cd src/AdhanSync.Api
dotnet run
\`\`\`

### Rodar o painel administrativo

\`\`\`sh
cd ../AdhanSync.Admin.Web
dotnet run
\`\`\`

---

## 🧪 Testes

\`\`\`sh
dotnet test
\`\`\`

---
