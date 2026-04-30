# GridMDM

Quntem Grid is a device management platform for ThetaOS devices. It combines a Next.js admin app, a Bun/Express API, and a shared Prisma database package for tenant setup, device enrollment, policy management, and app distribution.

## What It Does

- Authenticates admins through KeyStone
- Mirrors KeyStone tenant, user, and group data into the MDM database
- Accepts KeyStone device lifecycle webhooks for enroll, unenroll, and group changes
- Manages devices, groups, enrolment profiles, device policies, and app policies
- Proxies parts of the Flathub API for app discovery

## Monorepo Layout

- `apps/web`: Next.js admin UI
- `apps/server`: Bun + Express API
- `packages/database`: Prisma schema, generated client, and shared database types
- `packages/eslint-config`: shared ESLint config
- `packages/typescript-config`: shared TypeScript config

## Stack

- Turborepo
- Next.js 16
- React 19
- Express 5
- Prisma
- PostgreSQL
- KeyStone integration

## Requirements

- Bun `1.3.11`
- Node.js `18+`
- PostgreSQL

## Getting Started

1. Install dependencies:

```sh
bun install
```

2. Create a root `.env` file.

3. Generate the Prisma client and run migrations:

```sh
cd packages/database
bun run db:generate
bun run db:migrate
```

4. Start the whole workspace:

```sh
cd /path/to/gridmdm
bun run dev
```

This starts:

- the Next.js app on `http://localhost:3000`
- the Express API on `http://localhost:6090`

In development, the web app rewrites `/api/*` requests to the local API server on port `6090`.

## Environment Variables

Create a `.env` file in the repository root with values for:

```env
DATABASE_URL=

APP_ID=
APP_SECRET=
KEYSTONE_URL=

NEXT_PUBLIC_KEYSTONE_APPID=
NEXT_PUBLIC_KEYSTONE_URL=
NEXT_PUBLIC_KEYSTONE_ACQUIRE_URL=
NEXT_PUBLIC_API_URL=
```

Notes:

- `DATABASE_URL` is used by Prisma in `packages/database`
- `APP_ID`, `APP_SECRET`, and `KEYSTONE_URL` are used by the API to verify KeyStone sessions
- `NEXT_PUBLIC_*` values are used by the frontend setup and auth flow
- For local development, `NEXT_PUBLIC_API_URL` will usually be `http://localhost:3000`

## Useful Commands
Database commands:

```sh
cd packages/database
bun run db:generate
bun run db:migrate
bun run db:deploy
bun run db:studio
```

## KeyStone Setup Flow

The app is designed around a KeyStone-backed setup flow:

1. Acquire the Grid app in your KeyStone tenant
2. Assign yourself to the app in KeyStone
3. Open `/setup` in the web app
4. Sign in through KeyStone
5. Let Grid create the tenant record in its database
6. Add Grid as an MDM server inside KeyStone using the generated enrollment token

After that, KeyStone can send device webhook events to Grid and devices can be managed through the admin UI.

## API Overview

Primary routes exposed by the API:

- `/api/v1/keystone/webhook/device`: KeyStone device webhook endpoint
- `/api/internal/v1/tenant/*`: tenant setup endpoints used by the onboarding flow
- `/api/v1/devices`: device management
- `/api/v1/profiles`: enrolment profiles
- `/api/v1/policies`: device policies
- `/api/v1/apps`: app catalog and app policies
- `/api/v1/groups`: group-based management

## Data Model

The Prisma schema models:

- tenants
- mirrored KeyStone users and groups
- devices and enrollment tokens
- enrolment profiles and conditions
- device policies and app policies
- installed apps, commands, app requests, and LAPS data

See [`packages/database/prisma/schema.prisma`](./packages/database/prisma/schema.prisma) for the full schema.

## Development Notes

- The server currently listens on port `6090`
- The frontend expects KeyStone auth/session data and stores a `keystone_session` cookie during setup/sign-in
- The web app includes local API rewrites, so both `apps/web` and `apps/server` should be running during development

