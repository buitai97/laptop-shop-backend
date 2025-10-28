/*
  Warnings:

  - You are about to drop the column `factory` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `target` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `factory`,
    DROP COLUMN `target`,
    ADD COLUMN `brand` VARCHAR(255) NOT NULL DEFAULT 'Unknown',
    ADD COLUMN `category` VARCHAR(255) NOT NULL DEFAULT 'General';
