-- DropForeignKey
ALTER TABLE `ages` DROP FOREIGN KEY `ages_ibfk_1`;

-- DropForeignKey
ALTER TABLE `roles` DROP FOREIGN KEY `roles_ibfk_1`;

-- CreateTable
CREATE TABLE `comments` (
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `photo_id` VARCHAR(255) NOT NULL,
    `comment` VARCHAR(255) NOT NULL,

    INDEX `user_id`(`user_id`),
    INDEX `photo_id`(`photo_id`),
    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ages` ADD CONSTRAINT `ages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `roles` ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `image`(`photo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
