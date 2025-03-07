/*
  Warnings:

  - Added the required column `sellerID` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "sellerID" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Sellers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Sellers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sellers_email_key" ON "Sellers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sellers_phoneNumber_key" ON "Sellers"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "Sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
