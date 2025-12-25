'use client';

import Features from '@/components/features';
import Hero from '@/components/hero';
import Pricing from '@/components/pricing';
import Editor from '@/components/editor';
import Footer from '@/components/footer';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Clock, X } from 'lucide-react';

export default function Home() {
  const [paymentStatus, setPaymentStatus] = useState<
    'upgraded' | 'canceled' | null
  >(null);

  useEffect(() => {
    const urlParms = new URLSearchParams(window.location.search);
    const upgraded = urlParms.get('upgraded');
    const canceled = urlParms.get('payment_canceled');
    if (upgraded) {
      setPaymentStatus('upgraded');
      window.history.replaceState({}, '', '/');
    } else if (canceled) {
      setPaymentStatus('canceled');
      window.history.replaceState({}, '', '/');
    }
  }, []);

  return (
    <div>
      <AnimatePresence>
        {paymentStatus && (
          <motion.div
            initial={{
              opacity: 0,
              y: -50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -50,
            }}
            className={`fixed top-4 right-4 z-50 rounded-xl border ${
              paymentStatus === 'upgraded'
                ? 'bg-green-500/10 border-green-500/20 text-green-600'
                : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              {paymentStatus === 'upgraded' ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    🎉Welcome to Pro! You now have unlimited access to AI
                    Generations.
                  </span>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">
                    Payment canceled. You can upgrade anytime!
                  </span>
                </>
              )}
              <button onClick={() => setPaymentStatus(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Hero />
      <Features />
      <Pricing />
      <Editor />
      <Footer />
    </div>
  );
}
