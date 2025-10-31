import React, { useState, useEffect } from 'react';
import type { Post } from '../types';
import { CalendarIcon, MapPinIcon, XIcon, ChevronLeftIcon, ChevronRightIcon, ShareIcon, MessageSquareIcon, FlagIcon } from './IconComponents';
import { ShareModal } from './ShareModal';
import { ReportModal } from './ReportModal';


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
  const categoryText = categoryTextMap[post.category];

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
    const commonButtonClasses = "px-4 py-2 text-sm font-bold rounded-lg shadow-md transition-all duration-200";
    const primaryButtonClasses = `${commonButtonClasses} bg-white text-black hover:scale-105`;
    const secondaryButtonClasses = `${commonButtonClasses} bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:scale-105`;

    return (
        <div className="flex flex-wrap items-center gap-3">
            {post.category === 'sale' && (
                <>
                    <button className={primaryButtonClasses}>Message</button>
                    <button className={secondaryButtonClasses}>Make Offer</button>
                </>
            )}
            {post.category === 'event' && (
                <>
                    <button className={primaryButtonClasses}>RSVP</button>
                    <button className={secondaryButtonClasses}>Save Event</button>
                </>
            )}
            {post.category === 'service' && (
                <>
                    <button className={primaryButtonClasses}>Contact</button>
                    <button className={secondaryButtonClasses}>Request Info</button>
                </>
            )}
            {post.category === 'job' && (
                <>
                    <button className={primaryButtonClasses}>Apply Now</button>
                    <button className={secondaryButtonClasses}>Save Job</button>
                </>
            )}
        </div>
    );
  }

  const renderSecondaryActions = () => {
      const commonClasses = "flex items-center space-x-1.5 hover:text-white transition-colors";
      const smsBody = `Hi, I'm interested in your post "${post.title}" on Slate.`;
      
      return (
        <div className="flex items-center space-x-6 text-sm text-neutral-400">
            <button className={commonClasses} onClick={() => setShareModalOpen(true)}>
                <ShareIcon />
                <span>Share</span>
            </button>
            {post.user.phoneNumber && (
                <a href={`sms:${post.user.phoneNumber}?&body=${encodeURIComponent(smsBody)}`} className={commonClasses}>
                    <MessageSquareIcon />
                    <span>SMS</span>
                </a>
            )}
            <button className={commonClasses} onClick={() => setReportModalOpen(true)}>
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
          className="bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full md:w-1/2 flex-shrink-0 bg-black/20 flex flex-col">
            <div className="relative group flex-grow flex items-center justify-center p-4">
                <img
                  src={post.imageUrls[activeImageIndex]}
                  alt={post.title}
                  className="w-full h-full max-h-[60vh] object-contain rounded-lg"
                />
                {post.imageUrls.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
                    >
                      <ChevronLeftIcon />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
                    >
                      <ChevronRightIcon />
                    </button>
                  </>
                )}
            </div>
            {post.imageUrls.length > 1 && (
              <div className="p-2 flex-shrink-0">
                <div className="flex space-x-2 justify-center p-2">
                  {post.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-16 w-16 object-cover rounded-md cursor-pointer border-2 transition-colors ${
                        activeImageIndex === index
                          ? 'border-white'
                          : 'border-transparent hover:border-neutral-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col flex-grow w-full md:w-1/2">
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-bold text-white pr-4">{post.title}</h2>
              <button onClick={onClose} className="text-neutral-400 hover:text-white flex-shrink-0">
                <XIcon />
              </button>
            </div>
            
            {(post.category === 'sale' || post.category === 'job') && post.price && (
              <p className="text-2xl font-bold mt-1 text-white flex-shrink-0">{post.price}</p>
            )}

            <div className="mt-4 flex-shrink-0">{renderMetaInfo()}</div>

            <div className="mt-4 border-b border-neutral-800 pb-4 flex-shrink-0">
              {renderSecondaryActions()}
            </div>
            
            <div className="my-6 flex-grow overflow-y-auto pr-2 -mr-2">
              <p className="text-neutral-300 text-base leading-relaxed">
                  {post.description}
              </p>
              {post.tags && post.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                          <span key={tag} className="bg-neutral-800 text-neutral-300 text-xs font-medium px-2 py-1 rounded-full">
                              #{tag}
                          </span>
                      ))}
                  </div>
              )}
            </div>
            
            <div className="mt-auto flex-shrink-0">
              {isLoggedIn ? (
                  <div className="border-t border-neutral-700 pt-4 space-y-4">
                      <div>{renderActionButtons()}</div>
                      <div className="border-t border-neutral-800 pt-4">{renderUserInfo()}</div>
                  </div>
              ) : (
                  <div className="border-t border-neutral-700 pt-4 space-y-4">
                      <div>
                          <h3 className="text-lg font-bold text-white mb-2">Unlock Full Access</h3>
                          <p className="text-neutral-300 mb-4 text-sm">Log in or create an account to interact with this post.</p>
                          <div className="blur-sm pointer-events-none select-none opacity-60">
                              {renderActionButtons()}
                          </div>
                      </div>
                      <div className="border-t border-neutral-800 pt-4">{renderUserInfo()}</div>
                  </div>
              )}
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