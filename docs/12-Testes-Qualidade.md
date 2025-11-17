# 12. Testes e Garantia da Qualidade

O objetivo deste documento é definir as estratégias de teste para garantir a qualidade do sistema AdhanSync Corporate, detalhando responsabilidades, ferramentas específicas (Blazor/extensão), dados de teste, regressões e critérios para bloquear deploys.

---

## 12.1 Responsabilidades

| Tipo de teste | Responsável primário | Apoio |
|---------------|----------------------|-------|
| Unitários (Core/Infra) | Squad Backend | QA revisa cobertura |
| Unitários (Blazor/Extensão) | Squad Frontend | QA orienta cenários |
| Integração/API | Backend + QA | DevOps provisiona ambientes |
| E2E (Painel + Extensão) | QA | Frontend e Backend para scripts |
| Performance/Load | QA + Backend | DevOps (infra) |
| Segurança | QA + DevSecOps | Backend (fixes) |
| Exploratório/UX | UX + QA | PO/Stakeholders |

---

## 12.2 Tipos de Teste e Ferramentas

### 12.2.1 Testes Unitários
- **Backend**: xUnit + FluentAssertions; cobertura esperada 70% no Core.
- **Blazor**: bUnit para componentes críticos (formularios, wizards).
- **Extensão**: Jest/Vitest para serviços e stores.

### 12.2.2 Testes de Integração
- WebApplicationFactory (API) + banco em memória/PostgreSQL container.
- Testes cobrem autenticação, multi-tenant, migrations, políticas.

### 12.2.3 Testes End-to-End (E2E)
- Playwright (preferido) para painel e extensão (em modo headless com Chromium).
- Cenários: login admin, criação de tenant, alteração de política, sincronização da extensão, recebimento de notificação mockada.

### 12.2.4 Testes de Performance
- k6.io scripts medindo latência de `/auth`, `/prayer-times`, `/extension/sync` com carga multi-tenant.
- Objetivo: manter P95 ≤ 500ms e throughput estável.

### 12.2.5 Testes de Segurança
- Verificação de JWT inválidos, RBAC, rate limiting.
- Ferramentas: OWASP Zap baseline, dependency-check, Snyk (dependências). 

### 12.2.6 Testes Exploratório/UX
- Sessões quinzenais guiadas por QA + UX com checklists por persona (Amina, Omar, Fatima).
- Foco em fluxos críticos (wizard de políticas, notificações) e usabilidade (RTL, acessibilidade).

---

## 12.3 Dados de Teste

- Base de homologação anonimizada com 3 tenants (Doha, Londres, São Paulo), 10 usuários cada, múltiplos locais.
- Scripts seed versionados (`seed/SeedHomologation.cs`).
- Dados sensíveis mascarados; tokens e segredos fictícios.
- Para testes de Ramadan, tabela `PrayerPolicyHistory` populada com cenários reais.

---

## 12.4 Regressão Automatizada

- CI executa unit/integration tests a cada PR.
- Suite E2E noturna + antes de releases; falha bloqueia deploy.
- Extensão possui smoke test automatizado abrindo popup, exibindo horários e executando login fake.
- Checklist de regressão manual para áreas não cobertas (integrações externas, notificações físicas).

---

## 12.5 Critérios de Aceitação e Gates

- Nenhum erro 500 nas rotas essenciais (auth, organizations, users, prayer-times, prayer-settings) durante smoke tests.
- Extensão deve obter horários válidos para pelo menos três localidades de teste.
- Workers executam jobs diários com status “Sucesso”; falhas registradas e tratadas.
- Cobertura mínima atingida (70% Core, 50% API, 30% UI). 
- Qualquer bug classificado como P1/P2 bloqueia deploy até correção.

---

## 12.6 Testes de UX Crítico

Planos específicos para avaliar percepção dos usuários:
1. **Amina (RH)**: completar wizard de políticas, gerar log, exportar CSV com auxílio mínimo.
2. **Omar (Gestor)**: filtrar usuários, visualizar locais e receber alerta antes de reunião.
3. **Fatima (Colaboradora)**: instalar extensão, trocar idioma para árabe e confirmar que contadores respeitam RTL.

Feedback coletado em formulário (escala 1–5) para medir facilidade, confiança e clareza.

---

## 12.7 Critérios para Bloquear Deploys

- Pipeline CI falhou em qualquer etapa obrigatória.
- Cobertura caiu abaixo dos limiares definidos.
- Alertas críticos ativos (latência > 1s, jobs falhando repetidamente).
- Pendências em checklist de compliance (LGPD/GDPR) não resolvidas.
- Extensão reprovada em revisão manual (UX/PO) para release específico.

---

## 12.8 Conclusão

O processo de QA garante que o sistema AdhanSync Corporate seja estável, seguro e confiável em seu uso corporativo, cobrindo responsabilidades claras, automação robusta, testes exploratórios centrados em personas e critérios objetivos para liberar ou bloquear deploys.
