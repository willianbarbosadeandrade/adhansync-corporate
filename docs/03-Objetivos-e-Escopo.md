# 3. Objetivos e Escopo

## 3.1 Objetivo Geral

Desenvolver uma plataforma corporativa multiplataforma — composta por API em C#/.NET, painel administrativo em Blazor Server e extensão de navegador — capaz de calcular, sincronizar e gerenciar horários de oração (Adhan) para equipes e organizações, promovendo inclusão religiosa, organização de rotinas e integração com sistemas corporativos.

---

## 3.2 Objetivos Específicos

1. **Centralizar a configuração corporativa dos horários de oração**, permitindo que uma organização defina métodos de cálculo, madhhab, localização e políticas internas padronizadas.
2. **Oferecer aos colaboradores uma experiência simples e acessível**, permitindo visualizar horários de oração diretamente no navegador através de extensão compatível com Chrome/Edge.
3. **Sincronizar automaticamente horários de oração** considerando localização geográfica, fuso horário e variações sazonais (ex.: Ramadan).
4. **Integrar a plataforma com ferramentas corporativas** como calendários, chats internos e notificações por e-mail.
5. **Permitir gestão multi-tenant**, garantindo isolamento entre organizações e personalização de configurações.
6. **Fornecer um painel administrativo completo em Blazor**, permitindo ao RH gerenciar usuários, políticas e preferências de cálculo.
7. **Automatizar comunicações e lembretes**, utilizando workers para envio de notificações e processamento em segundo plano.
8. **Garantir segurança, escalabilidade e padronização**, utilizando C#/.NET, Entity Framework Core, JWT e práticas modernas de arquitetura (Clean Architecture).
9. **Atender ao modelo de documentação acadêmica da PUC Minas**, com estrutura completa de requisitos, modelagem, arquitetura e validação.

---

## 3.3 Escopo do Projeto

### 3.3.1 Funcionalidades incluídas (IN-SCOPE)

#### Backend (API C#/.NET)
- Cadastro e autenticação de administradores corporativos.
- Gerenciamento de organizações (multi-tenant).
- Cadastro e configuração de métodos de cálculo (ex.: Umm Al-Qura, Egypt, University of Islamic Sciences Karachi).
- Suporte a diferentes madhahib (Hanafi, Shafi'i, Maliki, Hanbali).
- Cálculo automático de horários de oração (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha).
- Recalcular automaticamente:
  - Diariamente à meia-noite da localização.
  - Quando políticas corporativas forem alteradas.
  - Quando a localização mudar.
- Integração com serviços externos:
  - Geolocalização (lat/long)
- Endpoints REST para:
  - Usuários
  - Preferências individuais
  - Notificações
  - Horários diários
- Autorização baseada em papéis (Admin, Gestor, Colaborador).

#### Painel Administrativo (Blazor Server)
- Login de administradores e gestores.
- Dashboard com visão da organização.
- Cadastro e edição de usuários corporativos.
- Gerenciamento de políticas de oração:
  - Método de cálculo
  - Madhhab
  - Localização (escritórios, times remotos)
- Visualização e teste de horários.
- Configuração de notificações globais.
- Logs de eventos e monitoramento básico.

#### Extensão de Navegador (Chrome/Edge – Manifest V3)
- Exibição dos horários de oração do usuário.
- Sincronização automática com API corporativa.
- Tema claro/escuro.
- Notificações do navegador.
- Troca de idioma (EN/AR/PT).
- Cache local via `chrome.storage`.

#### Workers (Jobs)
- Recalcular horários diariamente para todas organizações.
- Enviar e-mails e notificações automáticas.
- Execução de rotinas de Ramadan.
- Limpar dados temporários e tokens expirados.

---

### 3.3.2 Funcionalidades fora do escopo inicial (OUT-OF-SCOPE)

- Aplicativos Mobile nativos (Android/iOS) — poderão ser desenvolvidos em MAUI no futuro.
- Integração com dispositivos IoT (painéis físicos, relógios inteligentes).
- Sistema de pagamento e planos SaaS (versão corporativa 2.0).
- Relatórios avançados de RH.
- Chatbots internos (Teams/Slack bot).
- Machine Learning para previsão de horários.
- Geofencing avançado (detectar automaticamente localização de usuário).

---

## 3.4 Premissas

- O backend será implementado exclusivamente em **C# / .NET 8**.
- Todos os serviços seguirão princípios de **Clean Architecture**.
- Banco de dados relacional (preferencialmente PostgreSQL).
- O sistema será multi-tenant por design.
- Extensões de navegador utilizarão **TypeScript**.
- A solução deve rodar em ambientes cloud (Azure, AWS, Railway, etc.).

---

## 3.5 Restrições

- A extensão de navegador não pode realizar cálculos complexos — deve depender da API.
- Extensão limitada a navegadores baseados em Chromium (Chrome, Edge, Brave, etc.).
- Painel administrativo exclusivamente web (sem versão mobile nativa no MVP).
- Necessidade de conexão à internet para sincronização de horários.
- Trabalhos acadêmicos devem seguir o modelo da PUC Minas.

---

## 3.6 Definição do MVP

A primeira versão (MVP) deverá incluir:

- API com autenticação, cálculo de horários e multi-tenant básico.
- Blazor Admin com configurações essenciais de oração.
- Extensão do navegador com exibição dos horários.
- Worker diário recalculando horários.
- Documentação completa (13 arquivos).

---

## 3.7 Critérios de Sucesso

O MVP será considerado bem-sucedido se:

- Calcular corretamente os horários de oração em qualquer local do mundo.
- Permitir que uma empresa configure métodos e políticas corporativas.
- Sincronizar horários com a extensão sem erros.
- Administradores conseguirem gerenciar usuários e preferências.
- A base tecnológica estiver estável para a versão 2.0.
