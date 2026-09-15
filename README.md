# Medverse Take-Home — Starter

A cut-down slice of our production stack. Read `ASSIGNMENT.md` first.

## Layout

```
functions/            Firebase Cloud Functions (TypeScript, Node 22)
  src/core/           auth, shared infrastructure
  src/features/       one folder per feature: handler → service → repository
  tests/              vitest unit tests + Firestore rules tests
web/                  Next.js 15 portal (App Router)
  src/app/            routes
  src/lib/            API client, session helpers
  public/             hand-written HTML/CSS/JS pages (no framework, keep it that way)
firestore.rules       what is deployed today
seed/                 tenant tokens and example training documents
```

## Run

Preferred: open this repo in a GitHub Codespace — the devcontainer installs
Node 22 and Java and runs `npm ci` for you. Locally:

```bash
npm ci --ignore-scripts   # verified: tests and build work without lifecycle scripts
npm run dev          # http://localhost:3000/trainings and http://localhost:3000/launch.html
npm run test         # service unit tests
npm run test:rules   # rules tests, starts the Firestore emulator (needs Java 11+)
```

Node 22 and npm 10+. If Java is missing locally, note it in `NOTES.md` and still
hand in your `firestore.rules` — we can run the tests on our side.

## House rules in this codebase

- Handlers are thin: validate → call service → respond. No business logic.
- Services do not touch the Firebase SDK; Firestore access lives in a repository.
- Everything is `strict: true`. No `any`.
- Test names read `methodOrAction_condition_expectedResult`.
