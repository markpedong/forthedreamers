import { cookies } from "next/headers";

export const removeCookies = async (key: string) => {
  const cookieStore = await cookies();

  cookieStore.delete(key);
}