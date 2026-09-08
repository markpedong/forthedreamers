-- Add composite indexes for query optimization
CREATE INDEX "product_status_created_idx" ON "product"("status", "createdAt", "id");
CREATE INDEX "product_status_category_rating_idx" ON "product"("status", "categoryId", "rating");
CREATE INDEX "product_status_seller_created_idx" ON "product"("status", "sellerId", "createdAt");
CREATE INDEX "order_created_status_idx" ON "order"("createdAt", "status");
