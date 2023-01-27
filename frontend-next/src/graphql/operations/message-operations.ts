import { gql } from "@apollo/client";

export const getMessagesFields = `
    id
    sender {
      id
      username
      image
    }
    body
    createdAt
`;

const getConversationsFields = `
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
    getMessages: gql`
            query GetMessages($conversationId: String) {
                getMessages(conversationId: $conversationId) {
                    ${getMessagesFields}
                }
            }
        `,
  },
  Mutations: {
    sendMessage: gql`
      mutation SendMessage(
        $conversationId: String
        $senderId: String
        $body: String
      ) {
        sendMessage(
          conversationId: $conversationId
          senderId: $senderId
          body: $body
        )
      }
    `,
  },
  Subscriptions: {
    messageSent: gql`
      subscription MessageSent($conversationId: String) {
        messageSent(conversationId: $conversationId) {
          ${getMessagesFields}
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
  },
};
