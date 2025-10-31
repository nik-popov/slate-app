import React from 'react';
import type { Post } from '../types';
import { CalendarIcon, MapPinIcon } from './IconComponents';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

const categoryText = {
  sale: 'For Sale',
  event: 'Event',
  service: 'Service',
  job: 'Job'
};

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const renderKeyInfo = () => {
    switch (post.category) {
      case 'sale':
      case 'job':
        return <span className="text-lg font-bold text-white drop-shadow-md">{post.price}</span>;
      case 'event':
        return (
          <div className="flex items-center text-sm text-white/90 drop-shadow-md">
            <CalendarIcon />
            <span className="ml-1">{post.eventDate}</span>
          </div>
        );
      case 'service':
        return <span className="text-sm font-medium text-white/80 drop-shadow-md">Service Available</span>;
      default:
        return null;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl bg-black/60 backdrop-blur-lg border border-transparent hover:border-neutral-700/50 transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative w-full h-64 sm:h-72 lg:h-80 overflow-hidden">
        <img
          src={post.imageUrls[0]}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Multiple Images Indicator */}
        {post.imageUrls.length > 1 && (
          <div className="absolute top-3 right-3">
            <div className="bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full border border-white/20 flex items-center space-x-1">
              <span>📸</span>
              <span>{post.imageUrls.length}</span>
            </div>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Background shade for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent rounded-b-xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Key Info (Price/Date) */}
            <div className="mb-2">
              {renderKeyInfo()}
            </div>
            
            {/* Title */}
            <h3 className="text-white text-lg font-bold mb-3 drop-shadow-md leading-tight line-clamp-2">
              {post.title}
            </h3>
            
            {/* Location and Category */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-white/80 text-sm drop-shadow-md min-w-0 flex-1">
                <MapPinIcon />
                <span className="ml-1 truncate">{post.location}</span>
              </div>
              <div className="ml-3 flex-shrink-0">
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full border border-white/30">
                  {categoryText[post.category]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};