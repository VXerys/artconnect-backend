import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// --- IMPORTANT FOR USER ---
// Replace the credentials below with your actual Firebase Service Account credentials.
// Ideally, verify that these environment variables are correctly set in your .env file.
// Or you can load the serviceAccountKey.json file directly if you prefer.
// ---------------------------

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  try {
    // In a real production scenario, ensure these variables are present.
    // For now, we might initialize with placeholders if they are missing to avoid crash in development
    // BUT auth middleware will fail if keys are invalid.
    if (projectId && clientEmail && privateKey && !privateKey.includes('mock-private-key')) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('Firebase Admin Initialized');
    } else {
      console.warn('Firebase Admin credentials missing or mock. Auth will fail unless in Mock Mode.');
      // Initialize a mock app to prevent "default Firebase app does not exist" error
      if (process.env.NODE_ENV === 'development') {
          // We don't initialize the app, but we must ensure we don't call auth() on it if it's not there.
          // Actually, the error happens because we call admin.auth() and there is no app.
          // In mock mode, we should bypass admin.auth() calls entirely in the middleware.
      }
    }
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}

export default admin;
