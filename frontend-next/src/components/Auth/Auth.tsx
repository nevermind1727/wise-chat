import {
  Button,
  Center,
  Stack,
  Text,
  Image,
  Input,
  Box,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import * as React from "react";
import { useState } from "react";
import UserOperations from "../../graphql/operations/user-operations";
import { useMutation } from "@apollo/client";
import {
  CreateUsernameResponse,
  CreateUsernameParams,
} from "../../utils/types";
import toast from "react-hot-toast";
import { AiOutlineWechat } from "react-icons/ai";

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");
  const [createUsername, { loading, error }] = useMutation<
    CreateUsernameResponse,
    CreateUsernameParams
  >(UserOperations.Mutations.createUsername);
  const onSubmit = async () => {
    try {
      const { data } = await createUsername({ variables: { username } });

      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;
        throw new Error(error);
      }
      toast.success("Username successfully created!");
      reloadSession();
    } catch (e: any) {
      toast.error(e?.message);
    }
  };
  return (
    <Center height="100vh">
      <Stack align="center" spacing={5}>
        {session ? (
          <>
            <Text fontSize="3xl">Enter username:</Text>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
            <Button width="100%" onClick={onSubmit} isLoading={loading}>
              Save me!
            </Button>
          </>
        ) : (
          <>
            <Box display="flex">
              <Text fontSize="3xl" pr={4}>
                Wise Chat
              </Text>
              <AiOutlineWechat size={46} />
            </Box>
            <Button
              onClick={() => signIn("google")}
              leftIcon={<Image height="20px" src="/assets/googlelogo.png" />}
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
