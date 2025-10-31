import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { getCurrentUser } from './authService';

// Types for backend operations
export interface Message {
  id: string;
  postId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Offer {
  id: string;
  postId: string;
  buyerId: string;
  sellerId: string;
  amount: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterOffer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RSVP {
  id: string;
  postId: string;
  userId: string;
  status: 'attending' | 'maybe' | 'not-attending';
  createdAt: string;
}

export interface JobApplication {
  id: string;
  postId: string;
  applicantId: string;
  resumeText?: string;
  coverLetter?: string;
  status: 'submitted' | 'reviewing' | 'interview' | 'rejected' | 'hired';
  createdAt: string;
  updatedAt: string;
}

export interface SavedPost {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface Report {
  id: string;
  postId: string;
  reporterId: string;
  reason: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  premium: boolean;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    categories: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// MESSAGING SYSTEM
export const sendMessage = async (postId: string, receiverId: string, content: string): Promise<Message> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to send messages');
  }

  console.log('💬 Sending message from', currentUser.uid, 'to', receiverId);

  const messageData = {
    postId,
    senderId: currentUser.uid,
    receiverId,
    content,
    read: false,
    createdAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, 'messages'), messageData);
    console.log('✅ Message sent successfully:', docRef.id);
    
    return {
      id: docRef.id,
      ...messageData,
      createdAt: new Date().toISOString()
    } as Message;
  } catch (error: any) {
    console.error('❌ Error sending message:', error);
    throw error;
  }
};

export const getMessagesForPost = async (postId: string): Promise<Message[]> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to view messages');
  }

  try {
    const q = query(
      collection(db, 'messages'),
      where('postId', '==', postId),
      where('receiverId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    })) as Message[];

    console.log('📨 Retrieved', messages.length, 'messages for post', postId);
    return messages;
  } catch (error: any) {
    console.error('❌ Error fetching messages:', error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, { read: true });
    console.log('✅ Message marked as read:', messageId);
  } catch (error: any) {
    console.error('❌ Error marking message as read:', error);
    throw error;
  }
};

// OFFER SYSTEM
export const makeOffer = async (postId: string, sellerId: string, amount: string, message?: string): Promise<Offer> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to make offers');
  }

  console.log('💰 Making offer on post', postId, 'for', amount);

  const offerData = {
    postId,
    buyerId: currentUser.uid,
    sellerId,
    amount,
    message: message || '',
    status: 'pending' as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, 'offers'), offerData);
    console.log('✅ Offer made successfully:', docRef.id);
    
    return {
      id: docRef.id,
      ...offerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Offer;
  } catch (error: any) {
    console.error('❌ Error making offer:', error);
    throw error;
  }
};

export const respondToOffer = async (offerId: string, status: 'accepted' | 'rejected', counterOffer?: string): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to respond to offers');
  }

  try {
    const offerRef = doc(db, 'offers', offerId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };

    if (counterOffer) {
      updateData.counterOffer = counterOffer;
      updateData.status = 'countered';
    }

    await updateDoc(offerRef, updateData);
    console.log('✅ Offer response updated:', offerId, status);
  } catch (error: any) {
    console.error('❌ Error responding to offer:', error);
    throw error;
  }
};

export const getOffersForPost = async (postId: string): Promise<Offer[]> => {
  try {
    const q = query(
      collection(db, 'offers'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const offers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    })) as Offer[];

    console.log('💰 Retrieved', offers.length, 'offers for post', postId);
    return offers;
  } catch (error: any) {
    console.error('❌ Error fetching offers:', error);
    throw error;
  }
};

// RSVP SYSTEM
export const rsvpToEvent = async (postId: string, status: 'attending' | 'maybe' | 'not-attending'): Promise<RSVP> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to RSVP');
  }

  console.log('🎉 RSVP to event', postId, 'with status', status);

  // Check if user already has an RSVP for this event
  const existingRSVP = await getUserRSVP(postId);
  
  if (existingRSVP) {
    // Update existing RSVP
    const rsvpRef = doc(db, 'rsvps', existingRSVP.id);
    await updateDoc(rsvpRef, { status });
    console.log('✅ RSVP updated:', existingRSVP.id);
    
    return {
      ...existingRSVP,
      status
    };
  } else {
    // Create new RSVP
    const rsvpData = {
      postId,
      userId: currentUser.uid,
      status,
      createdAt: serverTimestamp()
    };

    try {
      const docRef = await addDoc(collection(db, 'rsvps'), rsvpData);
      console.log('✅ RSVP created successfully:', docRef.id);
      
      return {
        id: docRef.id,
        ...rsvpData,
        createdAt: new Date().toISOString()
      } as RSVP;
    } catch (error: any) {
      console.error('❌ Error creating RSVP:', error);
      throw error;
    }
  }
};

export const getUserRSVP = async (postId: string): Promise<RSVP | null> => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  try {
    const q = query(
      collection(db, 'rsvps'),
      where('postId', '==', postId),
      where('userId', '==', currentUser.uid),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    } as RSVP;
  } catch (error: any) {
    console.error('❌ Error fetching user RSVP:', error);
    return null;
  }
};

export const getEventRSVPs = async (postId: string): Promise<{ attending: number; maybe: number; notAttending: number }> => {
  try {
    const q = query(collection(db, 'rsvps'), where('postId', '==', postId));
    const querySnapshot = await getDocs(q);
    
    const counts = { attending: 0, maybe: 0, notAttending: 0 };
    querySnapshot.docs.forEach(doc => {
      const rsvp = doc.data() as RSVP;
      switch (rsvp.status) {
        case 'attending':
          counts.attending++;
          break;
        case 'maybe':
          counts.maybe++;
          break;
        case 'not-attending':
          counts.notAttending++;
          break;
      }
    });

    console.log('🎉 RSVP counts for event', postId, ':', counts);
    return counts;
  } catch (error: any) {
    console.error('❌ Error fetching RSVP counts:', error);
    throw error;
  }
};

// JOB APPLICATION SYSTEM
export const applyToJob = async (postId: string, resumeText?: string, coverLetter?: string): Promise<JobApplication> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to apply to jobs');
  }

  console.log('💼 Applying to job', postId);

  const applicationData = {
    postId,
    applicantId: currentUser.uid,
    resumeText: resumeText || '',
    coverLetter: coverLetter || '',
    status: 'submitted' as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, 'job_applications'), applicationData);
    console.log('✅ Job application submitted:', docRef.id);
    
    return {
      id: docRef.id,
      ...applicationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as JobApplication;
  } catch (error: any) {
    console.error('❌ Error submitting job application:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId: string, status: JobApplication['status']): Promise<void> => {
  try {
    const applicationRef = doc(db, 'job_applications', applicationId);
    await updateDoc(applicationRef, {
      status,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Application status updated:', applicationId, status);
  } catch (error: any) {
    console.error('❌ Error updating application status:', error);
    throw error;
  }
};

export const getJobApplications = async (postId: string): Promise<JobApplication[]> => {
  try {
    const q = query(
      collection(db, 'job_applications'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const applications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    })) as JobApplication[];

    console.log('💼 Retrieved', applications.length, 'applications for job', postId);
    return applications;
  } catch (error: any) {
    console.error('❌ Error fetching job applications:', error);
    throw error;
  }
};

// SAVE/BOOKMARK SYSTEM
export const savePost = async (postId: string): Promise<SavedPost> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to save posts');
  }

  console.log('🔖 Saving post', postId);

  const savedPostData = {
    userId: currentUser.uid,
    postId,
    createdAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, 'saved_posts'), savedPostData);
    console.log('✅ Post saved successfully:', docRef.id);
    
    return {
      id: docRef.id,
      ...savedPostData,
      createdAt: new Date().toISOString()
    } as SavedPost;
  } catch (error: any) {
    console.error('❌ Error saving post:', error);
    throw error;
  }
};

export const unsavePost = async (postId: string): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to unsave posts');
  }

  try {
    const q = query(
      collection(db, 'saved_posts'),
      where('userId', '==', currentUser.uid),
      where('postId', '==', postId)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.docs.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, 'saved_posts', docSnapshot.id));
    });

    console.log('✅ Post unsaved:', postId);
  } catch (error: any) {
    console.error('❌ Error unsaving post:', error);
    throw error;
  }
};

export const getUserSavedPosts = async (): Promise<SavedPost[]> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to view saved posts');
  }

  try {
    const q = query(
      collection(db, 'saved_posts'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const savedPosts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    })) as SavedPost[];

    console.log('🔖 Retrieved', savedPosts.length, 'saved posts');
    return savedPosts;
  } catch (error: any) {
    console.error('❌ Error fetching saved posts:', error);
    throw error;
  }
};

export const isPostSaved = async (postId: string): Promise<boolean> => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;

  try {
    const q = query(
      collection(db, 'saved_posts'),
      where('userId', '==', currentUser.uid),
      where('postId', '==', postId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error: any) {
    console.error('❌ Error checking if post is saved:', error);
    return false;
  }
};

// REPORTING SYSTEM
export const reportPost = async (postId: string, reason: string): Promise<Report> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to report posts');
  }

  console.log('🚨 Reporting post', postId, 'for reason:', reason);

  const reportData = {
    postId,
    reporterId: currentUser.uid,
    reason,
    status: 'pending' as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, 'reports'), reportData);
    console.log('✅ Report submitted successfully:', docRef.id);
    
    return {
      id: docRef.id,
      ...reportData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Report;
  } catch (error: any) {
    console.error('❌ Error submitting report:', error);
    throw error;
  }
};

export const updateReportStatus = async (reportId: string, status: Report['status']): Promise<void> => {
  try {
    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, {
      status,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Report status updated:', reportId, status);
  } catch (error: any) {
    console.error('❌ Error updating report status:', error);
    throw error;
  }
};

// SEARCH FUNCTIONALITY
export const searchPosts = async (searchQuery: string, category?: string): Promise<any[]> => {
  try {
    console.log('🔍 Searching posts for:', searchQuery, 'in category:', category);
    
    // For now, we'll do a simple client-side search since Firestore doesn't have full-text search
    // In production, you'd use Algolia, Elasticsearch, or Firebase Extensions for better search
    let q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    if (category && category !== 'all') {
      q = query(collection(db, 'posts'), where('category', '==', category), orderBy('createdAt', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    const allPosts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    // Client-side filtering for search terms
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const filteredPosts = allPosts.filter(post => {
      const searchableText = `${post.title || ''} ${post.description || ''} ${post.location || ''} ${post.tags?.join(' ') || ''}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });

    console.log('🔍 Found', filteredPosts.length, 'posts matching search');
    return filteredPosts;
  } catch (error: any) {
    console.error('❌ Error searching posts:', error);
    throw error;
  }
};

// USER PROFILE MANAGEMENT
export const createUserProfile = async (profileData: Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to create profile');
  }

  console.log('👤 Creating user profile for', currentUser.uid);

  const userProfileData = {
    userId: currentUser.uid,
    premium: false, // Default to non-premium
    ...profileData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, 'user_profiles'), userProfileData);
    console.log('✅ User profile created:', docRef.id);
    
    return {
      id: docRef.id,
      ...userProfileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as UserProfile;
  } catch (error: any) {
    console.error('❌ Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData: Partial<Omit<UserProfile, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to update profile');
  }

  try {
    const userProfile = await getUserProfile();
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    const profileRef = doc(db, 'user_profiles', userProfile.id);
    await updateDoc(profileRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });

    console.log('✅ User profile updated:', userProfile.id);
  } catch (error: any) {
    console.error('❌ Error updating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  try {
    const q = query(
      collection(db, 'user_profiles'),
      where('userId', '==', currentUser.uid),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    } as UserProfile;
  } catch (error: any) {
    console.error('❌ Error fetching user profile:', error);
    return null;
  }
};

// Upgrade user to premium
export const upgradeUserToPremium = async (): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to upgrade to premium');
  }

  console.log('⭐ Upgrading user to premium:', currentUser.uid);

  try {
    const userProfile = await getUserProfile();
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    const profileRef = doc(db, 'user_profiles', userProfile.id);
    await updateDoc(profileRef, {
      premium: true,
      updatedAt: serverTimestamp()
    });

    console.log('✅ User upgraded to premium:', userProfile.id);
  } catch (error: any) {
    console.error('❌ Error upgrading user to premium:', error);
    throw error;
  }
};