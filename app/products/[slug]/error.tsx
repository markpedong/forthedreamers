'use client';

import { Button } from '@/components/ui/button';

const ProductError = ({ reset }: { reset: () => void }) => (
  <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
    <p className="text-xs uppercase tracking-widest text-muted-foreground">Product unavailable</p>
    <h1 className="text-2xl font-semibold text-foreground">We could not load this product.</h1>
    <p className="text-muted-foreground">Please try again or return to the catalog.</p>
    <Button onClick={reset}>Try again</Button>
  </main>
);

export default ProductError;
