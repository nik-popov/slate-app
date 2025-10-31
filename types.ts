export interface User {
  name: string;
  avatarUrl: string;
  phoneNumber?: string;
  // Optional profile metrics
  totalPosts?: number;
  totalLikes?: number;
  etf?: string | number;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  user: User;
  category: 'sale' | 'event' | 'service' | 'job';
  price?: string | null;
  location?: string | null;
  eventDate?: string | null;
  tags?: string[] | null;
  createdAt?: string | null; // For Firestore serverTimestamp, converted to ISO string
}