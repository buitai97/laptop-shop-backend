/*
  Warnings:

  - You are about to drop the column `paymentRef` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `receiverAddress` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `receiverName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `receiverPhone` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `order_detail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `addressId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order_detail` DROP FOREIGN KEY `order_detail_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `order_detail` DROP FOREIGN KEY `order_detail_productId_fkey`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `paymentRef`,
    DROP COLUMN `receiverAddress`,
    DROP COLUMN `receiverName`,
    DROP COLUMN `receiverPhone`,
    ADD COLUMN `addressId` INTEGER NOT NULL,
    ADD COLUMN `email` VARCHAR(255) NOT NULL,
    ADD COLUMN `name` VARCHAR(255) NOT NULL,
    ADD COLUMN `phone` VARCHAR(255) NOT NULL,
    MODIFY `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'PROCESSING';

-- AlterTable
ALTER TABLE `users` DROP COLUMN `address`,
    ADD COLUMN `addressId` INTEGER NULL;

-- DropTable
DROP TABLE `order_detail`;

-- CreateTable
CREATE TABLE `addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `street` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255) NOT NULL,
    `zipCode` VARCHAR(20) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `price` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `addresses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
