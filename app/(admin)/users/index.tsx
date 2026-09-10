'use client';

import { FC, useState } from 'react';
import { Plus, MoreHorizontal, BadgeCheckIcon, BadgeAlertIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AlertDialog from '@/components/reusable/alert-dialog';
import { DropdownMenuItemType, SchemaForm } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import classNames from 'classnames';
import FormField from '@/components/reusable/form-field';
import formSchemas from '@/hooks/form-schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { twoFactor } from '@/lib/auth-client';
import { tryWithToast } from '@/utils/helper';
import DropDown from '@/components/reusable/dropdown';
import ProTable from '@/components/pro-table';
import { ProColumn } from '@/lib/types';
import { useDeleteUserMutation, useSetUserBannedMutation } from '@/services/useMutation';

type UserWithRole = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role?: string | null;
  banned?: boolean | null;
};

const UsersPage: FC<{ users: UserWithRole[] }> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const { twoFactorSchema } = formSchemas;
  const form = useForm<SchemaForm<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { otp: '' },
  });
  const updateMutation = useSetUserBannedMutation();
  const deleteMutation = useDeleteUserMutation(() => {
    setShowDeleteUser(false);
    setSelectedUser(null);
  });
  const isPending = updateMutation.isPending || deleteMutation.isPending;
  const { register } = form;

  const handleViewDetails = (user: UserWithRole) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) toast.success(`Editing ${user.name}`);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setShowDeleteUser(true);
    }
  };

  const handleBanUnbanUser = (user: UserWithRole) => {
    updateMutation.mutate({ userId: user.id, banned: !user.banned });
  };

  const onSubmit = async ({ otp }: SchemaForm<typeof twoFactorSchema>) => {
    if (!otp || otp.length < 6) {
      form.setError('otp', { message: 'OTP must be 6 digits' });
      form.setFocus('otp');
      return;
    }

    const verifyResult = await tryWithToast(twoFactor.verifyTotp({ code: `${otp}` }));
    if (!verifyResult || !!verifyResult.error || !selectedUser) return;
    deleteMutation.mutate(selectedUser.id);
  };

  const dropdownMenus = (record: UserWithRole): DropdownMenuItemType[] => [
    {
      label: <div>View Details</div>,
      onClick: () => handleViewDetails(record),
    },
    {
      label: <div>Edit</div>,
      onClick: () => handleEditUser(record.id),
    },
    {
      label: <div>{record.banned ? 'Unban' : 'Ban'}</div>,
      onClick: () => handleBanUnbanUser(record),
    },
    {
      label: <div>Delete</div>,
      onClick: () => handleDeleteUser(record.id),
      isDestructive: true,
    },
  ];

  const columns: ProColumn<UserWithRole>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      fieldProps: {
        placeholder: 'eg: John Doe',
      },
    },
    {
      title: 'Email',
      width: 300,
      sorter: (a, b) => a.email.localeCompare(b.email),
      fieldProps: {
        placeholder: 'eg: 4g2t0@example.com',
      },
      render: (_, record) => (
        <div className="flex justify-between gap-3">
          <span>{record.email}</span>
          <Badge
            variant="secondary"
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
      renderFormItem: () => null,
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
          <DropDown
            trigger={
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            }
            menus={dropdownMenus(record).map(item => ({
              ...item,
              disabled: isPending,
              className: 'cursor-pointer',
            }))}
          />
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Users</h1>
          <p className="text-muted-foreground mt-1">Manage your customer base</p>
        </div>
        <Button onClick={() => toast.success('Add user dialog opened')}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <ProTable<UserWithRole>
        rowKey="id"
        columns={columns?.map(item => ({ ...item, align: 'center' }))}
        dataSource={users}
      />

      <AlertDialog
        headerClassName="gap-0 mb-4"
        open={showDetails}
        onOpenChange={setShowDetails}
        title="User Details"
        description={selectedUser?.email}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{selectedUser?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium">{selectedUser?.role}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Login</p>
              {/* <p className='font-medium'>{selectedUser.lastLogin}</p> */}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              {/* <p className='font-medium'>{selectedUser.status}</p> */}
            </div>
          </div>
          <Button className="w-full">Send Email</Button>
        </div>
      </AlertDialog>
      <AlertDialog
        headerClassName="gap-0 mb-6"
        title={`Delete ${selectedUser?.name}?`}
        description="Please enter your 2FA code from your authenticator app"
        open={showDeleteUser}
        onOpenChange={setShowDeleteUser}
        onConfirm={form.handleSubmit(onSubmit)}
        confirmText={isPending ? 'Deleting...' : 'Delete'}
      >
        <form className="space-y-4">
          <FormField
            {...register('otp')}
            id="otp"
            type="text"
            inputMode="numeric"
            label="Verification code"
            error={form.formState.errors.otp?.message}
            placeholder="000000"
            autoFocus
            maxLength={6}
          />
        </form>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;
