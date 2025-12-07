'use client';

import { useSession } from 'next-auth/react';
import { Card, CardTitle } from '@/components/ui';
import { CheckSquare, Folder, DollarSign, Users } from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();

  const stats = [
    {
      name: 'Active Tasks',
      value: '12',
      icon: CheckSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Projects',
      value: '8',
      icon: Folder,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pending Invoices',
      value: '5',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      name: 'Clients',
      value: '23',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Tasks */}
        <Card>
          <CardTitle>Recent Tasks</CardTitle>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="text-sm font-medium text-gray-900">Complete dashboard design</p>
                <p className="text-xs text-gray-500">Website Redesign Project</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                In Progress
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="text-sm font-medium text-gray-900">Review client proposal</p>
                <p className="text-xs text-gray-500">Acme Corp Project</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                To Do
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">Update project timeline</p>
                <p className="text-xs text-gray-500">Mobile App Development</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-800">
                Pending
              </span>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardTitle>Recent Activity</CardTitle>
          <div className="mt-4 space-y-3">
            <div className="py-2 border-b">
              <p className="text-sm text-gray-900">
                <span className="font-medium">John Doe</span> completed a task
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <div className="py-2 border-b">
              <p className="text-sm text-gray-900">
                <span className="font-medium">Jane Smith</span> created a new invoice
              </p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
            <div className="py-2">
              <p className="text-sm text-gray-900">
                <span className="font-medium">Mike Johnson</span> updated a project
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
