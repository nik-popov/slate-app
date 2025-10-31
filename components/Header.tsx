import React, { useState } from 'react';
import { SearchIcon, SlateIcon, UserIcon, PlusIcon } from './IconComponents';
import type { AuthUser } from '../authService';

interface HeaderProps {
  isLoggedIn: boolean;
  user: AuthUser | null;
  isPremium?: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  onCreatePostClick: () => void;
  onSearch?: (query: string) => void;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn, user, isPremium, onLoginClick, onLogout, onCreatePostClick, onSearch, onProfileClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  return (
    <header className="bg-black/50 backdrop-blur-lg sticky top-0 z-50 border-b border-neutral-800/50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-1">
            <a href="#" className="text-3xl font-bold text-white hover:text-neutral-300 transition-colors tracking-wider">
              SLATE
            </a>
            <SlateIcon />
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden md:block">
               <div className="max-w-md w-full lg:max-w-xs">
                 <form onSubmit={handleSearchSubmit}>
                   <label htmlFor="search" className="sr-only">Search</label>
                   <div className="relative text-neutral-400 focus-within:text-white">
                     <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                       <SearchIcon />
                     </div>
                     <input
                       id="search"
                       value={searchQuery}
                       onChange={handleSearchChange}
                       className="block w-full bg-neutral-900/50 border border-neutral-700 rounded-md py-2 pl-10 pr-3 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
                       placeholder="Search posts..."
                       type="search"
                       name="search"
                     />
                   </div>
                 </form>
               </div>
            </div>

            <button
                onClick={onCreatePostClick}
                className="flex items-center space-x-2 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 relative"
              >
                <PlusIcon />
                <span className="hidden sm:inline">Create Post</span>
                {isLoggedIn && !isPremium && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full font-bold">
                    Premium
                  </span>
                )}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-neutral-300 text-sm hidden sm:inline">
                    Welcome, {user?.displayName || user?.email}
                  </span>
                  {isPremium && (
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center space-x-1">
                      <span>⭐</span>
                      <span>Premium</span>
                    </span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
                <button
                  onClick={onProfileClick}
                  className="h-8 w-8 bg-neutral-800 rounded-full flex items-center justify-center overflow-hidden hover:bg-neutral-700 transition-colors"
                >
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon />
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onLoginClick}
                  className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200"
                >
                  Login
                </button>
                <button
                  onClick={onLoginClick}
                  className="bg-white text-black hover:bg-neutral-200 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};