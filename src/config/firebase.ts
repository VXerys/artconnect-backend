import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Method 1: Using environment variables
    if (process.env.FIREBASE_PROJECT_ID && 
        process.env.FIREBASE_PRIVATE_KEY && 
        process.env.FIREBASE_CLIENT_EMAIL) {
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
      
      console.log('✅ Firebase Admin SDK initialized with environment variables');
    } 
    // Method 2: Using service account file (uncomment if you prefer this method)
    // else {
    //   const serviceAccount = require('../../firebase-service-account.json');
    //   admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount),
    //   });
    //   console.log('✅ Firebase Admin SDK initialized with service account file');
    // }
    else {
      console.warn('⚠️  Firebase credentials not found. Authentication will not work.');
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error);
  }
};

export { admin, initializeFirebase };
