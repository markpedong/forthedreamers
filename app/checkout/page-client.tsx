'use client';

import { useState } from 'react';
import type { Address } from '@/generated/prisma';
import { Banknote, ChevronLeft, Plus, Store, Truck } from 'lucide-react';
import Link from 'next/link';
import AddressForm from '@/components/reusable/address-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ENABLED_PAYMENT_METHOD, PAYMENT_METHODS } from '@/constants/payment';
import { COURIERS, type CourierCode } from '@/constants/shipping';
import { useCheckoutMutation } from '@/services/useMutation';

interface CheckoutPageClientProps {
  cartItems: Array<{
    id: string;
    quantity: number;
    variant: {
      id: string;
      name: string;
      price: number;
      discountedPrice: number | null;
      product: { name: string; sellerId: string; seller: { storeName: string } };
    };
  }>;
  addresses: Address[];
  sellerShippingMethods: Array<{ sellerId: string; storeName: string; courierCodes: string[] }>;
}

const CheckoutPageClient = ({ cartItems, addresses, sellerShippingMethods }: CheckoutPageClientProps) => {
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find(address => address.isDefault)?.id || addresses[0]?.id
  );
  const [selectedCouriers, setSelectedCouriers] = useState<Record<string, CourierCode>>(() =>
    Object.fromEntries(
      sellerShippingMethods.flatMap(seller => {
        const cheapest = COURIERS.find(courier => seller.courierCodes.includes(courier.code));
        return cheapest ? [[seller.sellerId, cheapest.code]] : [];
      })
    )
  );
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const checkoutMutation = useCheckoutMutation();

  const sellerGroups = new Map<string, typeof cartItems>();
  for (const item of cartItems) {
    const sellerId = item.variant.product.sellerId;
    const items = sellerGroups.get(sellerId) ?? [];
    items.push(item);
    sellerGroups.set(sellerId, items);
  }

  const selectedAddress = addresses.find(address => address.id === selectedAddressId);
  const itemTotal = cartItems.reduce((sum, item) => {
    const price = item.variant.discountedPrice ?? item.variant.price;
    return sum + price * item.quantity;
  }, 0);
  const shippingTotal = [...sellerGroups.keys()].reduce(
    (sum, sellerId) => sum + (COURIERS.find(courier => courier.code === selectedCouriers[sellerId])?.fee ?? 0),
    0
  );
  const grandTotal = itemTotal + shippingTotal;
  const shopsWithoutShipping = sellerShippingMethods.filter(
    seller => !COURIERS.some(courier => seller.courierCodes.includes(courier.code))
  );
  const hasAllShippingSelections = [...sellerGroups.keys()].every(sellerId => selectedCouriers[sellerId]);

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6 pb-[calc(7rem+env(safe-area-inset-bottom))] md:pt-8 md:pb-8">
      <Link href="/cart" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground md:mb-6">
        <ChevronLeft className="h-4 w-4" /> Back to Cart
      </Link>
      <h1 className="mb-5 text-2xl font-bold md:mb-8 md:text-3xl">Order Summary</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:gap-8">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-4">
            {[...sellerGroups.entries()].map(([sellerId, items]) => {
              const settings = sellerShippingMethods.find(seller => seller.sellerId === sellerId);
              const availableCouriers = COURIERS.filter(courier => settings?.courierCodes.includes(courier.code));
              return (
                <div key={sellerId} className="overflow-hidden rounded-lg border bg-card">
                  <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-3">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">{items[0].variant.product.seller.storeName}</span>
                    <span className="text-xs text-muted-foreground">
                      ({items.length} item{items.length === 1 ? '' : 's'})
                    </span>
                  </div>

                  <div className="divide-y">
                    {items.map(item => {
                      const price = item.variant.discountedPrice ?? item.variant.price;
                      return (
                        <div key={item.id} className="flex items-center justify-between gap-4 p-4">
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

                  <div className="space-y-3 border-t bg-muted/10 p-4">
                    <h3 className="flex items-center gap-2 font-medium">
                      <Truck className="h-4 w-4" /> Courier
                    </h3>
                    {availableCouriers.length === 0 ? (
                      <p className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                        {items[0].variant.product.seller.storeName} has no available shipping method. You cannot place
                        this order until the shop enables a courier.
                      </p>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {availableCouriers.map(courier => (
                          <label
                            key={courier.code}
                            className={`cursor-pointer rounded-lg border p-3 ${
                              selectedCouriers[sellerId] === courier.code
                                ? 'border-primary bg-primary/5'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <span className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`courier-${sellerId}`}
                                  checked={selectedCouriers[sellerId] === courier.code}
                                  onChange={() =>
                                    setSelectedCouriers(current => ({ ...current, [sellerId]: courier.code }))
                                  }
                                />
                                <span className="font-medium">{courier.name}</span>
                              </span>
                              <span className="font-semibold">${courier.fee.toFixed(2)}</span>
                            </span>
                            <span className="mt-1 block pl-6 text-xs text-muted-foreground">
                              Est. delivery: {courier.estimatedDays}–{courier.estimatedDays + 3} days
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4 rounded-lg border bg-card p-6">
            <h2 className="text-xl font-bold">Shipping Address</h2>
            {selectedAddress ? (
              <div className="rounded-lg border bg-primary/5 p-3">
                <p className="font-medium">{selectedAddress.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.region}{' '}
                  {selectedAddress.postalCode}
                </p>
                <p className="text-sm text-muted-foreground">{selectedAddress.phoneNumber}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No saved addresses.</p>
            )}
            <Button variant="outline" className="w-full gap-2" onClick={() => setAddressDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Manage Addresses
            </Button>
          </div>

          <div className="space-y-3 rounded-lg border bg-card p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Banknote className="h-5 w-5" /> Payment Method
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map(method => (
                <label
                  key={method.code}
                  className={`rounded-lg border p-4 ${
                    method.enabled ? 'cursor-pointer border-primary bg-primary/5' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.code}
                      checked={method.code === ENABLED_PAYMENT_METHOD}
                      disabled={!method.enabled}
                      readOnly
                      className="mt-1"
                    />
                    <span className="flex-1">
                      <span className="flex items-center justify-between gap-2 font-medium">
                        {method.name}
                        {!method.enabled && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Coming soon</span>
                        )}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{method.description}</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

        </div>

        <div className="space-y-4">
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <h2 className="text-xl font-bold">Total</h2>
            <div className="space-y-2 text-sm">
              {[...sellerGroups.entries()].map(([sellerId, items]) => {
                const subtotal = items.reduce((sum, item) => {
                  const price = item.variant.discountedPrice ?? item.variant.price;
                  return sum + price * item.quantity;
                }, 0);
                const courier = COURIERS.find(option => option.code === selectedCouriers[sellerId]);
                return (
                  <div key={sellerId} className="space-y-1 border-b pb-2 last:border-0">
                    <div className="flex justify-between">
                      <span>{items[0].variant.product.seller.storeName}</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{courier?.name ?? 'No courier'}</span>
                      <span>${(courier?.fee ?? 0).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between border-t pt-3 text-lg font-bold">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Button
            type="button"
            disabled={
              !selectedAddressId ||
              !hasAllShippingSelections ||
              shopsWithoutShipping.length > 0 ||
              checkoutMutation.isPending ||
              grandTotal <= 0
            }
            aria-busy={checkoutMutation.isPending}
            className="w-full py-6 text-lg"
            onClick={() => {
              if (!selectedAddressId || !hasAllShippingSelections) return;
              checkoutMutation.mutate({
                addressId: selectedAddressId,
                cartItemIds: cartItems.map(item => item.id),
                paymentMethod: ENABLED_PAYMENT_METHOD,
                shipments: [...sellerGroups.keys()].map(sellerId => ({
                  sellerId,
                  courierCode: selectedCouriers[sellerId],
                })),
              });
            }}
          >
            {checkoutMutation.isPending ? 'Placing order…' : `Place COD Order — $${grandTotal.toFixed(2)}`}
          </Button>
        </div>
      </div>

      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Addresses</DialogTitle>
          </DialogHeader>
          {addresses.length > 0 && (
            <div className="mb-4 space-y-3">
              <p className="text-sm text-muted-foreground">Select a shipping address:</p>
              {addresses.map(address => (
                <label
                  key={address.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${address.id === selectedAddressId ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                >
                  <input
                    type="radio"
                    name="checkout-address"
                    checked={address.id === selectedAddressId}
                    onChange={() => {
                      setSelectedAddressId(address.id);
                      setAddressDialogOpen(false);
                    }}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-medium">{address.fullName}</span>
                    <span className="block text-sm text-muted-foreground">
                      {address.street}, {address.city}, {address.region} {address.postalCode}
                    </span>
                    <span className="block text-sm text-muted-foreground">{address.phoneNumber}</span>
                  </span>
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
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddressForm onCancel={() => setShowAdd(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutPageClient;
