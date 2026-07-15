'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Users, Globe } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';

const features = [
  {
    title: 'Certified Quality',
    description: 'We adhere to international standards for all our connectors and harnesses.',
    icon: Award,
  },
  {
    title: 'High Performance',
    description: 'Built for longevity and precision in demanding industrial environments.',
    icon: Zap,
  },
  {
    title: 'Expert Support',
    description: 'Our technical team is ready to help with custom engineering needs.',
    icon: Users,
  },
  {
    title: 'Global Supply',
    description: 'A wide range of components in stock for fast global delivery.',
    icon: Globe,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background Micro-elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2%_2%,_#D2232A05_0%,_transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_98%_98%,_#D2232A05_0%,_transparent_50%)]"></div>
      </div>

      <div className="px-4 md:px-12 lg:px-24 xl:px-32 relative z-10 w-full">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <Reveal direction="up" delay={0.1}>
            <span className="text-brand-red font-black tracking-[0.3em] uppercase text-xs mb-6 block">Our Value Proposition</span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="text-5xl md:text-6xl font-black text-brand-dark mb-8 leading-tight">
              Built for <span className="text-brand-red">Performance</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p className="text-gray-500 text-xl leading-relaxed">
              Aaj Tech Trading provides high-reliability components that keep your industrial operations running smoothly.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -15 }}
              className="p-10 rounded-[40px] border border-gray-100 bg-white hover:bg-brand-light hover:shadow-[0_40px_80px_-20px_rgba(210,35,42,0.15)] transition-all duration-500 group text-center flex flex-col items-center"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8, ease: "anticipate" }}
                className="w-20 h-20 bg-brand-red/10 rounded-3xl flex items-center justify-center text-brand-red mb-8 group-hover:bg-brand-red group-hover:text-white transition-all duration-500 shadow-lg shadow-brand-red/5"
              >
                <feature.icon size={36} strokeWidth={2} />
              </motion.div>
              <h3 className="text-2xl font-black text-brand-dark mb-4 group-hover:text-brand-red transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
