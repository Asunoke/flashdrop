/*
  Warnings:

  - The values [EXPIRED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `paymentMethod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `reviews` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `specifications` on the `Product` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentMethod",
ADD COLUMN     "rejectionReason" TEXT,
ALTER COLUMN "expiresAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "author",
DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "readingTime" INTEGER,
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "excerpt" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "rating",
DROP COLUMN "reviews",
DROP COLUMN "specifications",
ALTER COLUMN "stockQuantity" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
