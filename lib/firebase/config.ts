import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCnoQrRHt2jM7BS7WTLVpg8GrVLvZXDCgE",
  authDomain: "apparel-online-store.firebaseapp.com",
  projectId: "apparel-online-store",
  storageBucket: "apparel-online-store.firebasestorage.app",
  messagingSenderId: "425864072585",
  appId: "1:425864072585:web:8acdd8e55921fa75932558",
  measurementId: "G-GF3VDSYK9V"
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);
export { analytics };
