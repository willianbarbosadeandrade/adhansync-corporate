# 9. Metodologia de Desenvolvimento

O desenvolvimento do AdhanSync Corporate seguirá práticas modernas baseadas em uma combinação de **Scrum** e **Kanban**, uso de GitFlow e integração contínua via GitHub Actions.

---

# 9.1 Abordagem de Trabalho

- Organização em ciclos curtos (sprints semanais).
- Planejamento de tarefas por prioridade de entrega (MVP → melhorias).
- Quadro Kanban com colunas:
  - Backlog
  - Em Progresso
  - Em Code Review
  - Em Teste
  - Concluído

---

# 9.2 Uso de Git e GitHub

## Estratégia de Branches (GitFlow simplificado)

- `main` — branch estável, usada para releases.
- `dev` — branch principal de desenvolvimento.
- `feature/xxx` — branches de funcionalidades específicas.
- `hotfix/xxx` — correções urgentes aplicadas diretamente a partir de `main`.

## Fluxo de Trabalho

1. Criar branch de feature:
   - `git checkout dev`
   - `git checkout -b feature/api-auth`
2. Implementar código.
3. Commitar com mensagens padronizadas.
4. Abrir Pull Request para `dev`.
5. Code review.
6. Merge + delete da branch de feature.

---

# 9.3 Padrões de Commit

Sugestões de prefixos:

- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: alteração em documentação
- `refactor`: refatoração de código
- `test`: criação/alteração de testes
- `chore`: tarefas de suporte (build, configs, etc.)

Exemplos:

- `feat(api): add prayer time endpoint`
- `fix(auth): handle invalid refresh token`
- `docs(core): update architecture description`

---

# 9.4 Ferramentas de Suporte

- **GitHub** — repositório de código e gestão de issues.
- **GitHub Projects** — board Kanban para organização das tarefas.
- **Visual Studio Code / Rider / Visual Studio** — IDEs para desenvolvimento C#.
- **Docker** — empacotamento e execução dos serviços.
- **GitHub Actions** — CI/CD.

---

# 9.5 Qualidade de Código

- Uso de Analyzers e `Nullable` ativado no .NET.
- Revisão obrigatória via Pull Request.
- Execução de testes automatizados em CI.
- Padronização de estilo via `.editorconfig`.

---

# 9.6 Conclusão

A metodologia proposta equilibra organização, flexibilidade e simplicidade, permitindo que o time desenvolva o MVP de forma ágil, com controle de qualidade e rastreabilidade das decisões técnicas.
