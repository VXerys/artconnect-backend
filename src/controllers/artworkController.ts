import { Request, Response } from 'express';
import * as artworkService from '../services/artworkService';
import { ApiResponse, PaginatedResponse } from '../types';
import { Artwork } from '@prisma/client';

// Helper for Pagination
const getPagination = (page: number, limit: number, total: number) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getArtworks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const { status, category, sortBy, sortOrder, userId } = req.query;

    // Strict filtering: Only show authenticated user's artworks unless admin (omitted here as per prev context)
    const authenticatedUserId = req.user?.uid;

    const result = await artworkService.getArtworks({
      page,
      limit,
      status: status as string,
      category: category as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
      userId: authenticatedUserId // Enforce filtering by own ID
    });

    const response: ApiResponse<PaginatedResponse<Artwork>> = {
      success: true,
      data: {
        data: result.artworks,
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

export const getArtworkById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const artwork = await artworkService.getArtworkById(id);

    if (!artwork) {
      res.status(404).json({ success: false, error: { message: 'Artwork not found' } });
      return;
    }

    res.status(200).json({
      success: true,
      data: artwork
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

export const createArtwork = async (req: Request, res: Response): Promise<void> => {
  try {
    // Note: Validation is now handled by middleware upstream
    const userId = req.user?.uid!;

    const newArtwork = await artworkService.createArtwork({
      ...req.body,
      userId
    });

    res.status(201).json({
      success: true,
      data: newArtwork,
      message: 'Artwork created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

export const updateArtwork = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid!;

    const updatedArtwork = await artworkService.updateArtwork(id, userId, req.body);

    res.status(200).json({
      success: true,
      data: updatedArtwork,
      message: 'Artwork updated successfully'
    });
  } catch (error: any) {
    if (error.message === 'Artwork not found') {
        res.status(404).json({ success: false, error: { message: error.message } });
    } else if (error.message === 'Permission denied') {
        res.status(403).json({ success: false, error: { message: error.message } });
    } else {
        res.status(500).json({ success: false, error: { message: error.message || 'Internal Server Error' } });
    }
  }
};

export const deleteArtwork = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid!;

    await artworkService.deleteArtwork(id, userId);

    res.status(200).json({
      success: true,
      message: 'Artwork deleted successfully'
    });
  } catch (error: any) {
    if (error.message === 'Artwork not found') {
        res.status(404).json({ success: false, error: { message: error.message } });
    } else if (error.message === 'Permission denied') {
        res.status(403).json({ success: false, error: { message: error.message } });
    } else {
        res.status(500).json({ success: false, error: { message: error.message || 'Internal Server Error' } });
    }
  }
};

// Simple Mock for Image Upload
export const uploadArtworkImage = async (req: Request, res: Response): Promise<void> => {
    // Mock Implementation
    const { id } = req.params;
    const userId = req.user?.uid!;
    const mockUrl = `https://storage.example.com/artworks/${id}-${Date.now()}.jpg`;

    try {
       const updated = await artworkService.updateArtwork(id, userId, { imageUrl: mockUrl });

       res.status(200).json({
         success: true,
         data: {
           id,
           imageUrl: mockUrl,
           updatedAt: updated.updatedAt
         },
         message: 'Image uploaded successfully (Mock)'
       });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message }});
    }
};
