# 7. Design da API

A API do AdhanSync Corporate é desenvolvida em **C# / ASP.NET Core**, estruturada segundo princípios REST, seguindo boas práticas de versionamento, autenticação, segurança e padronização de respostas.

---

# 7.1 Princípios

- RESTful
- JSON como formato padrão
- JWT para autenticação
- Versionamento por rota: `/api/v1/...`
- Códigos de status HTTP padronizados

---

# 7.2 Estrutura Base da API

```text
/api
   /v1
      /auth
      /organizations
      /users
      /locations
      /prayer-settings
      /prayer-times
      /notifications
7.3 Endpoints Detalhados
7.3.1 Autenticação – /api/v1/auth
POST /login

Autentica usuário.

Request

{
  "email": "user@company.com",
  "password": "123456"
}


Response

{
  "token": "jwt-here",
  "refreshToken": "refresh-here",
  "user": {
    "id": 1,
    "name": "Willian",
    "role": "Admin"
  }
}

POST /refresh

Gera novo token JWT.

7.3.2 Organizações – /api/v1/organizations
GET /

Lista organizações (apenas admin global).

POST /

Cria nova organização.

GET /{id}

Obtém detalhes.

PUT /{id}

Atualiza dados.

DELETE /{id}

Desativa organização (soft delete).

7.3.3 Usuários – /api/v1/users
GET /

Lista usuários da organização do usuário autenticado.

GET /{id}

Busca usuário específico.

POST /

Cria usuário.

PUT /{id}

Edita dados.

DELETE /{id}

Desativa usuário.

7.3.4 Locais – /api/v1/locations
GET /

Lista locais da organização.

POST /

Cria novo local corporativo.

PUT /{id}

Edita local.

DELETE /{id}

Desativa local.

7.3.5 Configurações de Oração – /api/v1/prayer-settings
GET /

Retorna método de cálculo da organização.

PUT /

Atualiza método, madhhab, ângulos, ajustes.

7.3.6 Horários de Oração – /api/v1/prayer-times
GET /today?locationId={id}

Retorna horários do dia para um local.

Response

{
  "locationId": 1,
  "date": "2025-02-20",
  "fajr": "05:02",
  "sunrise": "06:18",
  "dhuhr": "12:05",
  "asr": "15:21",
  "maghrib": "17:48",
  "isha": "19:02"
}

GET /range?locationId={id}&from=2025-02-20&to=2025-02-27

Retorna horário em intervalo de datas.

7.3.7 Notificações – /api/v1/notifications
GET /logs

Lista notificações enviadas ao usuário autenticado.

7.4 Padrão de Erros
{
  "error": "Invalid credentials",
  "code": "AUTH_001",
  "status": 401
}

7.5 Segurança

Autenticação obrigatória em todos endpoints (exceto /auth).

Tokens incluem OrganizationId.

Logs via Serilog.

Rate limiting configurado.

7.6 Conclusão

A API é o núcleo do AdhanSync Corporate, responsável por entregar dados consistentes e seguros para a extensão e para o painel administrativo, viabilizando a sincronização dos horários de oração em ambiente corporativo.
