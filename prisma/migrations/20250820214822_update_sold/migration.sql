/*
  Warnings:

  - Made the column `price` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `price` FLOAT NOT NULL;
