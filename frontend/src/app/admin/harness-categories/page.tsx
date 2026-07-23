'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const HarnessCategoryManagement = dynamic(
  () => import('@/features/admin/pages/HarnessCategoryManagement'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-red" size={32} />
      </div>
    )
  }
);

export default function HarnessCategoriesPage() {
  return <HarnessCategoryManagement />;
}
