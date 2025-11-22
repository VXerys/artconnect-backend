import prisma from '../utils/prisma';
import { Prisma, Artwork } from '@prisma/client';
import * as activityService from './activityService';

export interface CreateArtworkInput {
  title: string;
  artist: string;
  price: number;
  description?: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  currency?: string;
  category?: string;
  tags?: string[];
  userId: string;
}

export interface UpdateArtworkInput {
  title?: string;
  artist?: string;
  price?: number;
  description?: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  currency?: string;
  category?: string;
  tags?: string[];
  status?: any;
  imageUrl?: string;
}

export interface GetArtworksFilters {
  status?: string;
  category?: string;
  userId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getArtworks = async (filters: GetArtworksFilters) => {
  const { status, category, userId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.ArtworkWhereInput = {};

  if (status) whereClause.status = status as any;
  if (category) whereClause.category = category;
  if (userId) whereClause.userId = userId;

  const total = await prisma.artwork.count({ where: whereClause });
  const artworks = await prisma.artwork.findMany({
    where: whereClause,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return { artworks, total };
};

export const getArtworkById = async (id: string): Promise<Artwork | null> => {
  return await prisma.artwork.findUnique({
    where: { id },
    include: {
      salesDeals: true,
      activities: true,
    },
  });
};

export const createArtwork = async (data: CreateArtworkInput) => {
  const { tags, ...rest } = data;

  // Note: 'tags' is Json in schema, so we pass it directly.
  const artwork = await prisma.artwork.create({
    data: {
      ...rest,
      tags: tags as any,
      status: 'AVAILABLE',
    },
  });

  await activityService.createActivity({
    type: 'ARTWORK_CREATED',
    title: `Created artwork: ${artwork.title}`,
    userId: data.userId,
    artworkId: artwork.id,
  });

  return artwork;
};

export const updateArtwork = async (id: string, userId: string, data: UpdateArtworkInput) => {
  const existingArtwork = await prisma.artwork.findUnique({ where: { id } });

  if (!existingArtwork) throw new Error('Artwork not found');
  if (existingArtwork.userId !== userId) throw new Error('Permission denied');

  const { tags, ...rest } = data;

  const updatedArtwork = await prisma.artwork.update({
    where: { id },
    data: {
      ...rest,
      tags: tags as any,
    },
  });

  await activityService.createActivity({
    type: 'ARTWORK_UPDATED',
    title: `Updated artwork: ${updatedArtwork.title}`,
    userId: userId,
    artworkId: id,
  });

  return updatedArtwork;
};

export const deleteArtwork = async (id: string, userId: string) => {
  const existingArtwork = await prisma.artwork.findUnique({ where: { id } });

  if (!existingArtwork) throw new Error('Artwork not found');
  if (existingArtwork.userId !== userId) throw new Error('Permission denied');

  return await prisma.artwork.delete({ where: { id } });
};
