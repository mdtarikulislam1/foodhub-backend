/*
  Warnings:

  - The values [REJECT] on the enum `ReviewStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `email` on the `ProviderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ProviderProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerId]` on the table `ProviderProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,productId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerId` to the `ProviderProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReviewStatus_new" AS ENUM ('APPROVED', 'REJECTED');
ALTER TABLE "public"."Review" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Review" ALTER COLUMN "status" TYPE "ReviewStatus_new" USING ("status"::text::"ReviewStatus_new");
ALTER TYPE "ReviewStatus" RENAME TO "ReviewStatus_old";
ALTER TYPE "ReviewStatus_new" RENAME TO "ReviewStatus";
DROP TYPE "public"."ReviewStatus_old";
ALTER TABLE "Review" ALTER COLUMN "status" SET DEFAULT 'APPROVED';
COMMIT;

-- DropForeignKey
ALTER TABLE "ProviderProfile" DROP CONSTRAINT "ProviderProfile_userId_fkey";

-- DropIndex
DROP INDEX "ProviderProfile_userId_key";

-- DropIndex
DROP INDEX "Review_productId_idx";

-- DropIndex
DROP INDEX "Review_userId_idx";

-- AlterTable
ALTER TABLE "ProviderProfile" DROP COLUMN "email",
DROP COLUMN "userId",
ADD COLUMN     "providerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_providerId_key" ON "ProviderProfile"("providerId");

-- CreateIndex
CREATE INDEX "ProviderProfile_providerId_idx" ON "ProviderProfile"("providerId");

-- CreateIndex
CREATE INDEX "ProviderProfile_id_idx" ON "ProviderProfile"("id");

-- CreateIndex
CREATE INDEX "Review_productId_userId_parentId_idx" ON "Review"("productId", "userId", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_productId_key" ON "Review"("userId", "productId");

-- AddForeignKey
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
