import { Button } from '@/components/ui/button';
import {
  Dialog as DialogUI,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { ReactNode } from 'react';
import { FieldValues } from 'react-hook-form';

interface ReusableDialogProps<T extends FieldValues> {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: ReactNode;
  // form: UseFormReturn<T>;
  triggerText: string;
  onTriggerClick?: () => void;
  disableRefreshUponSubmit?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassname?: string;
}

const Dialog = <T extends FieldValues>({
  title,
  description,
  // form: formProps,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  loading = false,
  onCancel,
  triggerText,
  onTriggerClick,
  open,
  onOpenChange,
  contentClassname,
}: ReusableDialogProps<T>) => {
  return (
    <DialogUI open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant={destructive ? 'destructive' : 'outline'} onClick={onTriggerClick}>
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className={contentClassname}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant={destructive ? 'destructive' : 'outline'}
              type='button'
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
          </DialogClose>
          <Button disabled={loading}>{loading ? 'Please wait...' : confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </DialogUI>
  );
};

export default Dialog;
