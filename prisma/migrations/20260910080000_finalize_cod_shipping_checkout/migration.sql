-- Preserve the delivery address used when an order is placed, even if the saved address changes later.
ALTER TABLE "order_group"
ADD COLUMN "paymentMethod" TEXT,
ADD COLUMN "shippingFullName" TEXT,
ADD COLUMN "shippingPhoneNumber" TEXT,
ADD COLUMN "shippingRegion" TEXT,
ADD COLUMN "shippingCity" TEXT,
ADD COLUMN "shippingPostalCode" TEXT,
ADD COLUMN "shippingStreet" TEXT;

-- Stable courier codes support seller-level availability. The application config remains
-- authoritative for runtime fees; these prices are retained only for legacy compatibility.
ALTER TABLE "shipping_method" ADD COLUMN "code" TEXT;

UPDATE "shipping_method" SET "code" = 'JNT'
WHERE "id" = (SELECT "id" FROM "shipping_method" WHERE "name" = 'J&T Express' ORDER BY "id" LIMIT 1);
UPDATE "shipping_method" SET "code" = 'NINJA_VAN'
WHERE "id" = (SELECT "id" FROM "shipping_method" WHERE "name" = 'Ninja Van' ORDER BY "id" LIMIT 1);
UPDATE "shipping_method" SET "code" = 'FLASH_EXPRESS'
WHERE "id" = (SELECT "id" FROM "shipping_method" WHERE "name" = 'Flash Express' ORDER BY "id" LIMIT 1);
UPDATE "shipping_method" SET "code" = 'LBC'
WHERE "id" = (SELECT "id" FROM "shipping_method" WHERE "name" = 'LBC Express' ORDER BY "id" LIMIT 1);

INSERT INTO "shipping_method" ("id", "code", "name", "description", "price", "estimatedDays", "isActive")
SELECT gen_random_uuid(), 'JNT', 'J&T Express', 'Nationwide tracked delivery', 3.99, 3, true
WHERE NOT EXISTS (SELECT 1 FROM "shipping_method" WHERE "code" = 'JNT');

INSERT INTO "shipping_method" ("id", "code", "name", "description", "price", "estimatedDays", "isActive")
SELECT gen_random_uuid(), 'NINJA_VAN', 'Ninja Van', 'Door-to-door standard delivery', 4.49, 3, true
WHERE NOT EXISTS (SELECT 1 FROM "shipping_method" WHERE "code" = 'NINJA_VAN');

INSERT INTO "shipping_method" ("id", "code", "name", "description", "price", "estimatedDays", "isActive")
SELECT gen_random_uuid(), 'FLASH_EXPRESS', 'Flash Express', 'Tracked express delivery', 4.99, 2, true
WHERE NOT EXISTS (SELECT 1 FROM "shipping_method" WHERE "code" = 'FLASH_EXPRESS');

INSERT INTO "shipping_method" ("id", "code", "name", "description", "price", "estimatedDays", "isActive")
SELECT gen_random_uuid(), 'LBC', 'LBC Express', 'Priority nationwide delivery', 6.99, 1, true
WHERE NOT EXISTS (SELECT 1 FROM "shipping_method" WHERE "code" = 'LBC');

UPDATE "shipping_method"
SET "name" = 'J&T Express', "description" = 'Nationwide tracked delivery', "price" = 3.99, "estimatedDays" = 3, "isActive" = true
WHERE "code" = 'JNT';
UPDATE "shipping_method"
SET "name" = 'Ninja Van', "description" = 'Door-to-door standard delivery', "price" = 4.49, "estimatedDays" = 3, "isActive" = true
WHERE "code" = 'NINJA_VAN';
UPDATE "shipping_method"
SET "name" = 'Flash Express', "description" = 'Tracked express delivery', "price" = 4.99, "estimatedDays" = 2, "isActive" = true
WHERE "code" = 'FLASH_EXPRESS';
UPDATE "shipping_method"
SET "name" = 'LBC Express', "description" = 'Priority nationwide delivery', "price" = 6.99, "estimatedDays" = 1, "isActive" = true
WHERE "code" = 'LBC';

UPDATE "shipping_method" SET "code" = 'LEGACY_' || "id" WHERE "code" IS NULL;
ALTER TABLE "shipping_method" ALTER COLUMN "code" SET NOT NULL;
CREATE UNIQUE INDEX "shipping_method_code_key" ON "shipping_method"("code");

CREATE TABLE "_SellerShippingMethods" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  CONSTRAINT "_SellerShippingMethods_A_fkey" FOREIGN KEY ("A") REFERENCES "seller"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "_SellerShippingMethods_B_fkey" FOREIGN KEY ("B") REFERENCES "shipping_method"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "_SellerShippingMethods_AB_unique" ON "_SellerShippingMethods"("A", "B");
CREATE INDEX "_SellerShippingMethods_B_index" ON "_SellerShippingMethods"("B");

-- Existing sellers start with every supported courier enabled.
INSERT INTO "_SellerShippingMethods" ("A", "B")
SELECT seller."id", method."id"
FROM "seller" seller
CROSS JOIN "shipping_method" method
WHERE method."code" IN ('JNT', 'NINJA_VAN', 'FLASH_EXPRESS', 'LBC');
