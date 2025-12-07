'use client';

import { Card } from '@/components/ui';
import { FileIcon } from 'lucide-react';

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Files</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and organize your files
        </p>
      </div>

      <Card className="text-center py-12">
        <FileIcon size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-500">File manager will be available in a future update</p>
      </Card>
    </div>
  );
}
