-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "totalDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "discount" SET DEFAULT 0;
