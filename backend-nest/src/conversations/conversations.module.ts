import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsResolver } from './conversations.resolver';
import { PrismaService } from 'prisma/prisma.service';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [
    ConversationsService,
    ConversationsResolver,
    PrismaService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class ConversationsModule {}
