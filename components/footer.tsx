'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 border-t border-card-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-muted/10 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary" />
              <div className="absolute inset-0 w-8 h-8 text-secondary animate-glow-pulse opacity-50" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary !bg-clip-text text-transparent">
              ImagineX
            </span>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            ImagineX is a powerful AI-powered image editor that allows you to
            transform your photos with ease. With ImagineX, you can remove
            backgrounds, change backgrounds, edit images with text prompts, and
            much more.
          </p>
          {/* Copyright */}
          <div className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} ImagineX. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
