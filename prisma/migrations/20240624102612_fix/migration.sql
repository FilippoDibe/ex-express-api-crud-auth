/*
  Warnings:

  - You are about to drop the column `categoriesId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_categoriesId_fkey`;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `categoriesId`,
    ADD COLUMN `categoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
