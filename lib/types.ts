import { auth } from "./auth";
import type { z, ZodTypeAny } from 'zod';
import { getSession, listUserAccounts } from "./server-actions";
import type { Control, Path, FieldValues } from 'react-hook-form';
import { ComponentPropsWithoutRef } from "react";
import { Category, Product, Spec, Variant, VariantOption } from "@/generated/prisma";

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

interface SearchConfig {
  type: SearchType
  placeholder?: string
  width?: number
  valueEnum?: ValueEnum
}
export interface ProColumn<T> {
  title: string;
  width?: number
  dataIndex?: keyof T;
  sorter?: (a: T, b: T) => number;
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
  search?: SearchConfig | false
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


export type TCreateSeller = { storeName: string, userID: string }

// Product form data type (what the form expects/submits)
export type ProductFormData = {
  id?: string;
  name: string;
  slug?: string;
  brand: string | null;
  basePrice: number | null;
  description: string | null;
  images: string[];
  tags: string[];
  stock: number | null;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  category: string; // Category name
  categoryId?: string;
  specs: Array<{
    id?: string;
    label: string;
    value: string;
  }>;
  variants: Array<{
    id?: string;
    name: string;
    isRequired: boolean;
    options: Array<{
      id?: string;
      variantOptionName: string;
      price: number;
      discountedPrice: number | null;
      stock: number;
      coupon: string | null;
    }>;
  }>;
};

export type ProductFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialProduct?: TProduct;
  categories: Category[]
  onSubmit: (data: ProductFormData & { sellerId?: string }, mode: 'create' | 'edit') => Promise<void> | void
}

export type SharedProps<T extends FieldValues> = {
  label?: string;
  description?: string;
  control?: Control<T>;
  name: Path<T>;
  prefixIconSrc?: string;
  eyeIcon?: boolean;
  preventSpaces?: boolean;
  disabled?: boolean;
};

export type InputProps<T extends FieldValues> = SharedProps<T> &
  Omit<ComponentPropsWithoutRef<'input'>, 'name' | 'type'> & {
    type?: 'text' | 'password' | 'number' | 'email';
    textarea?: false;
  };

export type TextareaProps<T extends FieldValues> = SharedProps<T> &
  Omit<ComponentPropsWithoutRef<'textarea'>, 'name'> & {
    type: 'textarea';
    textarea: true;
  };

export type ReusableInputProps<T extends FieldValues> = InputProps<T> | TextareaProps<T>;


export type Option = {
  value: string | number;
  label: string;
};

export type ReusableSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control?: Control<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  containerClassName?: string
};


// Form spec type (without database fields)
export type FormSpec = {
  id?: string;
  label: string;
  value: string;
};

export type SpecsEditorProps = {
  specs: FormSpec[];
  onSpecsChange: (specs: FormSpec[]) => void;
}

export type TProductsList = { products: TProduct[]; categories: Category[], session: Session };

export type TVariantOption = Omit<
  VariantOption,
  "createdAt" | "updatedAt"
>;

// Form variant option type (without database fields)
export type FormVariantOption = Omit<TVariantOption, "variantId">;

// Form variant type (without database fields)
export type FormVariant = {
  id?: string;
  name: string;
  isRequired: boolean;
  options: FormVariantOption[];
};

export type TVariant = Variant & {
  options: TVariantOption[]
};

export type TSpec = Omit<Spec, "createdAt" | "updatedAt">;

export type OmittedProductFields = Omit<Product, "createdAt" | "updatedAt">

export type TProduct = OmittedProductFields & {
  specs: Spec[];
  category: Category;
  variants: TVariant[];
}

export type ProTableRef = {
  reset: () => void;
  reload: () => void;
  setPage: (page: number) => void;
  setFilters: (filters: Record<string, any>) => void;
};

export type DropdownMenuItemType = {
  label: React.ReactElement; // MUST be a single DOM element
  onClick?: () => void;
  isDestructive?: boolean;
  hasSeparatorBelow?: boolean;
  className?: string;
  isDisabled?: boolean;
};

export type DropdownProps = {
  trigger: React.ReactElement; // MUST be a single DOM element
  align?: 'start' | 'center' | 'end';
  menus: DropdownMenuItemType[];
};
