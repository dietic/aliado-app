# 🤖 Onboarding Flow (WhatsApp)

This file defines the user onboarding experience for Aliado, entirely via WhatsApp messages handled by Twilio.

---

## ✅ Purpose

Guide new users through a zero-friction WhatsApp interaction to collect essential data:

- Name
- Email _(not implemented yet — must be added ASAP)_
- District
- Service Categories
- Confirmation

All data is stored in a temporary table: `onboarding_state`. When all information is gathered, a user and provider is/are created.

---

## 👥 Current Steps (WIP)

### 1. Ask for Name

- Prompt: "¡Hola! ¿Cómo te llamas?"
- Response: Free-text (no validation yet)
- Store to: `onboarding_state.name`

### 2. Ask for Email _(❗Not implemented yet — critical to add)_

- Prompt: "¿Cuál es tu correo electrónico?"
- Response: Free-text (basic format validation to be added)
- Store to: `onboarding_state.email`

### 3. Ask for District

- Prompt: "¿En qué distrito vives o necesitas el servicio?"
- Response: Free-text, matched via fuzzy string to `districts.slug`
- Store to: `onboarding_state.district`

### 4. Ask for Category

- Prompt: "¿Qué tipo de servicio necesitas? (Ej: gasfitero, electricista, etc.)"
- Response: Free-text, matched to `categories.slug`
- Store to: `onboarding_state.services`

### 5. Confirm Data

- Prompt: "Esto es lo que tengo:
  - Nombre: {name}
  - Correo: {email}
  - Distrito: {district}
  - Servicio: {service}
    ¿Está todo correcto? (Sí/No)"
- Response: `Sí` continues, `No` loops back to step 1 or asks "¿Qué deseas corregir?"

---

## ❌ Missing Features

- [ ] Input validation (strip emojis, typos, empty replies)
- [ ] Standardize casing and accents
- [ ] **Email step not yet wired up — implement both capture and validation**
- [ ] District/category fuzzy matching is not robust
- [ ] Add fallback messages for empty or malformed inputs
- [ ] Add timeout handling for abandoned flows

---

## 📂 Data Structure (Supabase: `onboarding_state`)

| Column     | Type      | Description                               |
| ---------- | --------- | ----------------------------------------- |
| phone      | string    | User phone number (PK)                    |
| step       | string    | Current step in flow                      |
| name       | string    | User-provided name                        |
| email      | string    | User-provided email _(to be implemented)_ |
| districts  | string[]  | Matched district slugs                    |
| services   | string[]  | Matched category slugs                    |
| updated_at | timestamp | Last activity                             |

---

## ⚠️ AI Instructions

When assisting with onboarding:

- ✅ Use structured steps based on current `step` value
- ✅ Update `onboarding_state` after each reply
- ✅ Normalize strings before fuzzy matching
- ✅ Confirm data before submission
- ✅ Store multiple `services` or `districts` as arrays (string[])
- ❌ Do NOT store directly to `users` or `providers` tables during onboarding

---

This flow evolves as new categories, districts, and fallback logic are implemented.
