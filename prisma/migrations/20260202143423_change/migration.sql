/*
  Warnings:

  - The `status` column on the `OrderItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OrderItemStatus" AS ENUM ('PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'PARTIALLY_SHIPPED';
ALTER TYPE "OrderStatus" ADD VALUE 'PARTIALLY_DELIVERED';
ALTER TYPE "OrderStatus" ADD VALUE 'PARTIALLY_CANCELLED';

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "status",
ADD COLUMN     "status" "OrderItemStatus" NOT NULL DEFAULT 'PLACED';
