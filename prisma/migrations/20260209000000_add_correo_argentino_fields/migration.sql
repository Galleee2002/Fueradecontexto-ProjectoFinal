-- AlterTable: Add shipping dimensions to Product
ALTER TABLE "Product" ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "length" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION,
ADD COLUMN     "width" DOUBLE PRECISION;

-- AlterTable: Add Correo Argentino fields to Order
ALTER TABLE "Order" ADD COLUMN     "caDeliveredAt" TIMESTAMP(3),
ADD COLUMN     "caEstimatedDays" INTEGER,
ADD COLUMN     "caLabelUrl" TEXT,
ADD COLUMN     "caPackageWeight" DOUBLE PRECISION,
ADD COLUMN     "caServiceName" TEXT,
ADD COLUMN     "caServiceType" TEXT,
ADD COLUMN     "caShippedAt" TIMESTAMP(3),
ADD COLUMN     "caTrackingNumber" TEXT;

-- CreateIndex
CREATE INDEX "Order_caTrackingNumber_idx" ON "Order"("caTrackingNumber");
