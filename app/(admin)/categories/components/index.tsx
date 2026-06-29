"use client";

import ProTable from "@/components/pro-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/generated/prisma";
import { addCategory, getCategories } from "@/lib/http";
import { ProColumn, ActionType } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { tryWithToast } from "@/utils/helper";
import { FC, useRef, useState } from "react";
import { toast } from "sonner";

const Categories: FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [name, setName] = useState("");
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

  const fetchData = async (params: any) => {
    const res = await tryWithToast(getCategories({ ...params, isForProducts: false }));

    return {
      data: res?.data ?? [],
      total: res?.total ?? 0,
    };
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const res = await tryWithToast(addCategory(name.trim()));
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
        <Button onClick={handleSubmit}>Add Category</Button>
      </div>
      <ProTable<Category>
        rowKey="id"
        request={fetchData}
        columns={columns}
        actionRef={actionRef}
      />
    </div>
  );
};

export default Categories;
