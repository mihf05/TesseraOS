'use client';

import { useState } from 'react';
import { useInvoices, useCreateInvoice, useMarkInvoiceAsPaid } from '@/hooks/useInvoices';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { Button, Card, Badge, Modal, Input, Select } from '@/components/ui';
import { Plus, DollarSign, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const invoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  projectId: z.string().optional(),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
});

type InvoiceForm = z.infer<typeof invoiceSchema>;

export default function InvoicesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: invoices, isLoading } = useInvoices();
  const { data: clients } = useClients();
  const { data: projects } = useProjects();
  const createInvoice = useCreateInvoice();
  const markAsPaid = useMarkInvoiceAsPaid();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvoiceForm>({
    resolver: zodResolver(invoiceSchema),
  });

  const onSubmit = async (data: InvoiceForm) => {
    try {
      await createInvoice.mutateAsync({
        ...data,
        items: [],
        tax: 0,
        discount: 0,
      });
      setIsCreateModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      draft: 'default',
      pending: 'warning',
      paid: 'success',
      overdue: 'danger',
      canceled: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your invoices
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Invoices List */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices?.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.client.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${invoice.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {invoice.status !== 'paid' && (
                        <Button
                          size="sm"
                          onClick={() => markAsPaid.mutate(invoice.id)}
                          isLoading={markAsPaid.isPending}
                        >
                          Mark Paid
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Download size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {invoices?.length === 0 && (
        <Card className="text-center py-12">
          <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first invoice</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Create Invoice
          </Button>
        </Card>
      )}

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          reset();
        }}
        title="Create New Invoice"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Client"
            {...register('clientId')}
            error={errors.clientId?.message}
            options={[
              { value: '', label: 'Select a client' },
              ...(clients?.map((c) => ({ value: c.id, label: c.name })) || []),
            ]}
          />

          <Select
            label="Project (Optional)"
            {...register('projectId')}
            options={[
              { value: '', label: 'None' },
              ...(projects?.map((p) => ({ value: p.id, label: p.name })) || []),
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Issue Date"
              type="date"
              {...register('issueDate')}
              error={errors.issueDate?.message}
            />
            <Input
              label="Due Date"
              type="date"
              {...register('dueDate')}
              error={errors.dueDate?.message}
            />
          </div>

          <Input
            label="Notes"
            {...register('notes')}
            placeholder="Additional notes (optional)"
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createInvoice.isPending}>
              Create Invoice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
