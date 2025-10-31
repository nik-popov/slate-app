import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Global configuration state
let firebaseConfigured = false;
let firebaseApp: any = null;
let firebaseDB: any = null;
let firebaseAuth: any = null;

// Check if we have config in localStorage (for development)
const getFirebaseConfig = () => {
  // First check localStorage for runtime configuration
  const storedConfig = localStorage.getItem('firebaseConfig');
  if (storedConfig) {
    try {
      const config = JSON.parse(storedConfig);
      // Validate that it's a real config, not placeholder
      if (config.apiKey && config.projectId && 
          config.apiKey !== "placeholder-key" && 
          config.projectId !== "placeholder-project") {
        console.log('🔥 Using Firebase config from localStorage');
        return config;
      }
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
  if (envConfig.apiKey && envConfig.projectId && 
      envConfig.apiKey !== 'your_firebase_api_key_here') {
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

// Function to reinitialize Firebase with new config
const reinitializeFirebase = (newConfig: any) => {
  try {
    console.log('🔄 Reinitializing Firebase with new configuration...');
    
    // Store the new config
    localStorage.setItem('firebaseConfig', JSON.stringify(newConfig));
    
    // Initialize Firebase with new config
    firebaseApp = initializeApp(newConfig, 'main-app-' + Date.now());
    
    // Only initialize analytics if we have a real measurement ID
    if (newConfig.measurementId && newConfig.measurementId !== 'G-PLACEHOLDER') {
      getAnalytics(firebaseApp);
    }
    
    firebaseDB = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);
    firebaseConfigured = true;
    
    console.log('✅ Firebase reinitialized successfully');
    
    // Trigger a page reload to refresh all components
    window.location.reload();
    
    return true;
  } catch (error) {
    console.error('❌ Firebase reinitialization failed:', error);
    return false;
  }
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  const config = getFirebaseConfig();
  return config.apiKey !== "placeholder-key" && config.projectId !== "placeholder-project";
};

// Initialize Firebase on first load
const initializeFirebaseApp = () => {
  if (firebaseConfigured && firebaseApp) {
    return { app: firebaseApp, db: firebaseDB, auth: firebaseAuth };
  }

  const firebaseConfig = getFirebaseConfig();

  try {
    firebaseApp = initializeApp(firebaseConfig);
    
    // Only initialize analytics if we have a real measurement ID
    if (firebaseConfig.measurementId && firebaseConfig.measurementId !== 'G-PLACEHOLDER') {
      getAnalytics(firebaseApp);
    }
    
    firebaseDB = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);
    firebaseConfigured = true;
    
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    
    // Create mock objects to prevent app crashes
    firebaseDB = {} as any;
    firebaseAuth = {} as any;
  }

  return { app: firebaseApp, db: firebaseDB, auth: firebaseAuth };
};

// Initialize on module load
const { db, auth } = initializeFirebaseApp();

export { db, auth, reinitializeFirebase, isFirebaseConfigured };
export default firebaseApp;
