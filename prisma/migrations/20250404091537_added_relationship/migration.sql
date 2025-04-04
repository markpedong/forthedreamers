/*
  Warnings:

  - The `addressID` column on the `Orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "addressesId" UUID,
DROP COLUMN "addressID",
ADD COLUMN     "addressID" UUID;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_addressesId_fkey" FOREIGN KEY ("addressesId") REFERENCES "Addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
