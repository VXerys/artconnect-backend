import prisma from '../utils/prisma';
import { Prisma, Contact, ContactStatus, ContactType } from '@prisma/client';
import * as activityService from './activityService';

export interface CreateContactInput {
  name: string;
  type: ContactType;
  email?: string;
  phone?: string;
  company?: string;
  status?: ContactStatus;
  notes?: string;
  tags?: string[];
  userId: string;
}

export interface UpdateContactInput {
  name?: string;
  type?: ContactType;
  email?: string;
  phone?: string;
  company?: string;
  status?: ContactStatus;
  notes?: string;
  tags?: string[];
}

export interface GetContactsFilters {
  userId: string;
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getContacts = async (filters: GetContactsFilters) => {
  const { userId, type, status, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.ContactWhereInput = {
    userId,
  };

  if (type) whereClause.type = type as ContactType;
  if (status) whereClause.status = status as ContactStatus;
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } }, // PostgreSQL insensitive search
      { email: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
    ];
  }

  const total = await prisma.contact.count({ where: whereClause });
  const contacts = await prisma.contact.findMany({
    where: whereClause,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return { contacts, total };
};

export const getContactById = async (id: string): Promise<Contact | null> => {
  return await prisma.contact.findUnique({
    where: { id },
    include: {
      salesDeals: true,
      activities: true,
    },
  });
};

export const createContact = async (data: CreateContactInput) => {
  const { tags, ...rest } = data;

  const contact = await prisma.contact.create({
    data: {
      ...rest,
      tags: tags as any,
    },
  });

  await activityService.createActivity({
    type: 'CONTACT_CREATED',
    title: `Created contact: ${contact.name}`,
    userId: data.userId,
    contactId: contact.id,
  });

  return contact;
};

export const updateContact = async (id: string, userId: string, data: UpdateContactInput) => {
  const existingContact = await prisma.contact.findUnique({ where: { id } });

  if (!existingContact) throw new Error('Contact not found');
  if (existingContact.userId !== userId) throw new Error('Permission denied');

  const { tags, ...rest } = data;

  const updatedContact = await prisma.contact.update({
    where: { id },
    data: {
      ...rest,
      tags: tags as any,
    },
  });

  await activityService.createActivity({
    type: 'CONTACT_UPDATED',
    title: `Updated contact: ${updatedContact.name}`,
    userId: userId,
    contactId: id,
  });

  return updatedContact;
};

export const deleteContact = async (id: string, userId: string) => {
  const existingContact = await prisma.contact.findUnique({ where: { id } });

  if (!existingContact) throw new Error('Contact not found');
  if (existingContact.userId !== userId) throw new Error('Permission denied');

  return await prisma.contact.delete({ where: { id } });
};
