'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { PaginationProps, ProColumn, ProTableProps, SorterInfo, ValueEnumItem } from '@/lib/types';
import { Label } from '../ui/label';

export const ProTable = <T extends Record<string, any>>({
  rowKey,
  columns,
  dataSource,
  request,
  pagination = { pageSize: 10 },
  title,
}: ProTableProps<T>) => {
  const [paginationState, setPaginationState] = useState<PaginationProps>(() =>
    pagination === false
      ? { current: 1, pageSize: 10, total: dataSource?.length ?? 0, pageSizeOptions: [10, 20, 50] }
      : {
          current: pagination.current ?? 1,
          pageSize: pagination.pageSize ?? 10,
          total: pagination.total ?? dataSource?.length ?? 0,
          pageSizeOptions: pagination.pageSizeOptions ?? [10, 20, 50],
        },
  );

  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorter, setSorter] = useState<SorterInfo>({});
  const [tableData, setTableData] = useState<T[]>(dataSource ?? []);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(paginationState.total ?? dataSource?.length ?? 0);
  const current = paginationState.current ?? 1;
  const pageSize = paginationState.pageSize ?? 10;
  const totalCount = paginationState.total ?? total;

  const start = totalCount === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, totalCount);

  useEffect(() => {
    if (!request && dataSource) {
      setTableData(dataSource);
      setTotal(dataSource.length);
      setPaginationState((p) => ({ ...p, total: dataSource.length }));
    }
  }, [dataSource, request]);

  const paramsForRequest = useMemo(
    () => ({
      page: paginationState.current ?? 1,
      pageSize: paginationState.pageSize ?? 10,
      filters,
    }),
    [paginationState.current, paginationState.pageSize, filters],
  );

  const fetchRemote = useCallback(async () => {
    if (!request) return;
    setLoading(true);
    try {
      const res = await request(paramsForRequest, sorter);
      setTableData(res.data ?? []);
      setTotal(res.total ?? 0);
      setPaginationState((p) => ({ ...p, total: res.total ?? 0 }));
    } catch {
      setTableData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [request, paramsForRequest, sorter]);

  useEffect(() => {
    if (request) fetchRemote();
  }, [fetchRemote, request, paginationState.current, paginationState.pageSize, filters, sorter]);

  const processedClientData = useMemo(() => {
    if (request) return tableData;
    let d = dataSource ? [...dataSource] : [...tableData];
    Object.entries(filters).forEach(([k, v]) => {
      if (v)
        d = d.filter((r) =>
          String(r[k as keyof T] ?? '')
            .toLowerCase()
            .includes(String(v).toLowerCase()),
        );
    });
    if (sorter.field) {
      const col = columns.find((c) => String(c.dataIndex) === sorter.field);
      const sortFn =
        col?.sorter ??
        ((a, b) =>
          String(a[sorter.field as keyof T] ?? '').localeCompare(
            String(b[sorter.field as keyof T] ?? ''),
          ));
      d.sort(sortFn);
      if (sorter.order === 'desc') d.reverse();
    }
    if (pagination !== false) {
      const start = ((paginationState.current ?? 1) - 1) * (paginationState.pageSize ?? 10);
      return d.slice(start, start + (paginationState.pageSize ?? 10));
    }
    return d;
  }, [dataSource, tableData, filters, sorter, paginationState, columns, request, pagination]);

  useEffect(() => {
    if (!request) {
      setTotal(processedClientData.length);
      setPaginationState((p) => ({
        ...p,
        total: dataSource?.length ?? processedClientData.length,
      }));
    }
  }, [processedClientData.length, dataSource?.length, request]);

  function isPaginationEnabled(
    pagination: false | PaginationProps | undefined,
  ): pagination is PaginationProps {
    return pagination !== false && pagination !== undefined;
  }

  const handleFilterChange = (k: string, v: any) => {
    setFilters((prev) => ({ ...prev, [k]: v }));
    setPaginationState((p) => ({ ...p, current: 1 }));
    if (isPaginationEnabled(pagination)) pagination.onChange?.(1, paginationState.pageSize ?? 10);
  };

  const handleSortToggle = (field: string) =>
    setSorter((prev) =>
      prev.field === field
        ? { field, order: prev.order === 'asc' ? 'desc' : 'asc' }
        : { field, order: 'asc' },
    );

  const handlePageChange = (n: number) => {
    const safe = Math.max(1, n);
    setPaginationState((p) => ({ ...p, current: safe }));
    if (isPaginationEnabled(pagination))
      pagination.onChange?.(safe, paginationState.pageSize ?? 10);
  };

  const handlePageSizeChange = (ps: 10 | 20 | 50) => {
    setPaginationState((p) => ({ ...p, pageSize: ps, current: 1 }));
    if (isPaginationEnabled(pagination)) pagination.onChange?.(1, ps);
  };

  const handleResetFilters = () => {
    setFilters({});
    setSorter({});
    setPaginationState((p) => ({ ...p, current: 1 }));

    // Trigger optional external pagination onChange
    if (isPaginationEnabled(pagination)) {
      pagination.onChange?.(1, paginationState.pageSize ?? 10);
    }
  };

  const renderSearchInput = (col: ProColumn<T>) => {
    const key = String(col.dataIndex ?? '');
    const val = filters[key] ?? '';
    const type = col.search && col.search.type;
    const valueEnum = col.search?.valueEnum;

    if (!type) return null;
    if (type === 'select') {
      const [options, setOptions] = useState<ValueEnumItem[]>([]);
      useEffect(() => {
        let active = true;
        (async () => {
          if (valueEnum) {
            const res = typeof valueEnum === 'function' ? await valueEnum() : valueEnum;
            if (active) setOptions(res);
          }
        })();
        return () => {
          active = false;
        };
      }, [valueEnum]);

      return (
        <Select
          value={val || '__all__'}
          onValueChange={(v) => handleFilterChange(key, v === '__all__' ? '' : v)}
        >
          <SelectTrigger className='w-full md:w-40'>
            <SelectValue placeholder={`All ${col.title}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='__all__'>All</SelectItem>
            {options.map((o) => (
              <SelectItem key={o.value} value={String(o.value)}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    return (
      <div className='flex items-center gap-2'>
        <Label htmlFor={key}>{col.title}: </Label>
        <Input
          id={key}
          value={val}
          placeholder={col.search?.placeholder ?? `Search ${col.title}`}
          onChange={(e) => handleFilterChange(key, e.target.value)}
          className='w-full md:w-40'
          type={type === 'number' ? 'number' : 'text'}
        />
      </div>
    );
  };

  const visibleRows = request ? tableData : processedClientData;
  const totalPages = Math.max(
    1,
    Math.ceil((paginationState.total ?? total) / (paginationState.pageSize ?? 10)),
  );

  return (
    <Card>
      <CardContent className='p-4 space-y-4'>
        {title && <h3 className='text-lg font-medium'>{title}</h3>}
        <div className='flex items-center justify-between gap-3'>
          <div className='flex flex-wrap gap-3 items-center h-full'>
            {columns.map((col, i) =>
              col.title === 'Actions' ? null : (
                <div key={i} className='min-w-[160px]'>
                  {renderSearchInput(col)}
                </div>
              ),
            )}
          </div>

          <Button
            variant='default'
            size='sm'
            onClick={handleResetFilters}
            disabled={Object.keys(filters).length === 0 && !sorter.field}
          >
            Reset
          </Button>
        </div>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, i) => (
                  <TableHead
                    key={i}
                    className={`${col.className ?? ''} text-${col.align ?? 'left'} cursor-pointer select-none`}
                    onClick={() => col.sorter && handleSortToggle(String(col.dataIndex ?? ''))}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        col.align === 'right'
                          ? 'justify-end'
                          : col.align === 'center'
                            ? 'justify-center'
                            : 'justify-start'
                      }`}
                    >
                      <span>{col.title}</span>
                      {col.sorter && (
                        <span className='text-xs text-muted-foreground'>
                          {sorter.field === String(col.dataIndex ?? '')
                            ? sorter.order === 'asc'
                              ? '▲'
                              : '▼'
                            : '↕'}
                        </span>
                      )}
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
              ) : visibleRows.length ? (
                visibleRows.map((row, rIdx) => (
                  <TableRow
                    key={String(row[rowKey] ?? rIdx)}
                    className='h-14 border-b last:border-0 hover:bg-muted/50 transition-colors'
                  >
                    {columns.map((col, cIdx) => {
                      const key = col.dataIndex as keyof T;
                      const val = row[key];
                      return (
                        <TableCell
                          key={cIdx}
                          className={`py-3 px-4 align-middle text-sm text-${col.align ?? 'left'}`}
                        >
                          {col.render ? col.render(val, row, rIdx) : String(val ?? '')}
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
              Showing {start} - {end} of {totalCount}
            </div>
            <div className='flex items-center gap-3'>
              <Select
                value={String(paginationState.pageSize)}
                onValueChange={(v) => handlePageSizeChange(Number(v) as 10 | 20 | 50)}
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
