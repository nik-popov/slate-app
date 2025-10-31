import React, { useState, useEffect } from 'react';
import type { Post } from '../types';
import { reportPost } from '../backendService';
import { XIcon } from './IconComponents';

interface ReportModalProps {
  post: Post;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ post, onClose }) => {
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const commonInputClasses = "w-full bg-neutral-900 border border-neutral-700 rounded-md py-2 px-3 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition";

  useEffect(() => {
    // Prevent background scrolling when the modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
        alert("Please provide a reason for your report.");
        return;
    }
    
    try {
      console.log(`Reporting post ${post.id} for reason: ${reason}`);
      await reportPost(post.id, reason);
      setSubmitted(true);
      setTimeout(onClose, 2000); // Close modal after 2 seconds
    } catch (error: any) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

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
            <h2 className="text-2xl font-bold text-white">Report Post</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-white">
              <XIcon />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8">
                <p className="text-lg text-white">Thank you for your report.</p>
                <p className="text-neutral-400 mt-2">We will review this post shortly.</p>
            </div>
          ) : (
            <>
                <p className="text-neutral-400 mb-4 text-sm">
                    Please let us know why you are reporting the post titled "{post.title}".
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="reason" className="sr-only">Reason for reporting</label>
                        <textarea 
                            id="reason" 
                            value={reason} 
                            onChange={e => setReason(e.target.value)} 
                            rows={4} 
                            className={commonInputClasses} 
                            placeholder="Provide details here..." 
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-2 px-4 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="bg-white hover:bg-neutral-200 text-black font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                            Submit Report
                        </button>
                    </div>
                </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};