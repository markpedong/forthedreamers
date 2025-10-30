import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from 'dayjs';
import { UAParser } from "ua-parser-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toBase64 = (file: File) =>
  new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const formatDate = (date: Date, format = "MM/DD/YYYY h:mm A") => dayjs(date).format(format);

export const getBrowserInfo = (userAgent: string | null) => {
  if (!userAgent) return 'Unknown Device';
  const { browser, os } = new UAParser(userAgent).getResult();
  if (!browser.name && !os.name) return 'Unknown Device';
  return [browser.name, os.name].filter(Boolean).join(' on ');
}
