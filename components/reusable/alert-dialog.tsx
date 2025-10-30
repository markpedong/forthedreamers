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
}) => {
  return (
    <AlertDialogUI open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onConfirm?.();
          }
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>

        {children}

        <AlertDialogFooter>
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
