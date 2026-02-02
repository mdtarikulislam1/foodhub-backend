/*
  Warnings:

  - You are about to drop the column `discount` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `discountEnd` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `discountStart` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_providerId_fkey";

-- DropIndex
DROP INDEX "Category_providerId_idx";

-- DropIndex
DROP INDEX "Category_providerId_name_key";

-- DropIndex
DROP INDEX "Category_providerId_slug_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "discount",
DROP COLUMN "discountEnd",
DROP COLUMN "discountStart",
DROP COLUMN "order",
DROP COLUMN "providerId",
ADD COLUMN     "orderCount" INTEGER DEFAULT 0,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "Diet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDiet" (
    "productId" TEXT NOT NULL,
    "dietId" TEXT NOT NULL,

    CONSTRAINT "ProductDiet_pkey" PRIMARY KEY ("productId","dietId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Diet_name_key" ON "Diet"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Diet_slug_key" ON "Diet"("slug");

-- CreateIndex
CREATE INDEX "ProductDiet_dietId_idx" ON "ProductDiet"("dietId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- AddForeignKey
ALTER TABLE "ProductDiet" ADD CONSTRAINT "ProductDiet_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDiet" ADD CONSTRAINT "ProductDiet_dietId_fkey" FOREIGN KEY ("dietId") REFERENCES "Diet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
