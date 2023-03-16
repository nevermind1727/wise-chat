import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Stack,
  Avatar,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import userOperations from "../../../../graphql/operations/user-operations";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  CreateConversationParams,
  CreateConversationResponse,
  FindUsersParams,
  FindUsersResponse,
  FoundUser,
  GetWiseAiResponse,
} from "../../../../utils/types";
import UserSearchList from "./searchUsers/UserSearchList";
import ConversationParticipants from "./ConversationParticipants";
import conversationOperations from "../../../../graphql/operations/conversation-operations";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, session }) => {
  const { data: wiseData, error: wiseError } = useQuery<
    GetWiseAiResponse,
    null
  >(userOperations.Queries.getWiseAi);
  const [username, setUsername] = useState("");
  const [conversationParticipants, setConversationParticipants] = useState<
    Array<FoundUser>
  >([]);
  const [showUser, setShowUser] = useState(true);
  const {
    user: { id: userId },
  } = session;
  const router = useRouter();

  const addParticipant = (user: FoundUser) => {
    setConversationParticipants((prev) => [...prev, user]);
    setUsername("");
    setShowUser(false);
  };

  const removeParticipant = (userId: string) => {
    setConversationParticipants((prev) =>
      prev.filter((pr) => userId !== pr.id)
    );
    setShowUser(true);
  };

  const [findUsers, { data, error, loading }] = useLazyQuery<
    FindUsersResponse,
    FindUsersParams
  >(userOperations.Queries.findUsers);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    findUsers({ variables: { username } });
  };

  const [createConversation, { loading: conversationLoading }] = useMutation<
    CreateConversationResponse,
    CreateConversationParams
  >(conversationOperations.Mutations.createConversation);

  const onCreateConversation = async () => {
    try {
      const participantsIds = [
        userId,
        ...conversationParticipants.map((part) => part.id),
      ];
      const { data } = await createConversation({
        variables: { participantsIds },
      });
      if (!data) {
        throw new Error("Failed to create conversation");
      }

      const {
        createConversation: { conversationId },
      } = data;
      onClose();
      router.push({ query: { conversationId } });
      setConversationParticipants([]);
    } catch (e: any) {
      toast.error(e?.message);
    }
  };

  return (
    <>
      <ChakraModal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#171923" pb={4}>
          <ModalHeader>Create a Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={5}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {wiseData && (
                  <Stack
                    direction="row"
                    key={wiseData.getWiseAi.id}
                    align="center"
                    spacing={4}
                    py={2}
                    px={4}
                    borderRadius={4}
                    _hover={{ bg: "#2D3748" }}
                  >
                    <Avatar src={wiseData.getWiseAi.image} />
                    <Flex justify="space-between" align="center" width="100%">
                      <Text>{wiseData.getWiseAi.username}</Text>
                      <Stack direction="row" spacing={6} alignItems="center">
                        <Box color="red">NEW!</Box>
                        <Button
                          onClick={() => addParticipant(wiseData.getWiseAi)}
                        >
                          Start!
                        </Button>
                      </Stack>
                    </Flex>
                  </Stack>
                )}

                <Button type="submit" disabled={!username} isLoading={loading}>
                  Search
                </Button>
              </Stack>
            </form>
            {data?.findUsers && (
              <UserSearchList
                users={data?.findUsers}
                addParticipant={addParticipant}
                showUser={showUser}
              />
            )}
            {conversationParticipants.length > 0 && (
              <>
                <ConversationParticipants
                  conversationParticipants={conversationParticipants}
                  removeParticipant={removeParticipant}
                />
                <Button
                  width="100%"
                  mt={6}
                  isLoading={conversationLoading}
                  onClick={onCreateConversation}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </ChakraModal>
    </>
  );
};
export default Modal;
