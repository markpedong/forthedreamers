/*
  Warnings:

  - Added the required column `city` to the `Addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Addresses" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT;
