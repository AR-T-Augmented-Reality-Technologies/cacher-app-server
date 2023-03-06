/*
  Warnings:

  - Added the required column `timestamp` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comments` ADD COLUMN `timestamp` DATE NOT NULL;

-- CreateTable
CREATE TABLE `reply_comments` (
    `replycomment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `comment_id` INTEGER NOT NULL,
    `comment` VARCHAR(255) NOT NULL,
    `timestamp` DATE NOT NULL,

    INDEX `user_id`(`user_id`),
    INDEX `comment_id`(`comment_id`),
    PRIMARY KEY (`replycomment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reply_comments` ADD CONSTRAINT `reply_comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reply_comments` ADD CONSTRAINT `reply_comments_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments`(`comment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
