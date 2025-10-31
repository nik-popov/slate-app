import React, { useState, useEffect } from 'react';
import type { Post } from '../types';
import { CalendarIcon, MapPinIcon, XIcon, ChevronLeftIcon, ChevronRightIcon, ShareIcon, MessageSquareIcon, FlagIcon } from './IconComponents';
import { ShareModal } from './ShareModal';
import { ReportModal } from './ReportModal';
import { 
  sendMessage, 
  makeOffer, 
  rsvpToEvent, 
  applyToJob, 
  savePost, 
  unsavePost, 
  isPostSaved,
  getUserRSVP,
  getEventRSVPs
} from '../backendService';
import { getCurrentUser } from '../authService';


interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
  isLoggedIn: boolean;
}

const categoryTextMap = {
  sale: 'For Sale',
  event: 'Event',
  service: 'Service',
  job: 'Job',
};


export const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose, isLoggedIn }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userRSVP, setUserRSVP] = useState<string | null>(null);
  const [rsvpCounts, setRSVPCounts] = useState({ attending: 0, maybe: 0, notAttending: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const categoryText = categoryTextMap[post.category];

  // Check if post is saved and get RSVP status
  useEffect(() => {
    const loadUserData = async () => {
      if (!isLoggedIn) return;
      
      try {
        // Check if post is saved
        const saved = await isPostSaved(post.id);
        setIsSaved(saved);

        // If it's an event, get RSVP status and counts
        if (post.category === 'event') {
          const rsvp = await getUserRSVP(post.id);
          setUserRSVP(rsvp?.status || null);
          
          const counts = await getEventRSVPs(post.id);
          setRSVPCounts(counts);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [post.id, isLoggedIn, post.category]);

  useEffect(() => {
    // When the modal is mounted, prevent background scrolling.
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // When the modal is unmounted, restore the original overflow style.
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleanup on unmount.

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prevIndex) => (prevIndex - 1 + post.imageUrls.length) % post.imageUrls.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % post.imageUrls.length);
  };

  // Handler functions for user interactions
  const handleMessage = async () => {
    if (!isLoggedIn) {
      alert('Please log in to send messages');
      return;
    }

    const message = prompt('Enter your message:');
    if (message && message.trim()) {
      try {
        setIsLoading(true);
        await sendMessage(post.id, post.user.name, message); // Note: In real app, you'd use user ID
        alert('Message sent successfully!');
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMakeOffer = async () => {
    if (!isLoggedIn) {
      alert('Please log in to make offers');
      return;
    }

    const offer = prompt('Enter your offer amount:');
    if (offer && offer.trim()) {
      try {
        setIsLoading(true);
        await makeOffer(post.id, post.user.name, offer); // Note: In real app, you'd use user ID
        alert('Offer submitted successfully!');
      } catch (error) {
        console.error('Error making offer:', error);
        alert('Failed to submit offer. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRSVP = async (status: 'attending' | 'maybe' | 'not-attending') => {
    if (!isLoggedIn) {
      alert('Please log in to RSVP');
      return;
    }

    try {
      setIsLoading(true);
      await rsvpToEvent(post.id, status);
      setUserRSVP(status);
      
      // Update RSVP counts
      const counts = await getEventRSVPs(post.id);
      setRSVPCounts(counts);
      
      alert(`RSVP updated to: ${status}`);
    } catch (error) {
      console.error('Error updating RSVP:', error);
      alert('Failed to update RSVP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobApply = async () => {
    if (!isLoggedIn) {
      alert('Please log in to apply for jobs');
      return;
    }

    const coverLetter = prompt('Enter a brief cover letter (optional):');
    try {
      setIsLoading(true);
      await applyToJob(post.id, undefined, coverLetter || undefined);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePost = async () => {
    if (!isLoggedIn) {
      alert('Please log in to save posts');
      return;
    }

    try {
      setIsLoading(true);
      if (isSaved) {
        await unsavePost(post.id);
        setIsSaved(false);
        alert('Post removed from saved items');
      } else {
        await savePost(post.id);
        setIsSaved(true);
        alert('Post saved successfully!');
      }
    } catch (error) {
      console.error('Error saving/unsaving post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMetaInfo = () => {
    const categoryTag = (
        <div className="bg-neutral-800 text-neutral-300 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
          {categoryText}
        </div>
    );
    
    const separator = <span className="mx-2 text-neutral-600 flex-shrink-0">•</span>;

    const locationInfo = post.location ? (
        <div className="flex items-center">
            <MapPinIcon />
            <span className="truncate">{post.location}</span>
        </div>
    ) : null;

    const eventInfo = post.eventDate ? (
        <div className="flex items-center">
            <CalendarIcon />
            <span>{post.eventDate}</span>
        </div>
    ) : null;

    if (post.category === 'event') {
        return (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-neutral-400">
                {eventInfo}
                {eventInfo && locationInfo && separator}
                {locationInfo}
                {(eventInfo || locationInfo) && separator}
                {categoryTag}
            </div>
        )
    }

    return (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-neutral-400">
            {locationInfo}
            {locationInfo && separator}
            {categoryTag}
        </div>
    )
  };
  
  const renderActionButtons = () => {
    const commonButtonClasses = "px-4 py-2 text-sm font-bold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50";
    const primaryButtonClasses = `${commonButtonClasses} bg-white text-black hover:scale-105`;
    const secondaryButtonClasses = `${commonButtonClasses} bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:scale-105`;

    return (
        <div className="flex flex-wrap items-center gap-3">
            {post.category === 'sale' && (
                <>
                    <button 
                      className={primaryButtonClasses}
                      onClick={handleMessage}
                      disabled={isLoading}
                    >
                      Message
                    </button>
                    <button 
                      className={secondaryButtonClasses}
                      onClick={handleMakeOffer}
                      disabled={isLoading}
                    >
                      Make Offer
                    </button>
                </>
            )}
            {post.category === 'event' && (
                <>
                    <div className="flex space-x-2">
                      <button 
                        className={`${primaryButtonClasses} ${userRSVP === 'attending' ? 'bg-green-600 text-white' : ''}`}
                        onClick={() => handleRSVP('attending')}
                        disabled={isLoading}
                      >
                        Attending {rsvpCounts.attending > 0 ? `(${rsvpCounts.attending})` : ''}
                      </button>
                      <button 
                        className={`${secondaryButtonClasses} ${userRSVP === 'maybe' ? 'bg-yellow-600 text-white' : ''}`}
                        onClick={() => handleRSVP('maybe')}
                        disabled={isLoading}
                      >
                        Maybe {rsvpCounts.maybe > 0 ? `(${rsvpCounts.maybe})` : ''}
                      </button>
                    </div>
                    <button 
                      className={secondaryButtonClasses}
                      onClick={handleSavePost}
                      disabled={isLoading}
                    >
                      {isSaved ? 'Unsave Event' : 'Save Event'}
                    </button>
                </>
            )}
            {post.category === 'service' && (
                <>
                    <button 
                      className={primaryButtonClasses}
                      onClick={handleMessage}
                      disabled={isLoading}
                    >
                      Contact
                    </button>
                    <button 
                      className={secondaryButtonClasses}
                      onClick={handleMessage}
                      disabled={isLoading}
                    >
                      Request Info
                    </button>
                </>
            )}
            {post.category === 'job' && (
                <>
                    <button 
                      className={primaryButtonClasses}
                      onClick={handleJobApply}
                      disabled={isLoading}
                    >
                      Apply Now
                    </button>
                    <button 
                      className={secondaryButtonClasses}
                      onClick={handleSavePost}
                      disabled={isLoading}
                    >
                      {isSaved ? 'Unsave Job' : 'Save Job'}
                    </button>
                </>
            )}
        </div>
    );
  }

  const renderSecondaryActions = () => {
      const baseClasses = "flex items-center space-x-1.5 transition-all duration-200 font-medium";
      const shareClasses = `${baseClasses} text-blue-400 hover:text-blue-300 hover:scale-105`;
      const smsClasses = `${baseClasses} text-green-400 hover:text-green-300 hover:scale-105`;
      const reportClasses = `${baseClasses} text-red-400 hover:text-red-300 hover:scale-105`;
      const smsBody = `Hi, I'm interested in your post "${post.title}" on Slate.`;
      
      return (
        <div className="flex items-center space-x-8 text-sm">
            <button className={shareClasses} onClick={() => setShareModalOpen(true)}>
                <ShareIcon />
                <span>Share</span>
            </button>
            {post.user.phoneNumber && (
                <a href={`sms:${post.user.phoneNumber}?&body=${encodeURIComponent(smsBody)}`} className={smsClasses}>
                    <MessageSquareIcon />
                    <span>SMS</span>
                </a>
            )}
            <button className={reportClasses} onClick={() => setReportModalOpen(true)}>
                <FlagIcon />
                <span>Report</span>
            </button>
        </div>
      )
  }
  
  const renderUserInfo = () => (
  <div className="flex items-center">
    <img
      src={post.user.avatarUrl}
      alt={post.user.name}
      className="w-10 h-10 rounded-full object-cover border-2 border-neutral-600"
    />
    <div className="ml-3">
      <p className="text-sm text-neutral-400">Posted by</p>
      <p className="font-semibold text-white">{post.user.name}</p>
      <div className="mt-1 flex items-center space-x-4 text-sm text-neutral-400">
        <div>
          <span className="text-neutral-400">Posts: </span>
          <span className="text-white font-medium">{post.user.totalPosts ?? 0}</span>
        </div>
        <div>
          <span className="text-neutral-400">Likes: </span>
          <span className="text-white font-medium">{post.user.totalLikes ?? 0}</span>
        </div>
        {post.user.etf !== undefined && (
          <div>
          <span className="text-neutral-400">ETF: </span>
          <span className="text-white font-medium">{post.user.etf}</span>
          </div>
        )}
      </div>
    </div>
  </div>
  );

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
      >
        <div 
          className="bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 rounded-lg shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Media Column - Left Side */}
          <div className="w-1/2 flex-shrink-0 bg-black/20 flex flex-col">
            <div className="relative group flex-grow flex items-center justify-center p-6">
                <img
                  src={post.imageUrls[activeImageIndex]}
                  alt={post.title}
                  className="w-full h-full max-h-[80vh] object-contain rounded-lg"
                />
                {post.imageUrls.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70 hover:scale-110"
                    >
                      <ChevronLeftIcon />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70 hover:scale-110"
                    >
                      <ChevronRightIcon />
                    </button>
                  </>
                )}
            </div>
            {post.imageUrls.length > 1 && (
              <div className="p-4 flex-shrink-0 border-t border-neutral-800/50">
                <div className="flex space-x-3 justify-center overflow-x-auto pb-2">
                  {post.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-20 w-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 flex-shrink-0 ${
                        activeImageIndex === index
                          ? 'border-white scale-105'
                          : 'border-transparent hover:border-neutral-600 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Information Column - Right Side */}
          <div className="w-1/2 flex flex-col overflow-hidden">
            {/* Header Section */}
            <div className="p-6 border-b border-neutral-800/50">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-4xl font-bold text-white leading-tight pr-4">{post.title}</h2>
                <button 
                  onClick={onClose} 
                  className="text-neutral-400 hover:text-white transition-colors p-2 hover:bg-neutral-800/50 rounded-lg flex-shrink-0"
                >
                  <XIcon />
                </button>
              </div>
              
              {(post.category === 'sale' || post.category === 'job') && post.price && (
                <p className="text-3xl font-bold text-white mb-4">{post.price}</p>
              )}

              <div className="mb-4">{renderMetaInfo()}</div>
              <div>{renderSecondaryActions()}</div>
            </div>
            
            {/* Content Section - Scrollable */}
            <div className="flex-grow overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-neutral-300 text-lg leading-relaxed">
                      {post.description}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                              <span key={tag} className="bg-neutral-800 text-neutral-300 text-sm font-medium px-3 py-1.5 rounded-full hover:bg-neutral-700 transition-colors">
                                  #{tag}
                              </span>
                          ))}
                      </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer Section - Actions and User Info */}
            <div className="border-t border-neutral-800/50 p-6 bg-neutral-900/50">
              <div className="space-y-6">
                  <div>{renderUserInfo()}</div>
                  <div className="pt-2">{renderActionButtons()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isShareModalOpen && <ShareModal post={post} onClose={() => setShareModalOpen(false)} />}
      {isReportModalOpen && <ReportModal post={post} onClose={() => setReportModalOpen(false)} />}

      <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slide-up {
            from { transform: translateY(20px) scale(0.98); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </>
  );
};