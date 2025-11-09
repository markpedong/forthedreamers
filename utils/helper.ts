import { BaseQueryParams } from "@/lib/types";
import chroma from "chroma-js";

const handleError = (err: unknown) => {
  const message = err instanceof Error ? err.message : "Something went wrong";

  if (typeof window !== "undefined") {
    import("sonner").then(({ toast }) => {
      toast.error(message);
    });
  } else {
    console.error(message);
  }
};

// catchError that automatically shows toast/log
export async function catchErrorWithToast<T, E extends new (...args: any[]) => Error>(
  promise: Promise<T>,
  errorsToCatch?: E[]
): Promise<[undefined, T] | [InstanceType<E>]> {
  try {
    const data = await promise;
    return [undefined, data] as [undefined, T];
  } catch (error) {
    // Ensure it's an Error
    if (!(error instanceof Error)) throw error;

    // Catch all errors if no filter, or only the ones specified
    if (!errorsToCatch || errorsToCatch.some(e => error instanceof e)) {
      handleError(error);
      return [error as InstanceType<E>];
    }

    // Rethrow if not a specified error type
    throw error;
  }
}

export async function catchRouteErrors<T>(promise: Promise<T>): Promise<[Error | null, T | null]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (err) {
    return [err instanceof Error ? err : new Error("Something went wrong"), null];
  }
}

export const tryWithToast = async <T>(promise: Promise<T>): Promise<T | null> => {
  const [err, res] = await catchErrorWithToast(promise);
  if (err) return null;
  return res;
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function regenerateSlug(text: string): string {
  return slugify(text)
}

export const getCssVarHex = (variableName: string) => {
  if (typeof window === 'undefined') return;

  const rootStyles = getComputedStyle(document.documentElement);
  let value = rootStyles.getPropertyValue(variableName).trim();

  if (!value) return;

  if (value.startsWith('lab(')) {
    // @ts-ignore
    const [l, a, b] = value
      .match(/-?[\d.]+%?/g)
      .map((v) => (v.includes('%') ? parseFloat(v) : parseFloat(v)));

    return chroma.lab(l, a, b).hex();
  }

  try {
    return chroma(value).hex();
  } catch (e) {
    console.warn('Unable to parse color:', value, e);
    return;
  }
}

export const buildQueryParams = (params?: BaseQueryParams) => {
  const { current = 1, dateRange, ...rest } = params || {};
  const sp = new URLSearchParams(rest as Record<string, string>);

  if (dateRange?.length === 2) sp.set('dateRange', `${dateRange[0]},${dateRange[1]}`);

  sp.set('page', String(current));

  return sp.toString();
};


export const buildDateParams = (where: Record<string, any>): Record<string, any> => {
  const newWhere = { ...where }; // clone to avoid mutation

  if (newWhere.dateRange && typeof newWhere.dateRange === "string") {
    const [startRaw, endRaw] = newWhere.dateRange.split(",");

    const start = startRaw.includes("T") ? startRaw : startRaw.replace(" ", "T");
    const end = endRaw.includes("T") ? endRaw : endRaw.replace(" ", "T");

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      newWhere.createdAt = { gte: startDate, lte: endDate };
    }

    delete newWhere.dateRange; // remove original
  }

  return newWhere;
};