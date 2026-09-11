'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Button as LoadingButton } from '@/components/reusable/button';
import FormField from '@/components/reusable/form-field';
import { addressSchema } from '@/hooks/form-schemas';
import type { SchemaForm } from '@/lib/types';
import { useAddressMutation } from '@/services/useMutation';

type AddressFormAddress = Omit<SchemaForm<typeof addressSchema>, 'label'> & {
  id: string;
  label?: string | null;
};

const AddressForm = ({ address, onCancel }: { address?: AddressFormAddress; onCancel: () => void }) => {
  const mutation = useAddressMutation(() => onCancel());
  const isPending = mutation.isPending;
  const form = useForm<SchemaForm<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: address?.fullName ?? '',
      phoneNumber: address?.phoneNumber ?? '',
      street: address?.street ?? '',
      city: address?.city ?? '',
      region: address?.region ?? '',
      postalCode: address?.postalCode ?? '',
      label: address?.label ?? '',
      type: address?.type ?? 'HOME',
      isDefault: address?.isDefault ?? false,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (values: SchemaForm<typeof addressSchema>) => {
    mutation.mutate({
      operation: address ? 'update' : 'create',
      input: address ? { ...values, id: address.id } : values,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 border-t pt-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField {...register('fullName')} id="address-fullName" label="Full name" error={errors.fullName?.message} placeholder="Juan Dela Cruz" disabled={isPending} />
        <FormField {...register('phoneNumber')} id="address-phoneNumber" label="Phone number" error={errors.phoneNumber?.message} placeholder="+63 912 345 6789" disabled={isPending} />
        <FormField {...register('street')} id="address-street" label="Street / Barangay" error={errors.street?.message} placeholder="123 Rizal St, Brgy. San Antonio" disabled={isPending} />
        <FormField {...register('city')} id="address-city" label="City / Municipality" error={errors.city?.message} placeholder="Quezon City" disabled={isPending} />
        <FormField {...register('region')} id="address-region" label="Province" error={errors.region?.message} placeholder="Metro Manila" disabled={isPending} />
        <FormField {...register('postalCode')} id="address-postalCode" label="Postal code" error={errors.postalCode?.message} placeholder="1100" disabled={isPending} />
      </div>
      <FormField {...register('label')} id="address-label" label="Label (optional)" error={errors.label?.message} placeholder="Home, Office, etc." disabled={isPending} />

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton type="submit" className="flex-1" loading={isPending} title={address ? 'Save Changes' : 'Add Address'} />
      </div>
    </form>
  );
};

export default AddressForm;
