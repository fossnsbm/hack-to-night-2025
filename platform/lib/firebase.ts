import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';


declare global {
  var firebaseApp: any;
}



function initFirebase() {
  if (!global.firebaseApp) {
    const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');
    global.firebaseApp = initializeApp({
      credential: cert(serviceAccountPath),
    });
  }
  return global.firebaseApp;
}


const app = initFirebase();


export const db = getFirestore(); 