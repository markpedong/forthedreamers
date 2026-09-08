'use client';

import ProTable from '@/components/pro-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/generated/prisma';
import { addCategory } from '@/lib/http';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ProColumn, ActionType } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { FC, useRef, useState } from 'react';
import { toast } from 'sonner';

const Categories: FC<{ initialCategories: Category[] }> = ({ initialCategories }) => {
  const actionRef = useRef<ActionType>(null);
  const router = useRouter();
  const [name, setName] = useState('');
  const mutation = useMutation({
    mutationFn: addCategory,
    onSuccess: result => {
      toast.success(result.message);
      setName('');
      router.refresh();
    },
    onError: error => toast.error(error.message),
  });
  const columns: ProColumn<Category>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Created At',
      render: (_, record) => formatDate(record.createdAt),
    },
  ];

  const handleSubmit = () => mutation.mutate(name.trim());

  return (
    <div className="space-y-4">
      <div className="flex max-w-md gap-2">
        <Input value={name} onChange={event => setName(event.target.value)} placeholder="Category name" />
        <Button onClick={handleSubmit} disabled={mutation.isPending || !name.trim()}>
          Add Category
        </Button>
      </div>
      <ProTable<Category> rowKey="id" dataSource={initialCategories} columns={columns} actionRef={actionRef} />
    </div>
  );
};

export default Categories;
