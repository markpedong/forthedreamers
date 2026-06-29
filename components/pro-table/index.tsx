"use client";

import { useEffect, useImperativeHandle, useState } from "react";
import { SpinnerCustom } from "../reusable/spinner";
import { Card, CardContent } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ProTableProps } from "@/lib/types";

const getRowKey = <T extends Record<string, any>>(row: T, rowKey: keyof T | string) =>
  String(row[rowKey] ?? row.id);

const ProTable = <T extends Record<string, any>>({
  columns = [],
  rowKey = "id",
  actionRef,
  request,
  dataSource,
  isLoading = false,
  headerTitle,
}: ProTableProps<T>) => {
  const [rows, setRows] = useState<T[]>(dataSource ?? []);
  const [loading, setLoading] = useState(false);

  const reload = async () => {
    if (!request) {
      setRows(dataSource ?? []);
      return;
    }

    setLoading(true);
    try {
      const result = await request({ page: 1, pageSize: 20, current: 1 });
      setRows(result.data);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(actionRef, () => ({
    reload,
    reset: reload,
    setPage: reload,
    setFilters: reload,
  }));

  useEffect(() => {
    reload();
  }, [dataSource]);

  if (isLoading || loading) return <SpinnerCustom />;

  const visibleColumns = columns.filter((column) => !column.hideInTable);

  return (
    <Card>
      <CardContent className="p-0">
        {headerTitle && <div className="border-b p-4">{headerTitle}</div>}
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column, index) => (
                <TableHead key={`${String(column.dataIndex ?? column.title)}-${index}`}>
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={getRowKey(row, rowKey)}>
                  {visibleColumns.map((column, index) => {
                    const value = column.dataIndex ? row[column.dataIndex] : undefined;
                    return (
                      <TableCell key={`${getRowKey(row, rowKey)}-${index}`}>
                        {column.render ? column.render(value, row) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length || 1} className="py-8 text-center text-muted-foreground">
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProTable;
