import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import MessagesOperations from "../../../../graphql/operations/message-operations";
import {
  GetMessagesResponse,
  GetWiseAiResponse,
  SendMessageParams,
} from "../../../../utils/types";
import cuid from "cuid";
import conversationOperations from "../../../../graphql/operations/conversation-operations";
import openaiOperations from "../../../../graphql/operations/openai-operations";
import userOperations from "../../../../graphql/operations/user-operations";

type MessageInputProps = {
  session: Session;
  conversationId: string;
};

const MessageInput: React.FC<MessageInputProps> = ({
  session,
  conversationId,
}) => {
  const [messageBody, setMessageBody] = useState("");
  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    SendMessageParams
  >(MessagesOperations.Mutations.sendMessage);
  const [getWiseAiConversation] = useLazyQuery<
    { getWiseAiConversation: { id: string } },
    null
  >(conversationOperations.Queries.getWiseAiConversation);
  const [getWiseAi] = useLazyQuery<GetWiseAiResponse, null>(
    userOperations.Queries.getWiseAi
  );
  const [generateAiResponse] = useMutation<
    { generateAiResponse: string },
    { prompt: string; conversationId: string; senderId: string }
  >(openaiOperations.Mutations.generateAiResponse);
  const onSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const messageParams: SendMessageParams = {
        senderId: session.user.id,
        conversationId,
        body: messageBody,
      };
      const { data, errors } = await sendMessage({
        variables: messageParams,
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          setMessageBody("");
          const existing = cache.readQuery<GetMessagesResponse>({
            query: MessagesOperations.Queries.getMessages,
            variables: { conversationId },
          }) as GetMessagesResponse;

          cache.writeQuery<GetMessagesResponse, { conversationId: string }>({
            query: MessagesOperations.Queries.getMessages,
            variables: { conversationId },
            data: {
              ...existing,
              getMessages: [
                {
                  id: cuid(),
                  body: messageBody,
                  senderId: session.user.id,
                  conversationId,
                  sender: {
                    id: session.user.id,
                    username: session.user.username,
                    image:
                      session.user.image === undefined
                        ? ""
                        : session.user.image,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...existing.getMessages,
              ],
            },
          });
        },
      });
      if (!data?.sendMessage || errors) {
        throw new Error("Error sending message");
      }
      const { data: getWiseAiConversationData } = await getWiseAiConversation();
      if (
        getWiseAiConversationData?.getWiseAiConversation.id === conversationId
      ) {
        const { data: getWiseAiData } = await getWiseAi();
        if (!getWiseAiData) {
          throw new Error("Error getting wise AI");
        }
        const {
          data: generateAiResponseData,
          errors: generateAiResponseError,
        } = await generateAiResponse({
          variables: {
            prompt: messageBody,
            conversationId,
            senderId: getWiseAiData?.getWiseAi.id,
          },
        });
      }
      setMessageBody("");
    } catch (e: any) {
      toast.error(e?.message);
    }
  };

  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={onSendMessage}>
        <Input
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          placeholder="New Message"
          size="md"
          resize="none"
          _focus={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "whieAlpha.300",
          }}
        />
      </form>
    </Box>
  );
};
export default MessageInput;
