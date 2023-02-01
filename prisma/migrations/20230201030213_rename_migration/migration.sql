-- AlterTable
ALTER TABLE `users` ADD COLUMN `user_username` VARCHAR(255) NOT NULL DEFAULT 'guest';

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `user_id` TO `users_user_id_key`;
