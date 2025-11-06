'use client';

import {
  AlertDialog as AlertDialogUI,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import classNames from 'classnames';
import { FC, ReactNode } from 'react';

interface ReusableAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: ReactNode;
  wrapperClassName?: string;
  headerClassName?: string;
  containerClassName?: string;
}

const AlertDialog: FC<ReusableAlertProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  children,
  onCancel,
  wrapperClassName,
  headerClassName,
  containerClassName,
}) => {
  return (
    <AlertDialogUI open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={classNames('flex flex-col max-h-[90vh] p-0 gap-0', wrapperClassName)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onConfirm?.();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            onCancel?.();
          }
        }}
      >
        {/* Scrollable content with padding */}
        <div className={classNames('flex-1 overflow-auto p-4 pt-0 mt-4', containerClassName)}>
          <AlertDialogHeader className={headerClassName}>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
          </AlertDialogHeader>

          {children}
        </div>

        {/* Sticky footer */}
        <AlertDialogFooter className='m-4 flex-shrink-0'>
          <AlertDialogCancel disabled={loading} onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={
              destructive
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : ''
            }
          >
            {loading ? 'Please wait...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogUI>
  );
};

export default AlertDialog;
