import prisma from '../utils/prisma';
import { ActivityType } from '@prisma/client';

export interface CreateActivityInput {
  type: ActivityType;
  title: string;
  description?: string;
  userId: string;
  contactId?: string;
  artworkId?: string;
  dealId?: string;
}

export const createActivity = async (data: CreateActivityInput) => {
  return await prisma.activity.create({
    data: {
      type: data.type,
      title: data.title,
      description: data.description,
      userId: data.userId,
      contactId: data.contactId,
      artworkId: data.artworkId,
      dealId: data.dealId,
    },
  });
};
