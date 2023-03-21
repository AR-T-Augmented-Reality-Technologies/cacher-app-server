/*
  Warnings:

  - You are about to alter the column `timestamp` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `page_id` to the `image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comments` MODIFY `timestamp` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `image` ADD COLUMN `page_id` INTEGER NOT NULL,
    MODIFY `upload_date` DATETIME NOT NULL;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_page_id_fkey` FOREIGN KEY (`page_id`) REFERENCES `page`(`page_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
