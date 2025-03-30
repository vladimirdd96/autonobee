import React from 'react';
import { Lock } from 'lucide-react';
import Link from 'next/link';

interface NFTSubscriptionOverlayProps {
  onClose: () => void;
}

export default function NFTSubscriptionOverlay({ onClose }: NFTSubscriptionOverlayProps) {
  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-accent mb-2">NFT Subscription Required</h3>
        <p className="text-accent/80 mb-6">
          To post directly to your X account, you need to subscribe with an NFT. Choose a plan that best suits your needs.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/mint"
            className="px-6 py-3 bg-primary text-background rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            Subscribe Now
          </Link>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-accent/10 text-accent rounded-lg font-medium hover:bg-accent/20 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 