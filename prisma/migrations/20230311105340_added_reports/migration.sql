/*
  Warnings:

  - The primary key for the `page` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `page_id` on the `page` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - You are about to alter the column `page_id` on the `page_options` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `page_options` DROP FOREIGN KEY `page_options_ibfk_1`;

-- AlterTable
ALTER TABLE `page` DROP PRIMARY KEY,
    MODIFY `page_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`page_id`);

-- AlterTable
ALTER TABLE `page_options` MODIFY `page_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `reported_posts` (
    `reportid` INTEGER NOT NULL AUTO_INCREMENT,
    `reporter_id` INTEGER NOT NULL,
    `page_id` INTEGER NOT NULL,
    `issue_resolved` BOOLEAN NOT NULL,

    PRIMARY KEY (`reportid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `page_options` ADD CONSTRAINT `page_options_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `page`(`page_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reported_posts` ADD CONSTRAINT `reported_posts_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reported_posts` ADD CONSTRAINT `reported_posts_ibfk_2` FOREIGN KEY (`page_id`) REFERENCES `page`(`page_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
