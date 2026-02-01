/*
  Warnings:

  - A unique constraint covering the columns `[providerId,name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[providerId,slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "discountEnd" TIMESTAMP(3),
ADD COLUMN     "discountStart" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(100);

-- CreateIndex
CREATE INDEX "Category_providerId_idx" ON "Category"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_providerId_name_key" ON "Category"("providerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_providerId_slug_key" ON "Category"("providerId", "slug");
