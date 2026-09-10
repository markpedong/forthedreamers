import 'server-only';

import type { z } from 'zod';
import prisma from '@/lib/prisma';
import { addressSchema, addressUpdateSchema } from '@/hooks/form-schemas';

type AddressInput = z.infer<typeof addressSchema>;
type AddressUpdateInput = z.infer<typeof addressUpdateSchema>;

export const getUserAddresses = (userId: string) =>
  prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    omit: { createdAt: true, updatedAt: true, userId: true },
  });

export const createAddress = (userId: string, values: AddressInput) =>
  prisma.$transaction(async tx => {
    await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    return tx.address.create({
      data: { ...values, label: values.label || null, isDefault: true, userId },
      omit: { createdAt: true, updatedAt: true, userId: true },
    });
  });

export const updateAddress = (userId: string, values: AddressUpdateInput) =>
  prisma.$transaction(async tx => {
    const existing = await tx.address.findFirst({ where: { id: values.id, userId } });
    if (!existing) throw new Error('Address not found or unauthorized');
    const { id, ...data } = values;
    const isDefault = data.isDefault || existing.isDefault;
    if (isDefault) {
      await tx.address.updateMany({ where: { userId, isDefault: true, id: { not: id } }, data: { isDefault: false } });
    }
    return tx.address.update({
      where: { id },
      data: { ...data, label: data.label || null, isDefault },
      omit: { createdAt: true, updatedAt: true, userId: true },
    });
  });

export const deleteAddress = (userId: string, id: string) =>
  prisma.$transaction(async tx => {
    const existing = await tx.address.findFirst({ where: { id, userId } });
    if (!existing) throw new Error('Address not found or unauthorized');
    await tx.address.delete({ where: { id: existing.id } });
    let defaultAddressId: string | null = null;
    if (existing.isDefault) {
      const replacement = await tx.address.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        select: { id: true },
      });
      if (replacement) {
        await tx.address.update({ where: { id: replacement.id }, data: { isDefault: true } });
        defaultAddressId = replacement.id;
      }
    }
    return { success: true, defaultAddressId };
  });

export const setDefaultAddress = (userId: string, id: string) =>
  prisma.$transaction(async tx => {
    await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    const [address] = await tx.address.updateManyAndReturn({
      where: { id, userId },
      data: { isDefault: true },
      omit: { createdAt: true, updatedAt: true, userId: true },
    });
    if (!address) throw new Error('Address not found or unauthorized');
    return address;
  });

export const getUserAccounts = (userId: string) =>
  prisma.account.findMany({
    where: { userId },
    select: { id: true, accountId: true, providerId: true, createdAt: true },
  });
