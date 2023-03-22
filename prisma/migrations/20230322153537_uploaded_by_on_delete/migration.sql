/*
  Warnings:

  - You are about to alter the column `timestamp` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `upload_date` on the `image` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `uploaded_by` DROP FOREIGN KEY `uploaded_by_ibfk_1`;

-- DropForeignKey
ALTER TABLE `uploaded_by` DROP FOREIGN KEY `uploaded_by_ibfk_2`;

-- AlterTable
ALTER TABLE `comments` MODIFY `timestamp` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `image` MODIFY `upload_date` DATETIME NOT NULL;

-- AddForeignKey
ALTER TABLE `uploaded_by` ADD CONSTRAINT `uploaded_by_ibfk_1` FOREIGN KEY (`photo_id`) REFERENCES `image`(`photo_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `uploaded_by` ADD CONSTRAINT `uploaded_by_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
