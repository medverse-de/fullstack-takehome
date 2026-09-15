# Medverse — Fullstack Take-Home

**Time budget: 2 hours.** We mean it. Work on a timer and stop when it rings.
We would much rather see three tasks done well plus honest notes than four rushed
ones.

## Context

Medverse runs a medical training platform. Hospitals and industry partners are
**tenants** — every tenant gets the same product under its own branding
(white-label). The stack you are touching here is the real one:

- **Next.js 15** (App Router, React Server Components, TypeScript) — the portal
- **Hand-written HTML/CSS/vanilla JS** — the pages hospital users actually land
  on (SSO login, training catalog, launch screen)
- **Firebase Cloud Functions** (TypeScript, Node 22) + **Firestore** — the API,
  consumed by both the portal and our Unity training clients

This repo is a cut-down slice of that stack. It is **not** a clean codebase — it
is roughly the state a real ticket lands in.

## Setup — nothing runs on your machine

Click **Use this template** → create a copy under your own GitHub account →
**Code → Create codespace**. The devcontainer brings Node 22 and Java (for the
Firestore emulator) and runs `npm ci` for you. First boot takes a couple of
minutes; the 2-core machine is inside GitHub's free monthly allowance for
personal accounts.

```bash
npm run dev          # portal on :3000, launch page on :3000/launch.html
npm run test         # unit tests (vitest)
npm run test:rules   # Firestore rules tests (starts the emulator)
```

If you would rather work locally: the lockfile is pinned, there are no lifecycle
scripts of ours, and `npm ci --ignore-scripts` is verified to work end to end.

The two hours start when you open Task 1, not when you click "Create codespace"
— boot time is ours, not yours.

If the setup fights you for more than 10 minutes, skip it, note it in
`NOTES.md`, and move on to a task that does not need it.

---

## Task 1 — Trainings API (~25 min)

`GET /trainings` must return the trainings the calling user is allowed to see.

- Implement `listTrainings()` in `functions/src/features/trainings/service.ts`.
- A training is visible when it belongs to the caller's tenant **and** is
  `published`. Archived and draft trainings never appear.
- Sort by `order` ascending, then `title`.
- Make the tests in `functions/tests/trainings.service.test.ts` pass. One of them
  is marked `it.skip` — remove the `.skip`; it describes required behaviour.

The repository layer (`repository.ts`) and the handler are given. You may change
anything you consider wrong — just say so in `NOTES.md`.

## Task 2 — Firestore rules (~10 min)

`firestore.rules` is what is deployed today. A `session` document records one
user's run of a training:

```
sessions/{sessionId} = { tenantId, userId, trainingId, progress, score, updatedAt }
```

Requirements:

- A user may read and write **only their own** sessions, and only inside their
  own tenant (`request.auth.token.tenantId`).
- `score` is computed by the backend. Clients must never write it.

Make `functions/tests/rules.test.ts` pass without weakening the cases that
already pass. If the emulator will not start, hand in the rules anyway — we can
run the tests on our side.

## Task 3 — Portal training list (~20 min)

`web/src/app/trainings/page.tsx` renders the training catalog in the portal. It
is not written the way we want Next.js 15 written, and as it stands the route
does not compile — that is the task, not a broken setup.

- Bring it in line with App Router / Server Component practice.
- Add the loading and error states the route is missing.
- The list must stay fast on a slow hospital network — that is the whole point
  of this page.

## Task 4 — White-label launch page (~20 min)

`web/public/launch.html` (+ `launch.css`, `launch.js`) is a hand-written page —
no React, no framework, and it must stay that way. Today it is branded for one
tenant only.

- Make it white-label. The design tokens (`--brand`, `--brand-fg`, …) are
  already declared at the top of `launch.css`; a tenant is a set of values for
  those tokens, nothing more. Adding a tenant must not mean touching the HTML.
- `seed/tenants.json` has the values for three tenants. Show the switch working
  for at least two — how the page learns which tenant it is (query parameter,
  attribute, whatever) is your call.
- Fix anything else on the page you would not let through review — but only
  what you find while you are in there. Do not polish.

## Task 5 — NOTES.md (~10 min, required)

Create `NOTES.md` at the repo root with:

1. **What you did and why** — short, per task.
2. **What you did not finish**, and what you would have done next.
3. **Anything in the starter you thought was wrong, risky, or a bad idea** —
   whether or not you fixed it. Be blunt. This section counts.

## Submission

Send us the link to your repo (make it private and add the reviewer as a
collaborator if you prefer). We read the history, so commit as you work rather
than squashing everything at the end.

## Ground rules

- AI assistants are fine — we use them daily. You will be asked to explain every
  line you submit in the follow-up call, so do not hand in code you cannot
  defend.
- Do not add a UI component library, an ORM, or a state-management library.
  Tailwind is available in the portal; the vanilla page stays vanilla.
- Getting a task *almost* done and saying so beats silently leaving it broken.
