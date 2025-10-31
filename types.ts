export interface User {
  name: string;
  avatarUrl: string;
  phoneNumber?: string;
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