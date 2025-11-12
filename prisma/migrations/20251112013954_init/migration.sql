/*
  Warnings:

  - The values [DRAFT] on the enum `PRODUCT_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PRODUCT_STATUS_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "public"."product" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "product" ALTER COLUMN "status" TYPE "PRODUCT_STATUS_new" USING ("status"::text::"PRODUCT_STATUS_new");
ALTER TYPE "PRODUCT_STATUS" RENAME TO "PRODUCT_STATUS_old";
ALTER TYPE "PRODUCT_STATUS_new" RENAME TO "PRODUCT_STATUS";
DROP TYPE "public"."PRODUCT_STATUS_old";
ALTER TABLE "product" ALTER COLUMN "status" SET DEFAULT 'INACTIVE';
COMMIT;
