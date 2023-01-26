import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { GraphQLDateTime } from 'graphql-iso-date';
import { MessagesModule } from './messages/messages.module';
import { SubscriptionContext } from './utils/types';
import { ApolloError } from 'apollo-server-express';
import { Session } from 'next-auth';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      resolvers: { DateTime: GraphQLDateTime },
      subscriptions: {
        'graphql-ws': {
          path: '/graphql/subscriptions',
          onConnect: (context: SubscriptionContext) => {
            const {
              connectionParams: { session },
              extra,
            } = context;
            if (!session?.user) {
              throw new ApolloError('Not Authorized');
            }
            extra.session = session;
          },
        },
      },
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      context: ({ req, res, extra }) => ({ req, res, extra }),
    }),
    UsersModule,
    ConversationsModule,
    MessagesModule,
  ],
  providers: [
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class AppModule {}
