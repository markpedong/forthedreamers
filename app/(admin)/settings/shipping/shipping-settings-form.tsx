'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { COURIERS, type CourierCode } from '@/constants/shipping';
import { Button } from '@/components/reusable/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateSellerShippingMutation } from '@/services/useMutation';

export default function ShippingSettingsForm({ initialCourierCodes }: { initialCourierCodes: string[] }) {
  const initial = COURIERS.filter(courier => initialCourierCodes.includes(courier.code)).map(courier => courier.code);
  const [savedCodes, setSavedCodes] = useState<CourierCode[]>(initial);
  const [selectedCodes, setSelectedCodes] = useState<CourierCode[]>(initial);
  const mutation = useUpdateSellerShippingMutation();

  return (
    <div className="space-y-5 rounded-xl border bg-card p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {COURIERS.map(courier => {
          const selected = selectedCodes.includes(courier.code);
          return (
            <label key={courier.code} className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
              <Checkbox
                checked={selected}
                disabled={mutation.isPending}
                onCheckedChange={checked => {
                  if (!checked && selectedCodes.length === 1) {
                    toast.error('At least one courier must stay enabled');
                    return;
                  }
                  setSelectedCodes(
                    checked
                      ? [...selectedCodes, courier.code]
                      : selectedCodes.filter(code => code !== courier.code)
                  );
                }}
              />
              <span>
                <span className="block font-medium">{courier.name}</span>
                <span className="text-sm text-muted-foreground">Fixed fee: ${courier.fee.toFixed(2)}</span>
              </span>
            </label>
          );
        })}
      </div>

      <Button
        loading={mutation.isPending}
        disabled={selectedCodes.length === 0}
        title="Save shipping settings"
        onClick={() =>
          mutation.mutate(selectedCodes, {
            onSuccess: result => {
              const next = (result.data?.courierCodes ?? selectedCodes) as CourierCode[];
              setSavedCodes(next);
              setSelectedCodes(next);
            },
            onError: () => setSelectedCodes(savedCodes),
          })
        }
      />
    </div>
  );
}
