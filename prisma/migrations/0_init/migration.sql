-- CreateTable
CREATE TABLE `scrapbook` (
    `scrapbook_id` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `scrapbook_id`(`scrapbook_id`),
    PRIMARY KEY (`scrapbook_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_firstname` VARCHAR(255) NOT NULL,
    `user_lastname` VARCHAR(255) NOT NULL,
    `user_email` VARCHAR(255) NOT NULL,
    `user_password` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `dob` DATE NOT NULL,
    `age` INTEGER NOT NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image` (
    `photo_id` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `likes` INTEGER NOT NULL,
    `comments` VARCHAR(255) NOT NULL,
    `num_comments` INTEGER NOT NULL,
    `caption` VARCHAR(255) NOT NULL,
    `upload_date` DATE NOT NULL,

    PRIMARY KEY (`photo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `managed_by` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scrapbook_id` VARCHAR(255) NOT NULL,
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `scrapbook_id`(`scrapbook_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page` (
    `page_id` VARCHAR(255) NOT NULL,
    `page_collection` VARCHAR(255) NOT NULL,

    INDEX `page_collection`(`page_collection`),
    PRIMARY KEY (`page_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page_options` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `page_id` VARCHAR(255) NOT NULL,
    `page_title` VARCHAR(255) NOT NULL,
    `background_color` VARCHAR(7) NOT NULL,
    `orientation` VARCHAR(255) NOT NULL,

    INDEX `page_id`(`page_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pages` (
    `page_collection` VARCHAR(255) NOT NULL,
    `scrapbook_id` VARCHAR(255) NOT NULL,
    `number_of_pages` INTEGER NOT NULL,

    INDEX `scrapbook_id`(`scrapbook_id`),
    PRIMARY KEY (`page_collection`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `preoccupied` (
    `location` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`location`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `roles_name` VARCHAR(255) NOT NULL,
    `roles_serialized` VARCHAR(255) NOT NULL,
    `roles_description` VARCHAR(255) NOT NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `uploaded_by` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `photo_id` VARCHAR(255) NOT NULL,
    `user_id` INTEGER NOT NULL,

    INDEX `photo_id`(`photo_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ages` ADD CONSTRAINT `ages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `managed_by` ADD CONSTRAINT `managed_by_ibfk_1` FOREIGN KEY (`scrapbook_id`) REFERENCES `scrapbook`(`scrapbook_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `managed_by` ADD CONSTRAINT `managed_by_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `page` ADD CONSTRAINT `page_ibfk_1` FOREIGN KEY (`page_collection`) REFERENCES `pages`(`page_collection`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `page_options` ADD CONSTRAINT `page_options_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `page`(`page_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pages` ADD CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`scrapbook_id`) REFERENCES `scrapbook`(`scrapbook_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `roles` ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `uploaded_by` ADD CONSTRAINT `uploaded_by_ibfk_1` FOREIGN KEY (`photo_id`) REFERENCES `image`(`photo_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `uploaded_by` ADD CONSTRAINT `uploaded_by_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

