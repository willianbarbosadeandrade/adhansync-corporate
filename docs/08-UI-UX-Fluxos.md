# 8. UI/UX e Fluxos de Telas

Este documento descreve as telas da **Extensão de Navegador** e do **Painel Administrativo** em Blazor Server.

---

# 8.1 Princípios de Design

- Minimalista e funcional.
- Compatível com cultura islâmica (tons neutros, uso respeitoso de ícones).
- Layout responsivo.
- Usabilidade como prioridade.
- Acessibilidade básica (contraste, tamanho de fonte adequado).

---

# 8.2 Extensão de Navegador (Chrome/Edge)

## Tela: Dashboard

Elementos:
- Nome da próxima oração (ex.: Próxima oração: Dhuhr).
- Contador regressivo até a próxima oração.
- Lista de horários do dia (Fajr, Dhuhr, Asr, Maghrib, Isha).
- Indicador visual da oração em destaque.
- Troca de idioma (EN/AR/PT).
- Botão para abrir configurações pessoais.

Fluxo:
```text
Login (primeiro uso) → Dashboard → Visualiza horários → Recebe notificações
Tela: Configurações do Usuário
Idioma (EN/AR/PT).

Tema (claro/escuro).

Opção de permanecer logado.

Botão de logout.

8.3 Painel Administrativo (Blazor Server)
Tela: Login
Campos: e-mail, senha.

Validações de obrigatoriedade.

Mensagens claras de erro.

Tela: Dashboard
Resumo da organização:

Quantidade de usuários.

Quantidade de locais.

Próximas orações por local principal.

Acesso rápido para:

Usuários.

Locais.

Configurações de oração.

Tela: Gestão de Usuários
Tabela com:

Nome

E-mail

Papel (Admin, Manager, Employee)

Status (Ativo/Inativo)

Ações:

Criar novo usuário

Editar

Desativar

Campo de busca por nome/e-mail.

Tela: Gestão de Locais
Listagem de locais com:

Nome

Timezone

Latitude / Longitude

Ações:

Adicionar

Editar

Desativar

Visualização simples de mapa (futuro).

Tela: Configuração de Oração
Seletor de método de cálculo.

Seleção de madhhab (Hanafi / Shafi'i).

Ajustes finos de ângulo (Fajr e Isha).

Opções específicas para Ramadan.

Tela: Logs e Auditorias (versão simples)
Lista de eventos:

Logins

Alterações de configuração

Erros

Filtros por data e tipo de evento.

8.4 Fluxo Geral – Administrador
text
Copiar código
Login → Dashboard → Usuários → Criar usuário → Salvar → Confirmação
Login → Dashboard → Configuração de Oração → Editar método → Salvar → Aplicar a todos os locais
Login → Dashboard → Locais → Criar local → Salvar → Ver horários associados
8.5 Fluxo Geral – Colaborador (Extensão)
text
Copiar código
Primeiro uso: Login na extensão → API valida → token salvo
Abertura diária: Dashboard → visualização dos horários
Próxima oração se aproxima → Extensão mostra notificação → Usuário é lembrado
8.6 Conclusão
O design favorece clareza, rapidez e respeito cultural, atendendo ao público corporativo global e às necessidades específicas de colaboradores muçulmanos, sem perder a simplicidade necessária para adoção em larga escala.
