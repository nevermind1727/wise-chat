import { gql } from "@apollo/client";
import { getMessagesFields } from "./message-operations";

const getConversationsFields = `
        id
        participants {
            user {
                username
                id
                image
            }
            hasSeenLastMessage
        }
        updatedAt
        lastSentMessage {
            ${getMessagesFields}
        }
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
    conversationUpdated: gql`
      subscription ConversationUpdated {
        conversationUpdated {
          conversation {
            ${getConversationsFields}
          }
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
