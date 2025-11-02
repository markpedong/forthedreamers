import { auth } from "./auth";
import type { z, ZodTypeAny } from 'zod';
import { getSession, listUserAccounts } from "./server-actions";

export type TOnNavigate = (page: string) => void;

export type Session = Awaited<ReturnType<typeof getSession>>

export type SessionUser = typeof auth.$Infer.Session.user;




export type ProfileLayoutProps = {
  sections: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    content?: React.ReactNode;
  }>;
  hasPassword: boolean;
}

export type SchemaForm<T extends ZodTypeAny> = z.infer<T>;

export type Account = Awaited<ReturnType<typeof listUserAccounts>>[number];

export type SetupStep =
  | 'password'
  | 'qr-code'
  | 'backup-codes'
  | 'regenerate'
  | 'backup-codes-regenerated'
  | '';

export type ValueEnumItem = { label: string; value: string | number };

export type ValueEnum = ValueEnumItem[] | (() => Promise<ValueEnumItem[]>);

export type SearchType = 'text' | 'select' | 'number' | 'date';

export interface ProColumn<T> {
  title: string;
  dataIndex?: keyof T;
  sorter?: (a: T, b: T) => number;
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
  search?: {
    type: SearchType,
    placeholder?: string
    width?: number
    valueEnum?: ValueEnum;
  };
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export type RequestParams = { page: number; pageSize: number; filters?: Record<string, any> };

export type SorterInfo = { field?: string; order?: 'asc' | 'desc' };

export type RequestFn<T> = (
  params: RequestParams,
  sorter?: SorterInfo,
) => Promise<{ data: T[]; total: number }>;

export type PaginationProps = {
  current?: number;
  pageSize?: 10 | 20 | 50;
  total?: number;
  pageSizeOptions?: (10 | 20 | 50)[];
  onChange?: (page: number, pageSize: 10 | 20 | 50) => void;
};

export interface ProTableProps<T> {
  rowKey: keyof T;
  columns: ProColumn<T>[];
  dataSource?: T[];
  request?: RequestFn<T>;
  pagination?: false | PaginationProps;
  title?: string;
}

