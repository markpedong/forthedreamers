"use client";

import ProTable from "@/components/pro-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/generated/prisma";
import { useCategories, useAddCategory } from "@/lib/hooks/use-api";
import { ProColumn, ActionType } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { FC, useRef, useState } from "react";
import { toast } from "sonner";

const Categories: FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [name, setName] = useState("");

  const { data: categoriesData } = useCategories({ isForProducts: false });
  const addCategoryMutation = useAddCategory();

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

  const request = async (params: Record<string, any>) => {
    const data = categoriesData?.data ?? [];
    const total = categoriesData?.total ?? 0;
    return { data, total };
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const res = await addCategoryMutation.mutateAsync(name.trim());
    if (res?.success) {
      toast.success("Category added successfully");
      setName("");
      actionRef.current?.reload();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex max-w-md gap-2">
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Category name" />
        <Button onClick={handleSubmit} disabled={addCategoryMutation.isPending}>
          Add Category
        </Button>
      </div>
      <ProTable<Category>
        rowKey="id"
        request={request}
        columns={columns}
        actionRef={actionRef}
      />
    </div>
  );
};

export default Categories;
