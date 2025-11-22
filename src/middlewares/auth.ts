import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        [key: string]: any;
      };
    }
  }
}

export type AuthRequest = Request;

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Mock Mode: Check for mock user header in Development or Test environments
  // WARNING: This bypasses real authentication and should NEVER be enabled in production.
  if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') && req.headers['x-mock-user']) {
    // console.log('Using Mock Auth');
    req.user = {
      uid: 'mock-user-uid', // This ID must match the mocked User in the database
      email: 'mock@example.com',
      name: 'Mock User'
    };
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: { message: 'No token provided' }
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Additional Mock Logic: Allow 'mock-token' if in dev/test, even without x-mock-user (optional, but keeping for compatibility)
    if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') && token === 'mock-token') {
       req.user = {
        uid: 'mock-user-uid',
        email: 'mock@example.com',
        name: 'Mock User'
      };
      return next();
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      ...decodedToken,
      uid: decodedToken.uid,
      email: decodedToken.email || ''
    };
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token' }
    });
    return;
  }
};
