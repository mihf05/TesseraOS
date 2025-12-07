# TesseraOS Frontend

A modern, full-featured project management frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Authentication**: NextAuth.js (JWT)
- **Form Handling**: React Hook Form + Zod validation
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📋 Features Implemented

### ✅ Authentication
- Login and registration pages
- JWT-based authentication with NextAuth
- Session management
- Protected routes

### ✅ Dashboard
- Welcome screen with user info
- Statistics cards (tasks, projects, invoices, clients)
- Recent tasks and activity feed
- Responsive layout

### ✅ Projects Management
- Project list with grid view
- Create new projects with client assignment
- Project status tracking (new, in progress, pending, delayed, completed, canceled)
- Progress visualization
- Project detail pages

### ✅ Task Management
- Kanban board view (Backlog, To Do, In Progress, Done)
- Drag-and-drop task movement between columns
- Task creation with priority levels
- Task assignment and due dates
- Color-coded priority indicators

### ✅ Client Management
- Client list with contact information
- Create new clients
- Company and contact details
- Email and phone information

### ✅ Invoicing
- Invoice list with status tracking
- Create invoices linked to clients and projects
- Invoice status management (draft, pending, paid, overdue, canceled)
- Mark invoices as paid
- Date tracking (issue date, due date, payment date)

### ✅ UI Components Library
- Button (multiple variants and sizes)
- Input, Textarea, Select
- Modal dialogs
- Card components
- Badge indicators
- Responsive navigation sidebar
- Mobile-friendly hamburger menu

### 🚧 Coming Soon
- Tasks overview page
- Messaging/Inbox
- File Manager
- Calendar view
- Wiki/Documentation
- Proposals
- Contracts
- Client Portal

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Backend API running (see backend README)

### Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   copy .env.local.example .env.local
   ```

4. **Configure environment variables** in `.env.local`:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-this

   # App Configuration
   NEXT_PUBLIC_APP_NAME=TesseraOS
   ```

   **Important**: Generate a secure `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/auth/            # NextAuth API routes
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── dashboard/           # Dashboard
│   │   ├── projects/            # Projects pages
│   │   │   └── [id]/           # Project detail with tasks board
│   │   ├── contacts/            # Client management
│   │   ├── invoices/            # Invoice management
│   │   ├── tasks/               # Tasks overview (placeholder)
│   │   ├── inbox/               # Messaging (placeholder)
│   │   ├── files/               # File manager (placeholder)
│   │   ├── wiki/                # Documentation (placeholder)
│   │   ├── calendar/            # Calendar (placeholder)
│   │   ├── proposals/           # Proposals (placeholder)
│   │   ├── contracts/           # Contracts (placeholder)
│   │   ├── layout.tsx           # Root layout
│   │   ├── providers.tsx        # React Query & NextAuth providers
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── index.ts
│   │   └── layout/
│   │       └── AppLayout.tsx    # Main app layout with sidebar
│   ├── hooks/                   # React Query hooks
│   │   ├── useProjects.ts
│   │   ├── useTasks.ts
│   │   ├── useClients.ts
│   │   └── useInvoices.ts
│   ├── lib/
│   │   └── api/                 # API client and endpoints
│   │       ├── client.ts        # Base API client
│   │       ├── auth.ts
│   │       ├── projects.ts
│   │       ├── tasks.ts
│   │       ├── clients.ts
│   │       ├── invoices.ts
│   │       ├── messages.ts
│   │       ├── files.ts
│   │       └── index.ts
│   └── types/
│       ├── index.ts             # TypeScript interfaces
│       └── next-auth.d.ts       # NextAuth type extensions
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Success**: Green (#22c55e)
- **Warning**: Orange (#f97316)
- **Danger**: Red (#ef4444)

### Component Variants
- Buttons: primary, secondary, danger, ghost
- Badges: default, success, warning, danger, info
- Sizes: sm, md, lg

## 🔐 Authentication Flow

1. User enters credentials on login page
2. NextAuth validates credentials via backend API
3. JWT tokens stored in session
4. Protected routes check session and redirect to login if needed
5. API requests include JWT token in Authorization header

## 📡 API Integration

All API calls are handled through:
- **Base client**: `src/lib/api/client.ts`
- **React Query hooks**: `src/hooks/`
- Automatic token management via NextAuth session
- Error handling and loading states
- Optimistic updates and cache invalidation

## 🧪 Development Tips

### Type Safety
- All API responses are typed
- Form validation with Zod schemas
- TypeScript strict mode enabled

### Code Quality
```bash
npm run lint          # Run ESLint
npm run type-check    # Run TypeScript compiler
```

### State Management
- Use React Query hooks for server state
- Automatic background refetching
- Cache invalidation on mutations
- Loading and error states handled

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |
| `NEXTAUTH_URL` | Frontend URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Generated with `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `TesseraOS` |

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker
```bash
docker build -t tesseraos-frontend .
docker run -p 3000:3000 tesseraos-frontend
```

## 📝 License

Part of the TesseraOS project.
