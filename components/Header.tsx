import React from 'react';
import { SearchIcon, SlateIcon, UserIcon, PlusIcon } from './IconComponents';

interface HeaderProps {
  isLoggedIn: boolean;
  onLoginToggle: () => void;
  onCreatePostClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLoginToggle, onCreatePostClick }) => {
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
                 <label htmlFor="search" className="sr-only">Search</label>
                 <div className="relative text-neutral-400 focus-within:text-white">
                   <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                     <SearchIcon />
                   </div>
                   <input
                     id="search"
                     className="block w-full bg-neutral-900/50 border border-neutral-700 rounded-md py-2 pl-10 pr-3 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition"
                     placeholder="Search..."
                     type="search"
                     name="search"
                   />
                 </div>
               </div>
            </div>

            <button
                onClick={onCreatePostClick}
                className="flex items-center space-x-2 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200"
              >
                <PlusIcon />
                <span className="hidden sm:inline">Create Post</span>
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={onLoginToggle}
                  className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
                <div className="h-8 w-8 bg-neutral-800 rounded-full flex items-center justify-center">
                    <UserIcon />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onLoginToggle}
                  className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200"
                >
                  Login
                </button>
                <button
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