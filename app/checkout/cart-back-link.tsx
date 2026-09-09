import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const CartBackLink = () => (
  <Link href="/cart" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
    <ChevronLeft className="w-4 h-4" />Back to Cart
  </Link>
);

export default CartBackLink;
