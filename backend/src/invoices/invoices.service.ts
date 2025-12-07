import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const { items, ...invoiceData } = createInvoiceDto;

    // Calculate total
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = invoiceData.tax || 0;
    const total = subtotal + tax;

    return this.prisma.invoice.create({
      data: {
        ...invoiceData,
        subtotal,
        total,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    const { items, ...invoiceData } = updateInvoiceDto;

    try {
      // If items are updated, recalculate totals
      if (items) {
        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
        const tax = invoiceData.tax || 0;
        const total = subtotal + tax;

        // Delete existing items and create new ones
        await this.prisma.invoiceItem.deleteMany({
          where: { invoiceId: id },
        });

        return this.prisma.invoice.update({
          where: { id },
          data: {
            ...invoiceData,
            subtotal,
            total,
            items: {
              create: items,
            },
          },
          include: {
            items: true,
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                company: true,
              },
            },
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
      }

      return this.prisma.invoice.update({
        where: { id },
        data: invoiceData,
        include: {
          items: true,
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Invoice not found');
    }
  }

  async remove(id: string) {
    try {
      // Delete invoice items first
      await this.prisma.invoiceItem.deleteMany({
        where: { invoiceId: id },
      });

      await this.prisma.invoice.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Invoice not found');
    }
  }

  async markAsPaid(id: string) {
    try {
      return this.prisma.invoice.update({
        where: { id },
        data: {
          status: 'PAID',
          paidDate: new Date(),
        },
        include: {
          items: true,
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Invoice not found');
    }
  }
}
