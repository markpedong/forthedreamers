'use client';

import { FC, startTransition, useOptimistic, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trash2, Star, Pencil, Plus } from 'lucide-react';
import AddressForm from '@/components/reusable/address-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAddressMutation } from '@/services/useMutation';

type Address = {
  id: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  label?: string | null;
  fullName: string;
  phoneNumber: string;
  region: string;
  city: string;
  postalCode: string;
  street: string;
  isDefault: boolean;
};

type AddressesSectionProps = {
  addresses: Address[];
};

const AddressesSection: FC<AddressesSectionProps> = ({ addresses }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const mutation = useAddressMutation(() => undefined);
  const [optimisticAddresses, setOptimisticDefault] = useOptimistic(addresses, (current, addressId: string) =>
    current.map(address => ({ ...address, isDefault: address.id === addressId }))
  );
  const isPending = mutation.isPending;

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setShowDialog(true);
  };

  const openAddDialog = () => {
    setEditingAddress(null);
    setShowDialog(true);
  };

  const handleDelete = (addressId: string) => {
    mutation.mutate({ operation: 'delete', input: addressId });
  };

  const handleSetDefault = (addressId: string) => {
    startTransition(async () => {
      setOptimisticDefault(addressId);
      await mutation.mutateAsync({ operation: 'default', input: addressId }).catch(() => undefined);
    });
  };

  const typeLabels: Record<Address['type'], string> = {
    HOME: 'Home',
    WORK: 'Work',
    OTHER: 'Other',
  };

  return (
    <>
      <Card className="shadow-none">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Saved addresses</CardTitle>
              <CardDescription>Your delivery addresses from completed checkout details.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={openAddDialog} disabled={isPending} className="gap-2">
              <Plus className="h-4 w-4" /> Add address
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {optimisticAddresses.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <MapPin className="mx-auto mb-3 h-10 w-10 opacity-40" />
              <p className="font-medium">You haven&apos;t added an address yet</p>
              <p className="mt-1 text-sm">Add your first delivery address to use at checkout.</p>
              <Button variant="outline" size="sm" onClick={openAddDialog} className="mt-4 gap-2">
                <Plus className="h-4 w-4" /> Add address
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {optimisticAddresses.map(address => (
                <div
                  key={address.id}
                  className={`flex min-h-52 flex-col justify-between rounded-lg border p-5 ${
                    address.isDefault ? 'border-primary/50 bg-primary/5' : 'border-border'
                  }`}
                >
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{address.label || typeLabels[address.type]}</Badge>
                      {address.isDefault && <Badge>Default</Badge>}
                    </div>
                    <p className="font-medium text-foreground">{address.fullName}</p>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.region} {address.postalCode}
                      </p>
                      <p>{address.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(address)}
                      disabled={isPending}
                      className="gap-2"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        disabled={isPending}
                        className="gap-2"
                      >
                        <Star className="h-3.5 w-3.5" /> Set as default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      disabled={isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          <AddressForm
            key={editingAddress?.id ?? 'new'}
            address={editingAddress ?? undefined}
            onCancel={() => setShowDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddressesSection;
