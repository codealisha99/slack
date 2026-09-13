# Slacki — Professional Workspace

> Next.js 15 monorepo. Real-time messaging (Stream Chat), video calls (Stream Video), Clerk auth, MongoDB, Inngest. Turborepo + pnpm.

**Live:** `/` = marketing landing (unauth) → workspace (auth). `⌘K` to jump, `?` for shortcuts.

## Stack

- **App:** Next.js 15 (App Router), React 19, TypeScript, Tailwind 4, Framer Motion
- **Auth:** Clerk (`@clerk/nextjs` + `clerkMiddleware`)
- **Realtime:** `stream-chat` + `stream-chat-react`, `@stream-io/video-react-sdk`
- **DB:** MongoDB/Mongoose (`@slacki/db`), Inngest for `clerk/user.*` sync
- **Obs:** Sentry (`instrumentation.ts` + `instrumentation-client.ts`), TanStack Query, `zod`

## Structure

```
apps/web          Next.js app (layout, (auth), call/[id], api/*)
packages/db       Mongoose User model + cached connectDB()
packages/ui       Shared UI (shadcn-ready)
turbo.json        pnpm workspaces
```

Legacy `BACKEND/` (Express) + `FRONTEND/` (Vite) kept for reference — not used.

## Quick start

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local  # fill below
pnpm dev      # :3000
pnpm build && pnpm --filter web start
pnpm --filter web test        # vitest
pnpm --filter web type-check
```

**Env `apps/web/.env.local`:**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STREAM_API_KEY=...
STREAM_API_SECRET=...
MONGODB_URI=mongodb+srv://...
SENTRY_DSN=...
NEXT_PUBLIC_SENTRY_DSN=...
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Routes

| Route | Notes |
|---|---|
| `/` | MarketingLanding if anon, HomeClient if authed |
| `/sign-in`, `/sign-up` | Clerk |
| `/call/[id]` | Stream Video (creates if missing, copy link) |
| `/api/chat/token` | Auth + 20/min rate limit, Stream token |
| `/api/health`, `/api/inngest` | Health + Inngest `serve` |
| `/robots.txt`, `/sitemap.xml` | SEO |

## Scripts

- `pnpm dev / build / lint / lint:fix / format / type-check / test`

## Deploy (Vercel)

Single `apps/web` (`framework: nextjs`). Set env vars in Vercel dashboard. Inngest webhook: `/api/inngest`.

## Notes

- Static `slack-logo.png`/`auth-i.png` via `next/image`; avatars via `<img>` + `eslint-disable` (external hosts)
- `middleware.ts` makes `/` public for landing; others protected
- `OfflineBanner` + `KeyboardHelp` (`?`) + `CommandPalette` (`⌘K`)
- Bundle: `/` ~447kB, video heavy — consider dynamic import if needed
```

