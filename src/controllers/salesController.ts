import { Request, Response } from 'express';
import * as salesService from '../services/salesService';
import { ApiResponse, PaginatedResponse } from '../types';
import { SalesDeal } from '@prisma/client';

const getPagination = (page: number, limit: number, total: number) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getSalesDeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const { stage, sortBy, sortOrder } = req.query;
    const userId = req.user?.uid!;

    const result = await salesService.getSalesDeals({
      userId,
      page,
      limit,
      stage: stage as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    });

    const response: ApiResponse<PaginatedResponse<SalesDeal>> = {
      success: true,
      data: {
        data: result.deals,
        pagination: getPagination(page, limit, result.total)
      }
    };

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

export const getSalesDealById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deal = await salesService.getSalesDealById(id);

    if (!deal) {
      res.status(404).json({ success: false, error: { message: 'Deal not found' } });
      return;
    }

    if (deal.userId !== req.user?.uid) {
        res.status(403).json({ success: false, error: { message: 'Permission denied' } });
        return;
    }

    res.status(200).json({
      success: true,
      data: deal
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

export const createSalesDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid!;

    const newDeal = await salesService.createSalesDeal({
      ...req.body,
      userId
    });

    res.status(201).json({
      success: true,
      data: newDeal,
      message: 'Deal created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

export const updateSalesDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid!;

    const updatedDeal = await salesService.updateSalesDeal(id, userId, req.body);

    res.status(200).json({
      success: true,
      data: updatedDeal,
      message: 'Deal updated successfully'
    });
  } catch (error: any) {
    if (error.message === 'Deal not found') {
        res.status(404).json({ success: false, error: { message: error.message } });
    } else if (error.message === 'Permission denied') {
        res.status(403).json({ success: false, error: { message: error.message } });
    } else {
        res.status(500).json({ success: false, error: { message: error.message || 'Internal Server Error' } });
    }
  }
};

export const updateDealStage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.uid!;
        const { stage, probability } = req.body;

        const updatedDeal = await salesService.updateDealStage(id, userId, stage, probability);

        res.status(200).json({
          success: true,
          data: updatedDeal,
          message: 'Deal stage updated successfully'
        });
      } catch (error: any) {
        if (error.message === 'Deal not found') {
            res.status(404).json({ success: false, error: { message: error.message } });
        } else if (error.message === 'Permission denied') {
            res.status(403).json({ success: false, error: { message: error.message } });
        } else {
            res.status(500).json({ success: false, error: { message: error.message || 'Internal Server Error' } });
        }
      }
};

export const deleteSalesDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid!;

    await salesService.deleteSalesDeal(id, userId);

    res.status(200).json({
      success: true,
      message: 'Deal deleted successfully'
    });
  } catch (error: any) {
    if (error.message === 'Deal not found') {
        res.status(404).json({ success: false, error: { message: error.message } });
    } else if (error.message === 'Permission denied') {
        res.status(403).json({ success: false, error: { message: error.message } });
    } else {
        res.status(500).json({ success: false, error: { message: error.message || 'Internal Server Error' } });
    }
  }
};
