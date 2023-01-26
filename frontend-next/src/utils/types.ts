import {
  ConversationPopulated,
  MessagePopulated,
} from "../../../backend-nest/src/utils/types";

export interface CreateUsernameResponse {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface CreateUsernameParams {
  username: string;
}

export interface FindUsersResponse {
  findUsers: Array<FoundUser>;
}

export interface FoundUser {
  id: string;
  username: string;
  image: string;
}

export interface FindUsersParams {
  username: string;
}

export interface CreateConversationParams {
  participantsIds: Array<string>;
}

export interface CreateConversationResponse {
  createConversation: {
    conversationId: string;
  };
}

export interface GetConversationsResponse {
  getConversations: Array<ConversationPopulated>;
}

export interface GetMessagesResponse {
  getMessages: Array<MessagePopulated>;
}

export interface GetMessagesParams {
  conversationId: string;
}

export interface SendMessageParams {
  senderId: string;
  conversationId: string;
  body: string;
}

export interface ConversationCreatedSubscriptionData {
  subscriptionData: {
    data: {
      conversationCreated: ConversationPopulated;
    };
  };
}

export interface MessageSentSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated;
    };
  };
}

export interface ConversationUpdatedResponse {
  conversationUpdated: {
    conversation: Omit<ConversationPopulated, "lastSentMessage"> & {
      lastSentMessage: MessagePopulated;
    };
  };
}

export interface ConversationDeletedResponse {
  conversationDeleted: {
    id: string;
  };
}
