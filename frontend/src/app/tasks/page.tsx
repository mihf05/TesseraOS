'use client';

import { Card } from '@/components/ui';
import { CheckSquare } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all your tasks across projects
        </p>
      </div>

      <Card className="text-center py-12">
        <CheckSquare size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Tasks View</h3>
        <p className="text-gray-500">
          This page will show all tasks across all projects. View tasks in projects for now.
        </p>
      </Card>
    </div>
  );
}
