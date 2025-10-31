import React from 'react';
import { DatabaseIcon } from './IconComponents';
import { isFirebaseConfigured } from '../firebaseConfig';

interface EmptyStateProps {
  onSeedDatabase: () => void;
  onSetupDatabase: () => void;
  isSeeding: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSeedDatabase, onSetupDatabase, isSeeding }) => {
  const isConfigured = isFirebaseConfigured();
  
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <DatabaseIcon />
      <h2 className="mt-6 text-2xl font-bold text-white">Your Feed is Empty</h2>
      <p className="mt-2 max-w-md text-neutral-400">
        {isConfigured 
          ? "Your database is configured but contains no posts yet. Add some sample data to get started!"
          : "It looks like your database isn't configured yet. Set up Firebase to start using the app."
        }
      </p>
      
      <div className="mt-8 space-y-4">
        {!isConfigured ? (
          <button
            onClick={onSetupDatabase}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Configure Firebase Database
          </button>
        ) : (
          <button
            onClick={onSeedDatabase}
            disabled={isSeeding}
            className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center"
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
              'Add Sample Data'
            )}
          </button>
        )}
        
        {isConfigured && (
          <button
            onClick={onSetupDatabase}
            className="w-full bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Reconfigure Database
          </button>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-neutral-900 rounded-lg max-w-lg">
        <p className="text-sm text-neutral-300">
          <strong>{isConfigured ? "Database Status:" : "Quick Setup:"}</strong>
        </p>
        {isConfigured ? (
          <div className="text-xs text-neutral-400 mt-2 space-y-1 text-left">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Firebase configuration loaded</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Database connection ready</span>
            </div>
            <p className="mt-2 text-neutral-500">Ready to add posts and seed data!</p>
          </div>
        ) : (
          <ol className="text-xs text-neutral-400 mt-2 space-y-1 list-decimal list-inside text-left">
            <li>Click "Configure Firebase Database" above</li>
            <li>Create a Firebase project at console.firebase.google.com</li>
            <li>Copy your Firebase config values</li>
            <li>Enable Firestore Database</li>
            <li>Configuration will persist automatically</li>
          </ol>
        )}
      </div>
    </div>
  );
};