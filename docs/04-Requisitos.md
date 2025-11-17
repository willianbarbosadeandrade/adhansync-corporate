# 4. Requisitos do Sistema

Este documento apresenta os requisitos funcionais, não funcionais e regras de negócio do sistema **AdhanSync Corporate**, desenvolvido em C#/.NET, com arquitetura multi-tenant, API REST, extensão de navegador e painel administrativo corporativo. Cada requisito recebeu uma prioridade segundo MoSCoW para orientar o MVP e releases futuros.

Legenda de prioridade: **M (Must)**, **S (Should)**, **C (Could)**, **W (Won't no MVP)**.

---

# 4.1 Requisitos Funcionais (RF)

| ID | Prioridade | Descrição |
|----|------------|-----------|
| **RF01 – Autenticação e Autorização** |||
| RF01.1 | M | Login de usuários corporativos via e-mail e senha. |
| RF01.2 | M | Emissão de tokens JWT com refresh token e expiração configurável por tenant. |
| RF01.3 | M | Papéis: Administrador, Gestor, Colaborador; permissões descritas no RN. |
| RF01.4 | M | Todos os usuários vinculados a um tenant (OrganizationId). |
| RF01.5 | S | MFA opcional para administradores. |
| **RF02 – Gestão de Organizações** |||
| RF02.1 | M | Administrador global cadastra e gerencia organizações. |
| RF02.2 | M | Cada organização possui configurações isoladas de oração e política de notificação. |
| RF02.3 | M | Isolamento lógico de dados (multi-tenant) com filtros automáticos. |
| RF02.4 | S | Histórico de alterações de política por tenant. |
| **RF03 – Gestão de Usuários Corporativos** |||
| RF03.1 | M | CRUD de usuários por administradores; gestão parcial por gestores da própria organização. |
| RF03.2 | M | Colaboradores visualizam apenas seus dados e preferências. |
| RF03.3 | S | Importação em massa via CSV/planilha. |
| **RF04 – Configuração dos Métodos de Cálculo** |||
| RF04.1 | M | Seleção de métodos padrão (Umm Al-Qura, Egyptian, Karachi, MWL, Gulf Region, ISNA, Tehran, Custom). |
| RF04.2 | M | Ajuste de ângulos de Fajr/Isha e madhhab (Hanafi/Shafi'i). |
| RF04.3 | S | Ajustes adicionais por localidade (offset por local). |
| RF04.4 | S | Tabelas customizadas para períodos especiais (Ramadan). |
| **RF05 – Localização e Fuso Horário** |||
| RF05.1 | M | Cadastro de locais (escritórios, times remotos) por organização. |
| RF05.2 | M | Conversão automática de fuso horário com base em timezone e geolocalização. |
| RF05.3 | S | Sugestão automática de lat/long a partir de endereço. |
| **RF06 – Cálculo dos Horários de Oração** |||
| RF06.1 | M | Cálculo automatizado de Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha. |
| RF06.2 | M | Recalcular diariamente à meia-noite local e em alterações de política/localização. |
| RF06.3 | S | API para recalcular sob demanda (admin). |
| RF06.4 | C | Forecast semanal para planejamento. |
| **RF07 – Sincronização com Extensão** |||
| RF07.1 | M | Extensão consome horários via API autenticada. |
| RF07.2 | M | Cache local (até 12h) com fallback offline e aviso ao usuário. |
| RF07.3 | M | Contagem regressiva e notificações multilíngues (EN/AR/PT). |
| RF07.4 | S | Sincronização silenciosa de refresh token. |
| **RF08 – Painel Administrativo (Blazor)** |||
| RF08.1 | M | Dashboard com métricas da organização. |
| RF08.2 | M | CRUD de usuários e locais. |
| RF08.3 | M | Configuração corporativa de métodos/madhhab/notificações. |
| RF08.4 | M | Visualização dos horários do dia por local. |
| RF08.5 | S | Logs e auditorias básicos com filtros. |
| RF08.6 | C | Exportação de relatórios CSV/PDF. |
| **RF09 – Notificações e Lembretes** |||
| RF09.1 | M | Notificações push no navegador e e-mail básico. |
| RF09.2 | S | Notificações multicanal (Teams/Slack) configuráveis. |
| RF09.3 | M | Mensagens traduzidas conforme idioma do usuário; logs com status. |
| RF09.4 | S | Templates corporativos customizados por tenant. |
| **RF10 – Worker de Processamento** |||
| RF10.1 | M | Recalcular horários diariamente para todos os tenants ativos. |
| RF10.2 | M | Disparar lembretes e processar filas de notificações. |
| RF10.3 | M | Limpar tokens expirados, dados temporários e gerar logs de auditoria. |
| RF10.4 | S | Rotinas específicas de Ramadan (ajuste automático de lembretes). |
| RF10.5 | C | Métricas enviadas para dashboard de observabilidade.

---

# 4.2 Requisitos Não Funcionais (RNF)

| ID | Prioridade | Descrição |
|----|------------|-----------|
| RNF01 – Performance | M | API responde em ≤ 500ms (P95); recalcular horários por organização em ≤ 2s. |
| RNF02 – Segurança | M | Criptografia de senhas (bcrypt/Argon2), JWT assinado, MFA opcional, bloqueio após 5 tentativas, CORS restrito. |
| RNF03 – Escalabilidade | M | Suporte a horizontal scaling via Docker/Kubernetes; multi-tenant com isolamentos lógicos e limites configuráveis (máx. usuários/locais por tenant). |
| RNF04 – Confiabilidade | M | Disponibilidade mínima 99%, health-checks, logs estruturados (Serilog), rastreabilidade de jobs. |
| RNF05 – Usabilidade | M | Interface responsiva, acessível (WCAG AA), suporte a teclado/leitores de tela, notificações claras. |
| RNF06 – Portabilidade | M | Extensão compatível com navegadores Chromium (Chrome, Edge, Brave, Opera). |
| RNF07 – Internacionalização | M | Idiomas EN/AR/PT com suporte a LTR/RTL, formatação de datas e textos culturais. |
| RNF08 – Auditoria e Compliance | M | Registro de eventos críticos (login, alteração de política, novo tenant) com usuário, timestamp e tenant. |
| RNF09 – Logs e Observabilidade | S | Centralização de logs, correlação de requisições (traceId), métricas básicas para alarmes. |
| RNF10 – Fallback/Offline | M | Extensão mantém último conjunto de horários por até 12h; painel exibe aviso quando API indisponível. |

---

# 4.3 Regras de Negócio (RN)

| ID | Prioridade | Regra |
|----|------------|-------|
| RN01 | M | Cada usuário pertence a apenas uma organização. |
| RN02 | M | Métodos de cálculo seguem órgãos oficiais; customizações exigem justificativa e histórico. |
| RN03 | S | Durante Ramadan: notificações especiais de Iftar/Suhoor e possibilidade de políticas temporárias. |
| RN04 | M | Horários nunca são calculados na extensão; somente na API/workers. |
| RN05 | M | Mudança de localização/fuso exige recalcular imediatamente; logs devem registrar a origem. |
| RN06 | M | Apenas Admin altera políticas globais; gestores podem sugerir ajustes via workflow (futuro). |
| RN07 | M | Dados isolados por tenant; toda consulta filtrada por OrganizationId. |
| RN08 | S | Notificações multilíngues devem usar templates aprovados; fallback para inglês. |
| RN09 | S | Limites por tenant: nº máximo de usuários, locais, notificações/dia configuráveis para evitar abuso. |
| RN10 | C | Auditoria deve permitir reconstruir histórico de políticas por tenant (quem/quando/qual valor). |

---

## 4.4 Cenários de Erro, Fallback e Logs

- **Extensão offline**: se API indisponível, exibe horários em cache com carimbo de data e alerta “Dados atualizados em HH:MM”. Após 12h, usuário deve reautenticar.
- **Tokens expirados**: extensão tenta refresh silencioso; falha resulta em logout com mensagem localizada e registro em AuditLog. 
- **Limite excedido**: API retorna 429 com cabeçalhos `Retry-After` e loga no monitoramento; painel exibe ajustes recomendados.
- **Políticas de Ramadan**: se não houver configuração específica, sistema aplica padrão global e alerta administradores para revisão.
- **Logs e Compliance**: todos os eventos críticos (login, alteração, geração de horários) armazenados com tenant, usuário, IP e status. Logs seguem requisitos LGPD/GDPR e podem ser exportados mediante solicitação formal.

---

# 4.5 Conclusão

O conjunto de requisitos priorizados garante uma visão clara do MVP e das evoluções planejadas, evidencia preocupações com auditoria, acessibilidade, multi-tenant e notificações multilíngues, além de orientar regras de fallback e compliance. Esses requisitos servirão como base para o desenvolvimento coordenado entre squads de backend, frontend e infraestrutura.
