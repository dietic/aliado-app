# 📲 Twilio Routing & Proxy Flow

This file defines the messaging, proxying, and lead rotation logic for WhatsApp-based communication inside Aliado.
Currently, only the **Twilio sandbox number** is connected. Full proxy orchestration is **planned**.

---

## 📞 Current WhatsApp Setup

- **Number**: Twilio sandbox (1 number only)
- **Channel**: WhatsApp only
- **Environment**: Development/testing
- **Inbound logic**: Handled via webhook (Twilio > Edge Function > Supabase)

---

## 📲 Messaging Flow (Planned Architecture)

### User Requests Service

- User sends natural language message (e.g. "Se rompió mi caño")
- Message parsed via OpenAI for intent + location + category
- AI returns: `{ category, district}`

### Lead Matching Logic

- Find top 3 providers by:
  - Matching `category` + `district` (or 5 sorrunding `districts`)
  - Sorted by rating

### Lead Handoff (Planned)

- Send WhatsApp message to the user selected provider
- If no response after 15 minutes → fallback to next provider

---

## 🛏️ Proxy Number Flow (Planned)

- Provider does **not** see user’s real number
- User does **not** see provider’s real number
- A dynamic Twilio proxy number is assigned per match

### Planned Data Model

- Table: `proxy_links`
- Fields: `lead_id`, `user_number`, `provider_number`, `proxy_number`, `created_at`, `expires_at`

---

## ✉️ Trigger Keywords (Current + Planned)

- `OK`: Confirms a job (provider side)
- `comencé <tel>`: Marks job as started
- `terminé <tel>`: Marks job as completed (optional photo attached)
- `calificar <1-5>`: User feedback flow

---

## 📊 Logging (Planned)

- Every message and trigger logged to `message_logs`
- Schema: `id`, `timestamp`, `from`, `to`, `direction`, `type`, `text`, `lead_id`, `trigger`
- Used for ML-based fraud flagging, dropout tracking, and analytics

---

## ⚠️ AI Instructions

When building Twilio-related logic:

- ✅ Assume WhatsApp-only for all communication
- ✅ Format messages using Twilio's WhatsApp template rules
- ✅ Use proxy routing (when implemented) to mask phone numbers
- ❌ Never send raw DB values (e.g. unformatted phone, names)
- ❌ Never expose real numbers to providers or users directly
- ✅ Always log messages and triggers to `message_logs` once implemented

---

This document should evolve with Twilio logic. Update as soon as fallback, proxy, or new triggers go live.
