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
