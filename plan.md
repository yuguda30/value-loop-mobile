# Implementation Plan - Waste2Cash Mobile Web App

Waste2Cash is a mobile-first web application connecting Residents (sellers of waste) and Recyclers (buyers of waste). The app features a point-based reward system, multi-language support (English, Hausa, Yoruba, Igbo), and offline capabilities.

## Scope & Non-Goals
- **Scope**: Two user roles, post waste form (with image compression/offline sync), available pickups list, claim functionality, point/wallet system, and language toggle.
- **Non-Goals**: Real-world payment gateway integration (simulated Naira airtime redemption only), real-world backend (client-side persistence via localStorage for this session), user authentication with passwords (role selection only).

## Assumptions
- Persistence will be handled via `localStorage` to simulate a backend.
- Image compression will be done client-side before storage.
- Offline support will use a simple queue in `localStorage` for pending submissions.
- Translations will be hardcoded in a translation dictionary.

## Affected Areas
- **State Management**: Role selection, pickups list, resident wallet balance, current language.
- **UI/UX**: Mobile-responsive layout, multi-language labels, Role Selection screen, Resident Dashboard (Form), Recycler Dashboard (List), Wallet view.
- **Utils**: Image compression utility, translation helper, offline sync manager.

## Phases

### Phase 1: Foundation & Internationalization
- Setup translation dictionary for English, Hausa, Yoruba, and Igbo.
- Create a `LanguageContext` to manage the selected language across the app.
- Implement the Language Toggle component.
- **Owner**: `frontend_engineer`

### Phase 2: Role Selection & Shared Layout
- Build the "Login" screen with Resident and Recycler role buttons.
- Setup a basic navigation/layout structure suitable for mobile.
- **Owner**: `frontend_engineer`

### Phase 3: Resident Features (Posting & Wallet)
- Implement 'Post Waste' form with fields (Type, Weight, Address, Photo).
- Add image compression logic before saving.
- Implement offline submission logic (save to queue, sync when online).
- Build the Resident Wallet view with points and redeem button.
- **Owner**: `frontend_engineer`

### Phase 4: Recycler Features (Claiming)
- Implement the 'Available Pickups' list for Recyclers.
- Add 'Claim' functionality: remove from list, update Resident points (simulated notification).
- **Owner**: `frontend_engineer`

### Phase 5: Polishing & Offline Sync
- Add final CSS adjustments for the "lightweight" mobile feel.
- Verify all text switches correctly on language change.
- Ensure points persist in `localStorage`.
- **Owner**: `quick_fix_engineer`

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Build core infrastructure, roles, forms, and recycler list.
2. quick_fix_engineer — Final styling, language verification, and bug fixes.

**Per-agent instructions:**

### 1. frontend_engineer
- **Phases:** 1, 2, 3, 4
- **Scope:** 
    - Create a translation map for 4 languages.
    - Implement `LanguageContext` and a `useTranslation` hook.
    - Build `RoleSelection`, `ResidentDashboard` (Form + Wallet), and `RecyclerDashboard` (List).
    - Implement image compression (using `canvas` or a lightweight library if available, but native `canvas` is safer for "lightweight").
    - Implement `localStorage` persistence for `pickups` and `residentPoints`.
    - Implement offline queueing for waste posts.
- **Files:** 
    - `src/context/LanguageContext.tsx`
    - `src/hooks/useTranslation.ts`
    - `src/components/LanguageToggle.tsx`
    - `src/components/ResidentForm.tsx`
    - `src/components/RecyclerList.tsx`
    - `src/App.tsx`
- **Depends on:** none
- **Acceptance criteria:** App opens to role selection. Language toggle translates all UI text immediately. Residents can post waste (even offline). Recyclers can see and claim waste. Points update correctly.

### 2. quick_fix_engineer
- **Phases:** 5
- **Scope:** 
    - Refine mobile styles (padding, button sizes for big role buttons).
    - Ensure "100 Naira airtime" redemption message is correctly translated.
    - Fix any UI inconsistencies in the language switch.
- **Files:** `src/index.css`, components created by frontend_engineer.
- **Depends on:** frontend_engineer
- **Acceptance criteria:** Smooth mobile experience. Correct translations in all 4 languages verified. Points and pickups persist after refresh.
