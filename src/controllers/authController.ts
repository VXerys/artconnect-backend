import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { ApiResponse } from '../types';

// Sync User (Login/Register)
export const syncUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is already decoded by middleware
    const { uid, email, name, picture } = req.user!;

    const user = await authService.syncUser({
      uid,
      email,
      name,
      photoUrl: picture
    });

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User synced successfully'
    };
    res.status(200).json(response);
  } catch (error: any) {
    console.error('Sync User Error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

// Get User Profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid!;
    const user = await authService.getUserProfile(uid);

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
    const uid = req.user?.uid!;
    const { name, photoUrl } = req.body;

    const updatedUser = await authService.updateUserProfile(uid, { name, photoUrl });

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
