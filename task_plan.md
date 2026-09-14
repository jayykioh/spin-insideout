# Inside Out Lucky Wheel Implementation

## Goal
Build a production-ready bilingual React lucky-wheel SPA for the Inside Out opening event, with exact weighted selection, one local spin per phone/device, polished responsive design, and smooth animation on phones, iPads, and desktop.

## Phases
- [complete] Phase 1: Confirm framework/library guidance and scaffold the Vite React project.
- [complete] Phase 2: Define and test prize selection, validation, voucher, and persistence logic.
- [complete] Phase 3: Build the bilingual responsive experience and SVG wheel.
- [complete] Phase 4: Add motion, celebration effects, sharing, and result image export.
- [complete] Phase 5: Run automated checks and browser validation across mobile/iPad/desktop.
- [pending] Phase 5: Run automated checks and browser validation across mobile/iPad/desktop.

## Decisions
- Use React + Vite + TypeScript because the product is a static SPA and does not need Next.js server features.
- Use Motion for React for UI transitions and wheel animation; keep celebration effects lightweight and local.
- Treat 1/150 as exact and assign the rounding remainder to the no-prize result.

## Errors Encountered
| Error | Attempt | Resolution |
| --- | --- | --- |
| Domain test import failed because `src/domain/wheel.ts` did not exist | 1 | Expected TDD red state; implement the minimal domain module next. |
| Storage test import failed because `src/domain/spinStore.ts` did not exist | 1 | Expected TDD red state; implement the storage module next. |
| TypeScript rejected the `test` key in Vite's `defineConfig` overload | 1 | Use the Vitest config overload, which includes both Vite and test configuration types. |
| Playwright server detection could not load the Playwright package | 1 | Run the skill's one-time setup before browser validation. |
| Playwright Chromium download timed out repeatedly at 30 seconds | 2 | Do not repeat the download; use the connected browser automation service with the installed system browser. |
| Mobile decorative orbit caused horizontal document overflow | 1 | Clip decorative overflow at the site shell without affecting modal positioning. |
| A saved spin did not immediately disable the button after closing the modal | 1 | Added tested eligibility gating to both the button and spin handler. |
