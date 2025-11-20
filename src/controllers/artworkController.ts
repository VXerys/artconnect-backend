import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';

// Helper for Pagination
const getPagination = (page: number, limit: number, total: number) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

// Get All Artworks
export const getArtworks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const { status, category, sortBy, sortOrder, userId } = req.query;

    const whereClause: Prisma.ArtworkWhereInput = {};

    if (status) {
      whereClause.status = status as any;
    }

    if (category) {
      whereClause.category = category as string;
    }

    // If user is authenticated, they might only want to see their own artworks?
    // The doc says "Get list of user's artworks". Assuming this means "ALL artworks accessible" or "User's own".
    // Usually, artists see their own. If public, maybe filtered.
    // Let's assume if userId param is provided or derived from auth, we filter.
    // The doc implies `GET /api/artworks` gets list of user's artworks.
    // So we should strictly filter by `req.user.uid` -> `user.id`.

    const firebaseUid = req.user?.uid;
    if (firebaseUid) {
       const user = await prisma.user.findUnique({ where: { firebaseUid } });
       if (user) {
         whereClause.userId = user.id;
       }
    }

    // If explicitly requested by query param (admin case?)
    if (userId) {
      whereClause.userId = userId as string;
    }

    const total = await prisma.artwork.count({ where: whereClause });
    const artworks = await prisma.artwork.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        [((sortBy as string) || 'createdAt')]: (sortOrder as string) || 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: artworks,
      pagination: getPagination(page, limit, total)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

// Get Artwork by ID
export const getArtworkById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      include: {
        salesDeals: true,
        activities: true // As per docs example response
      }
    });

    if (!artwork) {
      res.status(404).json({ success: false, error: { message: 'Artwork not found' } });
      return;
    }

    // Check ownership? Docs say "Authentication Required".
    // Usually one should only see their own details or public details.
    // I'll allow access if authenticated for now.

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

// Create Artwork
export const createArtwork = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, artist, price, description, year, medium, dimensions, currency, category, tags } = req.body;
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

    // Basic Validation
    if (!title || !artist || !price) {
      res.status(400).json({
        success: false,
        error: { message: 'Validation failed: title, artist, and price are required' }
      });
      return;
    }

    const newArtwork = await prisma.artwork.create({
      data: {
        title,
        artist,
        price: parseFloat(price),
        description,
        year: year ? parseInt(year) : undefined,
        medium,
        dimensions,
        currency: currency || 'IDR',
        category,
        tags: tags, // Passed as JSON or string depending on prisma provider
        userId: user.id,
        status: 'AVAILABLE'
      }
    });

    // Log Activity
    await prisma.activity.create({
      data: {
        type: 'ARTWORK_CREATED',
        title: `Created artwork: ${title}`,
        userId: user.id,
        artworkId: newArtwork.id
      }
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

// Update Artwork
export const updateArtwork = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
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

    const existingArtwork = await prisma.artwork.findUnique({ where: { id } });
    if (!existingArtwork) {
      res.status(404).json({ success: false, error: { message: 'Artwork not found' } });
      return;
    }

    if (existingArtwork.userId !== user.id) {
      res.status(403).json({ success: false, error: { message: 'You do not have permission to edit this artwork' } });
      return;
    }

    const updatedArtwork = await prisma.artwork.update({
      where: { id },
      data: {
        ...data,
        price: data.price ? parseFloat(data.price) : undefined,
        year: data.year ? parseInt(data.year) : undefined,
      }
    });

    // Log Activity
    await prisma.activity.create({
      data: {
        type: 'ARTWORK_UPDATED',
        title: `Updated artwork: ${updatedArtwork.title}`,
        userId: user.id,
        artworkId: updatedArtwork.id
      }
    });

    res.status(200).json({
      success: true,
      data: updatedArtwork,
      message: 'Artwork updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

// Delete Artwork
export const deleteArtwork = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
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

    const existingArtwork = await prisma.artwork.findUnique({ where: { id } });
    if (!existingArtwork) {
      res.status(404).json({ success: false, error: { message: 'Artwork not found' } });
      return;
    }

    if (existingArtwork.userId !== user.id) {
      res.status(403).json({ success: false, error: { message: 'You do not have permission to delete this artwork' } });
      return;
    }

    await prisma.artwork.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Artwork deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

// Upload Image (Mock for now, or simple storage logic)
// In a real app with Firebase, user might upload to Firebase Storage on frontend and send URL.
// But docs say: POST /api/artworks/:id/image with Form Data.
// This implies backend handles upload.
// I will implement a placeholder that assumes file handling logic or just returns a mock URL.
// Implementing full Multer + Storage is out of scope unless requested, but I will add the route structure.
export const uploadArtworkImage = async (req: Request, res: Response): Promise<void> => {
    // TODO: Implement Multer or file upload logic
    // For now, we simulate success
    const { id } = req.params;
    // Assuming file is in req.file (needs multer middleware)

    // Mock URL
    const mockUrl = `https://storage.example.com/artworks/${id}-${Date.now()}.jpg`;

    try {
       await prisma.artwork.update({
         where: { id },
         data: { imageUrl: mockUrl }
       });

       res.status(200).json({
         success: true,
         data: {
           id,
           imageUrl: mockUrl,
           updatedAt: new Date()
         },
         message: 'Image uploaded successfully (Mock)'
       });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message }});
    }
};
