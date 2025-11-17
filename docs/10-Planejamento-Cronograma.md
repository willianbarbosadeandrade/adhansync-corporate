# 10. Planejamento e Cronograma

Este documento apresenta o planejamento macro e o cronograma estimado para o desenvolvimento do MVP do AdhanSync Corporate, considerando dependências entre squads, buffers de risco, recursos e entregáveis por sprint.

---

## 10.1 Fases do Projeto

1. **Planejamento e documentação** – definição de escopo, personas, arquitetura conceitual, docs 01–06 finalizados.  
2. **Setup de arquitetura e projetos C#** – criação da Solution, configuração de pipelines base, revisão de padrões (.editorconfig, lint).  
3. **Modelagem/Migrations** – DER validado, migrations iniciais, seeds para ambientes.  
4. **API base** – autenticação, multi-tenant, endpoints essenciais (orgs, usuários, locais).  
5. **Métodos de cálculo e horários** – serviços de cálculo, workers diários, logs.  
6. **Extensão do navegador** – UI básica, login, consumo de horários, cache offline.  
7. **Painel administrativo (Blazor)** – telas de login, dashboard, CRUD, políticas.  
8. **Integrações/Notificações** – envio de e-mail/push, templates, logs.  
9. **Testes, observabilidade e ajustes finais** – cobertura mínima, monitoramento, documentação final.

---

## 10.2 Cronograma Sugerido (8 Semanas)

| Semana | Atividades principais | Dependências | Entregáveis |
|--------|------------------------|--------------|-------------|
| 1 | Reforço documental (docs 01–08), definição de KPIs, setup de comunicação. | Nenhuma | Docs atualizados, backlog priorizado, board configurado. |
| 2 | Setup solução .NET, pipelines básicos, `docker-compose`, ambientes dev. | Semana 1 | Repositório estruturado, CI “build + test” verde. |
| 3 | Modelagem + migrations, endpoints de autenticação/orgs/usuários. | Semana 2 | API com login, seeds iniciais, testes unitários base. |
| 4 | Implementação dos cálculos e workers, endpoints de horários, painel login/dashboard (mock). | Semana 3 | Worker executando em dev, API `/prayer-times`, Blazor autenticando. |
| 5 | Extensão MVP (login, dashboard, notificações), ajustes na API para `/extension`. | Semanas 3-4 | Extensão consumindo API em dev, build automatizado. |
| 6 | Painel completo (CRUD usuários, políticas), logs/auditoria, integração básica de notificações (e-mail). | Semanas 4-5 | Blazor com telas principais, API `/prayer-settings`, logs. |
| 7 | Endurecer workers/notificações, testes E2E (painel + extensão), monitoramento/alerts. | Semana 6 | Jobs monitorados, testes Playwright/selenium iniciais. |
| 8 | Hardening final, testes de performance, documentação final (docs 09–13), preparação para demo/pilotos. | Todas | MVP pronto, relatório acadêmico, demo executiva. |

Buffers de 2 dias inseridos nas semanas 4 e 6 para mitigação de riscos (cálculos complexos e UX da extensão). Qualquer atraso aciona plano de contingência (priorizar Musts do MVP).

---

## 10.3 Recursos Alocados

- **Backend**: 2 devs + 1 tech lead compartilhado.
- **Frontend (Blazor + Extensão)**: 2 devs + 1 UX.
- **QA**: 1 analista focado em testes automatizados e manuais.
- **DevOps**: 1 engenheiro compartilhado (setup pipelines, infra-as-code, publicação extensão).
- **PO/Documentação**: 1 responsável por interface com stakeholders e manutenção dos docs.

---

## 10.4 Marcos e Pontos de Controle

| Marco | Data alvo | Critérios |
|-------|-----------|-----------|
| M1 – Arquitetura aprovada | Final Semana 1 | Docs 01–08 revisados, decisões de tecnologia congeladas. |
| M2 – API + Auth funcional | Meio Semana 3 | Login multi-tenant validado, testes unitários rodando no CI. |
| M3 – Workers + horários | Final Semana 4 | Recalculo diário automatizado, logs visíveis no dashboard. |
| M4 – Extensão MVP | Final Semana 5 | Fatima consegue instalar, logar e ver horários reais. |
| M5 – Painel completo | Final Semana 6 | Amina altera políticas e vê efeito imediatos, logs auditáveis. |
| M6 – Testes e Observabilidade | Final Semana 7 | Pipeline executa testes unitários/integrados/E2E, alertas configurados. |
| M7 – Entrega MVP/Demo | Final Semana 8 | Demonstração para stakeholders + documentação acadêmica finalizada. |

Cada marco inclui demo curta e checklist de riscos. Atraso ≥ 3 dias dispara reunião extraordinária para repriorizar escopo.

---

## 10.5 Dependências e Riscos

- **Cálculos de oração**: dependem de validação externa; mitigação: usar bibliotecas reconhecidas e planilha de testes fornecida por consultor religioso.
- **Publicação da extensão**: requer conta no Chrome Web Store e aprovação (até 7 dias); enviar pacote até semana 6.
- **Integrações corporativas**: dependem de acesso a APIs de calendário/email; caso não aprovadas, fornecer mock e documentação.
- **Equipes distribuídas**: zonas diferentes exigem comunicação assíncrona; diariamente registrar decisões no Slack/Notion.

---

## 10.6 Conclusão

O cronograma prioriza entregas incrementais com marcos claros, buffers de risco e recursos definidos. Cada sprint produz entregáveis tangíveis, alinhados às dependências entre squads e aos critérios de sucesso do MVP do AdhanSync Corporate.
