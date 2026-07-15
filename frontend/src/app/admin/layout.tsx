'use client';

import AdminLayout from '@/features/admin/components/AdminLayout';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
