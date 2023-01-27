import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import {
  ConversationUpdatedSubscriptionPayload,
  GraphQLContextExtended,
  MessagePopulated,
  MessageSentSubscriptionPayload,
} from 'src/utils/types';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { isUserConversationParticipant } from 'src/utils/helpers';

@Resolver()
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Mutation()
  async sendMessage(
    @Args() sendMessageInput: SendMessageDto,
    @Context() context: GraphQLContextExtended,
  ): Promise<boolean> {
    return this.messagesService.sendMessage(sendMessageInput, context);
  }

  @Query()
  async getMessages(
    @Args() conversationId: string,
    @Context() context: GraphQLContextExtended,
  ): Promise<Array<MessagePopulated>> {
    return this.messagesService.getMessages(conversationId, context);
  }

  @Subscription('messageSent', {
    filter: (
      payload: MessageSentSubscriptionPayload,
      variables: { conversationId: string },
    ) => {
      console.log('MESSAGE PAYLOAD', payload);
      return payload.messageSent.conversationId === variables.conversationId;
    },
  })
  messageSent() {
    return this.pubSub.asyncIterator('messageSent');
  }

  @Subscription('conversationUpdated', {
    filter: (
      payload: ConversationUpdatedSubscriptionPayload,
      _,
      context: GraphQLContextExtended,
    ) => {
      const user = context.extra.session.user;
      if (!user) {
        throw new GraphQLError('Not authorized');
      }
      console.log('HERE IS THE PAYLOAD', payload);
      const {
        conversationUpdated: {
          conversation: { participants },
        },
      } = payload;
      return isUserConversationParticipant(participants, user.id);
    },
  })
  conversationUpdated() {
    return this.pubSub.asyncIterator('conversationUpdated');
  }
}
