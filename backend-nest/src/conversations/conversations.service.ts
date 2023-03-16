import { Inject, Injectable } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
import { getSession } from 'next-auth/react';
import { PrismaService } from 'prisma/prisma.service';
import { Conversation } from 'src/graphql';
import { conversationPopulated } from 'src/utils/constants';
import {
  ConversationPopulated,
  CreateConversationResponse,
  GetConversationsResponse,
  GraphQLContextExtended,
} from 'src/utils/types';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { GraphQLError } from 'graphql';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  async createConversation(
    participantsIds: CreateConversationDto,
    context: GraphQLContextExtended,
  ): Promise<Conversation> {
    const { req } = context;
    const session = await getSession({ req });
    if (!session?.user) {
      throw new ApolloError('Not Authorized');
    }
    const newConversation = await this.prismaService.conversation.create({
      data: {
        participants: {
          createMany: {
            data: participantsIds.participantsIds.map((id) => ({
              userId: id,
              hasSeenLatestMessage: id === session.user.id,
            })),
          },
        },
      },
      include: conversationPopulated,
    });
    return newConversation;
  }

  async getConversations(
    context: GraphQLContextExtended,
  ): Promise<Array<ConversationPopulated>> {
    const { req } = context;
    const session = await getSession({ req });
    if (!session?.user) {
      throw new ApolloError('Not Authorized');
    }
    try {
      const conversations = await this.prismaService.conversation.findMany({
        include: conversationPopulated,
      });
      const filteredConversations = conversations.filter(
        (conv) =>
          !!conv.participants.find((part) => part.userId === session.user.id),
      );
      return filteredConversations;
    } catch (e: any) {
      throw new ApolloError(e?.message);
    }
  }

  async markAsRead(
    conversationId,
    context: GraphQLContextExtended,
  ): Promise<boolean> {
    const { req } = context;
    const session = await getSession({ req });
    if (!session?.user) {
      throw new ApolloError('Not Authorized');
    }
    try {
      const participant =
        await this.prismaService.conversationParticipant.findFirst({
          where: {
            conversationId,
            userId: session.user.id,
          },
        });
      await this.prismaService.conversationParticipant.update({
        where: {
          id: participant.id,
        },
        data: {
          hasSeenLatestMessage: true,
        },
      });
      return true;
    } catch (e: any) {
      throw new GraphQLError(e?.message);
    }
  }

  async deleteConversation(
    conversationId: string,
    context: GraphQLContextExtended,
  ): Promise<boolean> {
    const { req } = context;
    const session = await getSession({ req });
    if (!session?.user) {
      throw new ApolloError('Not Authorized');
    }
    try {
      const [deletedConversation] = await this.prismaService.$transaction([
        this.prismaService.conversation.delete({
          where: {
            id: conversationId,
          },
          include: conversationPopulated,
        }),
        this.prismaService.conversationParticipant.deleteMany({
          where: {
            conversationId,
          },
        }),
        this.prismaService.message.deleteMany({
          where: {
            conversationId,
          },
        }),
      ]);
      this.pubSub.publish('conversationDeleted', {
        conversationDeleted: deletedConversation,
      });
      return true;
    } catch (e) {
      throw new GraphQLError('Error deleting conversation');
    }
  }

  async getWiseAiConversation(context: GraphQLContextExtended) {
    const { req } = context;
    const session = await getSession({ req });
    if (!session?.user) {
      throw new ApolloError('Not Authorized');
    }
    const conversations = await this.prismaService.conversation.findMany({
      include: conversationPopulated,
    });
    const filteredConversations = conversations.filter(
      (conv) =>
        !!conv.participants.find((part) => part.userId === session.user.id),
    );
    const wiseAiConversation = filteredConversations.find(
      (conv) =>
        !!conv.participants.find((part) => part.user.username === 'WiseAI'),
    );
    return wiseAiConversation;
  }
}
