'use client';

import { FC, useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable, Column } from '@/components/reusable/table';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: string;
}

const initialUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Customer',
    lastLogin: '2024-01-14',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Customer',
    lastLogin: '2024-01-12',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Customer',
    lastLogin: '2024-01-10',
    status: 'Inactive',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'Vendor',
    lastLogin: '2024-01-15',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'Customer',
    lastLogin: '2024-01-13',
    status: 'Active',
  },
];

const UsersPage: FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleAction = (action: string, user?: User) => {
    if (action === 'add') return showToast('Add user dialog opened');
    if (action === 'view' && user) setSelectedUser(user);
    if (action === 'edit' && user) showToast(`Editing ${user.name}`);
    if (action === 'delete' && user) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      showToast(`${user.name} deleted`);
    }
  };

  const columns: Column<User>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      searchable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    { title: 'Email', dataIndex: 'email', searchable: true },
    { title: 'Role', dataIndex: 'role', searchable: true },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      sorter: (a, b) => +new Date(b.lastLogin) - +new Date(a.lastLogin),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 'Active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      render: (_, record) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon'>
              <MoreHorizontal className='w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => handleAction('view', record)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('edit', record)}>
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-destructive'
              onClick={() => handleAction('delete', record)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Users</h1>
          <p className='text-muted-foreground mt-1'>Manage your customer base</p>
        </div>
        <Button onClick={() => handleAction('add')}>
          <Plus className='w-4 h-4 mr-2' /> Add User
        </Button>
      </div>

      {/* Reusable Data Table */}
      <DataTable columns={columns} data={users} />

      {/* Details Modal */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser.name}</DialogTitle>
              <DialogDescription>{selectedUser.email}</DialogDescription>
            </DialogHeader>
            <div className='grid grid-cols-2 gap-4 mt-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Role</p>
                <p className='font-medium'>{selectedUser.role}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Last Login</p>
                <p className='font-medium'>{selectedUser.lastLogin}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Status</p>
                <p className='font-medium'>{selectedUser.status}</p>
              </div>
            </div>
            <Button className='w-full mt-4'>Send Email</Button>
          </DialogContent>
        </Dialog>
      )}

      {/* Toast */}
      {toast && (
        <div className='fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm shadow-md'>
          {toast}
        </div>
      )}
    </div>
  );
};

export default UsersPage;
