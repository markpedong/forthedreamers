/*
  Warnings:

  - You are about to drop the column `discountType` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `discountValue` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Products_discountType_idx";

-- DropIndex
DROP INDEX "Products_price_idx";

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "discountType",
DROP COLUMN "discountValue",
DROP COLUMN "price",
DROP COLUMN "stock";

-- CreateTable
CREATE TABLE "Variations" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "stock" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discountedPrice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "productsId" UUID,

    CONSTRAINT "Variations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Variations" ADD CONSTRAINT "Variations_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
