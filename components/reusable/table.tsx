'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  useTransition,
} from 'react';
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
import {
  PaginationProps,
  ProColumn,
  ProTableProps,
  ProTableRef,
  SorterInfo,
  ValueEnumItem,
} from '@/lib/types';
import { Label } from '@/components/ui/label';
import classNames from 'classnames';

const ProTableInner = <T extends Record<string, any>>(
  { rowKey, columns, dataSource, request, pagination = { pageSize: 10 }, title }: ProTableProps<T>,
  ref: React.Ref<ProTableRef>,
) => {
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
  const [searchInputs, setSearchInputs] = useState<Record<string, any>>({});
  const [sorter, setSorter] = useState<SorterInfo>({});
  const [tableData, setTableData] = useState<T[]>(dataSource ?? []);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(paginationState.total ?? dataSource?.length ?? 0);
  const current = paginationState.current ?? 1;
  const pageSize = paginationState.pageSize ?? 10;
  const totalCount = paginationState.total ?? total;
  const start = totalCount === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, totalCount);
  const [isPending, startTransition] = useTransition();

  useImperativeHandle(ref, () => ({
    reset: () => {
      handleResetFilters();
      fetchRemote?.();
    },
    reload: () => fetchRemote?.(),
    setPage: handlePageChange,
    setFilters: (newFilters: Record<string, any>) =>
      Object.entries(newFilters).forEach(([k, v]) => setFilters((prev) => ({ ...prev, [k]: v }))),
  }));

  useEffect(() => {
    if (!request && dataSource) {
      setTableData(dataSource);
      setTotal(dataSource.length);
      setPaginationState((p) => ({ ...p, total: dataSource.length }));
    }
  }, [dataSource, request]);

  const paramsForRequest = useMemo(
    () => ({ page: current, pageSize, filters }),
    [current, pageSize, filters],
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
  }, [fetchRemote]);

  const processedClientData = useMemo(() => {
    if (request) return tableData;
    let d = dataSource ? [...dataSource] : [...tableData];

    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;
      d = d.filter((row) => {
        // If column has dataIndex, use it; otherwise try to infer from render
        const val = row[key as keyof T];
        return (
          val !== null &&
          val !== undefined &&
          String(val).toLowerCase().includes(String(value).toLowerCase())
        );
      });
    });

    if (sorter.field) {
      const col = columns.find((c) => c.dataIndex === sorter.field);
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
      const startIdx = (current - 1) * pageSize;
      return d.slice(startIdx, startIdx + pageSize);
    }
    return d;
  }, [dataSource, tableData, filters, sorter, columns, pagination, current, pageSize, request]);

  useEffect(() => {
    if (!request) {
      setTotal(processedClientData.length);
      setPaginationState((p) => ({
        ...p,
        total: dataSource?.length ?? processedClientData.length,
      }));
    }
  }, [processedClientData.length, dataSource?.length, request]);

  const isPaginationEnabled = (
    pagination: false | PaginationProps | undefined,
  ): pagination is PaginationProps => pagination !== false && pagination !== undefined;
  const handleSortToggle = (field: string) =>
    setSorter((prev) =>
      prev.field === field
        ? { field, order: prev.order === 'asc' ? 'desc' : 'asc' }
        : { field, order: 'asc' },
    );
  const handlePageChange = (n: number) => {
    const safe = Math.max(1, n);
    setPaginationState((p) => ({ ...p, current: safe }));
    if (isPaginationEnabled(pagination)) pagination.onChange?.(safe, pageSize);
  };
  const handlePageSizeChange = (ps: 10 | 20 | 50) => {
    setPaginationState((p) => ({ ...p, pageSize: ps, current: 1 }));
    if (isPaginationEnabled(pagination)) pagination.onChange?.(1, ps);
  };
  const handleResetFilters = () => {
    setSearchInputs({});
    setFilters({});
    setSorter({});
    setPaginationState((p) => ({ ...p, current: 1 }));
    if (isPaginationEnabled(pagination)) pagination.onChange?.(1, pageSize);
  };
  const handleApplySearch = () => {
    setFilters(searchInputs);
    setPaginationState((p) => ({ ...p, current: 1 }));
  };

  const renderSearchInput = (col: ProColumn<T>, idx: number) => {
    if (col.search === false) return null;
    const key = col.dataIndex ? String(col.dataIndex) : `__rendered_${idx}`;
    const val = searchInputs[key] ?? '';
    const type = typeof col.search === 'object' ? col.search.type : undefined;

    if (type === 'select') {
      const [options, setOptions] = useState<ValueEnumItem[]>([]);
      const valueEnum = typeof col.search === 'object' ? col.search.valueEnum : undefined;
      useEffect(() => {
        let active = true;
        (async () => {
          if (valueEnum) {
            const resolved = typeof valueEnum === 'function' ? await valueEnum() : valueEnum;
            if (active) setOptions(resolved);
          }
        })();
        return () => {
          active = false;
        };
      }, [valueEnum]);
      return (
        <Select
          key={key}
          value={val || '__all__'}
          onValueChange={(v) =>
            setSearchInputs((prev) => ({ ...prev, [key]: v === '__all__' ? '' : v }))
          }
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
      <>
        <Label htmlFor={key}>{col.title}:</Label>
        <Input
          id={key}
          value={val}
          placeholder={
            typeof col.search === 'object'
              ? (col.search.placeholder ?? `Search ${col.title}`)
              : `Search ${col.title}`
          }
          onChange={(e) => setSearchInputs((prev) => ({ ...prev, [key]: e.target.value }))}
          className='w-full md:w-40'
          type={type === 'number' ? 'number' : 'text'}
        />
      </>
    );
  };

  const visibleRows = request ? tableData : processedClientData;
  const totalPages = Math.max(1, Math.ceil((paginationState.total ?? total) / pageSize));

  return (
    <Card>
      <CardContent className='p-4 space-y-4'>
        {title && <h3 className='text-lg font-medium'>{title}</h3>}
        <div className='flex flex-wrap items-end gap-3'>
          {columns
            .filter((col) => col.title !== 'Actions' && col.search !== false)
            .map((col, i, filteredCols) => (
              <div
                key={col.dataIndex ? String(col.dataIndex) : `col-wrapper-${i}`}
                className={classNames('flex items-center gap-2', {
                  'flex-1': i === filteredCols.length - 1,
                })}
              >
                {renderSearchInput(col, i)}
              </div>
            ))}
          <div className='flex gap-2'>
            <Button variant='outline' onClick={handleResetFilters} disabled={isPending}>
              Reset
            </Button>
            <Button onClick={handleApplySearch} disabled={isPending}>
              Search
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, i) => (
                  <TableHead
                    key={col.dataIndex ? String(col.dataIndex) : `col-head-${i}`}
                    className={`${col.className ?? ''} text-${col.align ?? 'left'} cursor-pointer select-none`}
                    style={{ width: col.width }}
                    onClick={() => col.sorter && handleSortToggle(String(col.dataIndex ?? ''))}
                  >
                    <div
                      className={`flex items-center gap-2 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}
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
                    key={`${row[rowKey] ?? ''}-${rIdx}`}
                    className='h-14 border-b last:border-0 hover:bg-muted/50 transition-colors'
                  >
                    {columns.map((col, cIdx) => (
                      <TableCell
                        key={cIdx}
                        className={`py-3 px-4 align-middle text-sm text-${col.align ?? 'left'}`}
                        style={{ width: col.width }}
                      >
                        {col.render
                          ? col.render(row[col.dataIndex as keyof T], row, rIdx)
                          : String(row[col.dataIndex as keyof T] ?? '')}
                      </TableCell>
                    ))}
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
                value={String(pageSize)}
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
                  disabled={current <= 1}
                  onClick={() => handlePageChange(current - 1)}
                >
                  Prev
                </Button>
                <div className='text-sm'>
                  Page <strong>{current}</strong> / <strong>{totalPages}</strong>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={current >= totalPages}
                  onClick={() => handlePageChange(current + 1)}
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

export const ProTable = forwardRef(ProTableInner) as <T extends Record<string, any>>(
  props: ProTableProps<T> & { ref?: React.Ref<ProTableRef> },
) => React.ReactNode;
