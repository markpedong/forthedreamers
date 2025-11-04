/*
  Warnings:

  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `spec` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."product" DROP CONSTRAINT "product_categoryId_fkey";

-- AlterTable
ALTER TABLE "category" DROP CONSTRAINT "category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "category_id_seq";

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "status" SET DEFAULT 'INACTIVE',
ALTER COLUMN "categoryId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "spec" DROP CONSTRAINT "spec_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "spec_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "spec_id_seq";

-- CreateIndex
CREATE INDEX "account_createdAt_idx" ON "account"("createdAt");

-- CreateIndex
CREATE INDEX "account_updatedAt_idx" ON "account"("updatedAt");

-- CreateIndex
CREATE INDEX "address_createdAt_idx" ON "address"("createdAt");

-- CreateIndex
CREATE INDEX "address_updatedAt_idx" ON "address"("updatedAt");

-- CreateIndex
CREATE INDEX "cart_addedAt_idx" ON "cart"("addedAt");

-- CreateIndex
CREATE INDEX "category_createdAt_idx" ON "category"("createdAt");

-- CreateIndex
CREATE INDEX "category_updatedAt_idx" ON "category"("updatedAt");

-- CreateIndex
CREATE INDEX "order_createdAt_idx" ON "order"("createdAt");

-- CreateIndex
CREATE INDEX "order_updatedAt_idx" ON "order"("updatedAt");

-- CreateIndex
CREATE INDEX "order_group_createdAt_idx" ON "order_group"("createdAt");

-- CreateIndex
CREATE INDEX "order_item_createdAt_idx" ON "order_item"("createdAt");

-- CreateIndex
CREATE INDEX "passkey_createdAt_idx" ON "passkey"("createdAt");

-- CreateIndex
CREATE INDEX "product_createdAt_idx" ON "product"("createdAt");

-- CreateIndex
CREATE INDEX "product_updatedAt_idx" ON "product"("updatedAt");

-- CreateIndex
CREATE INDEX "review_createdAt_idx" ON "review"("createdAt");

-- CreateIndex
CREATE INDEX "seller_createdAt_idx" ON "seller"("createdAt");

-- CreateIndex
CREATE INDEX "seller_updatedAt_idx" ON "seller"("updatedAt");

-- CreateIndex
CREATE INDEX "session_createdAt_idx" ON "session"("createdAt");

-- CreateIndex
CREATE INDEX "session_updatedAt_idx" ON "session"("updatedAt");

-- CreateIndex
CREATE INDEX "spec_createdAt_idx" ON "spec"("createdAt");

-- CreateIndex
CREATE INDEX "spec_updatedAt_idx" ON "spec"("updatedAt");

-- CreateIndex
CREATE INDEX "user_createdAt_idx" ON "user"("createdAt");

-- CreateIndex
CREATE INDEX "user_updatedAt_idx" ON "user"("updatedAt");

-- CreateIndex
CREATE INDEX "variant_createdAt_idx" ON "variant"("createdAt");

-- CreateIndex
CREATE INDEX "variant_updatedAt_idx" ON "variant"("updatedAt");

-- CreateIndex
CREATE INDEX "variant_option_createdAt_idx" ON "variant_option"("createdAt");

-- CreateIndex
CREATE INDEX "variant_option_updatedAt_idx" ON "variant_option"("updatedAt");

-- CreateIndex
CREATE INDEX "verification_createdAt_idx" ON "verification"("createdAt");

-- CreateIndex
CREATE INDEX "verification_updatedAt_idx" ON "verification"("updatedAt");

-- CreateIndex
CREATE INDEX "wishlist_addedAt_idx" ON "wishlist"("addedAt");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
