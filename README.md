# AdhanSync-Corporate

Aplicativo desktop corporativo para sincronizar e reproduzir Adhan com automação completa de áudio e conformidade cultural. Construído com **Electron (Main)**, **React + Tailwind (Renderer)** e **Rust (Core de Áudio)**.

## Visão
Em ambientes comerciais que seguem o calendário islâmico, o controle manual do áudio causa falhas e desconforto. O AdhanSync-Corporate automatiza as cinco chamadas diárias, orquestrando fade-out das fontes atuais, reprodução do Adhan e retomada suave, com suporte offline e gestão centralizada.

## Stack
- **Main (Desktop):** Electron + Node.js
- **Renderer (UI):** React 18, Tailwind CSS
- **Core de Áudio:** Rust (cpal/rodio) com bindings nativos
- **Persistência local:** SQLite3
- **Comunicação:** IPC Electron + socket.io-client (para futuras integrações cloud)

## Estrutura de pastas
- `src/main` — Processo principal do Electron, janelas, IPC, integração SO.
- `src/renderer` — Interface React + Tailwind, componentes e hooks.
- `src/core-audio` — Módulo nativo em Rust para manipulação de drivers de áudio.
- `docs` — Documentação técnica e de negócios.
- `config` — Configurações e chaves (não sensíveis). Segredos ficam fora do Git.
- `assets` — Ícones e áudios padrão.

## Primeiros passos
```bash
npm install
npm run dev   # inicia renderer + electron (ajuste scripts quando definir bundler)
```

## Roadmap breve
1) PoC de áudio com fade-in/out via Rust + Electron.
2) Scheduler de horários (API Aladhan + cache offline).
3) UI dark, controles de mixer e configuração de áudios por oração.
4) Portal cloud (NestJS/PostgreSQL) para licenciamento e sync.

## Documentação
- `docs/ARCHITECTURE.md` — fluxo de áudio, IPC e API Aladhan.
- `docs/MASTER_DOCUMENTATION.md` — documento mestre de negócios e engenharia (fonte única de verdade).
