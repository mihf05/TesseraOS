# TesseraOS - Development Guide

This guide helps you understand the codebase architecture and how to add new features.

## 🏗️ Architecture Overview

### Frontend Architecture (Next.js 14)

```
Frontend Request Flow:
User Interaction → React Component → API Hook (TanStack Query) 
→ API Client → Backend REST API → Database

Authentication Flow:
Login Form → NextAuth.js → Backend /auth/login → JWT Token 
→ Stored in Session → Auto-attached to API requests
```

#### Key Concepts

**App Router**
- Uses file-based routing in `app/` directory
- Each folder is a route segment
- `page.tsx` files define route UI
- `layout.tsx` files wrap child pages

**Server vs Client Components**
- Default: Server Components (faster, smaller bundle)
- Use `'use client'` for interactivity, hooks, browser APIs

**TanStack Query Pattern**
```typescript
// Custom hook in lib/hooks/useFeature.ts
export const useFeatures = () => {
  return useQuery({
    queryKey: ['features'],
    queryFn: () => apiClient.get('/features'),
  });
};

// Usage in component
const { data: features, isLoading } = useFeatures();
```

### Backend Architecture (NestJS)

```
API Request Flow:
HTTP Request → Controller → Guard (Auth) → Service → Prisma 
→ Database → Response

Module Structure:
feature.module.ts    # Defines module, imports, exports
feature.controller.ts # HTTP endpoints, request handling
feature.service.ts    # Business logic, database operations
dto/create-feature.dto.ts # Request validation schemas
```

#### Key Concepts

**Dependency Injection**
```typescript
@Injectable()
export class FeatureService {
  constructor(private prisma: PrismaService) {}
}
```

**Guards for Authentication**
```typescript
@UseGuards(JwtAuthGuard)  // Requires valid JWT
@UseGuards(RolesGuard)    // Requires specific role
@Roles('ADMIN')           // Only ADMIN can access
```

**DTOs for Validation**
```typescript
export class CreateFeatureDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
```

## 🆕 Adding New Features

### Add a New Entity (e.g., "Team")

#### 1. Update Prisma Schema
```prisma
// backend/prisma/schema.prisma
model Team {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  members     User[]
  projects    Project[]
}

// Update User model
model User {
  // ... existing fields
  teamId String?
  team   Team?   @relation(fields: [teamId], references: [id])
}
```

#### 2. Run Migration
```bash
cd backend
npx prisma migrate dev --name add_teams
npx prisma generate
```

#### 3. Create Backend Module
```bash
cd backend/src
mkdir teams
cd teams
```

Create `teams.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
```

Create `teams.service.ts`:
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto) {
    return this.prisma.team.create({
      data: createTeamDto,
    });
  }

  async findAll() {
    return this.prisma.team.findMany({
      include: {
        _count: {
          select: { members: true, projects: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        projects: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    try {
      return await this.prisma.team.update({
        where: { id },
        data: updateTeamDto,
      });
    } catch (error) {
      throw new NotFoundException('Team not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.team.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Team not found');
    }
  }
}
```

Create `teams.controller.ts`:
```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }
}
```

Create `dto/create-team.dto.ts`:
```typescript
import { IsString, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

Create `dto/update-team.dto.ts`:
```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './create-team.dto';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {}
```

#### 4. Register Module
Add to `app.module.ts`:
```typescript
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [
    // ... existing imports
    TeamsModule,
  ],
})
export class AppModule {}
```

#### 5. Add Frontend API Hook
Create `frontend/lib/hooks/useTeams.ts`:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => apiClient.get('/teams'),
  });
};

export const useTeam = (id: string) => {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: () => apiClient.get(`/teams/${id}`),
    enabled: !!id,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/teams', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.patch(`/teams/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/teams/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};
```

#### 6. Create Frontend Page
Create `frontend/app/teams/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useTeams, useCreateTeam, useDeleteTeam } from '@/lib/hooks/useTeams';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';

export default function TeamsPage() {
  const { data: teams, isLoading } = useTeams();
  const createTeam = useCreateTeam();
  const deleteTeam = useDeleteTeam();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTeam.mutateAsync(formData);
    setIsModalOpen(false);
    setFormData({ name: '', description: '' });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teams</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Team</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams?.map((team: any) => (
          <Card key={team.id}>
            <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
            <p className="text-gray-600 mb-4">{team.description}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{team._count?.members || 0} members</span>
              <span>{team._count?.projects || 0} projects</span>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteTeam.mutate(team.id)}
              className="mt-4"
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Team"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Team Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={createTeam.isPending}>
              Create
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
```

#### 7. Add to Navigation
Update `frontend/components/layout/AppLayout.tsx`:
```typescript
const navigation = [
  // ... existing items
  { name: 'Teams', href: '/teams', icon: Users },
];
```

## 🔐 Adding Role-Based Access

### Backend: Protect Endpoint by Role
```typescript
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('users')
  @Roles('ADMIN')  // Only ADMIN role can access
  findAllUsers() {
    return this.usersService.findAll();
  }
}
```

### Frontend: Conditional Rendering
```typescript
'use client';

import { useSession } from 'next-auth/react';

export default function AdminPanel() {
  const { data: session } = useSession();
  
  if (session?.user?.role !== 'ADMIN') {
    return <div>Access denied</div>;
  }
  
  return <div>Admin content</div>;
}
```

## 📁 Adding File Upload to Entity

### Backend: Add to Service
```typescript
async uploadFile(
  entityId: string,
  file: Express.Multer.File,
  userId: string,
) {
  const key = `entities/${entityId}/${Date.now()}-${file.originalname}`;
  
  // Upload to S3
  await this.s3Client.send(
    new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );
  
  // Save to database
  return this.prisma.file.create({
    data: {
      name: file.originalname,
      key,
      entityId,
      uploadedById: userId,
      // ... other fields
    },
  });
}
```

### Backend: Add Controller Endpoint
```typescript
@Post(':id/files')
@UseInterceptors(FileInterceptor('file'))
upload(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Request() req,
) {
  return this.service.uploadFile(id, file, req.user.userId);
}
```

### Frontend: File Upload Component
```typescript
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  await apiClient.post(`/entities/${entityId}/files`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

return (
  <input
    type="file"
    onChange={handleFileUpload}
    accept="image/*,.pdf,.doc,.docx"
  />
);
```

## 🔄 Adding Real-Time Updates (WebSockets)

### Backend: Add WebSocket Gateway
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

Create `messages/messages.gateway.ts`:
```typescript
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast to all clients in project room
    this.server.to(data.projectId).emit('newMessage', data);
  }

  @SubscribeMessage('joinProject')
  handleJoinProject(
    @MessageBody() projectId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(projectId);
  }
}
```

### Frontend: Socket.io Client
```bash
npm install socket.io-client
```

Create `lib/socket.ts`:
```typescript
import { io } from 'socket.io-client';

export const socket = io('http://localhost:3001', {
  autoConnect: false,
});
```

Use in component:
```typescript
useEffect(() => {
  socket.connect();
  socket.emit('joinProject', projectId);
  
  socket.on('newMessage', (message) => {
    // Update UI with new message
    queryClient.invalidateQueries(['messages', projectId]);
  });
  
  return () => {
    socket.off('newMessage');
    socket.disconnect();
  };
}, [projectId]);
```

## 🧪 Adding Tests

### Backend: Service Test
```typescript
// feature.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { FeatureService } from './feature.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FeatureService', () => {
  let service: FeatureService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeatureService, PrismaService],
    }).compile();

    service = module.get<FeatureService>(FeatureService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a feature', async () => {
    const mockFeature = { id: '1', name: 'Test' };
    jest.spyOn(prisma.feature, 'create').mockResolvedValue(mockFeature as any);

    const result = await service.create({ name: 'Test' });
    expect(result).toEqual(mockFeature);
  });
});
```

### Frontend: Component Test
```typescript
// teams.test.tsx
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TeamsPage from './page';

test('renders teams page', () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <TeamsPage />
    </QueryClientProvider>
  );
  expect(screen.getByText('Teams')).toBeInTheDocument();
});
```

## 📊 Best Practices

### Error Handling
```typescript
// Backend
try {
  const result = await this.prisma.feature.findUnique({ where: { id } });
  if (!result) {
    throw new NotFoundException('Feature not found');
  }
  return result;
} catch (error) {
  if (error instanceof NotFoundException) throw error;
  throw new InternalServerErrorException('Failed to fetch feature');
}

// Frontend
const { data, error, isLoading } = useFeature(id);

if (error) {
  return <div>Error: {error.message}</div>;
}
```

### Optimistic Updates
```typescript
const updateFeature = useMutation({
  mutationFn: (data) => apiClient.patch(`/features/${id}`, data),
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['features', id]);
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['features', id]);
    
    // Optimistically update
    queryClient.setQueryData(['features', id], newData);
    
    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['features', id], context?.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries(['features', id]);
  },
});
```

## 🚀 Deployment Checklist

- [ ] Set strong JWT secrets in production
- [ ] Use environment-specific database URLs
- [ ] Enable CORS only for production domain
- [ ] Set up proper S3 bucket with access policies
- [ ] Configure Redis for production use
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Set up CI/CD pipeline
- [ ] Review security headers
- [ ] Test all endpoints with production data
- [ ] Set up error tracking (Sentry)

## 📚 Additional Resources

- **Prisma Best Practices**: https://www.prisma.io/docs/guides/performance-and-optimization
- **NestJS Documentation**: https://docs.nestjs.com
- **Next.js Data Fetching**: https://nextjs.org/docs/app/building-your-application/data-fetching
- **TanStack Query Guides**: https://tanstack.com/query/latest/docs/react/guides

---

**Happy Coding! 🎉**
