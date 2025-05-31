# 🧼 Code Style Guide

This file defines baseline rules for how all code in Aliado should be written, including AI-generated logic.

---

## 🧠 TypeScript Rules

- ✅ Use `type` or `interface` for all object shapes
- ✅ All function arguments and return values must be typed
- ✅ Avoid `any` — use `unknown` and narrow it
- ❌ Never allow implicit `any`
- ✅ Use enums or literal types for fixed values (e.g. `"pending" | "accepted"`)

---

## 📦 Project Structure

- ✅ Use `utils/`, `lib/`, and `types/` folders for shared logic
- ✅ Do not define inline logic in route handlers — extract to pure functions
- ✅ Use Supabase **Edge Functions** for real-time or external-facing operations
- ✅ Use `app/api/*` routes only for admin-panel logic (internal UI management)

### 📍 When to Use What

| Use Case                       | Use `app/api` | Use Supabase Edge Function |
| ------------------------------ | ------------- | -------------------------- |
| Admin dashboard (CRUD, auth)   | ✅            | ❌                         |
| WhatsApp bot webhook           | ❌            | ✅                         |
| Lead matching logic            | ❌            | ✅                         |
| Twilio proxy routing / replies | ❌            | ✅                         |
| Internal DB actions (admin)    | ✅            | ❌                         |

---

## 💬 Strings & Constants

- ✅ All repeated values (e.g. roles, triggers, categories) must be constants or enums
- ✅ Avoid magic strings — define in `const.ts` or `lib/constants.ts`
- ✅ Prompts and templates should live in their own module (`lib/prompts`)

---

## 🚦 Logic & Flow

- ✅ Use early returns to reduce nesting
- ✅ Always check for null/undefined inputs
- ✅ Use exhaustive `switch` blocks when checking string unions or enums

---

## 🤖 AI-Specific Instructions

- ✅ Always define input/output types when generating functions
- ✅ Avoid any form of `any` — use concrete types
- ✅ Use clean folder-based imports
- ✅ Write small pure functions for business logic, avoid fat handlers
- ❌ Never fetch or mutate without type checks and error handling

---

This file is the law. Break it only if you’re prepared to explain why to your future self or another senior dev.
