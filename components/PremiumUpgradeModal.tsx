import React, { useEffect } from 'react';
import { XIcon } from './IconComponents';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade 
}) => {
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
      >
        <div 
          className="bg-neutral-900/90 backdrop-blur-md border border-neutral-700/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-yellow-600 to-orange-500 p-6">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1"
            >
              <XIcon />
            </button>
            <div className="text-center">
              <div className="text-3xl mb-2">⭐</div>
              <h2 className="text-2xl font-bold text-white">Upgrade to Premium</h2>
              <p className="text-yellow-100 text-sm mt-1">Unlock full posting capabilities</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Premium Features</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-neutral-300">Create unlimited posts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-neutral-300">Upload high-quality images</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-neutral-300">Priority listing placement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-neutral-300">Advanced analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-neutral-300">24/7 premium support</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-800/50 rounded-lg p-4 mb-6 text-center">
              <div className="text-2xl font-bold text-white">$9.99</div>
              <div className="text-neutral-400 text-sm">per month</div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors font-medium"
              >
                Maybe Later
              </button>
              <button
                onClick={onUpgrade}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-400 transition-all transform hover:scale-105 font-bold shadow-lg"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slide-up {
            from { transform: translateY(20px) scale(0.95); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </>
  );
};