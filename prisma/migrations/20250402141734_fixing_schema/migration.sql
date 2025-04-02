/*
  Warnings:

  - You are about to drop the column `orderId` on the `OrderItems` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `ordersId` to the `OrderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressID` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_orderId_fkey";

-- DropIndex
DROP INDEX "OrderItems_orderId_idx";

-- DropIndex
DROP INDEX "OrderItems_orderId_productId_key";

-- AlterTable
ALTER TABLE "OrderItems" DROP COLUMN "orderId",
ADD COLUMN     "ordersId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "date",
ADD COLUMN     "addressID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_ordersId_fkey" FOREIGN KEY ("ordersId") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
