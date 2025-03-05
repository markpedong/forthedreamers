/*
  Warnings:

  - You are about to drop the column `lastFourDigits` on the `PaymentMethods` table. All the data in the column will be lost.
  - Added the required column `cardNumber` to the `PaymentMethods` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentMethods" DROP COLUMN "lastFourDigits",
ADD COLUMN     "cardNumber" TEXT NOT NULL;
