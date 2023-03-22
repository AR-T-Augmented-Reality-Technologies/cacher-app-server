/*
  Warnings:

  - You are about to alter the column `timestamp` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `page_id` on the `image` table. All the data in the column will be lost.
  - You are about to alter the column `upload_date` on the `image` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `page_id` on the `reported_posts` table. All the data in the column will be lost.
  - You are about to drop the `blocked` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `following` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `page` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `page_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reply_comments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `photo_id` to the `reported_posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `blocked` DROP FOREIGN KEY `blocked_ibfk_1`;

-- DropForeignKey
ALTER TABLE `following` DROP FOREIGN KEY `following_ibfk_1`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `image_page_id_fkey`;

-- DropForeignKey
ALTER TABLE `page` DROP FOREIGN KEY `page_ibfk_1`;

-- DropForeignKey
ALTER TABLE `page_options` DROP FOREIGN KEY `page_options_ibfk_1`;

-- DropForeignKey
ALTER TABLE `pages` DROP FOREIGN KEY `pages_ibfk_1`;

-- DropForeignKey
ALTER TABLE `reply_comments` DROP FOREIGN KEY `reply_comments_ibfk_1`;

-- DropForeignKey
ALTER TABLE `reply_comments` DROP FOREIGN KEY `reply_comments_ibfk_2`;

-- DropForeignKey
ALTER TABLE `reported_posts` DROP FOREIGN KEY `reported_posts_ibfk_2`;

-- AlterTable
ALTER TABLE `comments` MODIFY `timestamp` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `image` DROP COLUMN `page_id`,
    MODIFY `upload_date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `reported_posts` DROP COLUMN `page_id`,
    ADD COLUMN `photo_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `blocked`;

-- DropTable
DROP TABLE `following`;

-- DropTable
DROP TABLE `page`;

-- DropTable
DROP TABLE `page_options`;

-- DropTable
DROP TABLE `pages`;

-- DropTable
DROP TABLE `reply_comments`;

-- CreateTable
CREATE TABLE `scrapbook_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scrapbook_id` INTEGER NOT NULL,
    `photo_id` INTEGER NOT NULL,

    INDEX `scrapbook_id`(`scrapbook_id`),
    INDEX `photo_id`(`photo_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `scrapbook_images` ADD CONSTRAINT `scrapbook_images_ibfk_1` FOREIGN KEY (`scrapbook_id`) REFERENCES `scrapbook`(`scrapbook_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `scrapbook_images` ADD CONSTRAINT `scrapbook_images_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `image`(`photo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reported_posts` ADD CONSTRAINT `reported_posts_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `image`(`photo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
