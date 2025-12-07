'use client';

import { use } from 'react';
import { useProject } from '@/hooks/useProjects';
import { useProjectTasks, useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import { Card, Badge, Button, Modal, Input, Textarea, Select } from '@/components/ui';
import { Calendar, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task } from '@/types';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['backlog', 'todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params);
  const { data: project, isLoading: projectLoading } = useProject(id);
  const { data: tasks, isLoading: tasksLoading } = useProjectTasks(id);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'todo',
      priority: 'medium',
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'bg-gray-500' },
    { id: 'todo', title: 'To Do', color: 'bg-blue-500' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-500' },
    { id: 'done', title: 'Done', color: 'bg-green-500' },
  ];

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

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-blue-500';
      default:
        return 'border-gray-300';
    }
  };

  const onSubmit = async (data: TaskForm) => {
    try {
      await createTask.mutateAsync({
        ...data,
        projectId: id,
      });
      setIsCreateModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks?.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const task = tasks?.find((t) => t.id === active.id);
    if (!task) return;

    // Check if dropped on a column
    const column = columns.find((col) => col.id === over.id);
    if (column && task.status !== column.id) {
      updateTask.mutate({
        id: task.id,
        data: { status: column.id as Task['status'] },
      });
    }
  };

  if (projectLoading || tasksLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
      </div>
    );
  }

  const tasksByStatus = columns.map((column) => ({
    ...column,
    tasks: tasks?.filter((task) => task.status === column.id) || [],
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Projects
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              {getStatusBadge(project.status)}
            </div>
            {project.description && (
              <p className="mt-2 text-gray-600">{project.description}</p>
            )}
            <div className="flex items-center gap-4 mt-4">
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
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>Add Task</Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500">Project Progress</span>
          <span className="font-medium text-gray-900">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </Card>

      {/* Task Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tasksByStatus.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="text-sm text-gray-500">({column.tasks.length})</span>
              </div>
              <div className="space-y-3 min-h-[200px] bg-gray-50 rounded-lg p-3">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`bg-white p-3 rounded-lg shadow-sm border-l-4 ${getPriorityColor(
                      task.priority
                    )} cursor-move hover:shadow-md transition-shadow`}
                  >
                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <Calendar size={12} className="mr-1" />
                        {format(new Date(task.dueDate), 'MMM dd')}
                      </div>
                    )}
                    {task.priority && (
                      <Badge
                        variant={
                          task.priority === 'high'
                            ? 'danger'
                            : task.priority === 'medium'
                            ? 'warning'
                            : 'info'
                        }
                        className="mt-2"
                      >
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div
              className={`bg-white p-3 rounded-lg shadow-lg border-l-4 ${getPriorityColor(
                activeTask.priority
              )} opacity-90`}
            >
              <h4 className="font-medium text-gray-900 text-sm">{activeTask.title}</h4>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          reset();
        }}
        title="Create New Task"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Task Title"
            {...register('title')}
            error={errors.title?.message}
            placeholder="Enter task title"
          />

          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Enter task description"
            rows={3}
          />

          <Select
            label="Status"
            {...register('status')}
            options={[
              { value: 'backlog', label: 'Backlog' },
              { value: 'todo', label: 'To Do' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'done', label: 'Done' },
            ]}
          />

          <Select
            label="Priority"
            {...register('priority')}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />

          <Input
            label="Due Date"
            type="date"
            {...register('dueDate')}
            error={errors.dueDate?.message}
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
            <Button type="submit" isLoading={createTask.isPending}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
