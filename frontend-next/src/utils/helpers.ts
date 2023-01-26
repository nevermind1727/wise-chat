import { ParticipantPopulated } from "../../../backend-nest/src/utils/types";

export const formatUsernames = (
  participants: Array<ParticipantPopulated>,
  currentUserId: string
) => {
  const usernames = participants
    .filter((part) => part.user.id !== currentUserId)
    .map((p) => p.user.username);
  return usernames.join(", ");
};

export const getParticipantImage = (
  participants: Array<ParticipantPopulated>,
  currentUserId: string
) => {
  const participant = participants.find(
    (part) => part.user.id !== currentUserId
  );
  console.log(participant);
  const participantImage = participant?.user.image;
  if (participantImage === null) return "";
  return participantImage;
};
