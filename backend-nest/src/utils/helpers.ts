import { ParticipantPopulated } from './types';

export function isUserConversationParticipant(
  participants: Array<ParticipantPopulated>,
  userId: string,
): boolean {
  return !!participants.find((part) => part.user.id === userId);
}
