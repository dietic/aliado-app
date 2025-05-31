# 🔡️ Supabase Rules & Access Control

This file documents the current data access model for Aliado using Supabase. RLS (Row-Level Security) is now **enabled** and enforced on all core data tables.

---

## ✅ General Conventions

- All table and column names use `snake_case`
- Primary keys are `uuid` via `uuid_generate_v4()`
- Timestamps use `now()` (named `created_at`, `updated_at`)
- All tables reside in the `public` schema unless noted

---

## 👥 Role Assumptions

- `anon`: unauthenticated users (e.g. WhatsApp onboarding)
- `authenticated`: signed-in users via Supabase Auth
- `service_role`: backend/API logic with full access (bypasses RLS)

---

## 🗒️ Table Access & Policies

### `providers`

- RLS **enabled**
- Providers can:
  - `SELECT` / `UPDATE` their own row (matching `auth.uid()` to `user_id`)
- `INSERT` is **not allowed** from the client; creation happens via `service_role`

```sql
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Provider can read own profile"
ON public.providers
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Provider can update own profile"
ON public.providers
FOR UPDATE
USING (auth.uid() = user_id);
```

---

### `provider_categories`

- RLS **enabled**
- Providers can:
  - `SELECT`, `INSERT`, `DELETE` where `provider_id` belongs to them

```sql
ALTER TABLE public.provider_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Provider can read their categories"
ON public.provider_categories
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.id = provider_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Provider can add their categories"
ON public.provider_categories
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.id = provider_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Provider can delete their categories"
ON public.provider_categories
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.id = provider_id AND p.user_id = auth.uid()
  )
);
```

---

### `provider_districts`

- RLS **enabled**
- Same structure as `provider_categories`

```sql
ALTER TABLE public.provider_districts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Provider can read their districts"
ON public.provider_districts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.id = provider_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Provider can add their districts"
ON public.provider_districts
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.id = provider_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Provider can delete their districts"
ON public.provider_districts
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.id = provider_id AND p.user_id = auth.uid()
  )
);
```

---

### `categories`, `districts`, `roles`

- RLS **enabled**
- **Public read-only access** (no client writes)

```sql
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read categories"
ON public.categories
FOR SELECT
USING (true);

ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read districts"
ON public.districts
FOR SELECT
USING (true);

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read roles"
ON public.roles
FOR SELECT
USING (true);
```

---

## ⚠️ AI Instructions

When generating Supabase-related logic:

- ✅ **Assume RLS is active**
- ✅ Use `supabase.auth.getUser()` to determine identity
- ✅ Use `insert(...).select()` to return clean data
- ✅ Parameterize queries (`eq`, `match`, etc.)
- ❌ **Never** use `select('*')` unless in admin-only contexts
- ❌ **Never** bypass access via `rpc()` without controlled `service_role`

---

This file will evolve as more tables and flows go live. Keep it updated after every schema or policy change.
