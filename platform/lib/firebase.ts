import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';

// Add type for global Firebase app
declare global {
  var firebaseApp: any;
}

// Initialize Firebase Admin if it hasn't been initialized yet
// Use global to prevent re-initialization in development environment
function initFirebase() {
  if (!global.firebaseApp) {
    const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');
    global.firebaseApp = initializeApp({
      credential: cert(serviceAccountPath),
    });
  }
  return global.firebaseApp;
}

// Initialize Firebase app
const app = initFirebase();

// Get Firestore instance
export const db = getFirestore(); 