import { Button, Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import * as React from 'react';
import FeedWrapper from './feed/FeedWrapper';
import ConversationsWrapper from './conversations/ConversationsWrapper';

interface ChatProps {
  session: Session;
}

const Chat: React.FC<ChatProps> = ({session}) => {
  return (
    <Flex height="100vh">
      <ConversationsWrapper session={session} />
      <FeedWrapper session={session} />
    </Flex>
  );
};

export default Chat;
