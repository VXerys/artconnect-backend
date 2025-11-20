import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Register User
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, photoUrl } = req.body;
    const firebaseUid = req.user?.uid;

    if (!firebaseUid) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { firebaseUid }
    });

    if (existingUser) {
      res.status(400).json({ success: false, error: { message: 'User already registered' } });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        firebaseUid,
        email: email || req.user?.email || '', // Use body email or firebase email
        name,
        photoUrl,
        role: 'USER' // Default role
      }
    });

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User registered successfully'
    });
  } catch (error: any) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

// Get User Profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const firebaseUid = req.user?.uid;

    if (!firebaseUid) {
       res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
       return;
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid }
    });

    if (!user) {
      res.status(404).json({ success: false, error: { message: 'User not found' } });
      return;
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

// Update User Profile
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const firebaseUid = req.user?.uid;
    const { name, photoUrl } = req.body;

    if (!firebaseUid) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    // Ensure user exists first
    const user = await prisma.user.findUnique({
      where: { firebaseUid }
    });

    if (!user) {
      res.status(404).json({ success: false, error: { message: 'User not found' } });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { firebaseUid },
      data: {
        name: name || undefined,
        photoUrl: photoUrl || undefined
      }
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};
