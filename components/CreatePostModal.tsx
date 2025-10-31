import React, { useState, useEffect } from 'react';
import type { Post } from '../types';
import { XIcon } from './IconComponents';

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (postData: Omit<Post, 'id' | 'user' | 'createdAt'>) => Promise<void>;
}

type Category = 'sale' | 'event' | 'service' | 'job';

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('sale');
  const [price, setPrice] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageSource, setImageSource] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Prevent background scrolling when the modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSource(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location || !imageSource) {
        alert("Please fill in all required fields and provide an image.");
        return;
    }
    setSubmitting(true);
    await onSubmit({
      title,
      description,
      category,
      price: category === 'sale' || category === 'job' ? price : undefined,
      eventDate: category === 'event' ? eventDate : undefined,
      location,
      imageUrls: [imageSource],
    });
    setSubmitting(false);
  };

  const categories: { id: Category, name: string }[] = [
    { id: 'sale', name: 'For Sale' },
    { id: 'event', name: 'Event' },
    { id: 'service', name: 'Service' },
    { id: 'job', name: 'Job' },
  ];
  
  const priceLabel = category === 'job' ? 'Salary / Rate' : 'Price';

  const commonInputClasses = "w-full bg-neutral-900 border border-neutral-700 rounded-md py-2 px-3 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition";

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white">Create a New Post</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-white">
              <XIcon />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-300 mb-1">Title</label>
                <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className={commonInputClasses} placeholder="e.g., Vintage Leather Jacket" required />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-300 mb-1">Description</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className={commonInputClasses} placeholder="Provide details about your post..." required></textarea>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map(({ id, name }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setCategory(id)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                        category === id
                            ? 'bg-white text-black'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                    >
                        {name}
                    </button>
                    ))}
                </div>
            </div>

            {(category === 'sale' || category === 'job') && (
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-neutral-300 mb-1">{priceLabel}</label>
                    <input id="price" type="text" value={price} onChange={e => setPrice(e.target.value)} className={commonInputClasses} placeholder={category === 'job' ? 'e.g., $120,000/year' : '$75'} required />
                </div>
            )}

            {category === 'event' && (
                <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-neutral-300 mb-1">Event Date</label>
                    <input id="eventDate" type="text" value={eventDate} onChange={e => setEventDate(e.target.value)} className={commonInputClasses} placeholder="Sat, Oct 26" required />
                </div>
            )}
            
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-neutral-300 mb-1">Location</label>
                <input id="location" type="text" value={location} onChange={e => setLocation(e.target.value)} className={commonInputClasses} placeholder="e.g., Downtown" required />
            </div>

            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-300 mb-1">Image URL or Upload</label>
                <div className="flex items-center space-x-2">
                    <input id="imageUrl" type="text" value={imageSource} onChange={e => setImageSource(e.target.value)} className={commonInputClasses} placeholder="Paste URL or upload..." />
                    <label htmlFor="file-upload" className="cursor-pointer bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors whitespace-nowrap">
                        Upload
                    </label>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                </div>
                 {imageSource && (imageSource.startsWith('data:image') || imageSource.startsWith('http')) && (
                    <div className="mt-4">
                        <img src={imageSource} alt="Preview" className="w-full h-auto max-h-48 object-contain rounded-md bg-black/20" />
                    </div>
                 )}
            </div>

            <div className="border-t border-neutral-700 mt-6 pt-4"></div>

            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-2 px-4 rounded-lg transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={submitting} className="bg-white hover:bg-neutral-200 text-black font-bold py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:scale-100">
                    {submitting ? 'Submitting...' : 'Submit Post'}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};