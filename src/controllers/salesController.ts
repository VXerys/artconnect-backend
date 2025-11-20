import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';

// Get All Deals
export const getSalesDeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stage, contactId, artworkId } = req.query;
    const firebaseUid = req.user?.uid;

    if (!firebaseUid) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) {
      res.status(404).json({ success: false, error: { message: 'User not found' } });
      return;
    }

    const whereClause: Prisma.SalesDealWhereInput = {
      userId: user.id
    };

    if (stage) whereClause.stage = stage as any;
    if (contactId) whereClause.contactId = contactId as string;
    if (artworkId) whereClause.artworkId = artworkId as string;

    const deals = await prisma.salesDeal.findMany({
      where: whereClause,
      include: {
        contact: { select: { id: true, name: true, company: true } },
        artwork: { select: { id: true, title: true, price: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // The docs mention grouping by stage in the response for /api/sales
    // "Get all sales deals grouped by stage"
    // But also query params allow filtering by stage.
    // If no filter is applied, we should probably return the grouped structure OR just list.
    // The doc says response data keys are stages (LEAD, QUALIFIED...).
    // I will stick to the doc format.

    // Grouping
    const grouped = {
      LEAD: [] as any[],
      QUALIFIED: [] as any[],
      PROPOSAL: [] as any[],
      NEGOTIATION: [] as any[],
      CLOSED_WON: [] as any[],
      CLOSED_LOST: [] as any[]
    };

    deals.forEach(deal => {
      if (grouped[deal.stage as keyof typeof grouped]) {
        grouped[deal.stage as keyof typeof grouped].push(deal);
      }
    });

    res.status(200).json({
      success: true,
      data: grouped
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

// Create Deal
export const createSalesDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, amount, currency, stage, probability, expectedCloseDate, contactId, artworkId } = req.body;
    const firebaseUid = req.user?.uid;

    if (!firebaseUid) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) {
      res.status(404).json({ success: false, error: { message: 'User not found' } });
      return;
    }

    if (!title || !amount || !contactId) {
      res.status(400).json({
        success: false,
        error: { message: 'Validation failed: title, amount, and contactId are required' }
      });
      return;
    }

    // Validate Contact Ownership
    const contact = await prisma.contact.findUnique({ where: { id: contactId } });
    if (!contact || contact.userId !== user.id) {
       res.status(400).json({ success: false, error: { message: 'Invalid contactId' } });
       return;
    }

    const newDeal = await prisma.salesDeal.create({
      data: {
        title,
        description,
        amount: parseFloat(amount),
        currency: currency || 'IDR',
        stage: stage || 'LEAD',
        probability: probability || 20,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        userId: user.id,
        contactId,
        artworkId: artworkId || null
      }
    });

    // Log Activity
    await prisma.activity.create({
      data: {
        type: 'DEAL_CREATED',
        title: `Created deal: ${title}`,
        userId: user.id,
        dealId: newDeal.id,
        contactId: contactId
      }
    });

    res.status(201).json({
      success: true,
      data: newDeal,
      message: 'Deal created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

// Update Deal Stage
export const updateDealStage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { stage, probability } = req.body;
    const firebaseUid = req.user?.uid;

    if (!firebaseUid) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) {
       res.status(404).json({ success: false, error: { message: 'User not found' } });
       return;
    }

    const existingDeal = await prisma.salesDeal.findUnique({ where: { id } });
    if (!existingDeal) {
      res.status(404).json({ success: false, error: { message: 'Deal not found' } });
      return;
    }

    if (existingDeal.userId !== user.id) {
      res.status(403).json({ success: false, error: { message: 'Permission denied' } });
      return;
    }

    const updateData: Prisma.SalesDealUpdateInput = {
      stage: stage,
      probability: probability
    };

    if (stage === 'CLOSED_WON' || stage === 'CLOSED_LOST') {
      updateData.closedDate = new Date();
    }

    const updatedDeal = await prisma.salesDeal.update({
      where: { id },
      data: updateData
    });

    // Log Activity
    const activityType = stage === 'CLOSED_WON' ? 'DEAL_WON' : stage === 'CLOSED_LOST' ? 'DEAL_LOST' : 'DEAL_STAGE_CHANGED';

    await prisma.activity.create({
      data: {
        type: activityType,
        title: `Deal stage updated to ${stage}`,
        userId: user.id,
        dealId: updatedDeal.id
      }
    });

    res.status(200).json({
      success: true,
      data: updatedDeal,
      message: 'Deal stage updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};
