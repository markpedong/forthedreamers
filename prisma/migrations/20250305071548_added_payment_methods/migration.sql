-- CreateEnum
CREATE TYPE "PAYMENT_TYPE" AS ENUM ('VISA', 'MASTERCARD', 'PAYPAL', 'APPLEPAY');

-- CreateTable
CREATE TABLE "PaymentMethods" (
    "id" UUID NOT NULL,
    "type" "PAYMENT_TYPE" NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "expiryDate" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY ("id")
);
