#!/usr/bin/env node

// Database seeding script for Slate app
// Usage: node seed-database.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_ID,
  measurementId: process.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data to seed
const seedData = [
  {
    title: "Vintage Leather Jacket",
    description: "A classic biker-style leather jacket from the 80s. Well-preserved with a beautiful patina. Minor wear on the cuffs, but otherwise in excellent condition. Size is Men's Medium.",
    imageUrls: ["https://picsum.photos/seed/jacket/600/800", "https://picsum.photos/seed/jacket2/600/800", "https://picsum.photos/seed/jacket3/600/800"],
    user: { name: "Alex Johnson", avatarUrl: "https://picsum.photos/seed/alex/100/100", phoneNumber: "+15551234567" },
    category: 'sale',
    price: '$75',
    location: "Downtown",
    tags: ['fashion', 'vintage', '80s', 'leather'],
  },
  {
    title: "Community Farmers Market",
    description: "Join us every Saturday for fresh, locally-grown produce, handmade crafts, and live music. A perfect weekend outing for the whole family. Free entry!",
    imageUrls: ["https://picsum.photos/seed/market/600/800", "https://picsum.photos/seed/market2/600/800"],
    user: { name: "Maria Garcia", avatarUrl: "https://picsum.photos/seed/maria/100/100", phoneNumber: "+15552345678" },
    category: 'event',
    eventDate: "Sat, Nov 2",
    location: "Central Park",
    tags: ['community', 'food', 'family-friendly', 'outdoors'],
  },
  {
    title: "Weekend Dog Walking",
    description: "Experienced and reliable dog walker available for weekend walks. I love all breeds and sizes. Your furry friend will be in safe hands for a fun-filled hour of exercise and play.",
    imageUrls: ["https://picsum.photos/seed/dogs/600/800", "https://picsum.photos/seed/dogwalk/600/800", "https://picsum.photos/seed/dogpark/600/800"],
    user: { name: "Chen Wei", avatarUrl: "https://picsum.photos/seed/chen/100/100", phoneNumber: "+15553456789" },
    category: 'service',
    location: "Neighborhood-wide",
    tags: ['pets', 'services', 'animals'],
  },
  {
    title: "Senior Frontend Engineer",
    description: "Join our dynamic team to build next-gen web applications. Proficient in React, TypeScript, and modern CSS. 5+ years of experience required. Competitive salary and benefits.",
    imageUrls: ["https://picsum.photos/seed/devjob/600/800", "https://picsum.photos/seed/office/600/800"],
    user: { name: "Innovate Tech Inc.", avatarUrl: "https://picsum.photos/seed/innovate/100/100", phoneNumber: "+15553001001" },
    category: 'job',
    price: '$120,000 - $150,000/year',
    location: "Remote / Downtown Office",
    tags: ['tech', 'engineering', 'react', 'remote'],
  },
  {
    title: "MacBook Pro M3 - Like New",
    description: "Selling my MacBook Pro M3 16-inch with 32GB RAM and 1TB SSD. Barely used, still under warranty. Perfect for developers and creators. Includes original charger and box.",
    imageUrls: ["https://picsum.photos/seed/macbook/600/800", "https://picsum.photos/seed/laptop/600/800"],
    user: { name: "Sarah Chen", avatarUrl: "https://picsum.photos/seed/sarah/100/100", phoneNumber: "+15554567890" },
    category: 'sale',
    price: '$2,200',
    location: "Tech District",
    tags: ['tech', 'apple', 'laptop', 'development'],
  },
  {
    title: "Halloween Party Tonight!",
    description: "Join us for a spooky Halloween celebration! Costume contest with prizes, pumpkin carving, and themed cocktails. Don't miss the fun!",
    imageUrls: ["https://picsum.photos/seed/halloween/600/800", "https://picsum.photos/seed/party/600/800"],
    user: { name: "Party Planners Co.", avatarUrl: "https://picsum.photos/seed/party-planners/100/100", phoneNumber: "+15556789012" },
    category: 'event',
    eventDate: "Thu, Oct 31",
    location: "Downtown Community Center",
    tags: ['halloween', 'party', 'costume', 'community'],
  }
];

async function checkExistingPosts() {
  try {
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    return postsSnapshot.size;
  } catch (error) {
    console.error('Error checking existing posts:', error);
    return -1;
  }
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding process...');
  
  // Check if posts already exist
  const existingPostsCount = await checkExistingPosts();
  
  if (existingPostsCount > 0) {
    console.log(`📚 Database already has ${existingPostsCount} posts. Seeding anyway...`);
  } else if (existingPostsCount === 0) {
    console.log('📭 Database is empty. Starting seed process...');
  } else {
    console.error('❌ Could not check database status. Exiting...');
    process.exit(1);
  }

  try {
    const postsCollectionRef = collection(db, 'posts');
    
    console.log(`📦 Seeding ${seedData.length} posts...`);
    
    for (let i = 0; i < seedData.length; i++) {
      const post = seedData[i];
      console.log(`  📝 Adding post ${i + 1}/${seedData.length}: "${post.title}"`);
      
      await addDoc(postsCollectionRef, {
        ...post,
        createdAt: serverTimestamp(),
      });
    }
    
    console.log('✅ Database seeded successfully!');
    console.log(`📊 Added ${seedData.length} sample posts to your Slate app`);
    console.log('🚀 Your app is now ready with sample data!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error('💡 Make sure:');
    console.error('   - Your Firebase configuration is correct');
    console.error('   - Firestore security rules allow writes');
    console.error('   - You have the necessary permissions');
    process.exit(1);
  }
}

// Run the seeding process
seedDatabase()
  .then(() => {
    console.log('🎉 Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });