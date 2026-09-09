CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "product_name_trgm_idx" ON "product" USING GIN ("name" gin_trgm_ops);
CREATE INDEX "product_description_trgm_idx" ON "product" USING GIN ("description" gin_trgm_ops);

CREATE INDEX "review_product_published_created_idx"
ON "review"("productId", "isPublished", "createdAt", "id");

CREATE INDEX "review_product_published_rating_created_idx"
ON "review"("productId", "isPublished", "rating", "createdAt", "id");

UPDATE "product" SET "sold" = 0;

UPDATE "product" AS product
SET "sold" = totals.quantity
FROM (
  SELECT variant."productId", SUM(item."quantity")::integer AS quantity
  FROM "order_item" AS item
  JOIN "variant" AS variant ON variant."id" = item."variantId"
  JOIN "order" AS customer_order ON customer_order."id" = item."orderId"
  LEFT JOIN "order_group" AS order_group ON order_group."id" = customer_order."orderGroupId"
  WHERE customer_order."status" IN ('PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED')
    AND (customer_order."orderGroupId" IS NULL OR order_group."paymentStatus" = 'PAID')
  GROUP BY variant."productId"
) AS totals
WHERE product."id" = totals."productId";
