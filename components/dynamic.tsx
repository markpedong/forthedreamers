'use client';

import dynamic from 'next/dynamic';

export const AdminSidebar = dynamic(
  () => import('@/app/(admin)/components/admin-sidebar').then((mod) => mod.default),
  { ssr: false },
);
