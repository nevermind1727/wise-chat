import { GraphQLExecutionContext } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import {
  conversationParticipantsPopulated,
  conversationPopulated,
  messagePopulated,
} from './constants';
import { Context } from 'graphql-ws/lib/server';
import { Session } from 'next-auth';

export type GraphQLContextExtended = GraphQLExecutionContext & {
  req: Request;
  res: Response;
  extra: {
    session: Session;
  };
};

export interface SubscriptionContext extends Context {
  connectionParams: {
    session: Session;
  };
  extra: {
    session: Session;
  };
}

export type CreateUsernameResponse = {
  success: boolean;
  error?: string;
};

export type CreateConversationResponse = {
  conversationId: string;
};

export type GetConversationsResponse = {
  conversations: Array<ConversationPopulated>;
};

export type ConversationCreatedSubscriptionPayload = {
  conversationCreated: ConversationPopulated;
};

export type ConversationUpdatedSubscriptionPayload = {
  conversationUpdated: {
    conversation: ConversationPopulated;
  };
};

export type ConversationDeletedSubscriptionPayload = {
  conversationDeleted: ConversationPopulated;
};

export type MessageSentSubscriptionPayload = {
  messageSent: MessagePopulated;
};

export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof conversationParticipantsPopulated;
}>;

export type MessagePopulated = Prisma.MessageGetPayload<{
  include: typeof messagePopulated;
}>;
