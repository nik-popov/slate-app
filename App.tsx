import React, { useState, useMemo, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { PostCard } from './components/PostCard';
import { Header } from './components/Header';
import { PostDetailModal } from './components/PostDetailModal';
import { CreatePostModal } from './components/CreatePostModal';
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

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
    let unsubscribe = () => {};
    try {
      const postsCollectionRef = collection(db, 'posts');
      const q = query(postsCollectionRef, orderBy('createdAt', 'desc'));

      unsubscribe = onSnapshot(q, (querySnapshot) => {
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
        setPosts(postsData);
        setLoading(false);
      }, (error: any) => {
        console.error("Error fetching posts:", { code: error.code, message: error.message });
        // On error (e.g. invalid config), stop loading and clear posts
        // This will cause the EmptyState component to render
        setPosts([]);
        setLoading(false);
      });
    } catch (error: any) {
        console.error("Error setting up Firestore listener:", { code: error.code, message: error.message });
        setPosts([]);
        setLoading(false);
    }

    return () => unsubscribe();
  }, []);


  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') {
      return posts;
    }
    return posts.filter(post => post.category === activeCategory);
  }, [activeCategory, posts]);
  
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

  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn);
  };
  
  const handleCreatePost = async (newPostData: Omit<Post, 'id' | 'user' | 'createdAt'>) => {
    const user = isLoggedIn 
      ? { name: "Current User", avatarUrl: "https://picsum.photos/seed/currentuser/100/100", phoneNumber: "+15559998888" }
      : { name: "Anonymous", avatarUrl: "https://picsum.photos/seed/anonymous/100/100", phoneNumber: "+15550001111" };

    try {
        await addDoc(collection(db, 'posts'), {
            ...newPostData,
            user,
            createdAt: serverTimestamp()
        });
        setCreateModalOpen(false);
    } catch (e: any) {
        console.error("Error adding document: ", { code: e.code, message: e.message });
        alert("There was an error submitting your post. Please try again.");
    }
  };


  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        onLoginToggle={handleLoginToggle}
        onCreatePostClick={() => setCreateModalOpen(true)}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <h1 className="text-4xl font-bold text-white mb-2">Global Feed</h1>
        <p className="text-neutral-400 mb-8">Find what you need, right around the corner.</p>
        
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(({ id, name }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                  activeCategory === id
                    ? 'bg-white text-black'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onClick={() => handlePostClick(post)} />
            ))}
            </div>
        ) : (
            <EmptyState onSeedDatabase={seedDatabase} isSeeding={isSeeding} />
        )}
      </main>
      
      {selectedPost && (
        <PostDetailModal 
          post={selectedPost} 
          onClose={handleCloseModal} 
          isLoggedIn={isLoggedIn}
        />
      )}

      {isCreateModalOpen && (
        <CreatePostModal 
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreatePost}
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