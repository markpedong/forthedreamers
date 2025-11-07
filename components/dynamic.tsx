'use client';

import dynamic from 'next/dynamic';

export const AdminSidebar = dynamic(
  () => import('@/app/(admin)/components/admin-sidebar').then((mod) => mod.default),
  { ssr: false },
);

export const Moon = dynamic(() => import('lucide-react').then((mod) => mod.Moon), {
  ssr: false,
});

export const Sun = dynamic(() => import('lucide-react').then((mod) => mod.Sun), {
  ssr: false,
});
