import { gql } from "@apollo/client";
import { getMessagesFields } from "./message-operations";

export const getConversationsFields = `
        id
        participants {
            user {
                username
                id
                image
            }
            hasSeenLatestMessage
        }
        lastSentMessage {
            ${getMessagesFields}
        }
        updatedAt
`;

export default {
  Queries: {
    getConversations: gql`
            query GetConversations {
                getConversations {
                    ${getConversationsFields}
                }
            }
        `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantsIds: [String]!) {
        createConversation(participantsIds: $participantsIds) {
          conversationId
        }
      }
    `,
    markAsRead: gql`
      mutation MarkAsRead($conversationId: String!) {
        markAsRead(conversationId: $conversationId)
      }
    `,
    deleteConversation: gql`
      mutation DeleteConversation($conversationId: String!) {
        deleteConversation(conversationId: $conversationId)
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
            subscription ConversationCreated {
                conversationCreated {
                    ${getConversationsFields}
                }
            }
           `,
    conversationDeleted: gql`
      subscription ConversationDeleted {
        conversationDeleted {
          id
        }
      }
    `,
  },
};
