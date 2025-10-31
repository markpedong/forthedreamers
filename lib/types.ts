import { auth } from "./auth";
import type { z, ZodTypeAny } from 'zod';
import { listUserAccounts } from "./server-actions";

export type TOnNavigate = (page: string) => void;

export type Session = typeof auth.$Infer.Session;

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
