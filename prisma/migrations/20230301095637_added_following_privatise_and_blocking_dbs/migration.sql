-- CreateTable
CREATE TABLE `private_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `following` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id_1` INTEGER NOT NULL,
    `user_id_2` INTEGER NOT NULL,

    INDEX `user_id`(`user_id_1`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blocked` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id_1` INTEGER NOT NULL,
    `user_id_2` INTEGER NOT NULL,

    INDEX `user_id`(`user_id_1`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `private_user` ADD CONSTRAINT `private_user_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `following` ADD CONSTRAINT `following_ibfk_1` FOREIGN KEY (`user_id_1`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `blocked` ADD CONSTRAINT `blocked_ibfk_1` FOREIGN KEY (`user_id_1`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
