-- DropForeignKey
ALTER TABLE `ages` DROP FOREIGN KEY `ages_ibfk_1`;

-- DropForeignKey
ALTER TABLE `blocked` DROP FOREIGN KEY `blocked_ibfk_1`;

-- DropForeignKey
ALTER TABLE `following` DROP FOREIGN KEY `following_ibfk_1`;

-- DropForeignKey
ALTER TABLE `managed_by` DROP FOREIGN KEY `managed_by_ibfk_2`;

-- DropForeignKey
ALTER TABLE `private_user` DROP FOREIGN KEY `private_user_ibfk_1`;

-- DropForeignKey
ALTER TABLE `roles` DROP FOREIGN KEY `roles_ibfk_1`;

-- AddForeignKey
ALTER TABLE `ages` ADD CONSTRAINT `ages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `managed_by` ADD CONSTRAINT `managed_by_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `roles` ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `private_user` ADD CONSTRAINT `private_user_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `following` ADD CONSTRAINT `following_ibfk_1` FOREIGN KEY (`user_id_1`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `blocked` ADD CONSTRAINT `blocked_ibfk_1` FOREIGN KEY (`user_id_1`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
