import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import {
  ConversationCreatedSubscriptionPayload,
  ConversationDeletedSubscriptionPayload,
  ConversationPopulated,
  ConversationUpdatedSubscriptionPayload,
  CreateConversationResponse,
  GetConversationsResponse,
  GraphQLContextExtended,
} from 'src/utils/types';
import { ConversationsService } from './conversations.service';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { isUserConversationParticipant } from 'src/utils/helpers';
import { GraphQLError } from 'graphql';

@Resolver()
export class ConversationsResolver {
  constructor(
    private readonly conversationsService: ConversationsService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Mutation()
  async createConversation(
    @Args() participantsIds: CreateConversationDto,
    @Context() context: GraphQLContextExtended,
  ): Promise<CreateConversationResponse> {
    const newConversation = await this.conversationsService.createConversation(
      participantsIds,
      context,
    );
    this.pubSub.publish('conversationCreated', {
      conversationCreated: newConversation,
    });
    return {
      conversationId: newConversation.id,
    };
  }

  @Query()
  async getConversations(
    @Context() context: GraphQLContextExtended,
  ): Promise<Array<ConversationPopulated>> {
    return this.conversationsService.getConversations(context);
  }

  @Subscription('conversationCreated', {
    filter: (
      payload: ConversationCreatedSubscriptionPayload,
      _,
      context: GraphQLContextExtended,
    ) => {
      const { participants } = payload.conversationCreated;
      const userId = context.extra.session.user.id;
      return isUserConversationParticipant(participants, userId);
    },
  })
  conversationCreated() {
    return this.pubSub.asyncIterator('conversationCreated');
  }

  @Mutation()
  async markAsRead(
    @Args() { conversationId },
    @Context() context: GraphQLContextExtended,
  ): Promise<boolean> {
    return this.conversationsService.markAsRead(conversationId, context);
  }

  @Mutation()
  async deleteConversation(
    @Args()
    { conversationId },
    @Context()
    context: GraphQLContextExtended,
  ): Promise<boolean> {
    return this.conversationsService.deleteConversation(
      conversationId,
      context,
    );
  }

  @Subscription('conversationDeleted', {
    filter: (
      payload: ConversationDeletedSubscriptionPayload,
      _,
      context: GraphQLContextExtended,
    ) => {
      const user = context.extra.session.user;
      if (!user) {
        throw new GraphQLError('Not authorized');
      }
      console.log('HERE IS THE PAYLOAD', payload);
      const {
        conversationDeleted: { participants },
      } = payload;
      return isUserConversationParticipant(participants, user.id);
    },
  })
  conversationDeleted() {
    return this.pubSub.asyncIterator('conversationDeleted');
  }
}
