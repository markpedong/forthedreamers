-- CreateTable
CREATE TABLE IF NOT EXISTS "shipping_method" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "estimatedDays" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "regions" JSONB,
    CONSTRAINT "shipping_method_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "shippingFee" DOUBLE PRECISION,
ADD COLUMN "shippingMethodId" TEXT;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "shipping_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;
