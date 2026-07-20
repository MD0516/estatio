-- DropIndex
DROP INDEX "properties_city_type_price_idx";

-- CreateIndex
CREATE INDEX "properties_listingType_idx" ON "properties"("listingType");

-- CreateIndex
CREATE INDEX "properties_city_type_listingType_price_idx" ON "properties"("city", "type", "listingType", "price");
