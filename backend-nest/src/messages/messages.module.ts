import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { PrismaService } from 'prisma/prisma.service';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [
    MessagesService,
    MessagesResolver,
    PrismaService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class MessagesModule {}
