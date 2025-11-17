# 6. Modelagem de Dados

Este documento descreve o modelo relacional da plataforma AdhanSync Corporate, seguindo o padrão multi-tenant e reforçando segurança, consistência e rastreabilidade. Foram incluídas entidades de suporte a tokens, preferências individuais, integrações e auditoria, garantindo aderência a LGPD/GDPR.

---

## 6.1 Modelo Entidade-Relacionamento (DER) – Descrição Textual

```text
Organization (1) ────< (N) User
Organization (1) ────< (N) Location
Organization (1) ────< (N) PrayerSettings
Organization (1) ────< (N) NotificationPolicy
Organization (1) ────< (N) IntegrationConfig
Organization (1) ────< (N) AuditLog
Organization (1) ────< (N) NotificationTemplate
Location (1)    ────< (N) PrayerTime
User (1)        ────< (N) NotificationLog
User (1)        ────< (N) UserPreference
User (1)        ────< (N) RefreshToken
PrayerSettings (1) ────< (N) PrayerPolicyHistory
NotificationTemplate (1) ────< (N) NotificationLog
```

---

## 6.2 Tabelas e Atributos

### 6.2.1 Organization
- `Id` (PK, GUID ou inteiro)
- `Name` (string)
- `Domain` (string, opcional)
- `Timezone` (string)
- `IsActive` (bool)
- `MaxUsers`, `MaxLocations`, `MaxNotificationsPerDay` (int, limites por contrato)
- `CreatedAt` (datetime)
- `UpdatedAt` (datetime, opcional)

### 6.2.2 User
- `Id` (PK)
- `OrganizationId` (FK → Organization)
- `Name` (string)
- `Email` (string, único por organização)
- `PasswordHash` (string)
- `Role` (`Admin`, `Manager`, `Employee`)
- `IsActive` (bool)
- `LastLoginAt` (datetime, opcional)
- `CreatedAt` (datetime)

### 6.2.3 UserPreference
- `Id` (PK)
- `UserId` (FK → User)
- `Language` (string EN/AR/PT)
- `Theme` (string: `light`, `dark`, `system`)
- `NotificationChannel` (string: `email`, `browser`, `both`)
- `StayLoggedIn` (bool)
- `CreatedAt` (datetime)
- `UpdatedAt` (datetime)

### 6.2.4 RefreshToken
- `Id` (PK)
- `UserId` (FK → User)
- `TokenHash` (string)
- `ExpiresAt` (datetime)
- `RevokedAt` (datetime, opcional)
- `CreatedAt` (datetime)
- `IpAddress` / `UserAgent` (string) para auditoria

### 6.2.5 Location
- `Id` (PK)
- `OrganizationId` (FK → Organization)
- `Name` (string)
- `Latitude`/`Longitude` (decimal)
- `Timezone` (string)
- `IsDefault` (bool)
- `CreatedAt` (datetime)

### 6.2.6 PrayerSettings
- `Id` (PK)
- `OrganizationId` (FK → Organization)
- `CalculationMethod` (string)
- `Madhhab` (string)
- `FajrAngle`, `IshaAngle` (decimal)
- `AdjustmentMinutes` (int, opcional)
- `AppliesDuringRamadan` (bool)
- `CreatedAt` (datetime)

### 6.2.7 PrayerPolicyHistory
- `Id` (PK)
- `PrayerSettingsId` (FK → PrayerSettings)
- `ChangedByUserId` (FK → User)
- `OldValues` / `NewValues` (JSON)
- `Reason` (string, opcional)
- `ChangedAt` (datetime)

### 6.2.8 PrayerTime
- `Id` (PK)
- `LocationId` (FK → Location)
- `Date` (date)
- `Fajr`, `Sunrise`, `Dhuhr`, `Asr`, `Maghrib`, `Isha` (time)
- `CalculatedAt` (datetime)
- `CalculationSource` (string: `worker`, `manual`, `import`)

### 6.2.9 NotificationPolicy
- `Id` (PK)
- `OrganizationId` (FK → Organization)
- `ReminderMinutesBefore` (json/array)
- `ChannelsEnabled` (json)
- `RamadanOverrides` (json opcional)
- `CreatedAt`, `UpdatedAt`

### 6.2.10 NotificationTemplate
- `Id` (PK)
- `OrganizationId` (FK → Organization)
- `TemplateKey` (string, ex.: `prayer.upcoming`)
- `Language` (string EN/AR/PT)
- `Subject`, `Body` (string)
- `IsDefault` (bool)
- `LastUpdatedBy` (FK → User)
- `UpdatedAt` (datetime)

### 6.2.11 NotificationLog
- `Id` (PK)
- `UserId` (FK → User)
- `NotificationTemplateId` (FK → NotificationTemplate)
- `PrayerName` (string)
- `Date` (date)
- `SentAt` (datetime)
- `Channel` (string: email, browser, app)
- `Status` (string: sent, failed)
- `ErrorMessage` (string, opcional)

### 6.2.12 IntegrationConfig
- `Id` (PK)
- `OrganizationId` (FK → Organization)
- `IntegrationType` (string: `calendar`, `email`, `webhook`)
- `Settings` (JSON criptografado)
- `IsActive` (bool)
- `LastSyncAt` (datetime, opcional)
- `CreatedAt`, `UpdatedAt`

### 6.2.13 AuditLog
- `Id` (PK)
- `OrganizationId` (FK → Organization)
- `UserId` (FK → User, opcional para eventos automáticos)
- `Action` (string)
- `Entity` (string)
- `EntityId` (string)
- `Metadata` (JSON)
- `IpAddress`, `UserAgent`
- `CreatedAt` (datetime)

---

## 6.3 Regras de Integridade

1. Toda linha relacionável deve conter `OrganizationId` direta ou indiretamente (via FK).  
2. Usuários sem `OrganizationId` são proibidos; tokens sempre vinculados ao usuário.  
3. `PrayerTime` deve referenciar `Location` válido e possuir registro em `PrayerSettings`.  
4. `NotificationTemplate` precisa ter versões para os idiomas suportados; fallback garantido para EN.  
5. `AuditLog` registra toda alteração de políticas, integrações e notificações importantes em conformidade com LGPD/GDPR.  
6. `IntegrationConfig.Settings` deve ser criptografado em repouso e em trânsito.

---

## 6.4 Observações de Compliance (LGPD/GDPR)

- Dados pessoais (nome, e-mail, preferências religiosas) têm base legal de consentimento + legítimo interesse corporativo documentado.  
- Campos sensíveis armazenados criptografados quando aplicável (tokens, integrações).  
- Logs devem permitir atender solicitações de acesso/remoção dentro dos prazos regulatórios.  
- `AuditLog` e `PrayerPolicyHistory` devem suportar exportação filtrada por tenant.  
- Retenção: tokens e notificações expiram após período definido (ex.: 90 dias) conforme política corporativa.

---

## 6.5 Considerações de Performance

- Índices: `User.Email`, `OrganizationId` em todas as tabelas, `PrayerTime(LocationId, Date)`, `NotificationLog(UserId, Date)`, `AuditLog(OrganizationId, CreatedAt)`.
- Possível **particionamento** de `PrayerTime` e `NotificationLog` por mês/ano para histórico extenso.  
- Uso de Redis para cache de horários e `IntegrationConfig` frequentemente acessados.  
- Monitorar crescimento de `AuditLog` e mover para armazenamento frio após período definido.

---

## 6.6 Conclusão

A modelagem atualizada cobre não apenas o núcleo de horários de oração, mas também preferências individuais, tokens, integrações e auditoria completa. Com isso, a plataforma suporta requisitos de multi-tenant, notificações corporativas, compliance e escalabilidade, mantendo base sólida para evolução do AdhanSync Corporate.
