import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// This is a placeholder configuration for local development.
// The app will build, but will not connect to a live Firebase backend.
// To connect to your own Firebase project, replace these values with your actual config
// from your Firebase project console: Project Settings > General > Your apps.
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore instance. This is what you'll use to interact with the database.
export const db = getFirestore(app);
