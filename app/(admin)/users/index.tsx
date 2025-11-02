'use client';

import { Column, DataTable } from '@/components/reusable/table';
import { FC } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

const users: User[] = [
  { id: '1', name: 'John', email: 'john@example.com', role: 'Admin', lastLogin: '2024-10-10' },
  { id: '2', name: 'Jane', email: 'jane@example.com', role: 'User', lastLogin: '2024-09-15' },
];

const columns: Column<User>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    searchable: true,
  },
  { title: 'Email', dataIndex: 'email', searchable: true },
  { title: 'Role', dataIndex: 'role', searchable: true },
  { title: 'Last Login', dataIndex: 'lastLogin' },
];

const Users: FC = () => {
  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Users</h1>
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default Users;
