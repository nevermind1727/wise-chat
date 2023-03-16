import { Stack, Avatar, Flex, Button, Text } from "@chakra-ui/react";
import React from "react";
import { FoundUser } from "../../../../../utils/types";

type Props = {
  user: FoundUser;
  addParticipant: (user: FoundUser) => void;
};

const SearchedUser: React.FC<Props> = ({ user, addParticipant }) => {
  return (
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
  );
};

export default SearchedUser;
