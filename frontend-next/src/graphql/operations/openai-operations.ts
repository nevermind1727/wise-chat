import { gql } from "@apollo/client";

export default {
  Mutations: {
    generateAiResponse: gql`
      mutation GenerateAiResponse(
        $prompt: String
        $conversationId: String
        $senderId: String
      ) {
        generateAiResponse(
          prompt: $prompt
          conversationId: $conversationId
          senderId: $senderId
        )
      }
    `,
  },
};
