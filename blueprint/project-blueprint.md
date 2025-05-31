# Aliados' Blueprint

---

## 😎 Vision

Aliado is your trusted friend on WhatsApp who instantly connects you with verified professionals near you—plumbers, electricians, carpenters—no apps, no confusion, no scams.

Built for Peru, where trust is earned, not downloaded.

## 🔍 Current Status

#### ✅ Completed (Frontend/Partial Logic)

- **Admin Panel Landing Page**: Fully built with dark/light mode toggle.
- **Sign-Up Page**: Frontend implemented with working phone verification logic (checks if user exists).
- **Admin / Users Page**: Frontend complete for managing users (still needs backend connection).

#### ⚠️ Functional but Incomplete

- **Onboarding Bot**: Core flow exists, but lacks:
  - Input validation
  - Multi-step refinement
  - Edge-case handling
  - Final review confirmation UX

#### 🚧 In Progress

- **Aliado Matching Logic** (30%):
  - AI intent classification started
  - Lead-to-provider logic partially wired
  - Still missing: rotation, fallback timeout, proxy number orchestration

#### 🧠 Not Yet Started / On Hold

- **End-to-end Bot Flow**: Full WhatsApp-to-Job-Completed lifecycle still pending.
- **Admin Backend Connections**: User management and provider actions not wired up yet.
- **Copy Polish**: Texts on the landing page need review and final edits.
- **Lead Lifecycle (Comencé / Terminé)**: Not implemented yet.

## 🎯 Next Milestone

**Milestone Name**: 🚀 MVP v0.1 — Internal Beta for Lead Creation  
**Goal**: Enable manual creation and matching of service leads through admin + WhatsApp bot  
**Deadline**: June 15th

---

#### 📦 Deliverables

##### 🎛️ Admin Panel

- [ ] Fix landing page copy and broken links
- [ ] Enable login/signup → dashboard flow
- [ ] Backend connection to list/manage providers

##### 🤖 WhatsApp Bot

- [ ] Fix and finalize onboarding flow (name, district, category, summary)
- [ ] Store user data in Supabase via bot
- [ ] Build basic matching logic (category + district + rating)

##### 🔄 Matching Logic

- [ ] Trigger message to top 3 matching Aliados
- [ ] Handle “OK” confirmation to reserve lead
- [ ] Implement fallback after 15 mins if no one responds

---

#### ✅ Success Criteria

- A user can go from **"Se rompió mi caño"** to **getting matched with a provider** without dev intervention
- The founder (you) can simulate and test the full flow internally

## 🛑 5. Out of Scope (For MVP v0.1)

- ❌ **Mobile App**: No native iOS/Android builds. WhatsApp is the only user interface.
- ❌ **Payment Processing**: No handling of transactions between users and providers.
- ❌ **Scheduling/Calendar Integration**: No time-slot booking or calendar sync.
- ❌ **Provider Onboarding via Bot**: Aliados will be onboarded manually for now.
- ❌ **Multi-language Support**: All messaging and UI will be in Spanish only.
- ❌ **Rating/Fraud Detection Systems**: Manual oversight only; no ML or automated flagging.
- ❌ **In-depth Analytics/Dashboards**: No analytics beyond raw logs or DB checks.
- ❌ **End-to-End Notification Logic**: No SMS fallbacks or multi-channel logic for now.
