import { auth } from "./auth";

export type TOnNavigate = (page: string) => void;

export type Session = typeof auth.$Infer.Session;

export type SessionUser = typeof auth.$Infer.Session.user;
