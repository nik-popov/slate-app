import React, { useState, useMemo, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { onAuthStateChange, signOutUser, getCurrentUser, type AuthUser } from './authService';
import { searchPosts } from './backendService';
import { reinitializeFirebase, isFirebaseConfigured } from './firebaseConfig';
import { PostCard } from './components/PostCard';
import { Header } from './components/Header';
import { PostDetailModal } from './components/PostDetailModal';
import { CreatePostModal } from './components/CreatePostModal';
import { LoginModal } from './components/LoginModal';
import { UserProfileModal } from './components/UserProfileModal';
import { DatabaseSetupModal } from './components/DatabaseSetupModal';
import { EmptyState } from './components/EmptyState';
import type { Post } from './types';

// This data is now used to "seed" the database on the first run.
const seedData: Omit<Post, 'id' | 'createdAt'>[] = [
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
    eventDate: "Sat, Oct 26",
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
];

type Category = 'all' | 'sale' | 'event' | 'service' | 'job';

const App: React.FC = () => {
  console.log('🏗️ App component initializing...');
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isDatabaseSetupOpen, setDatabaseSetupOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);

  console.log('📊 App state:', { postsCount: posts.length, loading, activeCategory, user: user?.email });

  // Auth state listener
  useEffect(() => {
    console.log('👤 Setting up auth state listener...');
    const unsubscribe = onAuthStateChange((user) => {
      console.log('👤 Auth state changed:', user?.email || 'signed out');
      setUser(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const seedDatabase = async () => {
    if (isSeeding) return;
    setIsSeeding(true);
    
    const postsCollectionRef = collection(db, 'posts');
    try {
      console.log("Seeding database with initial data...");
      for (const post of seedData) {
        await addDoc(postsCollectionRef, {
          ...post,
          createdAt: serverTimestamp(),
        });
      }
      console.log("Database seeded successfully.");
    } catch (error: any) {
      console.error("Error seeding database:", { code: error.code, message: error.message });
      alert("Failed to seed database. Please check your Firebase configuration in firebaseConfig.ts and ensure your Firestore security rules allow writes.");
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    console.log('🔥 Setting up Firebase listener...');
    let unsubscribe = () => {};
    try {
      console.log('📚 Creating Firestore collection reference...');
      const postsCollectionRef = collection(db, 'posts');
      const q = query(postsCollectionRef, orderBy('createdAt', 'desc'));

      console.log('👂 Setting up onSnapshot listener...');
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log('📨 Received snapshot with', querySnapshot.docs.length, 'documents');
        const postsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const post: Post = {
            id: doc.id,
            title: data.title,
            description: data.description,
            imageUrls: [...(data.imageUrls || [])],
            user: {
              name: data.user.name,
              avatarUrl: data.user.avatarUrl,
              phoneNumber: data.user.phoneNumber || undefined,
            },
            category: data.category,
            price: data.price || null,
            location: data.location || null,
            eventDate: data.eventDate || null,
            tags: data.tags ? [...data.tags] : null,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
          };
          return post;
        });
        console.log('✅ Processed posts data:', postsData.length, 'posts');
        setPosts(postsData);
        setLoading(false);
      }, (error: any) => {
        console.error("❌ Error fetching posts:", { code: error.code, message: error.message });
        // On error (e.g. invalid config), stop loading and clear posts
        // This will cause the EmptyState component to render
        setPosts([]);
        setLoading(false);
      });
    } catch (error: any) {
        console.error("❌ Error setting up Firestore listener:", { code: error.code, message: error.message });
        setPosts([]);
        setLoading(false);
    }

    return () => {
      console.log('🧹 Cleaning up Firebase listener');
      unsubscribe();
    };
  }, []);


  const filteredPosts = useMemo(() => {
    // If there's a search query, use search results
    if (searchQuery.trim()) {
      return searchResults;
    }
    
    // Otherwise filter by category
    if (activeCategory === 'all') {
      return posts;
    }
    return posts.filter(post => post.category === activeCategory);
  }, [activeCategory, posts, searchQuery, searchResults]);
  
  const categories: { id: Category, name: string }[] = [
    { id: 'all', name: 'All' },
    { id: 'sale', name: 'For Sale' },
    { id: 'event', name: 'Events' },
    { id: 'service', name: 'Services' },
    { id: 'job', name: 'Jobs' },
  ];

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Error logging out:', error);
    }
  };

  const handleLoginSuccess = () => {
    console.log('✅ Login successful');
    setLoginModalOpen(false);
  };

  const handleSearch = async (query: string) => {
    console.log('🔍 Searching for:', query);
    setSearchQuery(query);
    
    try {
      const results = await searchPosts(query, activeCategory !== 'all' ? activeCategory : undefined);
      setSearchResults(results as Post[]);
    } catch (error) {
      console.error('❌ Search failed:', error);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true);
  };

  const handleDatabaseSetup = (config: any) => {
    console.log('🔧 Setting up database configuration...');
    
    // Use the reinitializeFirebase function to persist the config
    const success = reinitializeFirebase(config);
    
    if (success) {
      console.log('✅ Firebase configuration saved and initialized');
      setDatabaseSetupOpen(false);
      
      // The page will reload automatically from reinitializeFirebase
      // which will pick up the new configuration
    } else {
      alert('Failed to configure Firebase. Please check your configuration values and try again.');
    }
  };
  
  const handleCreatePost = async (newPostData: Omit<Post, 'id' | 'user' | 'createdAt'>) => {
    const currentUser = getCurrentUser();
    const postUser = currentUser 
      ? { 
          name: currentUser.displayName || currentUser.email || 'User', 
          avatarUrl: currentUser.photoURL || `https://picsum.photos/seed/${currentUser.uid}/100/100`,
          phoneNumber: undefined
        }
      : { 
          name: "Anonymous", 
          avatarUrl: "https://picsum.photos/seed/anonymous/100/100", 
          phoneNumber: undefined
        };

    try {
        await addDoc(collection(db, 'posts'), {
            ...newPostData,
            user: postUser,
            createdAt: serverTimestamp()
        });
        setCreateModalOpen(false);
    } catch (e: any) {
        console.error("Error adding document: ", { code: e.code, message: e.message });
        alert("There was an error submitting your post. Please try again.");
    }
  };


  console.log('🎨 About to render App with:', { loading, postsLength: posts.length, filteredPostsLength: filteredPosts.length });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-neutral-100 font-sans flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans flex flex-col">
      <Header 
        isLoggedIn={!!user} 
        user={user}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        onCreatePostClick={() => setCreateModalOpen(true)}
        onSearch={handleSearch}
        onProfileClick={handleProfileClick}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            {searchQuery ? 'Search Results' : 'Discover'}
          </h1>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="text-neutral-400 hover:text-white text-sm underline transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
        <p className="text-neutral-400 mb-8 text-base lg:text-lg">
          {searchQuery 
            ? `Found ${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''} for "${searchQuery}"` 
            : 'Find what you need, right around the corner.'}
        </p>
        
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map(({ id, name }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 transform hover:scale-105 ${
                  activeCategory === id
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-neutral-900/80 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-700 hover:border-neutral-600'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-64">
                <p className="text-xl text-neutral-500">Loading feed...</p>
            </div>
        ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onClick={() => handlePostClick(post)} />
            ))}
            </div>
        ) : (
            <EmptyState 
              onSeedDatabase={seedDatabase} 
              onSetupDatabase={() => setDatabaseSetupOpen(true)}
              isSeeding={isSeeding} 
            />
        )}
      </main>
      
      {selectedPost && (
        <PostDetailModal 
          post={selectedPost} 
          onClose={handleCloseModal} 
          isLoggedIn={!!user}
        />
      )}

      {isCreateModalOpen && (
        <CreatePostModal 
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreatePost}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {isProfileModalOpen && (
        <UserProfileModal 
          isOpen={isProfileModalOpen}
          onClose={() => setProfileModalOpen(false)}
        />
      )}

      {isDatabaseSetupOpen && (
        <DatabaseSetupModal 
          isOpen={isDatabaseSetupOpen}
          onClose={() => setDatabaseSetupOpen(false)}
          onSubmit={handleDatabaseSetup}
        />
      )}


      <footer className="bg-black border-t border-neutral-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-neutral-600 text-sm">
            <p>&copy; {new Date().getFullYear()} Slate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;