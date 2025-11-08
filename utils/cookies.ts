'use server'

import { cookies } from "next/headers";

export const removeCookies = async (key: string) => {
  const cookieStore = await cookies();

  cookieStore.delete(key);
}

export const deleteAllCookies = async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  allCookies.forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });

  return allCookies;
}