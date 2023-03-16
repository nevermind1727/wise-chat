import React from "react";
import { FoundUser } from "../../../../../utils/types";
import { Flex, Stack, Text } from "@chakra-ui/react";
import SearchedUser from "./SearchedUser";

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
            <SearchedUser user={user} addParticipant={addParticipant} />
          ))}
        </Stack>
      )}
    </>
  );
};
export default UserSearchList;
