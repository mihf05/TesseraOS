'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { Button, Card, Modal, Input, Select, Textarea, Badge } from '@/components/ui';
import { Plus, Folder, Calendar, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  clientId: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['new', 'in_progress', 'pending', 'delayed', 'completed', 'canceled']).optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

export default function ProjectsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: projects, isLoading } = useProjects();
  const { data: clients } = useClients();
  const createProject = useCreateProject();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'new',
    },
  });

  const onSubmit = async (data: ProjectForm) => {
    try {
      await createProject.mutateAsync(data);
      setIsCreateModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      new: 'info',
      in_progress: 'success',
      pending: 'warning',
      delayed: 'danger',
      completed: 'success',
      canceled: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status.replace('_', ' ')}</Badge>;
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
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your projects in one place
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Folder className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  </div>
                </div>
                {getStatusBadge(project.status)}
              </div>

              {project.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="space-y-2">
                {project.client && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-2" />
                    {project.client.name}
                  </div>
                )}
                {project.dueDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    Due: {format(new Date(project.dueDate), 'MMM dd, yyyy')}
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {projects?.length === 0 && (
        <Card className="text-center py-12">
          <Folder size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first project</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Create Project
          </Button>
        </Card>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          reset();
        }}
        title="Create New Project"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Project Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="Enter project name"
          />

          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Enter project description"
            rows={4}
          />

          <Select
            label="Client"
            {...register('clientId')}
            options={[
              { value: '', label: 'Select a client' },
              ...(clients?.map((c) => ({ value: c.id, label: c.name })) || []),
            ]}
          />

          <Select
            label="Status"
            {...register('status')}
            options={[
              { value: 'new', label: 'New' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'pending', label: 'Pending' },
              { value: 'delayed', label: 'Delayed' },
              { value: 'completed', label: 'Completed' },
              { value: 'canceled', label: 'Canceled' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              {...register('startDate')}
              error={errors.startDate?.message}
            />
            <Input
              label="Due Date"
              type="date"
              {...register('dueDate')}
              error={errors.dueDate?.message}
            />
          </div>

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
            <Button type="submit" isLoading={createProject.isPending}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
