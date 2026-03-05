# NaviGate Academy Monorepo

## Stack
- Frontend: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn-style UI, react-icons, next-intl, next-themes
- Backend: Node.js, Express, TypeScript, Zod
- Shared: Zod lead schema

## Structure
- `frontend/` Next.js app with locale routing (`/en`, `/ru`, `/uz`)
- `backend/` Express API with `POST /api/leads`
- `shared/lead.schema.ts` shared validation schema

## Setup
1. Install all dependencies:
   - `npm run install:all`
2. Create env files:
   - copy `frontend/.env.example` to `frontend/.env.local`
   - copy `backend/.env.example` to `backend/.env`

## Run
- Frontend: `npm run dev:frontend`
- Backend: `npm run dev:backend`

## Build
- Frontend: `npm run build:frontend`
- Backend: `npm run build:backend`

## Translations
Update:
- `frontend/messages/en.json`
- `frontend/messages/ru.json`
- `frontend/messages/uz.json`

When adding a new translation key:
1. Add it to `en.json`.
2. Mirror the same key path in `ru.json` and `uz.json`.
3. Use `useTranslations("namespace")` in components/pages.

## Vercel Build Note
Do not commit OS-specific `@next/swc-*` packages.
If Vercel fails with `EBADPLATFORM`, regenerate the lockfile by removing `node_modules` and `package-lock.json`, then reinstall dependencies.
