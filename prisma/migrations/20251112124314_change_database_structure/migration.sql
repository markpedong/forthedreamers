/*
  Warnings:

  - You are about to drop the column `shippingFee` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `taxAmount` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `totalForSeller` on the `order` table. All the data in the column will be lost.
  - The `status` column on the `order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `variantOptionId` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `review` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `variantOptionId` on the `review` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `review` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `isRequired` on the `variant` table. All the data in the column will be lost.
  - You are about to drop the `cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `variant_option` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `total` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attributes` to the `variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `variant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_productId_fkey";

-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_variantOptionId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_orderGroupId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_productId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_variantOptionId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_variantOptionId_fkey";

-- DropForeignKey
ALTER TABLE "variant_option" DROP CONSTRAINT "variant_option_variantId_fkey";

-- DropIndex
DROP INDEX "order_createdAt_idx";

-- DropIndex
DROP INDEX "order_orderGroupId_idx";

-- DropIndex
DROP INDEX "order_orderGroupId_sellerId_idx";

-- DropIndex
DROP INDEX "order_sellerId_idx";

-- DropIndex
DROP INDEX "order_sellerId_status_idx";

-- DropIndex
DROP INDEX "order_updatedAt_idx";

-- DropIndex
DROP INDEX "order_item_createdAt_idx";

-- DropIndex
DROP INDEX "order_item_productId_idx";

-- DropIndex
DROP INDEX "order_item_productId_orderId_idx";

-- DropIndex
DROP INDEX "order_item_variantOptionId_idx";

-- DropIndex
DROP INDEX "review_createdAt_idx";

-- DropIndex
DROP INDEX "review_variantOptionId_idx";

-- DropIndex
DROP INDEX "variant_createdAt_idx";

-- DropIndex
DROP INDEX "variant_productId_isRequired_idx";

-- DropIndex
DROP INDEX "variant_updatedAt_idx";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "shippingFee",
DROP COLUMN "subtotal",
DROP COLUMN "taxAmount",
DROP COLUMN "totalForSeller",
ADD COLUMN     "coupon" TEXT,
ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "orderGroupId" DROP NOT NULL,
ALTER COLUMN "sellerId" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "order_item" DROP COLUMN "variantOptionId",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "variantId" TEXT NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "review" DROP COLUMN "review",
DROP COLUMN "variantOptionId",
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "variantId" TEXT,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "variant" DROP COLUMN "isRequired",
ADD COLUMN     "attributes" JSONB NOT NULL,
ADD COLUMN     "coupon" TEXT,
ADD COLUMN     "discountedPrice" DOUBLE PRECISION,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL;

-- DropTable
DROP TABLE "cart";

-- DropTable
DROP TABLE "variant_option";

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CartItem_userId_idx" ON "CartItem"("userId");

-- CreateIndex
CREATE INDEX "CartItem_variantId_idx" ON "CartItem"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_userId_variantId_key" ON "CartItem"("userId", "variantId");

-- CreateIndex
CREATE INDEX "order_userId_idx" ON "order"("userId");

-- CreateIndex
CREATE INDEX "order_status_idx" ON "order"("status");

-- CreateIndex
CREATE INDEX "order_coupon_idx" ON "order"("coupon");

-- CreateIndex
CREATE INDEX "order_item_variantId_idx" ON "order_item"("variantId");

-- CreateIndex
CREATE INDEX "order_item_couponUsed_idx" ON "order_item"("couponUsed");

-- CreateIndex
CREATE INDEX "review_variantId_idx" ON "review"("variantId");

-- CreateIndex
CREATE INDEX "variant_productId_idx" ON "variant"("productId");

-- CreateIndex
CREATE INDEX "variant_price_idx" ON "variant"("price");

-- CreateIndex
CREATE INDEX "variant_discountedPrice_idx" ON "variant"("discountedPrice");

-- CreateIndex
CREATE INDEX "variant_stock_idx" ON "variant"("stock");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_orderGroupId_fkey" FOREIGN KEY ("orderGroupId") REFERENCES "order_group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
