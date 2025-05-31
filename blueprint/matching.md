# 🔄 Matching & Lead Assignment

This file defines the logic for matching user requests to Aliados (service providers) and orchestrating the lead lifecycle.

---

## 🎯 Purpose

Match incoming service requests from users (via WhatsApp) with top-rated, trusted providers in the correct district and category.

---

## 📥 Input Flow

1. User sends natural language request (e.g., "Necesito un gasfitero en Pueblo Libre")
2. OpenAI function extracts structured data:

   ```ts
   {
     category: 'gasfitero',
     district: 'pueblo_libre'
   }
   ```

3. Parsed data is passed into the matching engine.

_Note: Matching logic and lead routing are currently **not implemented**. This document defines intended architecture._

---

## 🧠 Matching Logic (Planned)

### Primary Filter

- `category` must match `provider_categories`
- `district` must match `provider_districts`

### Sort By

1. `rating` (highest first)
2. `last_active_at` (most recent)
3. Randomize within tier to prevent bias

### Return

- Top 3 matching providers
- Store lead attempt in DB for each provider contacted

---

## 📲 Lead Handoff (Planned)

1. Send WhatsApp to Provider 1: "Nuevo trabajo: {summary}"
2. Provider replies `OK` to claim job
3. If no reply in 15 minutes, move to Provider 2
4. Continue fallback until a provider accepts

---

## 📊 DB Schema (Planned)

### `leads`

| Column       | Type | Description                    |
| ------------ | ---- | ------------------------------ |
| id           | uuid | Lead ID                        |
| user_id      | uuid | Creator                        |
| category_id  | uuid | Service type                   |
| district_id  | uuid | Location                       |
| created_at   | ts   | Timestamp                      |
| delivered_at | ts   | When sent to first provider    |
| accepted_by  | uuid | Provider who accepted          |
| status       | enum | `pending` `accepted` `expired` |

### `lead_attempts`

| Column      | Type   | Description                    |
| ----------- | ------ | ------------------------------ |
| id          | uuid   | Attempt ID                     |
| lead_id     | uuid   | Foreign key to leads           |
| provider_id | uuid   | Aliado receiving the request   |
| sent_at     | ts     | When sent                      |
| accepted_at | ts     | When confirmed (if applicable) |
| status      | string | `sent`, `accepted`, `expired`  |

---

## ⚠️ AI Instructions

- ✅ Use parsed category + district slugs to match providers
- ✅ Sort by `rating`, then activity
- ✅ Limit to 3 concurrent providers per lead
- ✅ Log all attempts to `lead_attempts`
- ✅ Use fallback if no reply in 15 mins
- ❌ Never show user’s phone number to provider (use proxy routing)

---

This logic will evolve with real usage. Prioritize clarity, fairness, and trust.
