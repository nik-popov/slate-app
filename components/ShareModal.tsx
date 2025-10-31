import React, { useState, useEffect } from 'react';
import type { Post } from '../types';
import { XIcon, CopyIcon } from './IconComponents';

interface ShareModalProps {
  post: Post;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ post, onClose }) => {
  const [copied, setCopied] = useState(false);
  const postUrl = `${window.location.origin}/post/${post.id}`;
  const canShare = navigator.share !== undefined;

  useEffect(() => {
    // Prevent background scrolling when the modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: `Check out this post on Slate: ${post.title}`,
        url: postUrl,
      });
      onClose();
    } catch (error) {
      // Gracefully handle user cancellation of the share sheet.
      // This is expected behavior and not an application error.
      if (error instanceof DOMException && error.name === 'AbortError') {
        // User cancelled the share dialog, do nothing.
        // The fallback UI will remain visible.
      } else {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1500);
  };
  
  // Trigger native share immediately if available
  useEffect(() => {
    if (canShare) {
      handleNativeShare();
    }
  }, [canShare]);


  // Render fallback UI if native share is not available or is cancelled by user
  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 rounded-lg shadow-2xl w-full max-w-md animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white">Share Post</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-white">
              <XIcon />
            </button>
          </div>
          <p className="text-neutral-400 mb-4 text-sm">Share this post with others.</p>

          <div className="flex items-center space-x-2 bg-neutral-900 border border-neutral-700 rounded-md p-2">
            <input 
              type="text" 
              value={postUrl} 
              readOnly 
              className="bg-transparent text-neutral-300 text-sm w-full outline-none"
            />
            <button 
              onClick={handleCopyLink}
              className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-3 rounded-md transition-colors flex items-center space-x-2"
            >
              <CopyIcon />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};