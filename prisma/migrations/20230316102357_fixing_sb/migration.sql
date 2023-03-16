/*
  Warnings:

  - You are about to alter the column `scrapbook_id` on the `managed_by` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - You are about to alter the column `scrapbook_id` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - The primary key for the `scrapbook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `scrapbook_id` on the `scrapbook` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `managed_by` DROP FOREIGN KEY `managed_by_ibfk_1`;

-- DropForeignKey
ALTER TABLE `pages` DROP FOREIGN KEY `pages_ibfk_1`;

-- AlterTable
ALTER TABLE `managed_by` MODIFY `scrapbook_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `pages` ADD COLUMN `scrapbookScrapbook_id` INTEGER NULL,
    MODIFY `scrapbook_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `scrapbook` DROP PRIMARY KEY,
    MODIFY `scrapbook_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`scrapbook_id`);

-- AddForeignKey
ALTER TABLE `managed_by` ADD CONSTRAINT `managed_by_ibfk_1` FOREIGN KEY (`scrapbook_id`) REFERENCES `scrapbook`(`scrapbook_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pages` ADD CONSTRAINT `pages_scrapbookScrapbook_id_fkey` FOREIGN KEY (`scrapbookScrapbook_id`) REFERENCES `scrapbook`(`scrapbook_id`) ON DELETE SET NULL ON UPDATE CASCADE;
