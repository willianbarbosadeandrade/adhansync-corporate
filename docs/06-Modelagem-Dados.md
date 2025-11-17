# 6. Modelagem de Dados

Este documento descreve o modelo relacional da plataforma AdhanSync Corporate, seguindo o padrão multi-tenant e reforçando segurança, consistência e rastreabilidade.

---

# 6.1 Modelo Entidade-Relacionamento (DER) – Descrição Textual

```text
Organization (1) ────< (N) User
Organization (1) ────< (N) Location
Organization (1) ────< (N) PrayerSettings
Location (1)    ────< (N) PrayerTime
User (1)        ────< (N) NotificationLog
6.2 Tabelas e Atributos
6.2.1 Organization

Id (PK, GUID ou inteiro)

Name (string)

Domain (string, opcional)

Timezone (string)

IsActive (bool)

CreatedAt (datetime)

UpdatedAt (datetime, opcional)

6.2.2 User

Id (PK)

OrganizationId (FK → Organization)

Name (string)

Email (string, único por organização)

PasswordHash (string)

Role (string: Admin, Manager, Employee)

IsActive (bool)

CreatedAt (datetime)

LastLoginAt (datetime, opcional)

6.2.3 Location

Id (PK)

OrganizationId (FK → Organization)

Name (string)

Latitude (decimal)

Longitude (decimal)

Timezone (string)

IsDefault (bool)

CreatedAt (datetime)

6.2.4 PrayerSettings

Id (PK)

OrganizationId (FK → Organization)

CalculationMethod (string)

Madhhab (string)

FajrAngle (decimal)

IshaAngle (decimal)

AdjustmentMinutes (int, opcional)

AppliesDuringRamadan (bool)

CreatedAt (datetime)

6.2.5 PrayerTime

Id (PK)

LocationId (FK → Location)

Date (date)

Fajr (time)

Sunrise (time)

Dhuhr (time)

Asr (time)

Maghrib (time)

Isha (time)

CalculatedAt (datetime)

6.2.6 NotificationLog

Id (PK)

UserId (FK → User)

PrayerName (string)

Date (date)

SentAt (datetime)

Channel (string: email, browser, app)

Status (string: sent, failed)

ErrorMessage (string, opcional)

6.3 Regras de Integridade

Toda linha relacionável deve conter OrganizationId direta ou indiretamente (via FK).

Um usuário sempre pertence a uma organização válida.

Um PrayerTime sempre pertence a um Location válido.

Não deve haver PrayerTime sem configuração válida de PrayerSettings associada à organização.

6.4 Considerações de Performance

Índices em:

User.Email

OrganizationId em todas as tabelas

PrayerTime.Date + LocationId

Possível partição por data em PrayerTime para histórico extenso.

6.5 Conclusão

A modelagem foi estruturada para suportar multi-tenant, cálculos complexos de horários de oração e integrações corporativas, oferecendo base sólida para a aplicação e facilitando futuras evoluções do sistema.
