import type { z, ZodTypeAny } from 'zod';
import type { getSession } from './services/auth';
import type { Control, Path, FieldValues } from 'react-hook-form';
import { ComponentPropsWithoutRef, Ref } from 'react';
import { Category, PrismaClient, Product, PRODUCT_STATUS, Seller, Spec, Variant } from '@/generated/prisma';

export type TOnNavigate = (page: string) => void;

export type Session = Awaited<ReturnType<typeof getSession>>;

export type SchemaForm<T extends ZodTypeAny> = z.infer<T>;

export type Account = { id: string; accountId: string; providerId: string; createdAt: Date | null };

export type ValueEnumItem = { label: string; value: string | number };

export type ValueEnum = ValueEnumItem[] | (() => Promise<ValueEnumItem[]>);

export type ProductFormData = {
  id?: string;
  name: string;
  brand: string | null;
  basePrice?: number | null;
  description: string | null;
  images: string[];
  tags: string[];
  stock?: number | null;
  status: PRODUCT_STATUS;
  categoryId: string;
  specs: FormSpec[];
  variants: Omit<TVariant[], 'id'> & { id?: string };
};

export type ProductFormModalProps = {
  isSubmitting?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  type: 'CREATE' | 'EDIT';
  initialProduct?: TProduct;
  categories: Category[];
  onSubmit: (data: ProductFormData & { sellerId?: string }, type: 'CREATE' | 'EDIT') => Promise<void> | void;
};

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
    isHorizontal?: boolean;
  };

export type TextareaProps<T extends FieldValues> = SharedProps<T> &
  Omit<ComponentPropsWithoutRef<'textarea'>, 'name'> & {
    type: 'textarea';
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
  containerClassName?: string;
};

export type FormSpec = {
  id?: string;
  label: string;
  value: string;
};

export type SpecsEditorProps = {
  specs: FormSpec[];
  onSpecsChange: (specs: FormSpec[]) => void;
};

export type FormVariant = {
  id?: string;
  name: string;
  isRequired: boolean;
};

export type OmittedProductFields = Omit<Product, 'createdAt' | 'updatedAt' | 'categoryId'>;

export type TSeller = Omit<Seller, 'createdAt' | 'updatedAt'>;

export type TVariant = Omit<Variant, 'createdAt' | 'updatedAt' | 'attributes'> & {
  attributes: Record<string, string>;
};

export type TProduct = OmittedProductFields & {
  specs: Spec[];
  category: Omit<Category, 'createdAt' | 'updatedAt'>;
  variants: TVariant[];
  seller: TSeller;
};

export type ProTableRef = {
  reset: () => void;
  reload: () => void;
  setPage: (page: number) => void;
  setFilters: (filters: Record<string, any>) => void;
};

export type ActionType = ProTableRef;

export type ProColumn<T> = {
  title: React.ReactNode;
  dataIndex?: keyof T | string;
  search?: boolean;
  hideInTable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  renderFormItem?: () => React.ReactNode;
  sorter?: (a: T, b: T) => number;
  fieldProps?: Record<string, any>;
  width?: number;
  align?: 'left' | 'center' | 'right';
};

export type DropdownMenuItemType = {
  label: React.ReactElement;

  onClick?: () => void;
  isDestructive?: boolean;
  hasSeparatorBelow?: boolean;
  className?: string;
  isDisabled?: boolean;
};

export type DropdownProps = {
  trigger: React.ReactElement;

  align?: 'start' | 'center' | 'end';
  menus: DropdownMenuItemType[];
};

export type ProTableProps<T> = {
  rowKey?: keyof T | string;
  columns?: ProColumn<T>[];
  dataSource?: T[];
  request?: (params: Record<string, any>) => Promise<{ data: T[]; total: number }>;
  headerTitle?: React.ReactNode;
  toolBarRender?: false;
  search?: Record<string, any> | false;
  exportDataFn?: () => Promise<void>;
  timeLabel?: string;
  disableTimeFilter?: boolean;
  actionRef?: Ref<ActionType | undefined>;
  formRef?: Ref<unknown>;
  isLoading?: boolean;
};

export type ApiSuccessResponse<T> = { success: true; data?: T; message?: string };
export type ApiErrorResponse = { success: false; message: string };
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type TGetPaginatedData = {
  model: keyof PrismaClient;
  where: Record<string, any>;
  include?: any;
  orderBy?: any;
  omit?: any;
};

export type VariantEditorProps = {
  variants: TVariant[];
  onVariantsChange: (variants: Partial<TVariant>[]) => void;
  onUpload: (files: File[]) => Promise<string[]>;
  isUploading: boolean;
  errors?: Record<number, Record<string, { message?: string } | undefined> | undefined>;
};

export type TagsInputProps = {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
};
