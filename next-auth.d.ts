import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      email?: string | null | undefined;
      exp?: number;
      iat?: number;
      id: string;
      image?: string;
      jti?: string;
      name: string | null;
      picture?: string | null | undefined;
      sub?: string;
    }
  }
}