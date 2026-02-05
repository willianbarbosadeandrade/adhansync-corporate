# Documentação Mestra de Negócio e Engenharia — AdhanSync-Corporate

Esta é a Documentação Mestra de Negócio e Engenharia para o AdhanSync-Corporate. Este documento serve como o "Single Source of Truth" (Fonte Única de Verdade) para desenvolvedores, investidores e stakeholders.

## Documentação Oficial: AdhanSync-Corporate

### 1. Justificativa: O "Porquê" (Value Proposition)
Em ambientes comerciais e corporativos em regiões que seguem o calendário islâmico, a gestão do áudio ambiente durante as cinco orações diárias é um desafio logístico. Atualmente, a pausa é manual ou inexistente, o que pode gerar desconforto ou falta de conformidade cultural.

O AdhanSync-Corporate automatiza o respeito à tradição. Ele elimina o erro humano, garantindo que a transição entre o entretenimento (música/rádio) e a espiritualidade (Adhan) seja fluida, profissional e tecnicamente precisa.

### 2. Requisitos do Sistema
#### 2.1 Requisitos Funcionais (RF)
- RF-01: Sincronização Geográfica: O app deve buscar horários de oração baseados na localização GPS ou seleção manual (ex: Doha) via API.
- RF-02: Controle de Processos (Audio Hijack): Identificar e listar aplicativos abertos (Spotify, Chrome, etc.) para controle individual.
- RF-03: Automação de Pausa (Mute/Fade): No horário exato, o app deve baixar o volume da fonte original (Fade-out) e pausar a execução.
- RF-04: Player de Adhan Customizável: Permitir upload de arquivos .mp3/wav para cada oração.
- RF-05: Ajuste de Offset: Configurar disparos antecipados ou atrasados em minutos.
- RF-06: Operação Offline: Cache local de horários para funcionamento sem internet por até 30 dias.

#### 2.2 Requisitos Não Funcionais (RNF)
- RNF-01: Latência Zero: O disparo do áudio não deve ter atraso superior a 1 segundo em relação ao relógio oficial.
- RNF-02: Baixo Consumo: O Agente Desktop não deve consumir mais de 150MB de RAM em background.
- RNF-03: Compatibilidade: Suporte nativo para Windows 10/11 e macOS (Intel/Apple Silicon).
- RNF-04: Resiliência: Auto-inicialização com o sistema operacional (Boot-start).

### 3. Arquitetura Técnica
#### 3.1 Estrutura Frontend (UI/UX)
- Tecnologia: React 18 + Tailwind CSS.
- Estética: Design "Dark Mode" por padrão, com botões de alta densidade (estilo Stream Deck/Companion).
- Componentização:
  - Dashboard Central: Countdown circular para a próxima oração.
  - Mixer de Fontes: Sliders de volume para cada app detectado no SO.
  - Configurador de Orações: Modal de drag-and-drop para arquivos de áudio.

#### 3.2 Estrutura Backend (Local & Cloud)
- Local (Electron Main Process):
  - Node.js: Orquestração de arquivos e interface.
  - Rust (Bridge): Módulo nativo para interagir com a WASAPI (Windows) e CoreAudio (Mac). É aqui que ocorre o "sequestro" do fluxo de áudio para aplicação de ganho e volume.
  - SQLite: Banco de dados local para logs e horários offline.
- Cloud (SaaS API):
  - NestJS + PostgreSQL: Gestão de usuários, assinaturas e armazenamento de arquivos de áudio em nuvem para sincronização entre dispositivos.

### 4. Plano de Desenvolvimento Passo a Passo (Roadmap)
- Fase 1: Fundação e Prova de Conceito (PoC)
  - Configuração do ambiente Electron + Rust.
  - Desenvolvimento do driver de áudio capaz de reduzir o volume de uma aba do Chrome via código.
  - Implementação do algoritmo de cálculo de orações (Umm Al-Qura).
- Fase 2: O "Cérebro" de Automação
  - Criação do Scheduler Service: um loop de alta precisão que monitora o tempo.
  - Implementação da lógica de Fade-out -> Play Adhan -> Fade-in.
  - Criação do sistema de banco de dados local para persistência de arquivos.
- Fase 3: Interface e Experiência do Usuário
  - Montagem da UI baseada nos prints (Doha Prayer Times).
  - Criação do sistema de "Botões Configuráveis".
  - Testes de UX para garantir que um leigo consiga configurar o app em menos de 2 minutos.
- Fase 4: Cloud e Comercialização
  - Implementação do sistema de login e licenciamento (SaaS).
  - Integração com gateway de pagamento.
  - Criação do portal web para gestão remota.

### 5. Escalabilidade e Segurança
- Segurança
  - Criptografia: Todos os arquivos de áudio do cliente são criptografados em repouso.
  - Sandboxing: O app de áudio opera com permissões restritas, garantindo que ele não tenha acesso a microfones ou dados privados do usuário.
  - Auth: Autenticação via OAuth2 com tokens JWT.
- Escalabilidade
  - Distribuição via CDN: Instaladores e atualizações (Auto-update) servidos via Cloudflare para garantir velocidade global.
  - Micro-serviços: O backend cloud é stateless, permitindo escalar horizontalmente para suportar milhares de lojas conectadas simultaneamente.
