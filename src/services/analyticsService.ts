import prisma from '../utils/prisma';

export const getDashboardMetrics = async (userId: string) => {
  // Parallelize queries for performance
  const [
    totalArtworks,
    totalContacts,
    activeDeals,
    recentActivities,
    salesData
  ] = await Promise.all([
    // Total Artworks
    prisma.artwork.count({
      where: { userId }
    }),

    // Total Contacts
    prisma.contact.count({
      where: { userId }
    }),

    // Active Deals (Lead, Qualified, Proposal, Negotiation)
    prisma.salesDeal.count({
      where: {
        userId,
        stage: {
          in: ['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION']
        }
      }
    }),

    // Recent Activities (last 5)
    prisma.activity.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' }
    }),

    // Sales Revenue (Closed Won)
    prisma.salesDeal.aggregate({
      where: {
        userId,
        stage: 'CLOSED_WON'
      },
      _sum: {
        amount: true
      }
    })
  ]);

  return {
    totalArtworks,
    totalContacts,
    activeDeals,
    totalRevenue: salesData._sum.amount || 0,
    recentActivities
  };
};

export const getSalesPerformance = async (userId: string) => {
  const dealsByStage = await prisma.salesDeal.groupBy({
    by: ['stage'],
    where: { userId },
    _count: {
      id: true
    },
    _sum: {
      amount: true
    }
  });

  return dealsByStage.map(stage => ({
    stage: stage.stage,
    count: stage._count.id,
    value: stage._sum.amount || 0
  }));
};
