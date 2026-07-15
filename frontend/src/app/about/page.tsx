'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Users, 
  Target, 
  ShieldCheck, 
  ChevronRight,
  Phone,
  Mail,
  Settings,
  Globe,
  Activity,
  Box
} from 'lucide-react';

const Hexagon = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.15, scale: 1 }}
    transition={{ delay, duration: 2, repeat: Infinity, repeatType: "reverse" }}
    className={`absolute ${className}`}
    style={{
      clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      background: "linear-gradient(135deg, #d2232a 0%, #8b1317 100%)",
      width: "150px",
      height: "170px",
    }}
  />
);

const AboutPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 0.2], [1, 1.1]), { stiffness: 100, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as any }
  };



  return (
    <div ref={containerRef} className="bg-white selection:bg-brand-red/20 overflow-x-hidden">
      {/* Immersive Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0 z-0">
          <Image
            src="/about_hero.png"
            alt="Premium Industrial Background"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-transparent to-white" />
        </motion.div>

        {/* Floating Hexagons */}
        <Hexagon className="top-20 left-[10%]" delay={0} />
        <Hexagon className="bottom-40 left-[15%] hidden lg:block" delay={0.5} />
        <Hexagon className="top-40 right-[10%]" delay={1} />
        <Hexagon className="bottom-20 right-[20%] hidden lg:block" delay={1.5} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black tracking-[0.3em] uppercase mb-12 shadow-2xl"
            >
              <Activity size={14} className="text-brand-red animate-pulse" />
              Excellence Since 2006
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as any }}
              className="relative"
            >
              <h1 className="text-7xl md:text-[10rem] font-black text-white leading-none tracking-tighter mb-8 mix-blend-difference">
                ABOUT <span className="text-transparent stroke-white stroke-2" style={{ WebkitTextStroke: "2px white" }}>US</span>
              </h1>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-red/20 blur-3xl rounded-full animate-pulse" />
            </motion.div>

            <motion.nav 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase text-gray-300"
            >
              <Link href="/" className="hover:text-brand-red transition-all duration-300 hover:tracking-[0.4em]">Home</Link>
              <span className="text-brand-red text-xl">{'//'}</span>
              <span className="text-white border-b-2 border-brand-red pb-1">About Us</span>
            </motion.nav>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-white/0 via-white/50 to-white" />
          <span className="text-[10px] text-white font-black uppercase tracking-[0.5em]">Scroll</span>
        </motion.div>
      </section>

      {/* Welcome Section - Glassmorphism */}
      <section className="relative py-32 container mx-auto px-4 -mt-20 z-20">
        <div className="bg-white/80 backdrop-blur-3xl rounded-[4rem] border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] p-12 md:p-24 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeInUp}>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[2px] w-12 bg-brand-red" />
                <span className="text-brand-red font-black tracking-[0.4em] uppercase text-xs">
                  The AJT Advantage
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-brand-dark mb-10 leading-[0.9] tracking-tighter">
                Bridging the Gap in <span className="text-brand-red">Technology</span>
              </h2>
              <div className="space-y-8 text-gray-500 text-lg leading-relaxed font-medium">
                <p>
                  A quality-focused business, <span className="text-brand-dark font-black">Aaj Tech Trading Corporation</span> has built a remarkable reputation for providing electronic components & Cables in competitive marketplaces since 2006.
                </p>
                <p className="bg-brand-light/50 p-8 rounded-3xl border-l-8 border-brand-red italic text-brand-dark/80 shadow-inner">
                  &quot;Our selection is of the highest calibre and complies with all relevant national and international quality norms like UL CE RoHS.&quot;
                </p>
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="group">
                    <div className="text-5xl font-black text-brand-dark mb-2 group-hover:text-brand-red transition-colors">18+</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Years Industry Expertise</div>
                  </div>
                  <div className="group">
                    <div className="text-5xl font-black text-brand-dark mb-2 group-hover:text-brand-red transition-colors">5000+</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Successful Shipments</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
                  alt="Tech Innovation"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-brand-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              {/* Floating Contact Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -bottom-10 -left-10 bg-brand-dark p-8 rounded-[2.5rem] shadow-2xl text-white max-w-xs"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center">
                      <Phone size={18} />
                    </div>
                    <a href="tel:+919910009227" className="text-sm font-black hover:text-brand-red hover:underline transition-colors">+91-9910009227</a>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Mail size={18} />
                    </div>
                    <a href="mailto:info@aajtechtrading.com" className="text-sm font-black hover:text-brand-red hover:underline transition-colors">info@aajtechtrading.com</a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertise - Modern Cards */}
      <section className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#d2232a 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-brand-dark tracking-tighter uppercase mb-6">Expertise <span className="text-brand-red">&</span> Domains</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Innovation in every connection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Distributor Excellence",
                subtitle: "Authorized Stockiest for All UL & CE Brands",
                icon: Globe,
                content: "Leading distributor of connectors used in inverters, CCTV, EPABX, Weighing Scales, and all kinds of PCBs. We import from Taiwan & China's best brands.",
                tags: ["YOUNGYAK", "NELTRON", "ZB CHINA", "XINYA"],
                gradient: "from-brand-dark to-[#1a1a1a]"
              },
              {
                title: "Precision Manufacturing",
                subtitle: "Custom Engineered Cable Solutions",
                icon: Settings,
                content: "We manufacture high-grade wiring harnesses for RO Scales, E-Rickshaws, Lifts, and Automobile industries with 100% testing standards.",
                tags: ["RO Scales", "E-Rickshaw", "Lifts", "EV Lifts"],
                gradient: "from-brand-red to-[#a51b21]"
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`group relative p-12 rounded-[3.5rem] bg-gradient-to-br ${card.gradient} text-white shadow-2xl overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                    <card.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">{card.title}</h3>
                  <p className="text-white/60 font-bold text-xs uppercase tracking-widest mb-8">{card.subtitle}</p>
                  <p className="text-white/80 text-lg mb-10 leading-relaxed font-medium">{card.content}</p>
                  
                  <div className="flex flex-wrap gap-3">
                    {card.tags.map(tag => (
                      <span key={tag} className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 group-hover:bg-brand-red transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values & Mission - Sleek Dark Design */}
      <section className="py-32 bg-brand-dark relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-white/10 rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl">
            {[
              {
                title: "Customer Satisfaction",
                icon: Users,
                desc: "We never skimp on authenticity, quality, or workmanship because these factors result in long-term business partnerships."
              },
              {
                title: "Core Values",
                icon: ShieldCheck,
                desc: "Highest calibre selection that complies with national and international quality norms. Complete quality assurance."
              },
              {
                title: "Our Mission",
                icon: Target,
                desc: "Devoted to growing our business in a regulated and profitable way while exceeding customer expectations daily."
              }
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-brand-dark p-16 hover:bg-brand-red transition-all duration-500 group"
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-red group-hover:bg-white group-hover:text-brand-red mb-10 transition-colors">
                  <pillar.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">{pillar.title}</h3>
                <p className="text-gray-400 group-hover:text-white/80 leading-relaxed font-medium transition-colors">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consumer Benefits - Minimalist Premium */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <motion.div {...fadeInUp} className="flex-1">
              <h2 className="text-6xl font-black text-brand-dark mb-16 tracking-tighter leading-none">
                TO BENEFIT OUR <br />
                <span className="text-brand-red">CONSUMERS BY</span> PROVIDING
              </h2>
              <div className="space-y-6">
                {[
                  "Inventive concepts and remedies",
                  "Superior goods and services",
                  "A first-time task well done",
                  "Dependability of goods and services",
                  "Aspire to outperform expectations",
                  "Commitment to ongoing progress",
                  "An organisation-wide commitment"
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-6 group cursor-default"
                  >
                    <div className="text-brand-red font-black text-xl group-hover:translate-x-2 transition-transform">0{idx + 1}</div>
                    <div className="h-[1px] w-8 bg-gray-200 group-hover:w-16 group-hover:bg-brand-red transition-all" />
                    <span className="text-sm font-black text-brand-dark uppercase tracking-[0.2em] group-hover:text-brand-red transition-colors">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 relative w-full"
            >
              <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.2)]">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
                  alt="Industrial Tech"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-red to-transparent opacity-60" />
                <div className="absolute bottom-16 left-16">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-brand-red shadow-2xl mb-6">
                    <Box size={32} />
                  </div>
                  <div className="text-white text-5xl font-black uppercase tracking-tighter leading-none">
                    PREMIUM <br /> STANDARDS
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Immersive CTA */}
      <section className="py-24 bg-brand-red relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div {...fadeInUp}>
            <h2 className="text-5xl md:text-8xl font-black text-white mb-12 tracking-tighter">LET&apos;S BUILD THE <br /> FUTURE TOGETHER</h2>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-4 bg-brand-dark text-white px-16 py-7 rounded-full font-black text-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-110 hover:-translate-y-2 transition-all duration-300 uppercase tracking-widest active:scale-95"
            >
              Start Collaboration <ChevronRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
