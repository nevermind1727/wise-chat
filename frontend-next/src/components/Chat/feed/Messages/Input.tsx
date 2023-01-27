import { useMutation } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import MessagesOperations from "../../../../graphql/operations/message-operations";
import {
  GetMessagesResponse,
  SendMessageParams,
} from "../../../../utils/types";
import cuid from "cuid";

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
      console.log("HERE IS THE MESSAGE DATA ", data.sendMessage);
      setMessageBody("");
    } catch (e: any) {
      console.error(e);
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
