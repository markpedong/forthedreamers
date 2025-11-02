'use client';

import { useMemo, useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

type SorterFn<T> = (a: T, b: T) => number;

export interface Column<T> {
  title: string;
  dataIndex: keyof T;
  render?: (value: T[keyof T], record: T) => React.ReactNode;
  sorter?: SorterFn<T>;
  searchable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export const DataTable = <T extends Record<string, any>>({ columns, data }: DataTableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  // Update search input
  const handleSearchChange = (key: keyof T, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerms((prev) => ({ ...prev, [key]: value }));
  };

  // Filter based on search terms
  const filtered = useMemo(() => {
    return data.filter((item) =>
      columns.every((col) => {
        const term = searchTerms[col.dataIndex as string];
        if (!term) return true;
        const cellValue = String(item[col.dataIndex] ?? '').toLowerCase();
        return cellValue.includes(term.toLowerCase());
      }),
    );
  }, [data, columns, searchTerms]);

  // Sort if active
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const column = columns.find((col) => col.dataIndex === sortKey);
    if (!column?.sorter) return filtered;

    const sortedData = [...filtered].sort(column.sorter);
    return sortOrder === 'asc' ? sortedData : sortedData.reverse();
  }, [filtered, sortKey, sortOrder, columns]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <Card>
      <CardContent className='pt-6 overflow-x-auto'>
        {/* Search Row */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
          {columns
            .filter((col) => col.searchable)
            .map((col) => (
              <Input
                key={String(col.dataIndex)}
                placeholder={`Search ${col.title}...`}
                value={searchTerms[col.dataIndex as string] || ''}
                onChange={(e) => handleSearchChange(col.dataIndex, e)}
              />
            ))}
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.dataIndex)}>
                  <div className='flex items-center gap-1'>
                    {col.title}
                    {col.sorter && (
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6'
                        onClick={() => handleSort(col.dataIndex)}
                      >
                        <ArrowUpDown className='w-3 h-3' />
                      </Button>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={String(col.dataIndex)}>
                    {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
