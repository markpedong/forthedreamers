'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ValueEnum = Record<string, string> | (() => Promise<Record<string, string>>);

export interface ProColumn<T> {
  title: string;
  dataIndex?: keyof T;
  sorter?: (a: T, b: T) => number;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  searchType?: 'text' | 'select' | 'number' | 'date';
  valueEnum?: ValueEnum;
}

interface PaginationProps {
  current?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
}

interface ProTableProps<T> {
  rowKey: keyof T;
  columns: ProColumn<T>[];
  dataSource?: T[];
  request?: (
    params: { page: number; pageSize: number },
    sort?: any,
  ) => Promise<{ data: T[]; total: number }>;
  pagination?: PaginationProps | false;
}

export const ProTable = <T extends Record<string, any>>({
  rowKey,
  columns,
  dataSource,
  request,
  pagination = { current: 1, pageSize: 10, total: 0 },
}: ProTableProps<T>) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>(dataSource || []);
  const [total, setTotal] = useState(
    pagination && 'total' in pagination ? pagination.total || 0 : 0,
  );
  const [page, setPage] = useState(
    pagination && 'current' in pagination ? pagination.current || 1 : 1,
  );
  const [pageSize, setPageSize] = useState(
    pagination && 'pageSize' in pagination ? pagination.pageSize || 10 : 10,
  );
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const fetchData = async () => {
    if (!request) return;
    setLoading(true);
    try {
      const res = await request({ page, pageSize }, {});
      setData(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (request) fetchData();
  }, [page, pageSize]);

  const handleSearchFilter = useMemo(() => {
    if (request) return data;
    let filtered = [...(dataSource || [])];
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;
      filtered = filtered.filter((item) => {
        const cellValue = String(item[key] ?? '').toLowerCase();
        return cellValue.includes(value.toLowerCase());
      });
    });
    return filtered;
  }, [filters, dataSource, data, request]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (pagination && typeof pagination.onChange === 'function') {
      pagination.onChange(newPage, pageSize);
    }
  };

  const renderSearchInput = (col: ProColumn<T>) => {
    if (!col.searchType) return null;

    if (col.searchType === 'text') {
      return (
        <Input
          placeholder={`Search ${col.title}`}
          value={filters[col.dataIndex as string] ?? ''}
          onChange={(e) => handleFilterChange(col.dataIndex as string, e.target.value)}
          className='w-full md:w-40'
        />
      );
    }

    if (col.searchType === 'select') {
      const [options, setOptions] = useState<Record<string, string>>({});

      useEffect(() => {
        if (typeof col.valueEnum === 'function') {
          col.valueEnum().then(setOptions);
        } else if (col.valueEnum) {
          setOptions(col.valueEnum);
        }
      }, [col.valueEnum]);

      return (
        <Select
          value={filters[col.dataIndex as string] ?? ''}
          onValueChange={(val) => handleFilterChange(col.dataIndex as string, val)}
        >
          <SelectTrigger className='w-full md:w-40'>
            <SelectValue placeholder={`Select ${col.title}`} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(options).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return null;
  };

  return (
    <Card>
      <CardContent className='pt-6 space-y-4'>
        {/* Search Filters Row */}
        <div className='flex flex-wrap gap-4'>
          {columns.map((col, idx) => (
            <div key={idx}>{renderSearchInput(col)}</div>
          ))}
          <Button variant='outline' onClick={() => setFilters({})} className='ml-auto'>
            Reset
          </Button>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, i) => (
                  <TableHead key={i}>{col.title}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className='text-center py-4'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : handleSearchFilter.length ? (
                handleSearchFilter.map((row, rowIndex) => (
                  <TableRow
                    key={String(row[rowKey])}
                    className='h-14 border-b last:border-0 hover:bg-muted/40 transition-colors'
                  >
                    {columns.map((col, colIndex) => (
                      <TableCell key={colIndex}>
                        {col.render
                          ? col.render(row[col.dataIndex ?? ''], row, rowIndex)
                          : String(row[col.dataIndex ?? ''] ?? '')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='text-center py-4 text-muted-foreground'
                  >
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination !== false && (
          <div className='flex items-center justify-between pt-4 border-t'>
            <div className='text-sm text-muted-foreground'>
              Page {page} of {Math.ceil(total / pageSize) || 1}
            </div>
            <div className='flex items-center gap-2'>
              <Select value={String(pageSize)} onValueChange={(val) => setPageSize(Number(val))}>
                <SelectTrigger className='w-20'>
                  <SelectValue placeholder='Size' />
                </SelectTrigger>
                <SelectContent>
                  {(pagination?.pageSizeOptions ?? [5, 10, 20, 50]).map((opt) => (
                    <SelectItem key={opt} value={String(opt)}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className='flex items-center gap-1'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Prev
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={page >= Math.ceil(total / pageSize)}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
