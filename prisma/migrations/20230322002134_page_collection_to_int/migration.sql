/*
  Warnings:

  - You are about to alter the column `photo_id` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - You are about to alter the column `timestamp` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - The primary key for the `image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `photo_id` on the `image` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - You are about to alter the column `upload_date` on the `image` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `page_collection` on the `page` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - The primary key for the `pages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `page_collection` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - You are about to alter the column `photo_id` on the `uploaded_by` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_ibfk_2`;

-- DropForeignKey
ALTER TABLE `page` DROP FOREIGN KEY `page_ibfk_1`;

-- DropForeignKey
ALTER TABLE `uploaded_by` DROP FOREIGN KEY `uploaded_by_ibfk_1`;

-- AlterTable
ALTER TABLE `comments` MODIFY `photo_id` INTEGER NOT NULL,
    MODIFY `timestamp` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `image` DROP PRIMARY KEY,
    MODIFY `photo_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `upload_date` DATETIME NOT NULL,
    ADD PRIMARY KEY (`photo_id`);

-- AlterTable
ALTER TABLE `page` MODIFY `page_collection` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `pages` DROP PRIMARY KEY,
    MODIFY `page_collection` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`page_collection`);

-- AlterTable
ALTER TABLE `uploaded_by` MODIFY `photo_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `page` ADD CONSTRAINT `page_ibfk_1` FOREIGN KEY (`page_collection`) REFERENCES `pages`(`page_collection`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `uploaded_by` ADD CONSTRAINT `uploaded_by_ibfk_1` FOREIGN KEY (`photo_id`) REFERENCES `image`(`photo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `image`(`photo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
