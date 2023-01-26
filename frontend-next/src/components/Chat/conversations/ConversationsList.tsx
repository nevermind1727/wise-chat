import React, { useState } from "react";
import { Session } from "next-auth";
import { Box, Button, Text } from "@chakra-ui/react";
import ConversationModal from "./modal/Modal";
import { ConversationPopulated } from "../../../../../backend-nest/src/utils/types";
import ConversationItem from "./ConversationItem";
import { useRouter } from "next/router";
import ConversationOperations from "../../../graphql/operations/conversation-operations";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { GraphQLError } from "graphql";
import { signOut } from "next-auth/react";

type ConversationsListProps = {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ) => void;
};

const ConversationsList: React.FC<ConversationsListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const router = useRouter();
  const { conversationId } = router.query;
  const userId = session.user.id;

  const sortedConversations = [...conversations];
  sortedConversations.sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
  );

  const [deleteConversation, { data, loading, error }] = useMutation<
    { deleteConversation: boolean },
    { conversationId: string }
  >(ConversationOperations.Mutations.deleteConversation);

  const onDeleteConversation = async (conversationId: string) => {
    try {
      toast.promise(
        deleteConversation({
          variables: {
            conversationId,
          },
          update: () => {
            router.replace(
              typeof process.env.NEXTAUTH_URL === "string"
                ? process.env.NEXTAUTH_URL
                : ""
            );
          },
        }),
        {
          loading: "Deleting conversation",
          success: "Deleted successfully",
          error: "Failed to delete conversation",
        }
      );
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message);
    }
  };

  return (
    <Box
      width={{ base: "100%", md: "400px" }}
      position="relative"
      height="100%"
      overflow="hidden"
    >
      <Box
        py={2}
        px={4}
        mb={4}
        bg="#171923"
        borderRadius={4}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text textAlign="center" fontWeight={500}>
          Find or start new conversation
        </Text>
      </Box>
      <Box px={4}>
        {sortedConversations.map((conv) => {
          const convParticipant = conv.participants.find(
            (part) => part.user.id === userId
          );
          return (
            <ConversationItem
              userId={userId}
              key={conv.id}
              conversation={conv}
              onClick={() =>
                onViewConversation(
                  conv.id,
                  convParticipant?.hasSeenLatestMessage
                )
              }
              isSelected={router.query.conversationId === conv.id}
              hasSeenLatestMessage={convParticipant?.hasSeenLatestMessage}
              onDeleteConversation={onDeleteConversation}
            />
          );
        })}
      </Box>
      <ConversationModal session={session} isOpen={isOpen} onClose={onClose} />
      <Box position="absolute" bottom={0} left={0} px={8} width="100%">
        <Button width="100%" onClick={() => signOut()}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};
export default ConversationsList;
