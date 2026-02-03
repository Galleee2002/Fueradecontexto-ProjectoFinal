-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "mpMerchantOrder" TEXT,
ADD COLUMN     "mpPaymentId" TEXT,
ADD COLUMN     "mpPaymentType" TEXT,
ADD COLUMN     "mpPreferenceId" TEXT,
ADD COLUMN     "mpStatus" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Order_mpPaymentId_idx" ON "Order"("mpPaymentId");
