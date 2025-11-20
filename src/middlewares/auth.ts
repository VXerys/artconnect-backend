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

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Check for Mock Mode in Development
    if (process.env.NODE_ENV === 'development' && req.headers['x-mock-user']) {
      console.log('Using Mock Auth (Header Check - No Bearer)');
      req.user = {
        uid: 'mock-user-uid',
        email: 'mock@example.com',
        name: 'Mock User'
      };
      return next();
    }

    res.status(401).json({
      success: false,
      error: { message: 'No token provided' }
    });
    return;
  }

  // Check for Mock Mode in Development even if Bearer is present (because verify_auth sends both)
  if (process.env.NODE_ENV === 'development' && req.headers['x-mock-user']) {
    console.log('Using Mock Auth (Header Check - With Bearer)');
    req.user = {
      uid: 'mock-user-uid',
      email: 'mock@example.com',
      name: 'Mock User'
    };
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    // If in mock mode and using mock token (but with Bearer prefix)
    if (process.env.NODE_ENV === 'development' && token === 'mock-token') {
      console.log('Using Mock Auth (Bearer mock-token detected)');
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
    return; // Ensure void is returned
  }
};
