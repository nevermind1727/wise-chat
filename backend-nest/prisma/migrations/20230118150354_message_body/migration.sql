/*
  Warnings:

  - Added the required column `body` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `message` ADD COLUMN `body` VARCHAR(191) NOT NULL;
