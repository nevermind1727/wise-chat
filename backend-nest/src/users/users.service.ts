import { Injectable } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { getSession } from 'next-auth/react';
import { PrismaService } from 'prisma/prisma.service';
import { User } from 'src/graphql/graphql';
import { CreateUsernameResponse, GraphQLContextExtended } from 'src/utils/types';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async createUsername(username: string, context: GraphQLContextExtended): Promise<CreateUsernameResponse> {
        const {req} = context
        const session = await getSession({req})
        if (!session?.user) {
            return {
                success: false,
                error: "User isn't authorized",
            }
        }

        const {id} = session?.user

        try {
            const existingUser = await this.prismaService.user.findUnique({where: {username}})
            if (existingUser) {
                return {
                    success: false,
                    error: `User with username: ${username} already exists.`,
                }
            }
            await this.prismaService.user.update({where: {id}, data: {username}})
            return {
                success: true,
            }
        } catch (e) {
            console.error(e)
            return {
                success: false,
                error: e.message,
            }
        }
    }

    async findUsers(username: string, context: GraphQLContextExtended): Promise<User[]> {
        const {req} = context
        const session = await getSession({req})
        if (!session?.user) {
            throw new ApolloError("Not Authorized")
        }
        const {username: sessionUsername} = session.user
        
        try {
            const foundUsers = await this.prismaService.user.findMany({
                where: {
                    username: {
                        contains: username,
                        not: sessionUsername,
                    },
                },
            })
            return foundUsers;
        } catch (e) {
            console.log(e)
        }
    }
}
