import { Inject, Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { PrismaService } from 'prisma/prisma.service';
import { GraphQLContextExtended, MessagePopulated } from 'src/utils/types';
import { getSession } from 'next-auth/react';
import { ApolloError } from 'apollo-server-express';
import { conversationPopulated, messagePopulated } from 'src/utils/constants';
import { PubSub } from 'graphql-subscriptions';
import { GraphQLError } from 'graphql';
import { isUserConversationParticipant } from 'src/utils/helpers';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  async sendMessage(
    sendMessageInput: SendMessageDto,
    context: GraphQLContextExtended,
  ): Promise<boolean> {
    const { conversationId, senderId, body } = sendMessageInput;
    const { req } = context;
    const session = await getSession({ req });

    if (!session?.user) {
      throw new ApolloError('Not Authorized');
    }
    if (session?.user.id !== senderId) {
      throw new ApolloError('Not Authorized');
    }

    try {
      const newMessage = await this.prismaService.message.create({
        data: {
          conversationId,
          senderId,
          body,
        },
        include: messagePopulated,
      });

      const conversationParticipant =
        await this.prismaService.conversationParticipant.findFirst({
          where: {
            userId: senderId,
            conversationId,
          },
        });

      if (!conversationParticipant) {
        throw new GraphQLError("Conversation participant doesn't exist");
      }

      const conversation = await this.prismaService.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          lastSentMessageId: newMessage.id,
          participants: {
            update: {
              where: {
                id: conversationParticipant.id,
              },
              data: {
                hasSeenLatestMessage: true,
              },
            },
            updateMany: {
              where: {
                NOT: {
                  id: senderId,
                },
              },
              data: {
                hasSeenLatestMessage: false,
              },
            },
          },
        },
        include: conversationPopulated,
      });
      this.pubSub.publish('messageSent', { messageSent: newMessage });
      this.pubSub.publish('conversationUpdated', {
        conversationUpdated: {
          conversation,
        },
      });
      return true;
    } catch (e) {
      console.error(e);
      throw new GraphQLError('Error sending message');
    }
  }

  async getMessages(
    conversationId: any,
    context: GraphQLContextExtended,
  ): Promise<Array<MessagePopulated>> {
    const { req } = context;
    const session = await getSession({ req });
    if (!session?.user) {
      throw new ApolloError('Not Authorized');
    }
    const conversation = await this.prismaService.conversation.findUnique({
      where: { id: conversationId.conversationId },
      include: conversationPopulated,
    });
    if (!conversation) {
      throw new GraphQLError('Conversation Not Found');
    }
    const allowedToView = isUserConversationParticipant(
      conversation.participants,
      session?.user.id,
    );
    if (!allowedToView) {
      throw new GraphQLError('You are not a participant of that conversation!');
    }
    try {
      const messages = await this.prismaService.message.findMany({
        where: {
          conversationId: conversationId.conversationId,
        },
        include: messagePopulated,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return messages;
    } catch (error) {
      console.error(error);
      throw new GraphQLError('Error getting messages');
    }
  }
}
