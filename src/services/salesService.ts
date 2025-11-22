import prisma from '../utils/prisma';
import { Prisma, SalesDeal, DealStage } from '@prisma/client';
import * as activityService from './activityService';

export interface CreateSalesDealInput {
  title: string;
  amount: number;
  contactId: string;
  artworkId?: string;
  stage?: DealStage;
  currency?: string;
  probability?: number;
  expectedCloseDate?: string | Date; // Date string or object
  description?: string;
  userId: string;
}

export interface UpdateSalesDealInput {
  title?: string;
  amount?: number;
  stage?: DealStage;
  currency?: string;
  probability?: number;
  expectedCloseDate?: string | Date;
  description?: string;
  closedDate?: string | Date;
}

export interface GetSalesFilters {
  userId: string;
  stage?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getSalesDeals = async (filters: GetSalesFilters) => {
  const { userId, stage, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.SalesDealWhereInput = {
    userId,
  };

  if (stage) whereClause.stage = stage as DealStage;

  const total = await prisma.salesDeal.count({ where: whereClause });
  const deals = await prisma.salesDeal.findMany({
    where: whereClause,
    include: {
      contact: {
        select: { id: true, name: true, company: true }
      },
      artwork: {
        select: { id: true, title: true, imageUrl: true, price: true }
      }
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return { deals, total };
};

export const getSalesDealById = async (id: string): Promise<SalesDeal | null> => {
  return await prisma.salesDeal.findUnique({
    where: { id },
    include: {
      contact: true,
      artwork: true,
      activities: true
    }
  });
};

export const createSalesDeal = async (data: CreateSalesDealInput) => {
  const deal = await prisma.salesDeal.create({
    data: {
      title: data.title,
      amount: data.amount,
      contactId: data.contactId,
      artworkId: data.artworkId,
      stage: data.stage || 'LEAD',
      currency: data.currency || 'IDR',
      probability: data.probability || 20,
      expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : undefined,
      description: data.description,
      userId: data.userId
    }
  });

  await activityService.createActivity({
    type: 'DEAL_CREATED',
    title: `Created deal: ${deal.title}`,
    userId: data.userId,
    dealId: deal.id,
    contactId: data.contactId,
    artworkId: data.artworkId
  });

  return deal;
};

export const updateSalesDeal = async (id: string, userId: string, data: UpdateSalesDealInput) => {
  const existingDeal = await prisma.salesDeal.findUnique({ where: { id } });

  if (!existingDeal) throw new Error('Deal not found');
  if (existingDeal.userId !== userId) throw new Error('Permission denied');

  const updatedDeal = await prisma.salesDeal.update({
    where: { id },
    data: {
        ...data,
        expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : undefined,
        closedDate: data.closedDate ? new Date(data.closedDate) : undefined,
    }
  });

  // Log activity if stage changed
  if (data.stage && data.stage !== existingDeal.stage) {
     await activityService.createActivity({
        type: 'DEAL_STAGE_CHANGED',
        title: `Deal stage changed to ${data.stage}`,
        userId: userId,
        dealId: id
     });
  }

  return updatedDeal;
};

export const deleteSalesDeal = async (id: string, userId: string) => {
  const existingDeal = await prisma.salesDeal.findUnique({ where: { id } });

  if (!existingDeal) throw new Error('Deal not found');
  if (existingDeal.userId !== userId) throw new Error('Permission denied');

  return await prisma.salesDeal.delete({ where: { id } });
};

// Specific Service Method for Stage Update (if controller separates it)
export const updateDealStage = async (id: string, userId: string, stage: DealStage, probability?: number) => {
    return await updateSalesDeal(id, userId, { stage, probability });
};
