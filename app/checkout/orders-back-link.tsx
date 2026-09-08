import Link from 'next/link';

const OrdersBackLink = () => (
  <Link href="/profile?tab=orders" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
    Back to Orders
  </Link>
);

export default OrdersBackLink;
