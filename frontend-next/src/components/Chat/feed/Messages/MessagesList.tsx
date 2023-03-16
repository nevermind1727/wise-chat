import { Flex, Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import MessagesOperations from "../../../../graphql/operations/message-operations";
import {
  GetMessagesParams,
  GetMessagesResponse,
  MessageSentSubscriptionData,
} from "../../../../utils/types";
import { useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import SkeletonLoader from "../../../common/SkeletonLoader";
import MessageItem from "./MessageItem";

type MessagesListProps = {
  userId: string;
  conversationId: string;
};

const MessagesList: React.FC<MessagesListProps> = ({
  userId,
  conversationId,
}) => {
  const {
    data: messagesData,
    loading: messagesLoading,
    error: messagesError,
    subscribeToMore,
  } = useQuery<GetMessagesResponse, GetMessagesParams>(
    MessagesOperations.Queries.getMessages,
    {
      variables: { conversationId },
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  const subscribeToNewMessages = (conversationId: string) => {
    return subscribeToMore({
      document: MessagesOperations.Subscriptions.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (
        prev,
        { subscriptionData }: MessageSentSubscriptionData
      ) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.messageSent;
        return Object.assign({}, prev, {
          getMessages:
            newMessage.sender.id === userId
              ? prev.getMessages
              : [newMessage, ...prev.getMessages],
        });
      },
    });
  };
  useEffect(() => {
    const unsubscribe = subscribeToNewMessages(conversationId);
    return () => unsubscribe();
  }, [conversationId]);

  if (messagesError) return null;

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {messagesLoading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={4} height="60px" />
        </Stack>
      )}
      {messagesData?.getMessages && (
        <Flex
          direction="column-reverse"
          overflowY="scroll"
          height="100%"
          css={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#171923",
              borderRadius: "24px",
            },
          }}
        >
          {messagesData.getMessages.map((message) => (
            <MessageItem
              message={message}
              sentByMe={message.sender.id === userId}
              key={message.id}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};
export default MessagesList;
