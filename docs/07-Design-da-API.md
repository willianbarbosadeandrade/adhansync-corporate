# 7. Design da API

A API do AdhanSync Corporate é desenvolvida em **C# / ASP.NET Core**, estruturada segundo princípios REST, seguindo boas práticas de versionamento, autenticação, segurança e padronização de respostas. Todos os endpoints expostos abaixo fazem parte do namespace `/api/v1`. Requisições devem incluir o header `X-Tenant-Id` (quando aplicável) além do JWT no header `Authorization`.

---

## 7.1 Princípios e Padrões

- RESTful com JSON como formato padrão.
- Versionamento por rota (`/api/v1`).
- Status HTTP e códigos específicos (`code`) para cada erro.
- Paginação padrão `?page=1&pageSize=20`, ordenação `sort=` e filtros `filter=`.
- Rate limiting: 100 req/min por usuário autenticado (429 com `Retry-After`).
- Cache-Control para endpoints de leitura (`PrayerTimes`) com `max-age=60` quando houver dados recentes.
- Respostas incluem `traceId` (correlação) e `timestamp`.

---

## 7.2 Autenticação – `/auth`

### POST `/login`
Autentica usuário e retorna JWT + refresh token.

**Request**
```json
{
  "email": "user@company.com",
  "password": "SenhaSegura123",
  "rememberMe": true
}
```

**Response 200**
```json
{
  "token": "jwt-here",
  "expiresIn": 3600,
  "refreshToken": "refresh-hash",
  "refreshExpiresIn": 604800,
  "user": {
    "id": 1,
    "name": "Willian",
    "role": "Admin",
    "organizationId": 10,
    "preferences": {
      "language": "pt",
      "theme": "dark"
    }
  }
}
```

**Erros**
- 400 `AUTH_001` credenciais inválidas.
- 423 `AUTH_002` usuário inativo/bloqueado.

### POST `/refresh`
Recebe `refreshToken`, valida e entrega novo par de tokens.

**Request/Response** igual ao login, mas apenas tokens retornados. Em caso de uso repetido, retorna 401 `AUTH_003`.

### POST `/logout`
Revoga refresh token atual.

---

## 7.3 Extensão – `/extension`

### POST `/extension/login`
Fluxo simplificado para a extensão (sem lembrar-me).

### POST `/extension/refresh`
Refresh silencioso chamado por alarmes da extensão.

### GET `/extension/sync`
Retorna horários + notificações pendentes em chamada única para minimizar round-trips.

**Response**
```json
{
  "serverTime": "2025-02-20T12:00:00Z",
  "prayerTimes": {
    "locationId": 1,
    "date": "2025-02-20",
    "fajr": "05:02",
    "sunrise": "06:18",
    "dhuhr": "12:05",
    "asr": "15:21",
    "maghrib": "17:48",
    "isha": "19:02",
    "calculatedAt": "2025-02-19T21:05:00Z"
  },
  "notifications": [
    {
      "prayerName": "Dhuhr",
      "channel": "browser",
      "minutesBefore": 10,
      "message": {
        "pt": "Dhuhr em 10 minutos",
        "en": "Dhuhr in 10 minutes"
      }
    }
  ]
}
```

---

## 7.4 Organizações – `/organizations`

### GET `/`
Lista organizações (somente admin global). Suporta filtros `?query=` e paginação.

**Response**
```json
{
  "data": [
    { "id": 10, "name": "ACME", "domain": "acme.com", "timezone": "Asia/Dubai", "isActive": true }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

### POST `/`
Cria organização.
```json
{
  "name": "ACME",
  "domain": "acme.com",
  "timezone": "Asia/Dubai",
  "limits": { "maxUsers": 200, "maxLocations": 10 }
}
```
- 201 com dados criados.
- 409 `ORG_001` se domínio já utilizado.

### GET/PUT/DELETE `/{id}`
- PUT atualiza nome, domínio, limites, status. 
- DELETE realiza soft delete.

---

## 7.5 Usuários – `/users`

### GET `/`
Lista usuários do tenant. Suporta filtros `role`, `status`, `search`.

### POST `/`
```json
{
  "name": "Fatima",
  "email": "fatima@acme.com",
  "role": "Employee",
  "temporaryPassword": "Opcional123"
}
```
- 201 retorno com usuário criado.

### PUT `/{id}`
Atualiza nome, papel, status.

### DELETE `/{id}`
Soft delete/desativação.

**Erros comuns**: 403 `USER_001` (sem permissão), 404 `USER_002` (não encontrado), 422 `USER_003` (limite excedido).

---

## 7.6 Locais – `/locations`

### GET `/`
Retorna locais da organização.

### POST `/`
```json
{
  "name": "Escritório Doha",
  "timezone": "Asia/Qatar",
  "latitude": 25.2854,
  "longitude": 51.5310,
  "isDefault": true
}
```

### PUT/DELETE `/{id}`
Atualizações e desativação.

---

## 7.7 Configurações de Oração – `/prayer-settings`

### GET `/`
Retorna configuração atual + histórico mais recente.

### PUT `/`
```json
{
  "calculationMethod": "UmmAlQura",
  "madhhab": "Hanafi",
  "fajrAngle": 18.5,
  "ishaAngle": 17,
  "adjustmentMinutes": { "fajr": 0, "dhuhr": 2 },
  "ramadanOverrides": {
    "ishaDelayMinutes": 15,
    "iftarNotification": true
  }
}
```
- 200 com dados atualizados + `policyVersion`.
- 409 `PRAYER_001` se há alteração concorrente.

---

## 7.8 Horários de Oração – `/prayer-times`

### GET `/today`
Parâmetros: `locationId` (obrigatório) ou `default=true`.

### GET `/range`
`locationId`, `from`, `to` (máx. 31 dias). Suporta paginação quando histórico extenso.

**Erros**: 404 `LOCATION_001`, 400 `DATE_001` se intervalo inválido.

### POST `/recalculate`
Somente admin; força recalcular.

---

## 7.9 Notificações – `/notifications`

### GET `/logs`
Lista notificações do usuário autenticado ou, para admins, de toda organização. Filtros: `prayerName`, `status`, `dateRange`.

### POST `/templates`
CRUD de templates corporativos.

### GET `/policies`
Obtém `NotificationPolicy`; `PUT` atualiza (somente admin).

### POST `/webhooks/test`
Permite testar integrações configuradas em `IntegrationConfig`.

---

## 7.10 Integrações – `/integrations`

- `GET /` lista integrações habilitadas.
- `POST /` cria nova integração (ex.: calendário). Payload inclui `type`, `settings` (criptografado) e `scopes` autorizados.
- `POST /{id}/sync` dispara sincronização manual.

---

## 7.11 Webhooks de Notificações

Para tenants que desejarem consumir eventos externos, a API envia POSTs para URLs configuradas em `IntegrationConfig`:

```json
{
  "event": "PrayerUpcoming",
  "tenantId": 10,
  "payload": {
    "userId": 32,
    "prayerName": "Asr",
    "scheduledFor": "2025-02-20T15:21:00Z"
  },
  "signature": "HMAC-SHA256"
}
```

- Cabeçalho `X-AdhanSync-Signature` para validação.
- Retries exponenciais em caso de 5xx.

---

## 7.12 Erros e Padrão de Resposta

```json
{
  "error": "Invalid credentials",
  "code": "AUTH_001",
  "status": 401,
  "traceId": "00-abc123",
  "timestamp": "2025-02-20T12:00:00Z"
}
```

Principais códigos: `AUTH_***`, `ORG_***`, `USER_***`, `PRAYER_***`, `NOTIF_***`, `INTEG_***`.

---

## 7.13 Segurança e Headers Obrigatórios

- `Authorization: Bearer <token>` em todos os endpoints (exceto `/auth/login`/`refresh`).
- `X-Tenant-Id` usado para auditoria (mesmo que derivado do token) e rastreamento em logs.
- `X-Request-Id` opcional para correlação fornecida pelo cliente; se ausente, API gera `traceId`.
- Rate limiting retornando `Retry-After`. Suporte a `If-None-Match` (ETag) nos endpoints de horários para otimizar tráfego.

---

## 7.14 Conclusão

A especificação detalhada permite desenvolvimento paralelo das squads de backend, painel Blazor e extensão, garantindo contratos claros (payloads, filtros, erros, headers) e preparando a API para integrações corporativas, notificações em massa e requisitos de segurança e compliance do AdhanSync Corporate.
