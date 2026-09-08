'use client';

import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MapPin, Trash2, Star, Pencil, Plus } from 'lucide-react';
import { createAddress, deleteAddress, setDefaultAddress, updateAddress } from '@/lib/http';
import { useRouter } from 'next/navigation';
import AlertDialog from '@/components/reusable/alert-dialog';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import formSchemas from '@/hooks/form-schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SchemaForm } from '@/lib/types';
import { useMutation } from '@tanstack/react-query';

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
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const { addressSchema } = formSchemas;
  const mutation = useMutation({
    mutationFn: ({ operation, input }: { operation: 'create' | 'update' | 'delete' | 'default'; input: unknown }) => {
      if (operation === 'create') return createAddress(input);
      if (operation === 'update') return updateAddress(input);
      if (operation === 'delete') return deleteAddress(input as string);
      return setDefaultAddress(input as string);
    },
    onSuccess: (_result, { operation }) => {
      toast.success(
        operation === 'create'
          ? 'Address added'
          : operation === 'update'
            ? 'Address updated'
            : operation === 'delete'
              ? 'Address deleted'
              : 'Default address updated'
      );
      if (operation === 'create' || operation === 'update') setShowDialog(false);
      router.refresh();
    },
    onError: error => toast.error(error.message),
  });
  const isPending = mutation.isPending;

  const form = useForm<SchemaForm<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      street: '',
      city: '',
      region: '',
      postalCode: '',
      label: '',
      type: 'HOME',
      isDefault: false,
    },
  });

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    form.reset({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      street: address.street,
      city: address.city,
      region: address.region,
      postalCode: address.postalCode,
      label: address.label || '',
      type: address.type,
      isDefault: address.isDefault,
    });
    setShowDialog(true);
  };

  const openAddDialog = () => {
    setEditingAddress(null);
    form.reset({
      fullName: '',
      phoneNumber: '',
      street: '',
      city: '',
      region: '',
      postalCode: '',
      label: '',
      type: 'HOME',
      isDefault: false,
    });
    setShowDialog(true);
  };

  const onSubmit = (values: SchemaForm<typeof addressSchema>) => {
    mutation.mutate({
      operation: editingAddress ? 'update' : 'create',
      input: editingAddress ? { ...values, id: editingAddress.id } : values,
    });
  };

  const handleDelete = (addressId: string) => {
    mutation.mutate({ operation: 'delete', input: addressId });
  };

  const handleSetDefault = (addressId: string) => {
    mutation.mutate({ operation: 'default', input: addressId });
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
          {addresses.length === 0 ? (
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
              {addresses.map(address => (
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

      <AlertDialog
        open={showDialog}
        onOpenChange={open => {
          if (!open) setShowDialog(false);
        }}
        title={editingAddress ? 'Edit address' : 'Add address'}
        description={editingAddress ? 'Update your delivery address details.' : 'Enter your delivery address details.'}
        confirmText={editingAddress ? 'Save changes' : 'Add address'}
        loading={isPending}
        onConfirm={form.handleSubmit(onSubmit)}
        onCancel={() => {
          setShowDialog(false);
          form.reset();
        }}
      >
        <Form form={form} onSubmit={onSubmit} customSubmitButton>
          <Input control={form.control} name="fullName" label="Full name" placeholder="Juan Dela Cruz" />
          <Input control={form.control} name="phoneNumber" label="Phone number" placeholder="+63 912 345 6789" />
          <Input
            control={form.control}
            name="street"
            label="Street / Barangay"
            placeholder="123 Rizal St, Brgy. San Antonio"
          />
          <Input control={form.control} name="city" label="City / Municipality" placeholder="Quezon City" />
          <Input control={form.control} name="region" label="Province" placeholder="Metro Manila" />
          <Input control={form.control} name="postalCode" label="Postal code" placeholder="1100" />
          <Input control={form.control} name="label" label="Label (optional)" placeholder="Home, Office, etc." />
        </Form>
      </AlertDialog>
    </>
  );
};

export default AddressesSection;
