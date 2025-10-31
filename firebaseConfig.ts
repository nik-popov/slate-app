import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// This is a placeholder configuration for local development.
// The app will build, but will not connect to a live Firebase backend.
// To connect to your own Firebase project, replace these values with your actual config
// from your Firebase project console: Project Settings > General > Your apps.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

// Get a Firestore instance. This is what you'll use to interact with the database.
export const db = getFirestore(app);
