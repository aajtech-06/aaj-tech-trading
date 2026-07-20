'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const CategoryManagement = dynamic(
  () => import('@/features/admin/pages/CategoryManagement'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-red" size={32} />
      </div>
    )
  }
);

export default function CategoriesPage() {
  return <CategoryManagement />;
}
