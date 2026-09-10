-- Preserve the delivery address used when an order is placed, even if the saved address changes later.
ALTER TABLE "order_group"
ADD COLUMN "paymentMethod" TEXT,
ADD COLUMN "shippingFullName" TEXT,
ADD COLUMN "shippingPhoneNumber" TEXT,
ADD COLUMN "shippingRegion" TEXT,
ADD COLUMN "shippingCity" TEXT,
ADD COLUMN "shippingPostalCode" TEXT,
ADD COLUMN "shippingStreet" TEXT;

-- Default Philippine courier choices. Prices use the storefront's existing USD currency.
INSERT INTO "shipping_method" ("id", "name", "description", "price", "estimatedDays", "isActive")
SELECT gen_random_uuid(), 'J&T Express', 'Nationwide tracked delivery', 3.99, 3, true
WHERE NOT EXISTS (SELECT 1 FROM "shipping_method" WHERE "name" = 'J&T Express');

INSERT INTO "shipping_method" ("id", "name", "description", "price", "estimatedDays", "isActive")
SELECT gen_random_uuid(), 'Ninja Van', 'Door-to-door standard delivery', 4.49, 3, true
WHERE NOT EXISTS (SELECT 1 FROM "shipping_method" WHERE "name" = 'Ninja Van');

INSERT INTO "shipping_method" ("id", "name", "description", "price", "estimatedDays", "isActive")
SELECT gen_random_uuid(), 'Flash Express', 'Tracked express delivery', 4.99, 2, true
WHERE NOT EXISTS (SELECT 1 FROM "shipping_method" WHERE "name" = 'Flash Express');

INSERT INTO "shipping_method" ("id", "name", "description", "price", "estimatedDays", "isActive")
SELECT gen_random_uuid(), 'LBC Express', 'Priority nationwide delivery', 6.99, 1, true
WHERE NOT EXISTS (SELECT 1 FROM "shipping_method" WHERE "name" = 'LBC Express');
