"use client";

import ProTable from "@/components/pro-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/generated/prisma";
import { addCategory } from "@/lib/actions/admin-catalog";
import { ProColumn, ActionType } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { FC, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

const Categories: FC<{ initialCategories: Category[] }> = ({ initialCategories }) => {
  const actionRef = useRef<ActionType>(null);
  const [name, setName] = useState("");

  const [pending, startTransition] = useTransition();
  const columns: ProColumn<Category>[] = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Created At",
      render: (_, record) => formatDate(record.createdAt),
    },
  ];

  const handleSubmit = () => startTransition(async () => {
    try { const result = await addCategory(name.trim()); if (result.success) { toast.success(result.message); setName(''); } else toast.error(result.message); }
    catch { toast.error('Unable to save category'); }
  });

  return (
    <div className="space-y-4">
      <div className="flex max-w-md gap-2">
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Category name" />
        <Button onClick={handleSubmit} disabled={pending}>
          Add Category
        </Button>
      </div>
      <ProTable<Category>
        rowKey="id"
        dataSource={initialCategories}
        columns={columns}
        actionRef={actionRef}
      />
    </div>
  );
};

export default Categories;
