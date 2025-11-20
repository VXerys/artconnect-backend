import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Get Dashboard Metrics
export const getDashboardMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
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

    const totalArtworks = await prisma.artwork.count({ where: { userId: user.id } });
    const totalContacts = await prisma.contact.count({ where: { userId: user.id } });
    const totalDeals = await prisma.salesDeal.count({ where: { userId: user.id } });
    const activeDeals = await prisma.salesDeal.count({
      where: {
        userId: user.id,
        stage: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] }
      }
    });

    const wonDeals = await prisma.salesDeal.findMany({
      where: { userId: user.id, stage: 'CLOSED_WON' }
    });

    const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.amount, 0);

    const pipelineDeals = await prisma.salesDeal.findMany({
       where: {
        userId: user.id,
        stage: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] }
      }
    });
    const pipelineValue = pipelineDeals.reduce((sum, deal) => sum + deal.amount, 0);

    // Conversion Rate: Won / (Won + Lost) * 100
    const lostDealsCount = await prisma.salesDeal.count({
      where: { userId: user.id, stage: 'CLOSED_LOST' }
    });
    const wonDealsCount = wonDeals.length;
    const closedDealsCount = wonDealsCount + lostDealsCount;
    const conversionRate = closedDealsCount > 0 ? (wonDealsCount / closedDealsCount) * 100 : 0;

    const recentActivities = await prisma.activity.findMany({
      where: { userId: user.id },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: {
        totalArtworks,
        totalContacts,
        totalDeals,
        activeDeals,
        totalRevenue,
        pipelineValue,
        conversionRate,
        recentActivities
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

// Get Revenue Analytics (Simplified for MVP)
export const getRevenueAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const firebaseUid = req.user?.uid;
    // ... Auth checks (omitted for brevity, same as above)
    if (!firebaseUid) {
       res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
       return;
    }
    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) {
       res.status(404).json({ success: false, error: { message: 'User not found' } });
       return;
    }

    const wonDeals = await prisma.salesDeal.findMany({
      where: { userId: user.id, stage: 'CLOSED_WON' }
    });

    const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const totalDeals = wonDeals.length;
    const averageDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0;

    // Group by month (Simplified logic for MVP)
    // Note: SQLite/MySQL specific date functions are harder to make portable.
    // We will do simple JS grouping for now.
    const timelineMap = new Map<string, { revenue: number, deals: number }>();

    wonDeals.forEach(deal => {
      if (deal.closedDate) {
        const month = deal.closedDate.toISOString().slice(0, 7); // YYYY-MM
        const current = timelineMap.get(month) || { revenue: 0, deals: 0 };
        timelineMap.set(month, {
          revenue: current.revenue + deal.amount,
          deals: current.deals + 1
        });
      }
    });

    const timeline = Array.from(timelineMap.entries()).map(([period, data]) => ({
      period,
      ...data
    })).sort((a, b) => b.period.localeCompare(a.period));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalDeals,
          averageDealSize
        },
        timeline
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

// Get Pipeline Metrics
export const getPipelineMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
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

    const deals = await prisma.salesDeal.findMany({
      where: { userId: user.id }
    });

    const byStage: any = {};
    const stages = ['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];

    stages.forEach(stage => {
      const stageDeals = deals.filter(d => d.stage === stage);
      byStage[stage] = {
        count: stageDeals.length,
        value: stageDeals.reduce((sum, d) => sum + d.amount, 0)
      };
    });

    // Conversion Rates (Lead to Won approximation)
    const leadCount = byStage['LEAD'].count;
    const wonCount = byStage['CLOSED_WON'].count;

    // Detailed funnel is hard without historical snapshots, we return static calc
    const conversionRate = {
      overallWinRate: deals.length > 0 ? (wonCount / deals.length) * 100 : 0
    };

    res.status(200).json({
      success: true,
      data: {
        byStage,
        conversionRate
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};
