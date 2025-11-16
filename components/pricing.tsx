'use client';
import { motion } from 'framer-motion';
import { Crown, LucideIcon, Play, Star, Zap } from 'lucide-react';

type PlansProps = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  limitations?: string[];
  cta: string;
  popular: boolean;
  icon: LucideIcon;
};

const plans: PlansProps[] = [
  {
    name: 'Free',
    price: '0INR',
    period: 'forever',
    description: 'Perfect for trying out ImagineX AI',
    features: [
      '3 edits per day',
      'Basic AI background removal',
      'Standard resolution output',
      'ImagineX watermark included',
      'Community support',
    ],
    limitations: ['Watermark on exports', 'Limited daily usage'],
    cta: 'Get Started',
    popular: false,
    icon: Star,
  },
  {
    name: 'Pro',
    price: '300INR',
    period: 'per month',
    description: 'Perfect for professionals',
    features: [
      'Unlimited edits per day',
      'Advanced AI background removal',
      'High resolution output',
      'ImagineX watermark included',
      'Community support',
    ],
    cta: 'Get Pro',
    popular: true,
    icon: Crown,
  },
];

const Pricing = () => {
  const scrollToEditor = () => {
    const element = document.getElementById('editor');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
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
          }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-glass  from-primary to-primary-glow p-4 rounded-2xl">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-medium">Simple Pricing</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">Choose Your</span>
            <span className="bg-gradient-primary !bg-clip-text text-transparent">
              Magic Plan
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that best fits your needs. Our pricing is simple and
            transparent.
          </p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans?.map((plan, index) => (
            <motion.div
              key={plan.name}
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
                delay: index * 0.2,
              }}
              whileHover={{
                scale: 1.02,
                y: -5,
              }}
              className={`relative group ${plan.period ? 'lg:-mt-8:' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-primary px-6 py-2 rounded-full text-sm font-bold text-background">
                    Most Popular
                  </div>
                </div>
              )}
              <div
                className={`glass rounded-2xl p-8 border border-card-border hover:border-primary/30 transition-all duration-300 shadow-glow-subtle hover:shadow-glow-primary ${
                  plan.popular
                    ? 'bg-primary/50 shadow-glow-primary'
                    : 'border-card-border hover:border-primary/30 shadow-glow-subtle  hover:shadow-glow-primary '
                }`}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-primary to-secondary group-hover:animate-glow-pulse">
                    <plan.icon className="w-8 h-8 text-background" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary">
                    {plan.name}
                  </h3>
                  <p className=" text-muted-foreground max-w-2xl mb-4">
                    {plan.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
