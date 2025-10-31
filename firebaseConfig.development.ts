import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Check if we have config in localStorage (for development)
const getFirebaseConfig = () => {
  const storedConfig = localStorage.getItem('firebaseConfig');
  if (storedConfig) {
    try {
      const config = JSON.parse(storedConfig);
      console.log('🔥 Using Firebase config from localStorage');
      return config;
    } catch (error) {
      console.error('❌ Failed to parse stored config:', error);
    }
  }

  // Fallback to environment variables
  const envConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
  };

  // Check if env config has required values
  if (envConfig.apiKey && envConfig.projectId) {
    console.log('🔥 Using Firebase config from environment variables');
    return envConfig;
  }

  // Development fallback (will work but not connect to real database)
  console.warn('⚠️ No Firebase configuration found. Using placeholder config.');
  return {
    apiKey: "placeholder-key",
    authDomain: "placeholder.firebaseapp.com",
    projectId: "placeholder-project",
    storageBucket: "placeholder.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:placeholder",
    measurementId: "G-PLACEHOLDER"
  };
};

const firebaseConfig = getFirebaseConfig();

// Initialize Firebase
let app;
let db;
let auth;

try {
  app = initializeApp(firebaseConfig);
  
  // Only initialize analytics if we have a real measurement ID
  if (firebaseConfig.measurementId && firebaseConfig.measurementId !== 'G-PLACEHOLDER') {
    getAnalytics(app);
  }
  
  db = getFirestore(app);
  auth = getAuth(app);
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  
  // Create mock objects to prevent app crashes
  db = {} as any;
  auth = {} as any;
}

export { db, auth };
export default app;