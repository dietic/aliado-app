# 📋 Backlog Tasks for Linear

Below is a consolidated list of tasks (stories/bugs) to be created in Linear, organized by feature area.

---

## Landing Page

- **Update copy & content**
  - Review and finalize all copy text per the latest marketing guidelines.
- **Fix navigation links & smooth scrolling**
  - Ensure each navbar link scrolls to the correct section (`#how-it-works`, `#services`, `#faq`) with smooth scroll behavior.
  - Update CTA buttons (Hero, Process, Cta) to use `<Link>` and navigate to signup/login or appropriate anchor.
  - Make the WhatsApp floating button open the WhatsApp chat directly.
- **SEO enhancements**
  - Add metadata (title, description, Open Graph tags) to the landing page/layout (`export const metadata`).
  - Generate `sitemap.xml` and `robots.txt`.

## Authentication (Auth / Sign-up / Login)

- **Improve phone‑check → signup transition**
  - Smooth out the UI/animation between `PhoneCheckForm` and `SignupForm`.
  - Propagate the parent `onPhoneExists` callback to `SignupForm` instead of a direct `router.replace`.
- **Fix prop typing & callbacks**
  - Update `SignupForm` to accept an `onPhoneExists` prop.
  - Verify `PhoneCheckFormProps.setPhoneValue` uses `UseFormSetValue<SignUpFormData>`.
- **Sign-up API error mapping**
  - Improve error mapping in `/api/auth/signup` route (map Zod validation errors to detailed field messages).
- **Phone lookup route cleanup**
  - Refactor `/api/users/phone/[phone]` error handling to use `customErrors` constants instead of hard‑coded strings.
- **Implement login flow**
  - Complete `/api/auth/login` route handling: display errors in UI, toast messages, redirect on success.
  - Add toasts and error feedback in `LoginForm`.
- **Forgot password flow**
  - Build UI and hook up the `/auth/reset-password` page to the reset‑password API.
- **Logout**
  - Implement client‑side `supabase.auth.signOut()` flow.
  - Add logout button/handler in the protected layout.

## Admin / User Management

- **Refactor data fetching hooks**
  - Ensure `useGetRoles`, `useGetUsers`, `useGetCategories`, and `useGetDistricts` fetch and cache data correctly.
- **Fix UsersPage effect bugs**
  - Only set `districts` state when `districtsData` changes (currently gated on `categoriesData`).
  - Replace `any` types with proper `RoleView`, `DistrictView`, and `CategoryView` types.
- **Users table & filter**
  - Wire up `UsersTable` to handle status updates (use `useUpdateUser`).
  - Implement deactivate/delete user actions via Supabase Auth Admin API.
  - Add pagination support to the users list.
- **Create user flow**
  - Integrate `useCreateUser` inside `CreateUserDialog` to POST `/api/users` and refresh the list on success.
  - Complete form fields (first/last name, phone, password) and validation logic in the dialog.
- **Fix API route bugs**
  - In `PATCH /api/users`, correct deletion of `provider_districts` table (table name mismatch).
- **Toasts & feedback**
  - Add toast notifications for create/update/delete/deactivate actions in the admin UI.

## General / Utilities

- **Toasts & UI feedback**
  - Globally style and standardize toasts (Sonner).
  - Enable toasts in Signup, Login, and Admin flows.
- **TypeScript & typing**
  - Enforce strict types across the app (eliminate `any` usage).
- **Smooth scroll plugin**
  - Install and configure smooth scroll for anchor navigation.
- **Pre-commit & lint**
  - Ensure pre-commit hooks run lint/format (Husky, Prettier, ESLint).
- **Documentation**
  - Update `README.md` with the latest setup, usage, and new API routes.

---

*Feel free to adjust priorities or break these down into smaller stories as needed.*