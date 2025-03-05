-- AlterEnum
ALTER TYPE "PAYMENT_TYPE" ADD VALUE 'CASH_ON_DELIVERY';

-- AlterTable
ALTER TABLE "PaymentMethods" ADD COLUMN     "email" TEXT;
