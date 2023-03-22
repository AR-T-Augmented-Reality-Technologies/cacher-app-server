/*
  Warnings:

  - You are about to alter the column `timestamp` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `upload_date` on the `image` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `scrapbook_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `scrapbook_images` DROP FOREIGN KEY `scrapbook_images_ibfk_1`;

-- DropForeignKey
ALTER TABLE `scrapbook_images` DROP FOREIGN KEY `scrapbook_images_ibfk_2`;

-- AlterTable
ALTER TABLE `comments` MODIFY `timestamp` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `image` ADD COLUMN `scrap_id` INTEGER NULL,
    MODIFY `likes` INTEGER NOT NULL DEFAULT 0,
    MODIFY `num_comments` INTEGER NOT NULL DEFAULT 0,
    MODIFY `upload_date` DATETIME NOT NULL;

-- DropTable
DROP TABLE `scrapbook_images`;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_scrap_id_fkey` FOREIGN KEY (`scrap_id`) REFERENCES `scrapbook`(`scrapbook_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `scrapbook` RENAME INDEX `scrapbook_id` TO `scrapbook_scrapbook_id_key`;
