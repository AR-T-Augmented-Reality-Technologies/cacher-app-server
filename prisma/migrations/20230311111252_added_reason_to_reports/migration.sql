/*
  Warnings:

  - Added the required column `reason` to the `reported_posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reported_posts` ADD COLUMN `reason` VARCHAR(255) NOT NULL;
