'use client';

import ProTable from '@/components/pro-table';
import { Button } from '@/components/ui/button';
import FormField from '@/components/reusable/form-field';
import { Category } from '@/generated/prisma';
import { ProColumn, ActionType } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { FC, useRef, useState } from 'react';
import { useAddCategoryMutation } from '@/services/useMutation';

const Categories: FC<{ initialCategories: Category[] }> = ({ initialCategories }) => {
  const actionRef = useRef<ActionType>(null);
  const [name, setName] = useState('');
  const mutation = useAddCategoryMutation(() => setName(''));
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
        <FormField value={name} onChange={event => setName(event.target.value)} placeholder="Category name" />
        <Button onClick={handleSubmit} disabled={mutation.isPending || !name.trim()}>
          Add Category
        </Button>
      </div>
      <ProTable<Category> rowKey="id" dataSource={initialCategories} columns={columns} actionRef={actionRef} />
    </div>
  );
};

export default Categories;
