export const handleAction = async (fn: () => Promise<void>) => {
  try {
    await fn();
  } catch (err: any) {
    const message =
      err instanceof Error ? err.message : "Something went wrong";

    if (typeof window !== "undefined") {
      import("sonner").then(({ toast }) => {
        toast.error(message);
      });
    } else {
      console.error(message);
    }
  }
}