/*
  Warnings:

  - You are about to alter the column `photo_id` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - You are about to alter the column `timestamp` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - The primary key for the `image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `photo_id` on the `image` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - You are about to alter the column `photo_id` on the `uploaded_by` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - A unique constraint covering the columns `[photo_id]` on the table `comments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[photo_id]` on the table `image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[photo_id]` on the table `uploaded_by` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_ibfk_2`;

-- DropForeignKey
ALTER TABLE `uploaded_by` DROP FOREIGN KEY `uploaded_by_ibfk_1`;

-- DropForeignKey
ALTER TABLE `uploaded_by` DROP FOREIGN KEY `uploaded_by_ibfk_2`;

-- AlterTable
ALTER TABLE `comments` MODIFY `photo_id` INTEGER NOT NULL,
    MODIFY `comment` TEXT NOT NULL,
    MODIFY `timestamp` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `image` DROP PRIMARY KEY,
    MODIFY `photo_id` INTEGER NOT NULL,
    MODIFY `caption` TEXT NOT NULL,
    MODIFY `upload_date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `reply_comments` MODIFY `comment` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `uploaded_by` MODIFY `photo_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `page_id` ON `comments`(`photo_id`);

-- CreateIndex
CREATE UNIQUE INDEX `page_id` ON `image`(`photo_id`);

-- CreateIndex
CREATE UNIQUE INDEX `page_id` ON `uploaded_by`(`photo_id`);

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_ibfk_1` FOREIGN KEY (`photo_id`) REFERENCES `page`(`page_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `uploaded_by` ADD CONSTRAINT `uploaded_by_ibfk_1` FOREIGN KEY (`photo_id`) REFERENCES `image`(`photo_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `uploaded_by` ADD CONSTRAINT `uploaded_by_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `image`(`photo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
