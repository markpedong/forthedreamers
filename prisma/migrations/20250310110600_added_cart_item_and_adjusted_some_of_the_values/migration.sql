/*
  Warnings:

  - You are about to drop the column `productsId` on the `Variations` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Variations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Variations" DROP CONSTRAINT "Variations_productsId_fkey";

-- AlterTable
ALTER TABLE "Variations" DROP COLUMN "productsId",
ADD COLUMN     "productId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Carts" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "variationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Carts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Variations" ADD CONSTRAINT "Variations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carts" ADD CONSTRAINT "Carts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carts" ADD CONSTRAINT "Carts_variationId_fkey" FOREIGN KEY ("variationId") REFERENCES "Variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carts" ADD CONSTRAINT "Carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
