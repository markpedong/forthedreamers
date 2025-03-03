/*
  Warnings:

  - Added the required column `firstName` to the `Addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Addresses" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL;
