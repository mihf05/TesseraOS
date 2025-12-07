# TesseraOS Backend

NestJS REST API backend for TesseraOS project management platform.

## Tech Stack

- **Framework**: NestJS 10.3
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Storage**: S3-compatible (AWS S3 / MinIO)
- **Cache**: Redis
- **Validation**: class-validator, class-transformer

## Features

- 🔐 JWT authentication with refresh tokens
- 👥 User management with role-based access control (ADMIN, MEMBER, CLIENT)
- 📁 Project management with progress tracking
- ✅ Task management with drag-and-drop support
- 👤 Client management
- 💰 Invoice management with line items
- 💬 Project messaging
- 📎 File upload/download with S3 storage
- 🚪 Client portal with scoped access

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- npm or yarn

## Getting Started

### 1. Start Infrastructure Services

Start PostgreSQL, Redis, and MinIO using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- MinIO on port 9000 (API) and 9001 (Console)

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

Copy the example environment file and update as needed:

```bash
copy .env.example .env
```

Default values work with the Docker Compose setup.

### 4. Run Database Migrations

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Start Development Server

```bash
npm run start:dev
```

The API will be available at http://localhost:3001

## API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Clients

- `GET /api/clients` - List all clients
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client by ID
- `PATCH /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Projects

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks

- `GET /api/projects/:projectId/tasks` - List tasks for project
- `POST /api/projects/:projectId/tasks` - Create task
- `GET /api/tasks/:id` - Get task by ID
- `PATCH /api/tasks/:id` - Update task (supports status/order changes)
- `DELETE /api/tasks/:id` - Delete task

### Invoices

- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice by ID
- `PATCH /api/invoices/:id` - Update invoice
- `PATCH /api/invoices/:id/paid` - Mark invoice as paid
- `DELETE /api/invoices/:id` - Delete invoice

### Messages

- `GET /api/projects/:projectId/messages` - List messages for project
- `POST /api/projects/:projectId/messages` - Send message
- `GET /api/messages/:id` - Get message by ID
- `DELETE /api/messages/:id` - Delete message

### Files

- `GET /api/projects/:projectId/files` - List files for project
- `POST /api/projects/:projectId/files` - Upload file
- `GET /api/files/:id` - Get file metadata
- `GET /api/files/:id/download` - Get signed download URL
- `DELETE /api/files/:id` - Delete file

### Portal (Client Access)

- `GET /api/portal/projects` - List client's projects
- `GET /api/portal/projects/:id` - Get client's project details
- `GET /api/portal/invoices` - List client's invoices
- `GET /api/portal/invoices/:id` - Get client's invoice details

## Database Schema

### Models

- **User**: System users with roles (ADMIN, MEMBER, CLIENT)
- **Client**: External clients/customers
- **Project**: Projects with status tracking and progress
- **Task**: Tasks with status, priority, and assignment
- **Invoice**: Invoices with line items and payment tracking
- **InvoiceItem**: Individual line items on invoices
- **Message**: Project chat messages
- **File**: Uploaded files with S3 storage

### Relationships

- Users can be assigned to Tasks
- Users can be linked to Clients (for portal access)
- Projects belong to Clients
- Tasks belong to Projects and can be assigned to Users
- Invoices belong to Clients and optionally link to Projects
- Messages and Files belong to Projects

## Scripts

```bash
# Development
npm run start          # Start production server
npm run start:dev      # Start with hot-reload
npm run start:debug    # Start with debugger

# Build
npm run build          # Build for production

# Database
npx prisma studio      # Open Prisma Studio GUI
npx prisma migrate dev # Create and apply migration
npx prisma generate    # Generate Prisma client

# Code Quality
npm run format         # Format with Prettier
npm run lint           # Lint with ESLint
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tesseraos

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this
REFRESH_TOKEN_EXPIRES_IN=30d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3 / MinIO
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_ENDPOINT=http://localhost:9000
AWS_BUCKET_NAME=tesseraos

# Server
PORT=3001
```

## Project Structure

```
backend/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── decorators/    # Custom decorators
│   │   ├── dto/           # Auth DTOs
│   │   ├── guards/        # Auth guards
│   │   └── strategies/    # Passport strategies
│   ├── clients/           # Client management
│   ├── files/             # File upload/storage
│   ├── invoices/          # Invoice management
│   ├── messages/          # Project messaging
│   ├── portal/            # Client portal
│   ├── prisma/            # Prisma service
│   ├── projects/          # Project management
│   ├── tasks/             # Task management
│   ├── users/             # User management
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry
├── prisma/
│   └── schema.prisma      # Database schema
├── .env.example           # Environment template
├── nest-cli.json          # NestJS CLI config
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

## Development Tips

### Using MinIO Console

Access MinIO console at http://localhost:9001
- Username: minioadmin
- Password: minioadmin

### Database Management

Use Prisma Studio for visual database management:

```bash
npx prisma studio
```

### Testing Authentication

1. Register a user:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123","name":"Admin User","role":"ADMIN"}'
```

2. Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```

3. Use the returned `accessToken` in Authorization header:
```bash
curl http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## License

MIT (NestJS + Prisma)

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
