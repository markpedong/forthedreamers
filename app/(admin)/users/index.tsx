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
import { ProTable } from '@/components/reusable/table'; // path depends on where you placed it
import { UserWithRole } from 'better-auth/plugins';
import { toast } from 'sonner';
import AlertDialog from '@/components/reusable/alert-dialog';
import { ProColumn } from '@/lib/types';

const UsersPage: FC<{ users: UserWithRole[] }> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = (user: UserWithRole) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) toast.success(`Editing ${user.name}`);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) toast.success(`${user.name} has been deleted`);
  };

  const handleBanUnbanUser = (user: UserWithRole) => {};

  const handleImpersonateUser = async (userId: string) => {};

  const handleRevokeSession = (user: UserWithRole) => {};

  // Columns config for ProTable
  const columns: ProColumn<UserWithRole>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      search: {
        type: 'text',
        placeholder: 'eg: John Doe',
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      search: {
        type: 'text',
        placeholder: 'eg: 4g2t0@example.com',
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      search: {
        type: 'select',
        placeholder: 'eg: Customer',
        valueEnum: async () =>
          Promise.resolve([
            { label: 'Customer', value: 'Customer' },
            { label: 'Vendor', value: 'Vendor' },
          ]),
      },
    },
    // {
    //   title: 'Last Login',
    //   dataIndex: 'lastLogin',
    //   sorter: (a, b) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime(),
    //   searchType: 'date',
    // },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   searchType: 'select',
    //   valueEnum: async () =>
    //     Promise.resolve([
    //       { label: 'Active', value: 'Active' },
    //       { label: 'Inactive', value: 'Inactive' },
    //     ]),
    //   render: (value: string) => (
    //     <Badge
    //       className={`${
    //         value === 'Active'
    //           ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    //           : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    //       }`}
    //     >
    //       {value}
    //     </Badge>
    //   ),
    // },
    {
      title: 'Actions',
      render: (_, record) => {
        return (
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
              <DropdownMenuItem onClick={() => handleEditUser(record.id)}>
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleImpersonateUser(record.id)}>
                Impersonate User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRevokeSession(record)}>
                Revoke Sessions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBanUnbanUser(record)}>
                {record.banned ? 'Unban User' : 'Ban User'}
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-destructive'
                onClick={() => handleDeleteUser(record.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Users</h1>
          <p className='text-muted-foreground mt-1'>Manage your customer base</p>
        </div>
        <Button onClick={() => toast.success('Add user dialog opened')}>
          <Plus className='w-4 h-4 mr-2' />
          Add User
        </Button>
      </div>

      <ProTable<UserWithRole>
        rowKey='id'
        columns={columns?.map((item) => ({ ...item, align: 'center' }))}
        dataSource={users}
      />

      <AlertDialog
        headerClassname='gap-0 mb-4'
        open={showDetails}
        onOpenChange={setShowDetails}
        title='User Details'
        description={selectedUser?.email}
      >
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Name</p>
              <p className='font-medium'>{selectedUser?.name}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Role</p>
              <p className='font-medium'>{selectedUser?.role}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Last Login</p>
              {/* <p className='font-medium'>{selectedUser.lastLogin}</p> */}
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Status</p>
              {/* <p className='font-medium'>{selectedUser.status}</p> */}
            </div>
          </div>
          <Button className='w-full'>Send Email</Button>
        </div>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;
