# ARCHITECTURE — AdhanSync-Corporate

## Overview
- **Main (Electron):** cria janelas, gerencia IPC, agenda notificações e delega áudio ao core nativo.
- **Renderer (React + Tailwind):** UI dark mode, painel de orações, mixer de apps e configuração de áudios.
- **Core Áudio (Rust):** engine nativa para captura/controle de dispositivos (CoreAudio/Wasapi/PulseAudio) com efeitos de fade.

## Fluxo de áudio (Fade-in / Fade-out)
1) Renderer agenda reprodução via IPC `schedule:play`.
2) Main valida horário/offset e chama o core Rust via FFI/CLI.
3) Core carrega buffer (mp3/wav) do Adhan, aplica curva de **fade-in (~500ms)**.
4) Durante o playback, watchdog monitora underruns e mantém sincronismo.
5) Finalização executa **fade-out (~400ms)**, libera handle e sinaliza Main.
6) Telemetria retorna ao Renderer para UI (progress bar / gráficos).

## Integração com API Aladhan
- Endpoint: `https://api.aladhan.com/v1/timings` usando localização GPS ou seleção manual.
- Scheduler em background (Main) persiste horários em SQLite.
- Cache offline: mantém últimos horários válidos por até 30 dias.
- Offset configurável por oração (antecipar/atrasar disparo em minutos).

## IPC & Dados
- Canais principais: `schedule:play`, `schedule:config`, `audio:mixer:list`, `audio:mixer:set-volume`.
- Telemetria: eventos enviados do Core -> Main -> Renderer via IPC (`audio:state`).
- Persistência: SQLite para configurações, logs e caching dos horários.

## Build & Tooling
- `npm run dev`: orquestra renderer + electron (via concurrently).
- Tailwind configurado para `src/renderer/**/*.{js,jsx,ts,tsx}`.
- Core Rust: crate `cdylib` exportada para bindings; usar `cargo build --release` dentro de `src/core-audio`.

## Roadmap técnico (resumo)
- Fase 1: PoC de controle de volume/fade em Rust + Electron.
- Fase 2: Scheduler de alta precisão (cron + monotonic clock) com integrações IPC.
- Fase 3: UI dark com mixer, botões configuráveis e upload de Adhan.
- Fase 4: Cloud (NestJS/PostgreSQL) para licenciamento e sync multi-dispositivo.
