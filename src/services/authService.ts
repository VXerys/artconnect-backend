import prisma from '../utils/prisma';
import { User } from '@prisma/client';

export interface SyncUserInput {
  uid: string;
  email: string;
  name?: string;
  photoUrl?: string;
}

export const syncUser = async (input: SyncUserInput): Promise<User> => {
  const { uid, email, name, photoUrl } = input;

  const existingUser = await prisma.user.findUnique({
    where: { id: uid },
  });

  if (existingUser) {
    // Optional: Update basic info on sync if changed in Firebase?
    // For now, just return existing user as requested.
    return existingUser;
  }

  return await prisma.user.create({
    data: {
      id: uid, // Use Firebase UID as DB ID
      email,
      name: name || 'Unknown User',
      photoUrl,
      role: 'USER',
    },
  });
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id: uid },
  });
};

export const updateUserProfile = async (uid: string, data: { name?: string; photoUrl?: string }) => {
  return await prisma.user.update({
    where: { id: uid },
    data,
  });
};
