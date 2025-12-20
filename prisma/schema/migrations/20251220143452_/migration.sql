-- DropIndex
DROP INDEX "public"."customerCoupons_customerId_couponId_key";

-- AlterTable
ALTER TABLE "customerCoupons" ADD COLUMN     "orderId" TEXT;

-- AddForeignKey
ALTER TABLE "customerCoupons" ADD CONSTRAINT "customerCoupons_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
