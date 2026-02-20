# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server on port 3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured in this project.

## Architecture Overview

This is a **Next.js 16 App Router** frontend deployed on AWS Amplify. It provides a UI for:
- AI chat (powered by a Strands agent backend)
- Avatar outfit coordination and recommendation
- Daily item discovery

### API Proxy Pattern

All backend calls go through Next.js route handlers in `app/api/*/[...path]/route.ts`. Each is a catch-all proxy that:
1. Forwards requests to a corresponding AWS Lambda / API Gateway endpoint
2. Injects the `x-api-key` header for backend auth
3. Handles streaming (SSE) vs non-streaming responses differently

Routes and their backend targets:
- `/api/chat` → Chat/streaming Lambda
- `/api/coordinator` → Outfit coordinator Lambda
- `/api/items` → Items discovery Lambda
- `/api/query-item` → Item search Lambda
- `/api/generate-image` → Image generation Lambda

**Streaming exception**: The chat SSE stream connects **directly** to the API Gateway URL (via `NEXT_PUBLIC_STREAMING_API_URL`) rather than through the proxy, because Amplify's response buffering breaks SSE.

### Authentication

AWS Cognito is used for auth. The `auth-context.tsx` wraps the app and provides `login`, `signup`, `logout`, `deleteAccount`, and `getCurrentUser`. User email is used as `user_id` in all API requests. Unauthenticated users fall back to `'trial-user'`.

Cognito config is hardcoded in `lib/cognito-config.ts` (User Pool: `ap-northeast-1_1BWSPzgA3`).

### Key Directories

- `app/api/` — Backend proxy route handlers
- `app/chat/` — Streaming chat UI with session management sidebar
- `app/coordinator/` — Avatar outfit wizard (5-step flow: avatar → analysis → categories → image gen → gallery)
- `app/item/` — Daily item picks with pagination
- `app/lib/` — Shared utilities: `api-client.ts` (fetch wrappers), `types.ts` (all TypeScript interfaces), `auth-context.tsx`, `theme-context.tsx`
- `app/components/` — Shared UI components (Header, Providers, ProductCard)
- `amplify/` — AWS Amplify CDK backend definitions (auth, data resources)

### Environment Variables

Server-side (in route handlers):
- `API_URL`, `API_KEY` — General API Gateway base
- `COORDINATOR_API_URL`, `COORDINATOR_API_KEY`
- `ITEMS_API_URL`, `ITEMS_API_KEY`
- `QUERY_ITEM_API_URL`, `QUERY_ITEM_API_KEY`
- `GENERATE_IMAGE_API_URL`, `GENERATE_IMAGE_API_KEY`

Client-side (accessible in browser):
- `NEXT_PUBLIC_STREAMING_API_URL` — Direct chat streaming endpoint
- `NEXT_PUBLIC_STREAMING_API_KEY` — Streaming API key

### Path Aliases

`@/*` maps to the project root. Use `@/app/lib/types` etc. for imports.

## Amplify Rewrite Rules (Production)

In the Amplify console (**App → Hosting → Rewrites and redirects**), add these rules **above** the SPA fallback rule (`/<*>` → `/index.html`):

| Source | Target | Type |
|--------|--------|------|
| `/api/chat/<*>` | `https://lgz099nfc3.execute-api.ap-northeast-1.amazonaws.com/Prod/<*>` | 200 (Rewrite) |
| `/api/coordinator/<*>` | `https://unkxcv7v41.execute-api.ap-northeast-1.amazonaws.com/Prod/<*>` | 200 (Rewrite) |
| `/api/items/<*>` | `https://poqzffs5v8.execute-api.ap-northeast-1.amazonaws.com/prod/<*>` | 200 (Rewrite) |

Type must be **200 (Rewrite)**, not redirect.
