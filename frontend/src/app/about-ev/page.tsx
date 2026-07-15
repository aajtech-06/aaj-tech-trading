'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronDown,
  Cpu,
  Layers,
  Settings,
  Activity
} from 'lucide-react';

const heroImages = [
  "/ev_hero_1.png",
  "/ev_hero_2.png",
  "/ev_hero_3.png"
];

const AboutEVPage = () => {
  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Hero Carousel State
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Stagger Container Animation
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Staggered Stiff Items
  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15 },
    },
  };

  const faqData = [
    {
      question: "Are your EV connectors compatible with Indian and global models?",
      answer: "Yes, our AC and DC charging interface assemblies are fully compliant with IEC 62196 Type 2, CCS2, and GB/T international standards. We supply both standard vehicle sockets and charging cable assemblies compatible with all major EV passenger cars, two-wheelers, and commercial fleets."
    },
    {
      question: "What is your testing protocol for high-voltage battery cables?",
      answer: "Every single high-voltage wire harness is subjected to a 100% automated electrical testing sequence. This includes high-pot dielectric testing (up to 1000V DC) to verify insulation resistance, continuity verification, and crimp force monitoring (CFM) for every crimped terminal connection."
    },
    {
      question: "Can you co-design custom connectors for unique EV architectures?",
      answer: "Absolutely. Our engineering cell works in active collaboration with EV OEM design teams. We analyze routing layout, check bend radii inside the vehicle CAD environment, and custom-mold silicone or polyurethane connector boots to offer premium strain relief."
    },
    {
      question: "What kind of waterproofing do your harnesses provide?",
      answer: "We deliver IP67 and IP69K sealed connector assemblies. Utilizing specialized silicone grommets, heat-shrink sleeves, and dust-tight overmolding, our assemblies prevent moisture and liquid intrusion under severe washdowns and waterlogged road conditions."
    }
  ];

  return (
    <div className="bg-brand-light min-h-screen selection:bg-brand-red/20 overflow-x-hidden pt-0">
      
      {/* 1. Hero Section (Full-Screen Background Slideshow) */}
      <section className="relative h-screen flex items-center bg-brand-dark text-white overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroImage}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={heroImages[currentHeroImage]}
                alt="Electric Vehicle Technology Background"
                fill
                priority
                className="object-cover brightness-[0.42] contrast-105"
              />
            </motion.div>
          </AnimatePresence>
          {/* Overlays to ensure high text contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/30 z-10" />
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-10" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 lg:px-8 xl:px-16 relative z-20 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            <div className="lg:col-span-8 space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red text-xs font-black tracking-[0.25em] uppercase shadow-inner backdrop-blur-md"
              >
                <Activity size={14} className="animate-pulse" />
                Empowering Sustainable Mobility
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]"
              >
                Empowering The Future <br />
                Of Sustainable <span className="text-brand-red underline decoration-brand-red/30 decoration-4 underline-offset-8">Transportation</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl leading-relaxed"
              >
                Innovative Electric Vehicle connection technologies by Aaj Tech. We design and distribute high-performance connectors, wire harnesses, and smart charging assemblies for a cleaner tomorrow.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link
                  href="#commitment"
                  className="inline-flex items-center gap-3 bg-brand-red hover:bg-brand-red-hover text-white px-10 py-4.5 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(210,35,42,0.4)] transition-all active:scale-95 group"
                >
                  Explore More
                  <ArrowRight size={16} className="transform group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Indicators and Specs Badge */}
        <div className="absolute bottom-10 left-4 lg:left-8 xl:left-16 right-4 lg:right-8 xl:right-16 flex justify-between items-center z-20">
          {/* Slide Navigation indicators */}
          <div className="flex gap-2.5">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroImage(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentHeroImage === idx ? 'bg-brand-red w-8' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Visual Specs Badge */}
          <div className="pointer-events-none hidden sm:block">
            <div className="dark-glass border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">HV Standard</span>
              <span className="text-white text-lg font-black tracking-wide">1000V DC Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Commitment Section */}
      <section id="commitment" className="py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-8 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Left side text and list */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-6 space-y-8"
            >
              <div className="space-y-4">
                <span className="text-brand-red text-xs font-black tracking-[0.25em] uppercase block">
                  Our Commitment
                </span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-brand-dark leading-none">
                  We Provide Best Solutions For Your Electric Vehicle
                </h2>
              </div>
              
              <p className="text-gray-500 text-lg font-medium leading-relaxed">
                At Aaj Tech Trading Corporation, we are driving the transition to sustainable e-mobility with certified, high-performance automotive wiring harnesses and power distribution connection blocks.
              </p>

              {/* Staggered Checklist */}
              <div className="space-y-6">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Reduced Carbon Footprint",
                    desc: "Our high-efficiency connection solutions eliminate resistance losses, optimizing battery life and lowering emissions."
                  },
                  {
                    icon: Zap,
                    title: "Energy Efficiency",
                    desc: "Designed with premium purity copper and advanced terminal contacts to minimize voltage drop and dissipation."
                  },
                  {
                    icon: Layers,
                    title: "Circular Economy Design",
                    desc: "We prioritize recyclable polymers and materials designed for clean end-of-life disassembly and component reuse."
                  }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="flex gap-5 group items-start"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red flex items-center justify-center shrink-0 transition-colors group-hover:bg-brand-red group-hover:text-white group-hover:scale-105 duration-300">
                      <item.icon size={22} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-brand-dark tracking-wide uppercase transition-colors group-hover:text-brand-red duration-300">
                        {item.title}
                      </h4>
                      <p className="text-gray-500 font-semibold text-sm mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right side triple-image montage */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
              {/* Top left image */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.93 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-md group cursor-pointer"
              >
                <Image
                  src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=600"
                  alt="Quality Testing EV"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                />
                <div className="absolute inset-0 bg-brand-red/5 mix-blend-multiply" />
              </motion.div>
              
              {/* Top right image (standing charger) */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.93 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-md group mt-10 cursor-pointer"
              >
                <Image
                  src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=600"
                  alt="EV Charging Station Panel"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                />
                <div className="absolute inset-0 bg-brand-red/5 mix-blend-multiply" />
              </motion.div>

              {/* Bottom full image */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="col-span-2 relative aspect-[16/9] rounded-3xl overflow-hidden shadow-md group mt-4 cursor-pointer"
              >
                <Image
                  src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200"
                  alt="Charging port close up"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                />
                <div className="absolute inset-0 bg-brand-red/5 mix-blend-multiply" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. standing showcase section */}
      <section className="py-32 bg-brand-dark text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-red/5 blur-[160px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 xl:px-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto mb-24 space-y-4"
          >
            <span className="text-brand-red text-xs font-black tracking-[0.25em] uppercase block">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Complete EV Solutions For Every Need
            </h2>
            <p className="text-gray-400 text-base font-semibold leading-relaxed">
              From power contacts to custom assembly arrays, we distribute certified EV components customized for high performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side text blocks */}
            <div className="lg:col-span-4 space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ x: -10, y: -2 }}
                className="space-y-3 lg:text-right group cursor-pointer p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.02] border border-transparent hover:border-white/5"
              >
                <div className="inline-flex lg:flex justify-center lg:justify-end mb-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red transition-all duration-300 group-hover:bg-brand-red group-hover:text-white group-hover:scale-110 group-hover:rotate-12">
                    <Cpu size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-black uppercase tracking-wide transition-colors duration-300 group-hover:text-brand-red">HV Battery Connections</h3>
                <p className="text-gray-400 text-sm font-semibold leading-relaxed transition-colors duration-300 group-hover:text-gray-300">
                  Rigid and flexible custom busbar assemblies and high-voltage distribution lines rated for up to 1000V DC.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                whileHover={{ x: -10, y: -2 }}
                className="space-y-3 lg:text-right group cursor-pointer p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.02] border border-transparent hover:border-white/5"
              >
                <div className="inline-flex lg:flex justify-center lg:justify-end mb-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red transition-all duration-300 group-hover:bg-brand-red group-hover:text-white group-hover:scale-110 group-hover:rotate-12">
                    <Layers size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-black uppercase tracking-wide transition-colors duration-300 group-hover:text-brand-red">BMS Signal Harnesses</h3>
                <p className="text-gray-400 text-sm font-semibold leading-relaxed transition-colors duration-300 group-hover:text-gray-300">
                  Low-voltage control connections with specialized shield braids to prevent electromagnetic interface issues.
                </p>
              </motion.div>
            </div>

            {/* Center Standing Charger Image */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="lg:col-span-4 flex justify-center py-8 relative"
            >
              {/* Pulse background element */}
              <motion.div 
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-red/25 blur-3xl rounded-full" 
              />
              
              {/* Floating inner container with 3D tilt and shine */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{
                  scale: 1.04,
                  rotateY: 8,
                  rotateX: -4,
                  transition: { duration: 0.3 }
                }}
                style={{ perspective: 1000 }}
                className="relative w-full max-w-[280px] aspect-[1/2] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group bg-brand-dark/20 cursor-pointer"
              >
                {/* Shining light overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-10" />
                
                <Image
                  src="/ev_charger_pedestal.png"
                  alt="EV Charger pedestal standing"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                />
              </motion.div>
            </motion.div>

            {/* Right side text blocks */}
            <div className="lg:col-span-4 space-y-12">
              <motion.div
                initial={{ opacity: 0, x: 35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ x: 10, y: -2 }}
                className="space-y-3 group cursor-pointer p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.02] border border-transparent hover:border-white/5"
              >
                <div className="inline-flex items-center w-12 h-12 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red mb-2 transition-all duration-300 group-hover:bg-brand-red group-hover:text-white group-hover:scale-110 group-hover:rotate-12">
                  <Settings size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-wide transition-colors duration-300 group-hover:text-brand-red">Molded Strain Relief</h3>
                <p className="text-gray-400 text-sm font-semibold leading-relaxed transition-colors duration-300 group-hover:text-gray-300">
                  Custom overmolded boots offering dust, moisture ingress, and vibrational protection for vehicle routing.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                whileHover={{ x: 10, y: -2 }}
                className="space-y-3 group cursor-pointer p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.02] border border-transparent hover:border-white/5"
              >
                <div className="inline-flex items-center w-12 h-12 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red mb-2 transition-all duration-300 group-hover:bg-brand-red group-hover:text-white group-hover:scale-110 group-hover:rotate-12">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-wide transition-colors duration-300 group-hover:text-brand-red">IP67 Waterproofing</h3>
                <p className="text-gray-400 text-sm font-semibold leading-relaxed transition-colors duration-300 group-hover:text-gray-300">
                  Heavy-duty circular and rectangular connectors customized to withstand water splashbacks and waterlogging.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ Accordion Section */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4 lg:px-8 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* Left FAQ Intro */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              <span className="text-brand-red text-xs font-black tracking-[0.25em] uppercase block">
                FAQ
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tight leading-none">
                Your Questions, Answered
              </h2>
              <p className="text-gray-500 font-medium text-base leading-relaxed">
                Have specific engineering questions about electrical capabilities, compliance standards, or harness assemblies? Get answers to our frequently asked questions.
              </p>
              
              <div className="pt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-brand-red font-black uppercase tracking-wider text-sm hover:text-brand-red-hover transition-colors group"
                >
                  Contact our engineering team 
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Accordion List */}
            <div className="lg:col-span-8 space-y-4">
              {faqData.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="border border-gray-100 rounded-3xl overflow-hidden bg-brand-light/40 hover:bg-brand-light/75 transition-colors duration-300"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left px-8 py-6.5 flex justify-between items-center gap-6 focus:outline-none"
                    >
                      <span className="font-black text-brand-dark text-base md:text-lg tracking-tight">
                        {faq.question}
                      </span>
                      <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-brand-red' : ''
                      }`}>
                        <ChevronDown size={18} />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                          <div className="px-8 pb-8 pt-2 text-gray-500 font-semibold text-sm leading-relaxed border-t border-gray-50 bg-white/50">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section - Styled as a floating card with a clean gap before the footer */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-brand-dark text-white rounded-[3.5rem] overflow-hidden py-24 px-8 md:px-16 border border-white/5 shadow-2xl shadow-brand-dark/10"
          >
            {/* Glowing accents inside the card */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-red/5 rounded-full blur-[90px] pointer-events-none" />
            
            <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
              <span className="text-brand-red text-xs font-black tracking-[0.25em] uppercase block">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase">
                Revolutionize The Way You Charge
              </h2>
              <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Need certified wiring harnesses, high-voltage copper busbars, or international charging connections for your EV manufacturing assembly lines?
              </p>
              
              <div className="pt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-4 bg-brand-red hover:bg-brand-red-hover text-white px-12 py-5 rounded-full font-black text-lg uppercase tracking-widest shadow-[0_20px_40px_rgba(210,35,42,0.3)] hover:scale-105 transition-all duration-300 group"
                >
                  Contact Engineering
                  <ArrowRight size={20} className="transform group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutEVPage;
