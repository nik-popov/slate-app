import React, { useState, useEffect } from 'react';
import { XIcon, UserIcon } from './IconComponents';
import { getUserProfile, createUserProfile, updateUserProfile } from '../backendService';
import { getCurrentUser } from '../authService';
import type { UserProfile } from '../backendService';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'sale', name: 'For Sale' },
    { id: 'event', name: 'Events' },
    { id: 'service', name: 'Services' },
    { id: 'job', name: 'Jobs' },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const userProfile = await getUserProfile();
        if (userProfile) {
          setProfile(userProfile);
          setDisplayName(userProfile.displayName);
          setBio(userProfile.bio || '');
          setLocation(userProfile.location || '');
          setPhoneNumber(userProfile.phoneNumber || '');
          setNotifications(userProfile.preferences.notifications);
          setEmailUpdates(userProfile.preferences.emailUpdates);
          setSelectedCategories(userProfile.preferences.categories);
        } else {
          // Set defaults from auth user
          setDisplayName(currentUser.displayName || currentUser.email || '');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const profileData = {
        displayName,
        bio,
        location,
        phoneNumber,
        preferences: {
          notifications,
          emailUpdates,
          categories: selectedCategories
        }
      };

      if (profile) {
        await updateUserProfile(profileData);
      } else {
        await createUserProfile(profileData);
      }

      alert('Profile saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all']);
    } else {
      const newCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories.filter(id => id !== 'all'), categoryId];
      
      setSelectedCategories(newCategories.length === 0 ? ['all'] : newCategories);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">User Profile</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <XIcon />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-neutral-400">Loading profile...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center">
                  <UserIcon />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{displayName}</h3>
                  <p className="text-neutral-400 text-sm">Update your profile information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-neutral-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                    placeholder="Your display name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-neutral-300 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-neutral-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                  placeholder="City, State"
                />
              </div>

              <div className="border-t border-neutral-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300">Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300">Email Updates</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailUpdates}
                        onChange={(e) => setEmailUpdates(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-neutral-300 mb-3">Interested Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(({ id, name }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleCategoryToggle(id)}
                        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
                          selectedCategories.includes(id)
                            ? 'bg-white text-black'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-md hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-white text-black font-semibold rounded-md hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};