import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUsernameResponse, GraphQLContextExtended } from 'src/utils/types';
import { User } from 'src/graphql/graphql';

@Resolver()
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query()
    async findUsers(@Args("username") username: string, @Context() context: GraphQLContextExtended): Promise<User[]> {
        return this.usersService.findUsers(username, context);
    }

    @Mutation()
    async createUsername(@Args("username") username: string, @Context() context: GraphQLContextExtended): Promise<CreateUsernameResponse> {
        return this.usersService.createUsername(username, context);
    }
}

