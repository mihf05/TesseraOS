'use client';

import { useState } from 'react';
import { useClients, useCreateClient } from '@/hooks/useClients';
import { Button, Card, Modal, Input } from '@/components/ui';
import { Plus, Users, Mail, Phone, Building } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
});

type ClientForm = z.infer<typeof clientSchema>;

export default function ContactsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = async (data: ClientForm) => {
    try {
      await createClient.mutateAsync(data);
      setIsCreateModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to create client:', error);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your clients and contacts
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Contact
        </Button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients?.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                {client.company && (
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Building size={14} className="mr-1" />
                    {client.company}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Mail size={14} className="mr-1" />
                  {client.email}
                </div>
                {client.phone && (
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Phone size={14} className="mr-1" />
                    {client.phone}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {clients?.length === 0 && (
        <Card className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first contact</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Add Contact
          </Button>
        </Card>
      )}

      {/* Create Client Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          reset();
        }}
        title="Create New Contact"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="Enter client name"
          />

          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="client@example.com"
          />

          <Input
            label="Company"
            {...register('company')}
            error={errors.company?.message}
            placeholder="Company name (optional)"
          />

          <Input
            label="Phone"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="+1 (555) 000-0000"
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
            <Button type="submit" isLoading={createClient.isPending}>
              Create Contact
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
