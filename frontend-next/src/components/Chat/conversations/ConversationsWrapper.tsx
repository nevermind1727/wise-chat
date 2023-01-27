import { Session } from "next-auth";
import ConversationsList from "./ConversationsList";
import { Box } from "@chakra-ui/react";
import ConversationOperations from "../../../graphql/operations/conversation-operations";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  GetConversationsResponse,
  ConversationCreatedSubscriptionData,
  ConversationUpdatedResponse,
  ConversationDeletedResponse,
} from "../../../utils/types";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import SkeletonLoader from "../../common/SkeletonLoader";
import { ParticipantPopulated } from "../../../../../backend-nest/src/utils/types";

interface ConversationsWrapperProps {
  session: Session;
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({
  session,
}) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<GetConversationsResponse, null>(
    ConversationOperations.Queries.getConversations,
    {
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );
  console.log(conversationsData);
  const router = useRouter();
  const [markAsRead] = useMutation<
    { markAsRead: boolean },
    { conversationId: string }
  >(ConversationOperations.Mutations.markAsRead);
  const {
    query: { conversationId },
  } = router;
  useSubscription<ConversationUpdatedResponse, null>(
    ConversationOperations.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;
        console.log("ON DATA FIRING", subscriptionData);
        if (!subscriptionData) return;
        const {
          conversationUpdated: { conversation: updatedConversation },
        } = subscriptionData;
        const currentViewingConversation =
          updatedConversation.id === conversationId;
        if (currentViewingConversation) {
          onViewConversation(conversationId, false);
        }
      },
    }
  );
  useSubscription<ConversationDeletedResponse, null>(
    ConversationOperations.Subscriptions.conversationDeleted,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;
        if (!subscriptionData) return;
        const existing = client.readQuery<GetConversationsResponse>({
          query: ConversationOperations.Queries.getConversations,
        });
        if (!existing) return;
        const { getConversations } = existing;
        const {
          conversationDeleted: { id: deletedConversationId },
        } = subscriptionData;

        client.writeQuery<GetConversationsResponse>({
          query: ConversationOperations.Queries.getConversations,
          data: {
            getConversations: getConversations.filter(
              (conv) => conv.id !== deletedConversationId
            ),
          },
        });
        router.push("/");
      },
    }
  );
  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ): Promise<void> => {
    router.push({ query: { conversationId } });
    if (hasSeenLatestMessage) return;
    try {
      await markAsRead({
        variables: {
          conversationId,
        },
        optimisticResponse: {
          markAsRead: true,
        },
        update: (cache) => {
          const participantsFragment = cache.readFragment<{
            participants: Array<ParticipantPopulated>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                    image
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });
          if (!participantsFragment) return;
          const participants = [...participantsFragment.participants];
          const participantIndex = participants.findIndex(
            (part) => part.user.id === session.user.id
          );
          if (participantIndex === -1) return;
          const currentUserParticipant = participants[participantIndex];
          participants[participantIndex] = {
            ...currentUserParticipant,
            hasSeenLatestMessage: true,
          };
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData }: ConversationCreatedSubscriptionData
      ) => {
        console.log("SUBSCRIPTION DATA HERE ", subscriptionData);
        if (!subscriptionData.data) return prev;
        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          getConversations: [newConversation, ...prev.getConversations],
        });
      },
    });
  };
  useEffect(() => {
    subscribeToNewConversations();
  }, []);
  return (
    <Box
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "430px" }}
      bg="#1A202C"
      flexDirection="column"
      gap={4}
      py={6}
      px={3}
    >
      {conversationsLoading ? (
        <SkeletonLoader count={7} height="80px" />
      ) : (
        <ConversationsList
          session={session}
          conversations={conversationsData?.getConversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
};
export default ConversationsWrapper;
