'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Crop, Expand, Scissors, Type, Zap } from 'lucide-react';

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  delay: number;
};

const features: FeatureCardProps[] = [
  {
    icon: Scissors,
    title: 'AI Background Removal',
    description:
      '1-click clean photos with precision AI, Remove any background with ease',
    gradient: 'from-primary to-primary-glow',
    delay: 0.1,
  },
  {
    icon: Expand,
    title: 'AI Gemeratove Fill',
    description:
      'Expand your canvas and auto-fill edges seamlessly. Create stunning images with ease',
    gradient: 'from-secondary to-seondary-glow',
    delay: 0.2,
  },
  {
    icon: Zap,
    title: 'AI Upscale & Enhance',
    description:
      'Boost resolution up to 4x while fixing detials, Transform your photos with ease',
    gradient: 'from-primary to-seondary',
    delay: 0.3,
  },
  {
    icon: Crop,
    title: 'Smart Crop & Face Focus',
    description:
      'Perfect thumbnails automatically. AI detects faces and crops to focus on them',
    gradient: 'from-secondary to-seondary-glow',
    delay: 0.4,
  },
  {
    icon: Type,
    title: 'Watermark & Text Overlay',
    description:
      'Brand your content professionally with AI-generated watermarks and text overlays',
    gradient: 'from-primary-glow to-secondary-glow',
    delay: 0.3,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">Magical</span>
            <span className="bg-gradient-primary !bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the power of AI with ImagineX AI. Our advanced features
            enable you to create stunning images with ease.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {features?.slice(0, 3)?.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features?.slice(3)?.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index + 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

function FeatureCard({
  feature,
  index,
}: {
  feature: FeatureCardProps;
  index: number;
}) {
  const { icon: Icon, title, description, gradient, delay } = feature;
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.8,
        delay,
      }}
      whileHover={{
        scale: 1.02,
        y: -5,
      }}
      className="group"
    >
      <div className="h-full glass rounded-2xl p-8 border border-card-border hover:border-primary/30 transition-all duration-300 shadow-glow-subtle hover:shadow-glow-primary  ">
        <div className="relative mb-6">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} p-4 group-hover:animate-glow-pulse`}
          >
            <Icon className="w-full h-full text-background" />
          </div>
          <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        <div className="mt-6 pt-6 border-t border-card-border">
          <div className="flex items-center space-x-2 text-sm text-primary">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="font-medium">ImagineX AI Powered</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Features;
