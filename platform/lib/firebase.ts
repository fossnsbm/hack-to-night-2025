import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

declare global {
  var firebaseApp: any;
}

function initFirebase() {
  if (!global.firebaseApp) {
    let credentialInput;
    const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (serviceAccountEnv) {
      try {
        credentialInput = JSON.parse(serviceAccountEnv);
      } catch (error) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT. Falling back to file.', error);
      }
    }

    if (!credentialInput) {
      const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');
      if (fs.existsSync(serviceAccountPath)) {
        credentialInput = serviceAccountPath;
      } else {
        throw new Error('Firebase Admin SDK credentials not found. Please set FIREBASE_SERVICE_ACCOUNT env var or provide a service-account.json file.');
      }
    }

    global.firebaseApp = initializeApp({
      credential: cert(credentialInput),
    });
  }
  return global.firebaseApp;
}

export const app = initFirebase();
export const db = getFirestore(); 
