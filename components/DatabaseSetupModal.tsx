import React, { useState } from 'react';
import { XIcon } from './IconComponents';

interface DatabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: FirebaseConfig) => void;
}

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const DatabaseSetupModal: React.FC<DatabaseSetupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [config, setConfig] = useState<FirebaseConfig>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof FirebaseConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      onSubmit(config);
      // onSubmit will handle closing the modal and page reload
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration. Please try again.');
      setIsSubmitting(false);
    }
  };

  const isFormValid = config.apiKey && config.authDomain && config.projectId && 
                     config.storageBucket && config.messagingSenderId && config.appId;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Configure Firebase Database
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <XIcon size={24} />
            </button>
          </div>

          <div className="mb-6 p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
            <p className="text-green-200 text-sm">
              <strong>✨ Configuration will persist automatically!</strong>
            </p>
            <p className="text-green-200/80 text-sm mt-1">
              Once saved, your Firebase configuration will be stored locally and persist across browser sessions. No need to re-enter it every time!
            </p>
          </div>

          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <p className="text-yellow-200 text-sm">
              <strong>Setup Instructions:</strong>
            </p>
            <ol className="text-yellow-200/80 text-sm mt-2 space-y-1 list-decimal list-inside">
              <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-100">Firebase Console</a></li>
              <li>Create a new project or select an existing one</li>
              <li>Click "Add app" and select "Web app" ({"</>"} icon)</li>
              <li>Register your app with any name</li>
              <li>Copy the configuration values below</li>
              <li>Enable Firestore Database in your Firebase project</li>
              <li>Set Firestore rules to allow read/write for testing</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                API Key *
              </label>
              <input
                type="text"
                value={config.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="AIzaSyD..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Auth Domain *
              </label>
              <input
                type="text"
                value={config.authDomain}
                onChange={(e) => handleInputChange('authDomain', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="your-project.firebaseapp.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Project ID *
              </label>
              <input
                type="text"
                value={config.projectId}
                onChange={(e) => handleInputChange('projectId', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="your-project-id"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Storage Bucket *
              </label>
              <input
                type="text"
                value={config.storageBucket}
                onChange={(e) => handleInputChange('storageBucket', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="your-project.appspot.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Messaging Sender ID *
              </label>
              <input
                type="text"
                value={config.messagingSenderId}
                onChange={(e) => handleInputChange('messagingSenderId', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="123456789"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                App ID *
              </label>
              <input
                type="text"
                value={config.appId}
                onChange={(e) => handleInputChange('appId', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="1:123456789:web:abc123def456"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Measurement ID (Optional)
              </label>
              <input
                type="text"
                value={config.measurementId}
                onChange={(e) => handleInputChange('measurementId', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="G-XXXXXXXXXX"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex-1 px-4 py-3 bg-white text-black rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '🔄 Saving & Initializing...' : '💾 Save & Configure Firebase'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
            <p className="text-blue-200 text-sm">
              <strong>Sample Firestore Rules for Testing:</strong>
            </p>
            <pre className="text-blue-200/80 text-xs mt-2 bg-blue-900/30 p-2 rounded overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
            </pre>
            <p className="text-blue-200/60 text-xs mt-2">
              ⚠️ These rules allow all read/write access. Use more restrictive rules in production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};