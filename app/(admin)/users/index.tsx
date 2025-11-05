'use client';

import { FC, useState, useTransition } from 'react';
import { Plus, MoreHorizontal, BadgeCheckIcon, BadgeAlertIcon } from 'lucide-react';
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
import { ProColumn, SchemaForm } from '@/lib/types';
import {
  banUser,
  deleteUserByAdmin,
  impersonateUser,
  revalidatePath,
  revokeUserSessions,
  unbanUser,
} from '@/lib/server-actions';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import classNames from 'classnames';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import useFormSchema from '@/hooks/useFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@/lib/auth-client';
import { tryWithToast } from '@/utils/helper';

const UsersPage: FC<{ users: UserWithRole[] }> = ({ users }) => {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const { twoFactorSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { otp: '' },
  });
  const [isPending, startTransition] = useTransition();

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
    if (user) {
      setSelectedUser(user);
      setShowDeleteUser(true);
    }
  };

  const handleBanUnbanUser = (user: UserWithRole) => {
    startTransition(async () => {
      let res;

      if (user.banned) {
        res = await tryWithToast(unbanUser(user.id));
      } else {
        res = await tryWithToast(banUser(user.id));
      }
      if (!res) return;

      toast.success(`User ${res.user.name} has been ${res.user.banned ? 'unbanned' : 'banned'}`);
      router.refresh();
    });
  };

  const handleImpersonateUser = (userId: string) => {
    startTransition(async () => {
      const result = await tryWithToast(impersonateUser(userId));
      if (!result) return;

      router.push('/');
      await revalidatePath('/');
    });
  };

  const handleRevokeSession = async (user: UserWithRole) => {
    startTransition(async () => {
      const res = await tryWithToast(revokeUserSessions(user.id));
      if (!res || !res.success) return;

      toast.success('Sessions revoked successfully');
      router.refresh();
    });
  };

  const onSubmit = async ({ otp }: SchemaForm<typeof twoFactorSchema>) => {
    if (!otp || otp.length < 6) {
      form.setError('otp', { message: 'OTP must be 6 digits' });
      form.setFocus('otp');
      return;
    }

    startTransition(async () => {
      const verifyResult = await tryWithToast(
        authClient.twoFactor.verifyTotp({ code: `${otp}` })
      );
      if (!verifyResult || !!verifyResult.error) return;

      const deleteResult = await tryWithToast(deleteUserByAdmin(`${selectedUser?.id}`));
      if (!deleteResult) return;

      toast.success('User deleted successfully!', { duration: 2000 });
      setShowDeleteUser(false);
      setSelectedUser(null);
      router.refresh();
    });
  };

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
      width: 300,
      sorter: (a, b) => a.email.localeCompare(b.email),
      search: {
        type: 'text',
        placeholder: 'eg: 4g2t0@example.com',
      },
      render: (_, record) => (
        <div className='flex justify-between'>
          <span>{record.email}</span>
          <Badge
            variant='secondary'
            className={classNames('text-white', {
              'bg-green-500 dark:bg-green-600': record.emailVerified,
              'bg-red-500 dark:bg-red-600': !record.emailVerified,
            })}
          >
            {record.emailVerified ? <BadgeCheckIcon /> : <BadgeAlertIcon />}
            {record.emailVerified ? 'Verified' : 'Unverified'}
          </Badge>
        </div>
      ),
    },
    {
      title: 'Role',
      search: {
        type: 'select',
        placeholder: 'eg: Customer',
        valueEnum: async () =>
          Promise.resolve([
            { label: 'Customer', value: 'Customer' },
            { label: 'Vendor', value: 'Vendor' },
          ]),
      },
      render: (_, record) => <Badge>{record.role}</Badge>,
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
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => handleViewDetails(record)}
                disabled={isPending}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => handleEditUser(record.id)}
                disabled={isPending}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => handleImpersonateUser(record.id)}
                disabled={isPending}
              >
                Impersonate
              </DropdownMenuItem>
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => handleRevokeSession(record)}
                disabled={isPending}
              >
                Revoke Sessions
              </DropdownMenuItem>
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => handleBanUnbanUser(record)}
                disabled={isPending}
              >
                {record.banned ? 'Unban' : 'Ban'}
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-destructive cursor-pointer'
                onClick={() => handleDeleteUser(record.id)}
                disabled={isPending}
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
      <AlertDialog
        headerClassname='gap-0 mb-6'
        title={`Delete ${selectedUser?.name}?`}
        description='Please enter your 2FA code from your authenticator app'
        open={showDeleteUser}
        onOpenChange={setShowDeleteUser}
        onConfirm={form.handleSubmit(onSubmit)}
        confirmText={isPending ? 'Deleting...' : 'Delete'}
      >
        <Form form={form} customSubmitButton>
          <Input id='otp' type='number' name='otp' placeholder='000000' autoFocus maxLength={6} />
        </Form>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;
