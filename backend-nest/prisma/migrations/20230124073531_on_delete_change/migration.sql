-- DropForeignKey
ALTER TABLE `conversation` DROP FOREIGN KEY `Conversation_lastSentMessageId_fkey`;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_lastSentMessageId_fkey` FOREIGN KEY (`lastSentMessageId`) REFERENCES `Message`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
