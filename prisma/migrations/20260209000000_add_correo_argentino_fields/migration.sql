-- AlterTable: Add shipping dimensions to Product
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "height" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "length" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "weight" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "width" DOUBLE PRECISION;

-- AlterTable: Add Correo Argentino fields to Order
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "caDeliveredAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "caEstimatedDays" INTEGER,
ADD COLUMN IF NOT EXISTS "caLabelUrl" TEXT,
ADD COLUMN IF NOT EXISTS "caPackageWeight" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "caServiceName" TEXT,
ADD COLUMN IF NOT EXISTS "caServiceType" TEXT,
ADD COLUMN IF NOT EXISTS "caShippedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "caTrackingNumber" TEXT;

-- CreateIndex (only if not exists)
CREATE INDEX IF NOT EXISTS "Order_caTrackingNumber_idx" ON "Order"("caTrackingNumber");
