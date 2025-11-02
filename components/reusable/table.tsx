'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { Loader2 } from 'lucide-react';

export type ValueEnumItem = { label: string; value: string | number };
export type ValueEnum = ValueEnumItem[] | (() => Promise<ValueEnumItem[]>);

export type SearchType = 'text' | 'select' | 'number' | 'date';

export interface ProColumn<T> {
  title: string;
  dataIndex?: keyof T;
  sorter?: (a: T, b: T) => number;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  searchType?: SearchType;
  valueEnum?: ValueEnum;
  className?: string;
}

export type RequestParams = { page: number; pageSize: number; filters?: Record<string, any> };
export type SorterInfo = { field?: string; order?: 'asc' | 'desc' };

export type RequestFn<T> = (
  params: RequestParams,
  sorter?: SorterInfo,
) => Promise<{ data: T[]; total: number }>;

export type PaginationProps = {
  current?: number;
  pageSize?: number;
  total?: number;
  pageSizeOptions?: number[];
  onChange?: (page: number, pageSize: number) => void;
};

export interface ProTableProps<T> {
  rowKey: keyof T;
  columns: ProColumn<T>[];
  dataSource?: T[];
  request?: RequestFn<T>;
  pagination?: false | PaginationProps;
  title?: string;
}

/**
 * ProTable - Shadcn styled ProTable-like component
 */
export const ProTable = <T extends Record<string, any>>({
  rowKey,
  columns,
  dataSource,
  request,
  pagination = false, // ✅ changed default from object → false
  title,
}: ProTableProps<T>) => {
  const [paginationState, setPaginationState] = useState<PaginationProps>(() => {
    if (pagination === false) {
      return {
        current: 1,
        pageSize: 10,
        total: dataSource?.length ?? 0,
        pageSizeOptions: [10, 20, 50],
      };
    }
    return {
      current: pagination?.current ?? 1,
      pageSize: pagination?.pageSize ?? 10,
      total: pagination?.total ?? dataSource?.length ?? 0,
      pageSizeOptions: pagination?.pageSizeOptions ?? [10, 20, 50],
    };
  });

  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorter, setSorter] = useState<SorterInfo>({});
  const [tableData, setTableData] = useState<T[]>(dataSource ?? []);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(
    paginationState.total ?? (dataSource ? dataSource.length : 0),
  );

  useEffect(() => {
    if (!request && dataSource) {
      setTableData(dataSource);
      setTotal(dataSource.length);
      setPaginationState((p) => ({ ...p, total: dataSource.length }));
    }
  }, [dataSource, request]);

  const paramsForRequest = useMemo<RequestParams>(() => {
    return {
      page: paginationState.current ?? 1,
      pageSize: paginationState.pageSize ?? 10,
      filters,
    };
  }, [paginationState.current, paginationState.pageSize, filters]);

  const fetchRemote = useCallback(async () => {
    if (!request) return;
    setLoading(true);
    try {
      const res = await request(paramsForRequest, sorter);
      setTableData(res.data ?? []);
      setTotal(res.total ?? 0);
      setPaginationState((p) => ({ ...p, total: res.total ?? 0 }));
    } catch (err) {
      console.error('ProTable request error:', err);
      setTableData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [request, paramsForRequest, sorter]);

  useEffect(() => {
    if (request) {
      fetchRemote();
    }
  }, [fetchRemote, request, paginationState.current, paginationState.pageSize, filters, sorter]);

  // ✅ FIX: removed setPaginationState from inside useMemo (caused infinite loop)
  const processedClientData = useMemo(() => {
    if (request) return tableData;
    let d: T[] = dataSource ? [...dataSource] : [...tableData];

    Object.entries(filters).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      const key = k;
      d = d.filter((row) => {
        const cell = String(row[key as keyof T] ?? '').toLowerCase();
        return cell.includes(String(v).toLowerCase());
      });
    });

    if (sorter && sorter.field) {
      const col = columns.find((c) => String(c.dataIndex) === String(sorter.field));
      if (col?.sorter) {
        d.sort(col.sorter as (a: T, b: T) => number);
        if (sorter.order === 'desc') d.reverse();
      } else {
        d.sort((a, b) => {
          const va = String(a[sorter.field as keyof T] ?? '');
          const vb = String(b[sorter.field as keyof T] ?? '');
          return va.localeCompare(vb);
        });
        if (sorter.order === 'desc') d.reverse();
      }
    }

    // ✅ no state updates here (pure calculation)
    if (pagination !== false) {
      const start = ((paginationState.current ?? 1) - 1) * (paginationState.pageSize ?? 10);
      const end = start + (paginationState.pageSize ?? 10);
      return d.slice(start, end);
    }

    return d;
  }, [
    dataSource,
    tableData,
    filters,
    sorter,
    paginationState.current,
    paginationState.pageSize,
    columns,
    request,
    pagination,
  ]);

  // ✅ update total separately after computing data
  useEffect(() => {
    if (!request) {
      setTotal(processedClientData.length);
      setPaginationState((p) => ({
        ...p,
        total: dataSource?.length ?? processedClientData.length,
      }));
    }
  }, [processedClientData.length, dataSource?.length, request]);

  const visibleRows = request ? tableData : processedClientData;

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPaginationState((p) => ({ ...p, current: 1 }));
    if (pagination !== false && typeof pagination.onChange === 'function') {
      pagination.onChange(1, paginationState.pageSize ?? 10);
    }
  };

  const handleSortToggle = (field: string) => {
    setSorter((prev) => {
      if (prev.field === field) {
        const nextOrder = prev.order === 'asc' ? 'desc' : 'asc';
        return { field, order: nextOrder };
      }
      return { field, order: 'asc' };
    });
  };

  const handlePageChange = (next: number) => {
    const safeNext = Math.max(1, next);
    setPaginationState((prev) => ({ ...prev, current: safeNext }));
    if (pagination !== false && typeof pagination.onChange === 'function') {
      pagination.onChange(safeNext, paginationState.pageSize ?? 10);
    }
  };

  const handlePageSizeChange = (ps: number) => {
    setPaginationState((prev) => ({ ...prev, pageSize: ps, current: 1 }));
    if (pagination !== false && typeof pagination.onChange === 'function') {
      pagination.onChange(1, ps);
    }
  };

  const renderSearchInput = (col: ProColumn<T>) => {
    const key = String(col.dataIndex ?? '');
    const val = filters[key] ?? '';

    if (!col.searchType) return null;

    if (col.searchType === 'select') {
      const [options, setOptions] = useState<ValueEnumItem[] | null>(null);
      useEffect(() => {
        let alive = true;
        const load = async () => {
          if (!col.valueEnum) {
            setOptions([]);
            return;
          }
          if (typeof col.valueEnum === 'function') {
            const res = await col.valueEnum();
            if (alive) setOptions(res);
          } else {
            setOptions(col.valueEnum);
          }
        };
        load();
        return () => {
          alive = false;
        };
      }, [col.valueEnum]);

      return (
        <Select
          value={val === '' ? '__all__' : String(val)}
          onValueChange={(v) => handleFilterChange(key, v === '__all__' ? '' : v)}
        >
          <SelectTrigger className='w-full md:w-40'>
            <SelectValue placeholder={`All ${col.title}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='__all__'>All</SelectItem>
            {(options ?? []).map((opt) => (
              <SelectItem key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        value={val ?? ''}
        placeholder={`Search ${col.title}`}
        onChange={(e) => handleFilterChange(key, e.target.value)}
        className='w-full md:w-40'
        type={col.searchType === 'number' ? 'number' : 'text'}
      />
    );
  };

  const totalPages = Math.max(
    1,
    Math.ceil((paginationState.total ?? total) / (paginationState.pageSize ?? 10)),
  );

  return (
    <Card>
      <CardContent className='p-4 space-y-4'>
        {title && (
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium'>{title}</h3>
          </div>
        )}

        <div className='flex flex-wrap gap-3 items-center'>
          {columns.map((col, i) => (
            <div key={i} className='min-w-[160px]'>
              {renderSearchInput(col)}
            </div>
          ))}
          <div className='ml-auto' />
        </div>

        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, i) => (
                  <TableHead
                    key={i}
                    className={col.className ?? ''}
                    onClick={() => col.sorter && handleSortToggle(String(col.dataIndex ?? ''))}
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span>{col.title}</span>
                      {col.sorter ? (
                        <span className='text-xs text-muted-foreground'>
                          {sorter.field === String(col.dataIndex ?? '')
                            ? sorter.order === 'asc'
                              ? '▲'
                              : '▼'
                            : '↕'}
                        </span>
                      ) : null}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className='text-center py-6'>
                    <Loader2 className='w-5 h-5 animate-spin inline-block mr-2' /> Loading...
                  </TableCell>
                </TableRow>
              ) : visibleRows && visibleRows.length > 0 ? (
                visibleRows.map((row, rowIndex) => (
                  <TableRow
                    key={String(row[rowKey] ?? rowIndex)}
                    className='h-14 border-b last:border-0 hover:bg-muted/50 transition-colors'
                  >
                    {columns.map((col, colIndex) => {
                      const idx = col.dataIndex ?? ('' as keyof T);
                      const raw = row[idx as keyof T];
                      return (
                        <TableCell key={colIndex} className='py-3 px-4 align-middle text-sm'>
                          {col.render ? col.render(raw, row, rowIndex) : String(raw ?? '')}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='text-center py-6 text-muted-foreground'
                  >
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {pagination !== false && (
          <div className='flex items-center justify-between pt-4 border-t'>
            <div className='text-sm text-muted-foreground'>
              Showing {(paginationState.current ?? 1 - 1) * (paginationState.pageSize ?? 10) + 1} -
              {Math.min(
                (paginationState.current ?? 1) * (paginationState.pageSize ?? 10),
                paginationState.total ?? total,
              )}{' '}
              of {paginationState.total ?? total}
            </div>

            <div className='flex items-center gap-3'>
              <Select
                value={String(paginationState.pageSize)}
                onValueChange={(v) => handlePageSizeChange(Number(v))}
              >
                <SelectTrigger className='w-28'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(paginationState.pageSizeOptions ?? [10, 20, 50]).map((opt) => (
                    <SelectItem key={opt} value={String(opt)}>
                      {opt} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={(paginationState.current ?? 1) <= 1}
                  onClick={() => handlePageChange((paginationState.current ?? 1) - 1)}
                >
                  Prev
                </Button>
                <div className='text-sm'>
                  Page <strong>{paginationState.current}</strong> / <strong>{totalPages}</strong>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={(paginationState.current ?? 1) >= totalPages}
                  onClick={() => handlePageChange((paginationState.current ?? 1) + 1)}
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
