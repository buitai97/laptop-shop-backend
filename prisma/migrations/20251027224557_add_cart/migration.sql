/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cartId,productId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `cart_items` MODIFY `quantity` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `cartId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `cart_items_productId_key` ON `cart_items`(`productId`);

-- CreateIndex
CREATE UNIQUE INDEX `cart_items_cartId_productId_key` ON `cart_items`(`cartId`, `productId`);
