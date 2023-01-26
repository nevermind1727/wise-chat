import React from "react";
import { FoundUser } from "../../../../utils/types";
import { Avatar, Button, Flex, Stack, Text } from "@chakra-ui/react";

interface UserSearchListProps {
  users: Array<FoundUser>;
  addParticipant: (user: FoundUser) => void;
  showUser: boolean;
}

const UserSearchList: React.FC<UserSearchListProps> = ({
  users,
  addParticipant,
  showUser,
}) => {
  return (
    <>
      {users.length === 0 || !showUser ? (
        <Flex mt={6} justify="center">
          <Text>No users found</Text>
        </Flex>
      ) : (
        <Stack mt={6}>
          {users.map((user) => (
            <Stack
              direction="row"
              key={user.id}
              align="center"
              spacing={4}
              py={2}
              px={4}
              borderRadius={4}
              _hover={{ bg: "#2D3748" }}
            >
              <Avatar src={user.image} />
              <Flex justify="space-between" align="center" width="100%">
                <Text>{user.username}</Text>
                <Button onClick={() => addParticipant(user)}>Select</Button>
              </Flex>
            </Stack>
          ))}
        </Stack>
      )}
    </>
  );
};
export default UserSearchList;
