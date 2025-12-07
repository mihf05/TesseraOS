# Backend (NestJS + Prisma)

## Stack
- NestJS (modular) + REST controllers, DTO validation (class-validator/zod), Swagger later.
- Prisma ORM on PostgreSQL; Redis for sessions/cache/rate limits; S3-compatible storage (AWS/MinIO) for files/chat uploads.
- JWT auth; role guard for admin/member vs client.

## Modules (MVP)
- Auth: login/register, JWT issue/refresh.
- Users: me/profile; tie to roles.
- Clients: create/list; optional link to portal user.
- Projects: create/list/detail; status; due date.
- Tasks: per-project list/board; assign; due date; status transitions; ordering per column.
- Invoices: create/list/detail; items (name/qty/rate); total calc; mark paid/unpaid; PDF endpoint.
- Messages: project chat (text + file attachment IDs); pagination.
- Files: signed upload/download; metadata stored in DB; project association.
- Portal: client-scoped endpoints for projects/tasks/invoices/files/messages (read-only except chat send).

## API surface (high level)
- Auth: POST /auth/register, /auth/login, /auth/refresh
- Clients: POST /clients, GET /clients, GET /clients/:id
- Projects: POST /projects, GET /projects, GET /projects/:id
- Tasks: POST /projects/:id/tasks, PATCH /tasks/:id (assign/status/due), GET /projects/:id/tasks
- Invoices: POST /invoices, GET /invoices, GET /invoices/:id, PATCH /invoices/:id (mark paid/unpaid), GET /invoices/:id/pdf
- Messages: POST /projects/:id/messages, GET /projects/:id/messages
- Files: POST /projects/:id/files (signed upload), GET /projects/:id/files, GET /files/:id/download
- Portal: GET /portal/projects, GET /portal/projects/:id (includes tasks, invoices, files, messages), POST /portal/projects/:id/messages

## Environment (examples)
- DATABASE_URL=postgresql://user:pass@localhost:5432/tessera
- REDIS_URL=redis://localhost:6379
- STORAGE_ENDPOINT=http://localhost:9000
- STORAGE_BUCKET=tessera
- STORAGE_ACCESS_KEY=xxx
- STORAGE_SECRET_KEY=xxx
- JWT_SECRET=change-me

## Local dev outline
1) Install deps: `npm install`
2) Bring up infra: `docker compose up -d postgres redis minio` (compose file to be added)
3) Prisma: `npx prisma generate` then `npx prisma migrate dev --name init`
4) Start API: `npm run start:dev`

## Planned structure
- src/
  - main.ts (bootstrap)
  - app.module.ts
  - modules/
    - auth/
    - users/
    - clients/
    - projects/
    - tasks/
    - invoices/
    - messages/
    - files/
    - portal/
- prisma/schema.prisma
