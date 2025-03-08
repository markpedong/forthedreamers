/*
  Warnings:

  - You are about to drop the `Sellers` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "USER_ROLE" ADD VALUE 'SELLER';

-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_sellerID_fkey";

-- DropTable
DROP TABLE "Sellers";

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
