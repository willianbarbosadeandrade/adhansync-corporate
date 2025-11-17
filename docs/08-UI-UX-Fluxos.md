# 8. UI/UX e Fluxos de Telas

Este documento descreve as telas da **Extensão de Navegador** e do **Painel Administrativo** em Blazor Server, incluindo princípios de design, estados (loading/erro/offline), internacionalização (LTR/RTL) e mapa de navegação.

---

## 8.1 Princípios de Design

- **Minimalista e funcional**: foco nas informações essenciais (próxima oração, configurações críticas).
- **Compatibilidade cultural**: tons neutros, padrões discretos inspirados em arte islâmica sem apropriação, uso respeitoso de ícones.
- **Responsividade**: painéis adaptam-se a desktops, tablets e telas grandes; extensão otimizada para janelas pequenas.
- **Acessibilidade**: contraste mínimo WCAG AA, suporte total a teclado, leitores de tela, labels descritivas e status textual para contadores.
- **Internacionalização**: idiomas EN/AR/PT, com suporte LTR (EN/PT) e RTL (AR). Layouts e iconografia espelham automaticamente conforme idioma.

---

## 8.2 Componentes Compartilhados

- **Header corporativo** com nome do tenant e indicador de status (online/offline).
- **Cards** com estados (loading skeleton, dados, erro) padronizados.
- **Tabela responsiva** com paginação, busca e ícones de ação consistentes.
- **Modais** para confirmações destrutivas (desativar usuário/política).
- **Toasts/notificações** com tradução automática e suporte a RTL.

---

## 8.3 Extensão de Navegador

### 8.3.1 Fluxo de Login
```
[Popup Login]
  - Campos: email, senha
  - Botão "Entrar" (disabled até validação)
  - Link "Esqueci a senha" abre nova aba
  - Estado loading (spinner) durante requisição
  - Mensagens de erro localizadas (ex.: "Verifique suas credenciais")
```

### 8.3.2 Dashboard (Wireframe textual)
```
┌────────────────────────────────────┐
│ Próxima oração: Dhuhr (em 12:32)   │  <- Contador regressivo com fallback textual
├────────────────────────────────────┤
│ Lista diária                      │
│ Fajr     05:02  •                 │
│ Sunrise  06:18                    │
│ Dhuhr    12:05  Próximo           │
│ Asr      15:21                    │
│ Maghrib  17:48                    │
│ Isha     19:02                    │
├────────────────────────────────────┤
│ Ações rápidas: [Idioma EN/AR/PT]  │
│               [Tema Claro/Escuro] │
│               [Configurações]     │
└────────────────────────────────────┘
```

### 8.3.3 Estados Especializados
- **Loading**: skeleton + mensagem “Sincronizando horários…”.
- **Offline**: banner amarelo “Mostrando dados de HH:MM; reconectar para atualizar”.
- **Erro**: card vermelho com botão “Tentar novamente”.
- **RTL**: componentes invertidos; contador alinhado à direita.

### 8.3.4 Tela de Configurações
- Preferências (idioma, tema, canal de notificação, permanecer logado).
- Listagem das localizações disponíveis com seleção padrão.
- Botão de logout com confirmação.

### 8.3.5 Fluxo Geral – Colaborador
```
Primeiro uso → Login → Seleciona idioma/tema → Dashboard
Diário → Abre extensão → Verifica próxima oração → Recebe notificação push
Problema de conexão → Extensão usa cache e alerta usuário
```

---

## 8.4 Painel Administrativo (Blazor Server)

### 8.4.1 Mapa de Navegação
```
Login
 └── Dashboard
      ├── Usuários
      │    ├── Criar/Editar
      │    └── Importar CSV
      ├── Locais
      │    ├── Criar/Editar
      │    └── Visualização mapa (futuro)
      ├── Configurações de Oração
      │    └── Wizard (Método → Madhhab → Ajustes → Ramadan)
      ├── Notificações
      │    ├── Políticas
      │    └── Templates
      └── Logs & Auditorias
```

### 8.4.2 Tela de Login
- Campos com máscara de teclado acessível.
- Feedback em tempo real (caps lock ativado, erros localizados).
- Estado loading no botão “Entrar”.

### 8.4.3 Dashboard
```
┌ Cards Métricas (Usuários, Locais, Próximas Orações) ┐
├─────────────────────────────────────────────────────┤
│ Gráfico mini (usuários ativos)                      │
│ Lista de tarefas (ex.: Revisar política Ramadan)    │
├─────────────────────────────────────────────────────┤
│ Logs recentes / alertas                             │
└─────────────────────────────────────────────────────┘
```
- Cada card possui fallback “Sem dados ainda”.
- Status do worker exibido (última sincronização, erros).

### 8.4.4 Gestão de Usuários
- Tabela com busca, filtros por papel/status, paginação.
- Botão “Novo usuário” abre modal com etapas (dados básicos → preferências → resumo).
- Ações: editar, desativar, redefinir senha, reenviar convite.
- Estados: loading (skeleton), vazio (“Nenhum usuário cadastrado”), erro (toast + retry).

### 8.4.5 Gestão de Locais
- Lista com coordenadas e timezone; botão “Ver mapa” abre modal com mapa (futuro).
- Validação ao salvar (lat/long obrigatórios, timezone consistente).

### 8.4.6 Configuração de Oração
- Wizard com 4 passos: Método → Madhhab → Ajustes Finos → Ramadan.
- Exibe preview dos horários calculados antes de aplicar.
- Mensagem de confirmação “Aplicar para todos os locais?” com checklist de impactos.

### 8.4.7 Logs e Auditorias
- Tabela com filtros (tipo de ação, usuário, data).
- Possibilidade de exportar CSV.
- Mensagens claras quando filtros não retornam dados.

### 8.4.8 Estados e Feedbacks
- **Saving**: botões com spinner + texto “Salvando…”.
- **Success**: toast verde “Configuração aplicada e recalculada às HH:MM”.
- **Erro**: toast vermelho com código + link “Ver detalhes do log”.
- **Sessão expirada**: redireciona para login com mensagem contextual.

### 8.4.9 Fluxos Críticos
1. **Criar usuário**: Dashboard → Usuários → “Novo” → Formulário → Validação → Resumo → Confirmar → Toast + log.
2. **Alterar política de oração**: Dashboard → Configurações → Wizard → Preview → Confirmar → Worker acionado → Banner informa status.
3. **Auditar evento**: Dashboard → Logs → Filtrar por período → Exportar → Download CSV.

---

## 8.5 Internacionalização e Acessibilidade

- Strings armazenadas em arquivos de recursos compartilhados; extensão/painel detectam idioma do usuário e permitem troca manual.
- Suporte RTL envolve inversão de layout, alinhamento e animações (prefira transformações simétricas).
- Textos críticos (horários, contagens) possuem `aria-live=polite` para leitores de tela.
- Todos os gráficos possuem equivalentes textuais resumindo métricas.

---

## 8.6 Comportamento Offline / Fallback

- Extensão: indicador de offline, bloqueio de ações que exigem API (login, troca de localização). Cache exibe carimbo de data/hora.
- Painel: banner “Serviço indisponível” quando API retorna 5xx; botões críticos ficam desabilitados até restabelecer.

---

## 8.7 Conclusão

A especificação de UI/UX fornece wireframes textuais, estados e fluxos detalhados para garantir uma experiência consistente para personas-chave. Com diretrizes claras de internacionalização, acessibilidade e fallback, as squads de frontend conseguem desenvolver a extensão e o painel Blazor em paralelo, mantendo alinhamento cultural e técnico com os objetivos do AdhanSync Corporate.
