/*
  Warnings:

  - You are about to drop the column `scrapbookScrapbook_id` on the `pages` table. All the data in the column will be lost.
  - Added the required column `closest_book` to the `preoccupied` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pages` DROP FOREIGN KEY `pages_scrapbookScrapbook_id_fkey`;

-- AlterTable
ALTER TABLE `pages` DROP COLUMN `scrapbookScrapbook_id`;

-- AlterTable
ALTER TABLE `preoccupied` ADD COLUMN `closest_book` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `pages` ADD CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`scrapbook_id`) REFERENCES `scrapbook`(`scrapbook_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
