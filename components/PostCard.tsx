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
        return <span className="text-lg font-bold text-white truncate">{post.price}</span>;
      case 'event':
        return (
          <div className="flex items-center text-sm text-neutral-300">
            <CalendarIcon />
            <span>{post.eventDate}</span>
          </div>
        );
      case 'service':
        return <span className="text-sm font-medium text-neutral-300">View Details</span>;
      default:
        return <div className="h-6"></div>; // Placeholder for consistent height
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg bg-black/60 backdrop-blur-lg border border-transparent hover:border-neutral-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer flex flex-col"
    >
      <div className="relative">
        <img
          src={post.imageUrls[0]}
          alt={post.title}
          className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
             <h3 className="text-white text-lg font-bold truncate">{post.title}</h3>
        </div>
      </div>
      <div className="p-4 bg-black/70 flex flex-col flex-grow justify-between">
        <div className="flex items-center justify-between h-7">
          {renderKeyInfo()}
        </div>
        <div className="flex items-center text-neutral-400 text-xs mt-2">
            <div className="flex items-center min-w-0">
              <MapPinIcon />
              <span className="truncate">{post.location}</span>
            </div>
            <span className="mx-2 text-neutral-600 flex-shrink-0">•</span>
            <div className="bg-neutral-800 text-neutral-300 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
              {categoryText[post.category]}
            </div>
        </div>
      </div>
    </div>
  );
};