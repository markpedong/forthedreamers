import Link from 'next/link';

const CartBackLink = () => (
  <Link href="/cart" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
    Back to Cart
  </Link>
);

export default CartBackLink;
