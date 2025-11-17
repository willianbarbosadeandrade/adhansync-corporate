# 4. Requisitos do Sistema

Este documento apresenta os requisitos funcionais, não funcionais e regras de negócio do sistema **AdhanSync Corporate**, desenvolvido em C#/.NET, com arquitetura multi-tenant, API REST, extensão de navegador e painel administrativo corporativo.

---

# 4.1 Requisitos Funcionais (RF)

### RF01 – Autenticação e Autorização
- RF01.1 — O sistema deve permitir login de usuários corporativos via e-mail e senha.
- RF01.2 — O sistema deve emitir tokens JWT com refresh token.
- RF01.3 — O sistema deve suportar três papéis: **Administrador**, **Gestor** e **Colaborador**.
- RF01.4 — Usuários devem pertencer obrigatoriamente a uma **organização (tenant)**.

### RF02 – Gestão de Organizações
- RF02.1 — O Administrador deve cadastrar organizações.
- RF02.2 — Cada organização possui suas próprias configurações de oração.
- RF02.3 — O sistema deve isolar os dados de cada organização (multi-tenant).

### RF03 – Gestão de Usuários Corporativos
- RF03.1 — Administradores podem criar, editar e desativar usuários.
- RF03.2 — Gestores podem visualizar usuários da própria organização.
- RF03.3 — Colaboradores somente visualizam seus próprios dados.

### RF04 – Configuração dos Métodos de Cálculo
O sistema deve permitir selecionar o método desejado:

- Umm Al-Qura (Makkah)
- Egyptian General Authority of Survey
- University of Islamic Sciences, Karachi
- Muslim World League
- Gulf Region
- ISNA
- Tehran, Shia Ithna-Ashari
- Customizado

Configurações ajustáveis:

- Ângulo do Fajr
- Ângulo do Isha
- Diferença de Asr (Madhhab: Hanafi / Shafi'i)

### RF05 – Localização e Fuso Horário
- RF05.1 — A organização deve definir localizações (escritórios, fábricas, filiais).
- RF05.2 — O sistema deve converter automaticamente fuso horário.
- RF05.3 — Deve ser possível utilizar geolocalização para identificar latitude/longitude.

### RF06 – Cálculo dos Horários de Oração
O sistema deve calcular automaticamente:

- Fajr
- Sunrise
- Dhuhr
- Asr
- Maghrib
- Isha

O sistema deve recalcular horários:

- Diariamente, à meia-noite da localização.
- Ao alterar políticas corporativas.
- Ao alterar a localização (lat/long).

### RF07 – Sincronização com Extensão de Navegador
- RF07.1 — A extensão deve buscar horários via API.
- RF07.2 — A extensão deve armazenar dados em cache local.
- RF07.3 — A extensão deve mostrar contagem regressiva até a próxima oração.
- RF07.4 — A extensão deve exibir notificações.

### RF08 – Painel Administrativo (Blazor)
- RF08.1 — Dashboard com resumo da organização.
- RF08.2 — CRUD de usuários.
- RF08.3 — Configuração corporativa dos horários.
- RF08.4 — Visualização dos horários do dia.
- RF08.5 — Configuração de notificações.

### RF09 – Notificações e Lembretes
- Notificação push no navegador.
- Notificação por e-mail.
- Notificação por integração corporativa (Teams / Slack no futuro).

### RF10 – Worker de Processamento
- RF10.1 — Recalcular horários diariamente.
- RF10.2 — Disparar lembretes.
- RF10.3 — Limpar tokens expirados.
- RF10.4 — Registrar logs e auditorias.

---

# 4.2 Requisitos Não Funcionais (RNF)

### RNF01 – Performance
- Requisições da API devem responder em até **500ms** em condições normais.
- Recalcular horários para uma organização deve levar menos de **2 segundos**.

### RNF02 – Segurança
- Criptografia de senhas via bcrypt.
- Tokens JWT assinados com chave segura.
- Bloqueio após 5 tentativas falhas de login.
- Logs de acesso a recursos sensíveis.

### RNF03 – Escalabilidade
- API escalável horizontalmente via Docker/Kubernetes.
- Suporte a múltiplas organizações (multi-tenant) em um único cluster.

### RNF04 – Confiabilidade
- Disponibilidade mínima: **99%**.
- Health-check endpoints.
- Logs estruturados via Serilog.

### RNF05 – Usabilidade
- Interface simples, responsiva e clara.
- Extensão deve funcionar off-line por até 12 horas (cache dos últimos horários).

### RNF06 – Portabilidade
- Extensão compatível com navegadores baseados em Chromium (Chrome, Edge, Opera, Brave).

### RNF07 – Internacionalização
- Suporte a **inglês**, **português** e **árabe**.

---

# 4.3 Regras de Negócio (RN)

### RN01 – Cada usuário pertence a apenas uma organização
Não é permitido usuário multi-tenant.

### RN02 – Métodos de cálculo devem seguir padrões internacionais
Baseados em órgãos oficiais responsáveis por calendários e horários islâmicos.

### RN03 – Ajustes de Ramadan
Durante Ramadan:
- O horário de Iftar deve gerar notificação especial.
- Políticas corporativas podem alterar lembretes e horários de trabalho.

### RN04 – Horários nunca são calculados na extensão
A extensão **somente consome** a API.

### RN05 – Mudança de localização exige recalcular horários
Qualquer alteração de latitude/longitude ou fuso exige novo cálculo imediato.

### RN06 – Admin é o único que pode alterar políticas globais
Colaboradores e gestores não podem alterar métodos de cálculo ou madhhab da organização.

### RN07 – Dados isolados por organização
Nenhum dado pode ser compartilhado entre tenants.

---

# 4.4 Conclusão

Este conjunto de requisitos define o comportamento do sistema AdhanSync Corporate, garantindo confiabilidade, escalabilidade, respeito cultural e alinhamento às necessidades corporativas.
