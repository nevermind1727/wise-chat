-- DropForeignKey
ALTER TABLE `conversation` DROP FOREIGN KEY `Conversation_lastSentMessageId_fkey`;

-- AlterTable
ALTER TABLE `conversation` MODIFY `lastSentMessageId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_lastSentMessageId_fkey` FOREIGN KEY (`lastSentMessageId`) REFERENCES `Message`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
