import React from 'react';
import { FoundUser } from '../../../../utils/types';
import { Flex, Stack, Text } from '@chakra-ui/react';
import {CgCloseO} from "react-icons/cg"

type ConversationParticipantsProps = {
    conversationParticipants: Array<FoundUser>;
    removeParticipant: (userId: string) => void
};

const ConversationParticipants:React.FC<ConversationParticipantsProps> = ({conversationParticipants, removeParticipant}) => {
    
    return (
        <Flex mt={8} gap="10px" flexWrap="wrap">
            {conversationParticipants.map(part => (
                <Stack direction="row" align="center" key={part.id} bg="#2D3748" p={2} borderRadius={4}>
                    <Text>{part.username}</Text>
                    <CgCloseO size={20} onClick={() => removeParticipant(part.id)} cursor="pointer" />
                </Stack>
            ))}
        </Flex>
    )
}
export default ConversationParticipants;