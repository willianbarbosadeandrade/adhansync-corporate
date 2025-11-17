# 9. Metodologia de Desenvolvimento

O desenvolvimento do AdhanSync Corporate seguirá práticas modernas baseadas em uma combinação de **Scrum** e **Kanban**, uso de GitFlow e integração contínua via GitHub Actions. Esta seção detalha papéis, cerimônias, Definition of Ready/Done e o plano de comunicação entre squads frontend/back-end/infra.

---

## 9.1 Papéis e Responsabilidades

| Papel | Responsabilidades principais |
|-------|------------------------------|
| **Product Owner (PO)** | Prioriza backlog, define critérios de aceite, valida entregas com stakeholders e personas (Amina/Omar/Fatima). |
| **Tech Lead / Arquiteto** | Mantém visão técnica, revisa decisões de arquitetura, auxilia na integração entre squads. |
| **Squad Backend** | Implementa API, domínio, workers, integrações. |
| **Squad Frontend** | Desenvolve painel Blazor e extensão, garante UX e acessibilidade. |
| **QA / Chapter Quality** | Define estratégia de testes, automatiza pipelines, valida critérios antes de releases. |
| **DevOps / Infra** | Cuida de pipelines, ambientes, monitoramento e publicação de extensões. |

---

## 9.2 Abordagem de Trabalho

- Ciclos curtos (sprints semanais) com planejamento na segunda-feira e demo/retro na sexta-feira.
- Quadro Kanban com colunas: Backlog → Em Grooming → To Do → Em Progresso → Review → QA → Done.
- Stand-up diário (15 minutos) com representantes de cada squad para sincronizar dependências.

---

## 9.3 Definition of Ready (DoR)

Um item entra em desenvolvimento somente quando:
1. Descrição clara com objetivo, persona e valor.
2. Critérios de aceite SMART e métricas associadas.
3. Dependências identificadas (API/Front/Infra) e mockups ou contratos anexados.
4. Dados de teste e impacto em documentação conhecidos.
5. Estimativa inicial (story points) aprovada pelo time.

## 9.4 Definition of Done (DoD)

Uma história é considerada concluída quando:
1. Código implementado, revisado e mergeado na branch `dev`.
2. Testes automatizados atualizados/executados (unitário/integrado/UI conforme escopo).
3. Documentação necessária (README, docs/xx) atualizada.
4. Feature validada em ambiente de homologação com usuário-alvo/PO.
5. Monitoração/alertas ajustados caso seja funcionalidade nova.
6. Checklist de handoff preenchido (vide seção 9.7).

---

## 9.5 Uso de Git e GitHub

### Estratégia de Branches (GitFlow simplificado)
- `main` — branch estável, releases aprovados.
- `dev` — integração contínua do sprint.
- `feature/<nome>` — funcionalidades ou correções.
- `hotfix/<nome>` — correções urgentes a partir de `main`.

### Fluxo de Trabalho
1. `git checkout dev && git checkout -b feature/api-auth`
2. Desenvolvimento com commits frequentes seguindo convenção (`feat/api`, `fix/ui`).
3. Pull Request direcionado a `dev` com descrição, checklist DoD e link para tarefa.
4. Review obrigatório de pelo menos 1 pessoa de outra squad (de acordo com impacto).
5. Merge após aprovação + pipeline verde.

### SLAs de Code Review
- Tempo máximo de espera: 24h úteis.
- PRs críticos sinalizados em canal #reviews-urgentes.
- Revisores devem comentar decisões e sugerir melhorias com foco em segurança/multi-tenant.

---

## 9.6 Cerimônias e Comunicação

| Cerimônia | Frequência | Participantes | Objetivo |
|-----------|------------|---------------|----------|
| Planning | Semanal | PO, Tech Leads, representantes das squads | Priorizar sprint, alinhar dependências. |
| Daily | Diário | Todas as squads | Atualizar status e desbloquear impedimentos. |
| Refinement | 2x/semana | PO + squads | Detalhar backlog futuro, alinhar contratos. |
| Demo | Semanal | Stakeholders | Mostrar incrementos para Amina/Omar/Fatima (personas) e coletar feedback. |
| Retro | Quinzenal | Times completos | Identificar melhorias de processo. |

Comunicação assíncrona via Slack: 
- `#announcements` (PO/gestão), `#backend`, `#frontend`, `#infra`, `#qa`, `#docs`.  
- Registro de decisões no Notion/Confluence.

---

## 9.7 Checklist de Handoff entre Squads

Antes de entregar uma funcionalidade que depende de outro time, confirme:
1. Contratos de API atualizados (`docs/07`) com exemplos.
2. Feature flag ativada/desativada conforme combinado.
3. Dados de teste e scripts seed fornecidos.
4. Documentação de UX (wireframes, copy) disponível no repositório.
5. Critérios de monitoramento definidos (métricas, logs, alertas).
6. Dependências em pipelines (variáveis, segredos, chaves) comunicadas ao DevOps.

---

## 9.8 Ferramentas de Suporte

- **GitHub** — repositório, issues, PRs.
- **GitHub Projects** — board Kanban.
- **Azure DevOps / Jira (opcional)** — registro acadêmico.
- **Slack / Teams** — comunicação diária.
- **Figma / Excalidraw** — wireframes e diagramas.
- **Docker** — ambientes padronizados.
- **GitHub Actions** — CI/CD.

---

## 9.9 Qualidade de Código

- Uso de Analyzers e `Nullable` ativado no .NET.
- SonarCloud (futuro) para análise estática.
- Linters/formatadores (ESLint/Prettier para extensão, `.editorconfig` para C#).
- Revisão de segurança periódica (dependabot, verificação de secrets).

---

## 9.10 Conclusão

A metodologia proposta equilibra organização, flexibilidade e colaboração entre squads, garantindo padrões claros (DoR/DoD), comunicação eficiente e SLAs definidos para PRs e handoffs. Assim, o time consegue desenvolver o MVP do AdhanSync Corporate com qualidade e previsibilidade.
