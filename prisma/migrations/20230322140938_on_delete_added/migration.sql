/*
  Warnings:

  - You are about to alter the column `timestamp` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `upload_date` on the `image` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `image_scrap_id_fkey`;

-- AlterTable
ALTER TABLE `comments` MODIFY `timestamp` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `image` MODIFY `upload_date` DATETIME NOT NULL;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_scrap_id_fkey` FOREIGN KEY (`scrap_id`) REFERENCES `scrapbook`(`scrapbook_id`) ON DELETE CASCADE ON UPDATE CASCADE;
