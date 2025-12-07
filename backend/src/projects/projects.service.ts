import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: createProjectDto,
      include: {
        client: true,
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        client: true,
        _count: {
          select: {
            tasks: true,
            messages: true,
            files: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            messages: true,
            files: true,
            invoices: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      return await this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
        include: {
          client: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Project not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.project.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Project not found');
    }
  }

  async updateProgress(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });

    if (!project || project.tasks.length === 0) {
      return;
    }

    const doneTasks = project.tasks.filter((task) => task.status === 'DONE').length;
    const progress = Math.round((doneTasks / project.tasks.length) * 100);

    await this.prisma.project.update({
      where: { id },
      data: { progress },
    });
  }
}
