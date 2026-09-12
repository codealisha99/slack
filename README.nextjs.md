# Slacki — Next.js Full-Stack (Turborepo)

> Migrated from `BACKEND/` (Express) + `FRONTEND/` (Vite) → unified Next.js 15 monorepo at `apps/web`.

## 📦 Structure

```
slacki/
├── apps/web/                 # Next.js 15 App Router (main app)
│   ├── app/
│   │   ├── layout.tsx        # ClerkProvider + Providers + globals
│   │   ├── page.tsx          # / — chat (protected)
│   │   ├── call/[id]/page.tsx# /call/:id — video
│   │   ├── (auth)/sign-in    # Clerk SignIn
│   │   ├── (auth)/sign-up    # Clerk SignUp
│   │   ├── api/chat/token    # Stream token (replaces Express /api/chat/token)
│   │   ├── api/health        # health check
│   │   └── api/inngest       # Inngest webhook
│   ├── components/           # Ported from FRONTEND/src/components/*.jsx → .tsx
│   ├── hooks/useStreamChat.ts
│   ├── lib/{db,stream,inngest,api,env}.ts
│   ├── middleware.ts         # clerkMiddleware (protects all except /sign-in,/sign-up,/api/inngest,/api/health)
│   ├── public/               # logo, auth-i.png
│   └── styles/               # loginPage.css + streamChatTheme.css
├── packages/db/              # @slacki/db — Mongoose connection + User model (shared)
├── packages/ui/              # @slacki/ui — shared UI stub (extend with shadcn)
├── packages/typescript-config
├── BACKEND/                  # LEGACY — Express (kept for reference, not used)
├── FRONTEND/                 # LEGACY — Vite (kept for reference, not used)
├── pnpm-workspace.yaml
├── turbo.json
└── package.json              # turbo dev/build at root
```

## 🚀 Quick Start

```bash
pnpm install

# 1. env
cp apps/web/.env.example apps/web/.env.local
# fill: Clerk, Stream, MongoDB, Sentry, Inngest

# 2. dev (runs Next.js on :3000)
pnpm dev
# or: pnpm --filter web dev

# 3. build
pnpm build
```

## 🔑 Env (`apps/web/.env.local`)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_STREAM_API_KEY=
STREAM_API_SECRET=
MONGODB_URI=
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

## 🔄 Migration Notes

| Before | After |
|---|---|
| `BACKEND/src/server.js` Express + cors + clerkMiddleware + `serve(inngest)` | `apps/web/app/api/*` Route Handlers + `middleware.ts` clerkMiddleware + `app/api/inngest/route.ts` |
| `BACKEND/src/config/*` | `packages/db/src/client.ts` + `apps/web/lib/{stream,inngest,env}.ts` |
| `BACKEND/src/models/user.model.js` | `packages/db/src/models/user.ts` (typed) |
| `FRONTEND` Vite + `react-router` | Next.js App Router + `next/navigation` (`useRouter`, `useSearchParams`) |
| `FRONTEND/src/lib/axios.js` (axios + hardcoded Vercel URL) | `apps/web/lib/api.ts` (fetch to `/api/*`, same origin) |
| `FRONTEND/src/Providers/AuthProvider.jsx` (axios interceptor) | `apps/web/components/AuthProvider.tsx` (no-op — Clerk does it) |
| `FRONTEND/src/hooks/useStreamChat.js` | `apps/web/hooks/useStreamChat.ts` (typed, Sentry) |
| `FRONTEND/src/pages/{Home,Call,Auth}Page.jsx` | `apps/web/app/page.tsx`, `app/call/[id]/page.tsx`, `app/(auth)/*` |
| `stream-chat-react` CSS via `index.css` | `app/globals.css` + `styles/streamChatTheme.css` |
| Manual `vercel.json` (separate FE/BE) | Single `apps/web/vercel.json` (`framework: nextjs`) |

## ✅ What Passed Build

- `pnpm --filter web type-check` ✅
- `pnpm --filter web build` ✅ (7 routes, middleware 145kB, warnings only for <img> — swap to next/image later)

## 📝 Next Steps (optional)

- Replace `<img>` with `next/image` (7 warnings)
- `pnpm dlx shadcn@latest init` → add `packages/ui` components
- Add `zod` validation for channel create payload
- Add Playwright / Vitest, rate-limit on `/api/chat/token`, and webhook verification tests
- Remove `BACKEND/` + `FRONTEND/` once validated
