import { Request, Response } from 'express';
import * as analyticsService from '../services/analyticsService';
import { ApiResponse } from '../types';

export const getDashboardMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid!;

    const metrics = await analyticsService.getDashboardMetrics(userId);

    const response: ApiResponse = {
      success: true,
      data: metrics
    };

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

export const getSalesPerformance = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid!;

    const performance = await analyticsService.getSalesPerformance(userId);

    const response: ApiResponse = {
      success: true,
      data: performance
    };

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};
