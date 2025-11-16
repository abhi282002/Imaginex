'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import BeforeAfterSlider from './before-after-slider';
const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const ele = document.getElementById(sectionId) as HTMLDivElement;

    if (ele) {
      ele.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to bg-muted opacity-50" />

      {/* Floting Objects */}

      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
        style={{
          animationDelay: '-1s',
        }}
      />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}

        <motion.div
          initial={{
            opacity: 0,
            x: -50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="inline-flex items-center space-x-2 bg-gradient-glass rounded-full  px-2 mb-6 glass border border-card-border"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">
              Imaginex Powered by AI Magic
            </span>
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="text-3xl lg:text-5xl font-bold leading-tight mb-6"
          >
            <span className="bg-gradient-primary !bg-clip-text text-transparent">
              ImagineX AI
            </span>
            <br />
            <span className="text-foreground">The Magic Photo Editor</span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
            }}
            className="text-xl  text-muted-foreground mb-8 max-w-2xl"
          >
            ImagineX AI is a powerful photo editing tool that uses AI to enhance
            your photos and make them look like they were taken by a
            professional.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Button
              variant={'hero'}
              size={'lg'}
              onClick={() => scrollToSection('editor')}
              className="group text-white"
            >
              <Play className="h-5 w-5 group-hover:animate-pulse " />
              Try Free now
            </Button>
            <Button
              variant={'secondary'}
              size={'lg'}
              onClick={() => scrollToSection('editor')}
              className="group"
            >
              Launch App
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform " />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex items-center justify-center lg:justify-start space-x-6"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Unlimited Uploads on Pro</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Unlimited Edits</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content */}

        <motion.div
          initial={{
            opacity: 0,
            x: 50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className="flex justify-center"
        >
          <BeforeAfterSlider />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
