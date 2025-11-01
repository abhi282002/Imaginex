'use client';

import { signIn, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const [isMobaileMenuOpen, setIsMobaileMenuOpen] = useState(false);

  const { data: session } = useSession();

  const scrollToSection = (sectionId: string) => {
    const ele = document.getElementById(sectionId) as HTMLDivElement;

    if (ele) {
      ele.scrollIntoView({
        behavior: 'smooth',
      });
      setIsMobaileMenuOpen(false);
    }
  };

  const handleSubmit = async () => {
    if (session?.user) {
      scrollToSection('editor');
    } else {
      await signIn('google');
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'shadow-glass border-b border-card-border backdrop-blur-glass '
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            onClick={() => scrollToSection('hero')}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="relative ">
              <Sparkles
                fill="transparent"
                className="size-8 text-primary animate-glow-pulse"
              />
              <div className="absolute inset-0 size-8 text-secondary animate-glow-pulse opacity-50" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text! text-transparent">
                ImagineX
              </span>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => {
                scrollToSection('features');
              }}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => {
                scrollToSection('pricing');
              }}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Pricing
            </button>
            <Button
              variant={'hero'}
              className="w-full font-semibold"
              onClick={() => {}}
            >
              {session?.user ? 'Launch App' : 'Sign In'}
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
