import { auth } from "./auth";
import type { z, ZodTypeAny } from 'zod';

export type TOnNavigate = (page: string) => void;

export type Session = typeof auth.$Infer.Session;

export type SessionUser = typeof auth.$Infer.Session.user;

export type ProfileLayoutProps = {
  children: React.ReactNode;
  sections: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    content?: React.ReactNode;
  }>;
}

export type SchemaForm<T extends ZodTypeAny> = z.infer<T>;