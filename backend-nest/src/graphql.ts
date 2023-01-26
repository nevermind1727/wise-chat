
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface IMutation {
    createConversation(participantsIds?: Nullable<Nullable<string>[]>): Nullable<CreateConversationResponse> | Promise<Nullable<CreateConversationResponse>>;
    markAsRead(conversationId?: Nullable<string>): Nullable<boolean> | Promise<Nullable<boolean>>;
    deleteConversation(conversationId?: Nullable<string>): Nullable<boolean> | Promise<Nullable<boolean>>;
    sendMessage(conversationId?: Nullable<string>, body?: Nullable<string>, senderId?: Nullable<string>): Nullable<boolean> | Promise<Nullable<boolean>>;
    createUsername(username?: Nullable<string>): Nullable<CreateUsernameResponse> | Promise<Nullable<CreateUsernameResponse>>;
}

export interface Conversation {
    id?: Nullable<string>;
    lastSentMessage?: Nullable<Message>;
    participants?: Nullable<Nullable<Participant>[]>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export interface Participant {
    id?: Nullable<string>;
    user?: Nullable<User>;
    hasSeenLastMessage?: Nullable<boolean>;
}

export interface ConversationUpdatedSubscriptionPayload {
    conversation?: Nullable<Conversation>;
}

export interface ConversationDeletedSubscriptionPayload {
    id?: Nullable<string>;
}

export interface IQuery {
    getConversations(): Nullable<Nullable<Conversation>[]> | Promise<Nullable<Nullable<Conversation>[]>>;
    getMessages(conversationId?: Nullable<string>): Nullable<Nullable<Message>[]> | Promise<Nullable<Nullable<Message>[]>>;
    findUsers(username?: Nullable<string>): Nullable<Nullable<FoundUser>[]> | Promise<Nullable<Nullable<FoundUser>[]>>;
}

export interface CreateConversationResponse {
    conversationId?: Nullable<string>;
}

export interface ISubscription {
    conversationCreated(): Nullable<Conversation> | Promise<Nullable<Conversation>>;
    conversationUpdated(): Nullable<ConversationUpdatedSubscriptionPayload> | Promise<Nullable<ConversationUpdatedSubscriptionPayload>>;
    conversationDeleted(): Nullable<ConversationDeletedSubscriptionPayload> | Promise<Nullable<ConversationDeletedSubscriptionPayload>>;
    messageSent(conversationId?: Nullable<string>): Nullable<Message> | Promise<Nullable<Message>>;
}

export interface Message {
    id?: Nullable<string>;
    sender?: Nullable<User>;
    body?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
}

export interface User {
    id?: Nullable<string>;
    name?: Nullable<string>;
    email?: Nullable<string>;
    image?: Nullable<string>;
    username?: Nullable<string>;
    emailVerified?: Nullable<boolean>;
}

export interface FoundUser {
    id: string;
    username?: Nullable<string>;
    image?: Nullable<string>;
}

export interface CreateUsernameResponse {
    success?: Nullable<boolean>;
    error?: Nullable<string>;
}

export type DateTime = any;
type Nullable<T> = T | null;
