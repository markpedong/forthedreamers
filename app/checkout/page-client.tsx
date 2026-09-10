'use client';

import { useState } from 'react';
import type { Address, ShippingMethod } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Package, Truck, ChevronLeft, Plus, Store } from 'lucide-react';
import Link from 'next/link';
import AddressForm from '@/components/reusable/address-form';

interface CheckoutPageClientProps {
  cartItems: Array<{
    id: string;
    quantity: number;
    variant: {
      id: string;
      name: string;
      price: number;
      discountedPrice: number | null;
      product: { name: string; sellerId: string; seller?: { storeName?: string } };
    };
  }>;
  addresses: Address[];
  shippingMethods: ShippingMethod[];
}

const CheckoutPageClient = ({
  cartItems,
  addresses,
  shippingMethods,
}: CheckoutPageClientProps) => {
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find(a => a.isDefault)?.id || addresses[0]?.id
  );
  const [selectedShippingId, setSelectedShippingId] = useState(
    shippingMethods[0]?.id ?? ''
  );
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  const total = cartItems.reduce((sum, item) => {
    const price = item.variant.discountedPrice ?? item.variant.price;
    return sum + price * item.quantity;
  }, 0);

  const shipping = shippingMethods.find(m => m.id === selectedShippingId);
  const grandTotal = total + (shipping?.price ?? 0);

  const sellerGroups = new Map<string, typeof cartItems>();
  for (const item of cartItems) {
    const sellerId = item.variant.product.sellerId;
    if (!sellerGroups.has(sellerId)) sellerGroups.set(sellerId, []);
    sellerGroups.get(sellerId)!.push(item);
  }

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      {/* Back to Cart */}
      <Link href="/cart" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="w-4 h-4" />Back to Cart
      </Link>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Order Summary</h2>
            {Array.from(sellerGroups.entries()).map(([sellerId, items]) => (
              <div key={sellerId} className="border rounded-lg bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
                  <Store className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">
                    {items[0].variant.product.seller?.storeName || 'Seller'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({items.length} item{items.length > 1 ? 's' : ''})
                  </span>
                </div>

                <div className="divide-y">
                  {items.map(item => {
                    const price = item.variant.discountedPrice ?? item.variant.price;
                    return (
                      <div key={item.id} className="flex justify-between items-center gap-4 p-4">
                        <div>
                          <p className="font-medium">
                            {item.variant.product.name} — {item.variant.name}
                          </p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${(price * item.quantity).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="border rounded-lg p-6 bg-card space-y-4">
            <h2 className="text-xl font-bold">Shipping Address</h2>

            {selectedAddress ? (
              <div className="p-3 border rounded-lg bg-primary/5">
                <p className="font-medium">{selectedAddress.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.region} {selectedAddress.postalCode}
                </p>
                <p className="text-sm text-muted-foreground">{selectedAddress.phoneNumber}</p>
                {selectedAddress.isDefault && <span className="text-xs text-primary font-medium ml-2">Default</span>}
              </div>
            ) : (
              <p className="text-muted-foreground">No saved addresses.</p>
            )}

            <Button variant="outline" className="w-full gap-2" onClick={() => setAddressDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Manage Addresses
            </Button>
          </div>

          {/* Shipping Method */}
          <div className="border rounded-lg p-6 bg-card space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Truck className="w-5 h-5" />Shipping Method
            </h2>

            {shippingMethods.length === 0 ? (
              <p className="text-muted-foreground">No shipping methods available.</p>
            ) : (
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      method.id === selectedShippingId ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={method.id === selectedShippingId}
                      onChange={() => setSelectedShippingId(method.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{method.name}</p>
                        <p className="font-semibold">${method.price.toFixed(2)}</p>
                      </div>
                      {method.description && (
                        <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Est. delivery: {method.estimatedDays}–{method.estimatedDays + 3} days
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <PlaceOrderButton total={grandTotal} shippingMethodsCount={shippingMethods.length} />
        </div>

        {/* Right Sidebar */}
        <div className="order-first lg:order-last space-y-4">
          {shipping && (
            <div className="p-6 border rounded-lg bg-card space-y-4">
              <h2 className="text-xl font-bold">Shipping</h2>
              <div className="flex justify-between text-sm">
                <span>{shipping.name}</span>
                <span>${shipping.price.toFixed(2)}</span>
              </div>
            </div>
          )}
          <div className="p-6 border rounded-lg bg-card space-y-4">
            <h2 className="text-xl font-bold">Total</h2>
            <div className="space-y-2 text-sm">
              {Array.from(sellerGroups.entries()).map(([sellerId, items]) => {
                const sellerTotal = items.reduce((sum, item) => {
                  const price = item.variant.discountedPrice ?? item.variant.price;
                  return sum + price * item.quantity;
                }, 0);
                return (
                  <div key={sellerId} className="flex justify-between">
                    <span>{items[0].variant.product.seller?.storeName || 'Seller'}</span>
                    <span>${sellerTotal.toFixed(2)}</span>
                  </div>
                );
              })}
              <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Management Dialog */}
      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Addresses</DialogTitle>
          </DialogHeader>

          {addresses.length > 0 && (
            <div className="space-y-3 mb-4">
              <p className="text-sm text-muted-foreground mb-2">Select a shipping address:</p>
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    address.id === selectedAddressId ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkout-address"
                    checked={address.id === selectedAddressId}
                    onChange={() => { setSelectedAddressId(address.id); setAddressDialogOpen(false); }}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">{address.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.street}, {address.city}, {address.region} {address.postalCode}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.phoneNumber}</p>
                    {address.isDefault && <span className="text-xs text-primary font-medium ml-2">Default</span>}
                  </div>
                </label>
              ))}
            </div>
          )}

          <AddressFormDialog />
        </DialogContent>
      </Dialog>
    </main>
  );
};

/* Address management dialog + separate add-address modal */
const AddressFormDialog = () => {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <Button variant="outline" className="w-full gap-2" onClick={() => setShowAdd(true)}>
        <Plus className="h-4 w-4" /> Add New Address
      </Button>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{'Add New Address'}</DialogTitle>
          </DialogHeader>
          <AddressForm onCancel={() => setShowAdd(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

const PlaceOrderButton = ({ total, shippingMethodsCount }: { total: number; shippingMethodsCount: number }) => (
  <Button disabled={shippingMethodsCount === 0 || total <= 0} className="w-full text-lg py-6">
    Place Order — ${total.toFixed(2)}
  </Button>
);

export default CheckoutPageClient;
