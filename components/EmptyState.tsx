import React from 'react';
import { DatabaseIcon } from './IconComponents';

interface EmptyStateProps {
  onSeedDatabase: () => void;
  isSeeding: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSeedDatabase, isSeeding }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <DatabaseIcon />
      <h2 className="mt-6 text-2xl font-bold text-white">Your Feed is Empty</h2>
      <p className="mt-2 max-w-md text-neutral-400">
        It looks like there are no posts yet. This might be because the database is empty or the configuration is missing.
      </p>
      <button
        onClick={onSeedDatabase}
        disabled={isSeeding}
        className="mt-8 bg-white hover:bg-neutral-200 text-black font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center"
      >
        {isSeeding ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Seeding Database...</span>
            </>
        ) : (
          'Enable Store & Seed Data'
        )}
      </button>
    </div>
  );
};