import { redirect } from 'next/navigation';
import { USER_ROLE } from '@/generated/prisma';
import { getSessionUser } from '@/lib/auth';
import { getSellerShippingSettings } from '@/lib/services/seller';
import ShippingSettingsForm from './shipping-settings-form';

export default async function ShippingSettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect('/seller');
  if (user.role !== USER_ROLE.SELLER) redirect('/dashboard');

  const settings = await getSellerShippingSettings();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Shipping Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Choose the couriers available for orders from {settings.storeName}.
        </p>
      </div>
      <ShippingSettingsForm initialCourierCodes={settings.courierCodes} />
    </main>
  );
}
