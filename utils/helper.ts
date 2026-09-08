import chroma from 'chroma-js';
import { toast } from 'sonner';

// catchError that automatically shows toast/log
// export async function catchErrorWithToast<T, E extends new (...args: any[]) => Error>(
//   promise: Promise<T>,
//   errorsToCatch?: E[]
// ): Promise<[undefined, T] | [InstanceType<E>]> {
//   try {
//     const data = await promise;
//     return [undefined, data] as [undefined, T];
//   } catch (error) {
//     // Ensure it's an Error
//     if (!(error instanceof Error)) throw error;

//     // Catch all errors if no filter, or only the ones specified
//     if (!errorsToCatch || errorsToCatch.some(e => error instanceof e)) {
//       handleError(error);
//       return [error as InstanceType<E>];
//     }

//     // Rethrow if not a specified error type
//     throw error;
//   }
// }

export async function catchRouteErrors<T>(promise: Promise<T>): Promise<[Error | null, T | null]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (err) {
    return [err instanceof Error ? err : new Error('Something went wrong'), null];
  }
}

// export const tryWithToast = async <T>(promise: Promise<T>): Promise<T> => {
//   try {
//     const res = await promise;

//     // @ts-ignore
//     if (res?.error || res?.success === false) {
//       // @ts-ignore
//       const message = res.error?.message || (res as any).message || "Something went wrong";

//       toastError(message);
//     }

//     return res;
//   } catch (err) {
//     // @ts-ignore
//     toastError(err.message);
//     return err as T;
//   }
// };

const handleError = (err: unknown) => {
  const message = err instanceof Error ? err.message : 'Something went wrong';

  if (typeof window !== 'undefined') {
    import('sonner').then(({ toast }) => {
      toast.error(message);
    });
  } else {
    console.error(message);
  }
};

export async function catchErrorWithToast<T, E extends new (...args: any[]) => Error>(
  promise: Promise<T>,
  errorsToCatch?: E[]
): Promise<[undefined, T] | [InstanceType<E>]> {
  try {
    const data = await promise;

    return [undefined, data] as [undefined, T];
  } catch (error) {
    if (!(error instanceof Error)) throw error;

    if (!errorsToCatch || errorsToCatch.some(e => error instanceof e)) {
      handleError(error);
      return [{ message: error.message, success: false } as InstanceType<E>];
    }

    // throw error;

    return [error as InstanceType<E>];
  }
}

type ErrResp = {
  error?: {
    message: string;
  } | null;
  success?: boolean;
  message?: string;
};

export const tryWithToast = async <T>(promise: Promise<T>): Promise<T | null> => {
  try {
    const res = await promise;

    if ((res as ErrResp)?.error) {
      toast.error((res as ErrResp).error?.message || 'Something went wrong');
      return null;
    }

    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';

    toast.error(message);
    return null;
  }
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function regenerateSlug(text: string): string {
  return slugify(text);
}

export const getCssVarHex = (variableName: string) => {
  if (typeof window === 'undefined') return;

  const rootStyles = getComputedStyle(document.documentElement);
  let value = rootStyles.getPropertyValue(variableName).trim();

  if (!value) return;

  if (value.startsWith('lab(')) {
    // @ts-ignore
    const [l, a, b] = value.match(/-?[\d.]+%?/g).map(v => (v.includes('%') ? parseFloat(v) : parseFloat(v)));

    return chroma.lab(l, a, b).hex();
  }

  try {
    return chroma(value).hex();
  } catch (e) {
    console.warn('Unable to parse color:', value, e);
    return;
  }
};

export const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
