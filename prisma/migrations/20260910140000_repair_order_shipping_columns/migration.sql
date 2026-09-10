-- Repair databases where the shipping migration was recorded but these order columns are absent.
ALTER TABLE "order"
ADD COLUMN IF NOT EXISTS "shippingFee" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "shippingMethodId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'order_shippingMethodId_fkey'
      AND conrelid = '"order"'::regclass
  ) THEN
    ALTER TABLE "order"
    ADD CONSTRAINT "order_shippingMethodId_fkey"
    FOREIGN KEY ("shippingMethodId") REFERENCES "shipping_method"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
