import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('portal')
@UseGuards(JwtAuthGuard)
export class PortalController {
  constructor(private prisma: PrismaService) {}

  // Get projects for the current client user
  @Get('projects')
  async getProjects(@Request() req) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { client: true },
    });

    if (!user?.client) {
      throw new ForbiddenException('Client access only');
    }

    return this.prisma.project.findMany({
      where: { clientId: user.client.id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            messages: true,
            files: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get project details for client
  @Get('projects/:id')
  async getProject(@Request() req, @Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { client: true },
    });

    if (!user?.client) {
      throw new ForbiddenException('Client access only');
    }

    const project = await this.prisma.project.findFirst({
      where: {
        id,
        clientId: user.client.id,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
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
          orderBy: [{ status: 'asc' }, { order: 'asc' }],
        },
        messages: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        files: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new ForbiddenException('Project not found or access denied');
    }

    return project;
  }

  // Get invoices for the current client
  @Get('invoices')
  async getInvoices(@Request() req) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { client: true },
    });

    if (!user?.client) {
      throw new ForbiddenException('Client access only');
    }

    return this.prisma.invoice.findMany({
      where: { clientId: user.client.id },
      include: {
        items: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get invoice details for client
  @Get('invoices/:id')
  async getInvoice(@Request() req, @Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { client: true },
    });

    if (!user?.client) {
      throw new ForbiddenException('Client access only');
    }

    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id,
        clientId: user.client.id,
      },
      include: {
        items: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new ForbiddenException('Invoice not found or access denied');
    }

    return invoice;
  }
}
