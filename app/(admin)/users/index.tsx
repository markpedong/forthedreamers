'use client';

import { FC, useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Card, CardContent } from '@/components/ui/card';
import { ProTable, ProColumn } from '@/components/reusable/table'; // path depends on where you placed it

// Sample user data
const initialUsers = Array.from({ length: 50 }, (_, i) => {
  const roles = ['Customer', 'Vendor', 'Admin'];
  const statuses = ['Active', 'Inactive'];
  const names = [
    'John Doe',
    'Jane Smith',
    'Bob Johnson',
    'Alice Williams',
    'Charlie Brown',
    'Eve Adams',
    'Frank Miller',
    'Grace Lee',
    'Henry Clark',
    'Ivy Nguyen',
  ];

  const name = names[i % names.length];
  const role = roles[i % roles.length];
  const status = statuses[i % statuses.length];

  const date = new Date(2024, 0, 1 + (i % 15)); // simulate 15-day cycle
  const formattedDate = date.toISOString().split('T')[0];

  return {
    id: `${i + 1}`,
    name: `${name} ${i + 1}`,
    email: `${name.split(' ')[0].toLowerCase()}${i + 1}@example.com`,
    role,
    lastLogin: formattedDate,
    status,
  };
});

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: string;
}

const UsersPage: FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [toast, setToast] = useState('');

  const showNotification = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetails(true);
    showNotification(`Viewing ${user.name}`);
  };

  const handleEditUser = (userId: string) => {
    const user = initialUsers.find((u) => u.id === userId);
    if (user) showNotification(`Editing ${user.name}`);
  };

  const handleDeleteUser = (userId: string) => {
    const user = initialUsers.find((u) => u.id === userId);
    if (user) showNotification(`${user.name} has been deleted`);
  };

  // Columns config for ProTable
  const columns: ProColumn<User>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      searchType: 'text',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      searchType: 'text',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      searchType: 'select',
      valueEnum: async () =>
        Promise.resolve([
          { label: 'Customer', value: 'Customer' },
          { label: 'Vendor', value: 'Vendor' },
        ]),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      sorter: (a, b) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime(),
      searchType: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      searchType: 'select',
      valueEnum: async () =>
        Promise.resolve([
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
        ]),
      render: (value: string) => (
        <Badge
          className={`${
            value === 'Active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
          }`}
        >
          {value}
        </Badge>
      ),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon'>
              <MoreHorizontal className='w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => handleViewDetails(record)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditUser(record.id)}>Edit User</DropdownMenuItem>
            <DropdownMenuItem
              className='text-destructive'
              onClick={() => handleDeleteUser(record.id)}
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
        <Button onClick={() => showNotification('Add user dialog opened')}>
          <Plus className='w-4 h-4 mr-2' />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className='pt-6'>
          <ProTable<User>
            rowKey='id'
            columns={columns?.map((item) => ({ ...item, align: 'center' }))}
            dataSource={initialUsers}
          />
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>{selectedUser.email}</DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Name</p>
                  <p className='font-medium'>{selectedUser.name}</p>
                </div>
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
              <Button className='w-full'>Send Email</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Toast */}
      {toast && (
        <div className='fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm shadow-lg'>
          {toast}
        </div>
      )}
    </div>
  );
};

export default UsersPage;
