import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Loader2, Star, X, Zap } from 'lucide-react';
import { Button } from './ui/button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  usageCount: number;
  usageLimit: number;
}

const PaymentModal = ({
  isOpen,
  onClose,
  onUpgrade,
  usageCount,
  usageLimit,
}: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'basic',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm "
        >
          <motion.div
            initial={{
              scale: 0.95,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.95,
              opacity: 0,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md glass rounded-2xl p-6 border shadow-glow-primary"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-3 rounded-full hover:bg-neutral-800/50"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Upgrade to Pro
              </h2>
              <p className="text-muted-foreground">
                Upgrade to Pro to remove the usage limit and get access to all
                features.
              </p>
            </div>

            {/* Add Feature */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center ">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Unlimited Uploads
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No more limits on the number of images you can upload.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Priority Processing
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get your images processed faster with priority processing.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Premium Effects</p>
                  <p className="text-xs text-muted-foreground">
                    Get access to premium effects and filters.
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={onUpgrade} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Upgrade to Pro'
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              By clicking "Upgrade to Pro", you agree to our{' '}
              <a href="#" className="underline text-primary">
                Terms of Service
              </a>
              .
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
