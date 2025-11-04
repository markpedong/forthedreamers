/*
  Warnings:

  - A unique constraint covering the columns `[storeName]` on the table `seller` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "seller_storeName_key" ON "seller"("storeName");
