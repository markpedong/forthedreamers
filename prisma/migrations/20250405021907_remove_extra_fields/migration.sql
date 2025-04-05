/*
  Warnings:

  - You are about to drop the column `addressesId` on the `Orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_addressesId_fkey";

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "addressesId";

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "Addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
