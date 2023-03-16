import { Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { BiMessageSquareDots } from "react-icons/bi";
import { GetConversationsResponse } from "../../../utils/types";
import ConversationOperations from "../../../graphql/operations/conversation-operations";
import { useQuery } from "@apollo/client";

const NoConversation: React.FC = () => {
  const { data, loading, error } = useQuery<GetConversationsResponse, null>(
    ConversationOperations.Queries.getConversations
  );

  if (!data?.getConversations || loading || error) return null;

  const { getConversations } = data;

  const hasConversations = getConversations.length;

  const text = hasConversations
    ? "Select a Conversation"
    : "Let's Get Started 🥳";

  return (
    <Flex height="100%" justify="center" align="center">
      <Stack spacing={10} align="center">
        <Text fontSize={40}>{text}</Text>
        <BiMessageSquareDots fontSize={90} />
      </Stack>
    </Flex>
  );
};
export default NoConversation;
