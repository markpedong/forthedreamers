-- AlterTable
ALTER TABLE "PaymentMethods" ALTER COLUMN "expiryDate" DROP NOT NULL,
ALTER COLUMN "cardNumber" DROP NOT NULL;
