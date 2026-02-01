/*
  Warnings:

  - A unique constraint covering the columns `[providerId,name]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[providerId,slug]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "image" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Brand_providerId_name_key" ON "Brand"("providerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_providerId_slug_key" ON "Brand"("providerId", "slug");
