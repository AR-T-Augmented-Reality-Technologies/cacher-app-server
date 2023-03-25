/*
  Warnings:

  - Made the column `profile_pic` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `profile_pic` VARCHAR(255) NOT NULL DEFAULT 'https://ar-t-cacher-app-s3.eu-central-1.linodeobjects.com/profiles/user.png';
