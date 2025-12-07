# TesseraOS - Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] Docker Desktop installed and running
- [ ] Git installed
- [ ] Port 3000 (frontend), 3001 (backend), 5432 (PostgreSQL), 6379 (Redis), 9000/9001 (MinIO) available

## 🚀 5-Minute Setup

### Step 1: Start Infrastructure (1 minute)
```bash
# From project root
docker-compose up -d

# Verify services are running
docker-compose ps
```

Expected output:
- tesseraos-postgres: Up (port 5432)
- tesseraos-redis: Up (port 6379)
- tesseraos-minio: Up (ports 9000, 9001)

### Step 2: Setup Backend (2 minutes)
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init

# Start backend server
npm run start:dev
```

Backend should be running at: http://localhost:3001

### Step 3: Setup Frontend (2 minutes)
```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.local.example .env.local

# Start frontend
npm run dev
```

Frontend should be running at: http://localhost:3000

## 🎯 First Login

### Create Admin User
```bash
# Using curl (Git Bash or WSL)
curl -X POST http://localhost:3001/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@test.com\",\"password\":\"password123\",\"name\":\"Admin User\",\"role\":\"ADMIN\"}"

# Or using PowerShell
Invoke-RestMethod -Method Post -Uri "http://localhost:3001/api/auth/register" `
  -ContentType "application/json" `
  -Body '{"email":"admin@test.com","password":"password123","name":"Admin User","role":"ADMIN"}'
```

### Login to Application
1. Open http://localhost:3000/login
2. Email: `admin@test.com`
3. Password: `password123`
4. Click "Sign In"

## 🎮 Quick Demo Workflow

### Create a Client
1. Navigate to "Clients" in sidebar
2. Click "Add Client"
3. Fill in:
   - Name: John Doe
   - Email: john@example.com
   - Company: Acme Corp
   - Phone: 555-0100
4. Click "Create Client"

### Create a Project
1. Navigate to "Projects"
2. Click "New Project"
3. Fill in:
   - Project Name: Website Redesign
   - Description: Complete website overhaul
   - Client: Select "Acme Corp"
   - Status: In Progress
   - Start Date: Today
4. Click "Create"

### Add Tasks
1. Click on the project to open details
2. See the Kanban board with 4 columns
3. Click "+ Add Task" in "To Do" column
4. Fill in:
   - Title: Design homepage mockup
   - Priority: High
   - Status: To Do
5. Create more tasks and drag them between columns!

### Create an Invoice
1. Navigate to "Invoices"
2. Click "Create Invoice"
3. Fill in:
   - Invoice Number: INV-001
   - Client: Select "Acme Corp"
   - Project: Select "Website Redesign"
   - Issue Date: Today
   - Due Date: 30 days from now
4. Add line items:
   - Design Services: 40 hours @ $100/hr = $4,000
   - Development: 60 hours @ $120/hr = $7,200
5. Click "Create Invoice"
6. Click "Mark as Paid" when payment received

## 🛠️ Useful Commands

### Backend Commands
```bash
cd backend

# Start development server with hot reload
npm run start:dev

# Open Prisma Studio (visual database editor)
npx prisma studio

# Create new migration after schema changes
npx prisma migrate dev --name description_of_changes

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format code
npm run format

# Lint code
npm run lint
```

### Frontend Commands
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint code
npm run lint
```

### Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart postgres

# Remove all data (WARNING: deletes volumes)
docker-compose down -v
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Windows - Find and kill process on port
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# View PostgreSQL logs
docker-compose logs postgres
```

### Prisma Client Not Generated
```bash
cd backend
npx prisma generate
```

### Frontend Environment Variables Not Loading
```bash
# Make sure .env.local exists
cd frontend
dir .env.local

# Restart Next.js dev server
# (Ctrl+C then npm run dev)
```

### MinIO Connection Issues
```bash
# Check MinIO is running
docker-compose ps minio

# Access MinIO Console
# Open http://localhost:9001
# Username: minioadmin
# Password: minioadmin
```

## 📱 Access URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | admin@test.com / password123 |
| Backend API | http://localhost:3001/api | (use JWT token) |
| Prisma Studio | http://localhost:5555 | (run `npx prisma studio`) |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin |
| PostgreSQL | localhost:5432 | postgres / postgres |
| Redis | localhost:6379 | (no auth) |

## 🧪 Testing the API

### Using cURL (Git Bash)
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'

# Copy the accessToken from response

# Get projects (replace YOUR_TOKEN)
curl http://localhost:3001/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using PowerShell
```powershell
# Login
$response = Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3001/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"email":"admin@test.com","password":"password123"}'

$token = $response.accessToken

# Get projects
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:3001/api/projects" `
  -Headers @{Authorization="Bearer $token"}
```

## 📚 Next Steps

1. ✅ **Explore the Dashboard** - View project statistics
2. ✅ **Create Demo Data** - Add clients, projects, tasks
3. ✅ **Test Drag & Drop** - Move tasks between columns
4. ✅ **Upload Files** - Try file upload on a project
5. ✅ **Check Client Portal** - Create a CLIENT user and test portal access
6. ✅ **Review Code** - Explore the implementation
7. ✅ **Customize** - Modify to fit your needs
8. ✅ **Deploy** - Deploy to production when ready

## 🎓 Learning Resources

### Frontend (Next.js)
- Next.js Docs: https://nextjs.org/docs
- TanStack Query: https://tanstack.com/query/latest
- NextAuth.js: https://next-auth.js.org

### Backend (NestJS)
- NestJS Docs: https://docs.nestjs.com
- Prisma Docs: https://www.prisma.io/docs
- AWS SDK v3: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest

### Architecture
- See `IMPLEMENTATION.md` for complete overview
- See `backend/README.md` for API documentation
- See `frontend/README.md` for frontend architecture

## 💡 Tips

1. **Use Prisma Studio** for easy database viewing: `npx prisma studio`
2. **Check Backend Logs** if API calls fail - very helpful for debugging
3. **Try Different Roles** - Create MEMBER and CLIENT users to test permissions
4. **Backup Database** before making schema changes
5. **Use Git** to version control your changes

## 🎉 You're Ready!

Everything is set up and ready to use. Start by:
1. Creating some clients
2. Adding projects
3. Creating tasks and dragging them around
4. Uploading files
5. Creating invoices

**Happy Project Managing!** 🚀

---

*Need help? Check the main README.md or IMPLEMENTATION.md for more details.*
