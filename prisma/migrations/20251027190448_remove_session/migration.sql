/*
  Warnings:

  - You are about to drop the column `sum` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `carts` DROP COLUMN `sum`;

-- DropTable
DROP TABLE `sessions`;
