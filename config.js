// ========================================
// FIREBASE CONFIGURATION
// ========================================
// Replace with your actual Firebase credentials from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ========================================
// CLOUDINARY CONFIGURATION
// ========================================
// Get your Cloudinary credentials from https://cloudinary.com/console
// cloudName: Your cloud name
// uploadPreset: Create in Cloudinary Dashboard > Settings > Upload
const cloudinaryConfig = {
  cloudName: "dpeh316e0",
  uploadPreset: "picksmart_uploads"
};

// ========================================
// FIREBASE INITIALIZATION
// ========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Analytics is optional and requires a measurementId. It can throw in some
// environments (or with an incomplete config), so we guard it to make sure a
// failure here never crashes the whole site / freezes the loading skeletons.
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('Firebase Analytics not initialized:', error?.message || error);
}

export { db, analytics, cloudinaryConfig, firebaseConfig };
