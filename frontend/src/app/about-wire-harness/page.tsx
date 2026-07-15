'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Activity, Settings2, Factory, ShieldCheck, Headset, Clock, CheckCircle2 } from 'lucide-react';

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

const AboutWireHarnessPage = () => {
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
            src="/wire_harness_collage_v2.png"
            alt="Wire Harness Background"
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
              <h1 className="text-5xl md:text-[6rem] lg:text-[8rem] font-black text-white leading-none tracking-tighter mb-8 mix-blend-difference">
                ABOUT <span className="text-transparent stroke-white stroke-2" style={{ WebkitTextStroke: "2px white" }}>WIRE HARNESS</span>
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
              <span className="text-white border-b-2 border-brand-red pb-1">About Wire Harness</span>
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

      {/* Who We Are Section */}
      <section className="relative py-24 bg-gray-50 z-20 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Video Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-7/12 flex justify-center"
            >
              <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.2)] bg-black border-4 border-white mx-auto">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/IfsR6q2vL_s?autoplay=0&mute=1&loop=1&playlist=IfsR6q2vL_s"
                  title="Inside Our Wire Harness Manufacturing Facility"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-5/12 lg:pl-12"
            >
              <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-8 tracking-tight">
                Who We Are
              </h2>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-medium">
                <p>
                  At <span className="text-brand-red font-black">Aaj Tech Trading Corporation</span>, we specialize in the design and manufacturing of custom wire harnesses and assemblies, helping OEMs, retailers, and traders across India bring their products to market faster.
                </p>
                <p>
                  Whether you&apos;re in the early concept phase or scaling production, we offer end-to-end engineering and manufacturing support, ensuring every harness meets both application-specific needs and international standards. We work closely with you to develop and execute in-process and functional testing, tailored to your product and the destination market&apos;s compliance requirements.
                </p>
                <p>
                  Backed by a state-of-the-art manufacturing setup, we deliver both high-mix and flexible volume production with ease. With a skilled team, advanced machinery, and distribution hubs strategically located across India, we ensure reliable fulfilment and responsive support.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-24 bg-white z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center gap-6 mb-16">
            <div className="h-[2px] w-12 md:w-24 bg-brand-dark" />
            <h2 className="text-4xl md:text-5xl font-black text-brand-red tracking-wide">Cable Harness</h2>
            <div className="h-[2px] w-12 md:w-24 bg-brand-dark" />
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div {...fadeInUp} className="w-full lg:w-1/2 space-y-6 text-gray-700 text-lg leading-relaxed font-medium">
              <p>
                <strong className="text-brand-dark font-black">Wire Harness-</strong> Aaj Tech Trading Corporation has extensive expertise producing cable and wire assemblies based on the unique needs of the customers. We manufacture custom cable harnesses as well as cable harnesses for the commercial, military, and aerospace applications, ranging from straightforward point-to-point to intricate multiple branch harnesses.
              </p>

              <p>
                By creating specialised and/or repeated harnesses for systems, we can assist in shortening the schedule of your project. Our engineering staff can help you create the most effective harness to fit your needs since they are skilled in harness design and fabrication.
              </p>

              <div className="pl-6 py-2 border-l-4 border-brand-red/20 my-6 bg-brand-light/30 rounded-r-xl">
                <ul className="space-y-3 font-bold text-brand-dark">
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-red"></div> Wire to Board & Wire to Wire Connectors Cable Assembly</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-red"></div> Flat Cable Assemblies</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-red"></div> RF Cable Assemblies</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-red"></div> D Sub Cable Assemblies</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-red"></div> Metal Round Connector Cable Assemblies</li>
                </ul>
              </div>

              <p>
                Manufacturing Unit has Team of 35 Personals Which inclused Both Skilled Technical Team and Specially Trained Unskilled Labours to manufacture defect free Material.
              </p>

              <p>
                All the Cables made at Aaj Tech Trading Corporation are Totally QC passed & properly check to avoid any issue at Fieldwork at the End Product.
              </p>

              <p>
                Being a Small Manufacturer, We have the Potential to become big in upcoming years. Our Clents are mainly OEMs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2"
            >
              <div className="relative aspect-[4/5] md:aspect-square w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] group">
                <Image
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop"
                  alt="Custom Wire Harness Manufacturing"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-xl font-black text-brand-dark mb-2">Precision Engineered</h3>
                  <p className="text-sm font-medium text-gray-600">High-quality custom cable and wire assemblies for diverse industrial applications.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Aaj Tech Advantage Section */}
      <section className="relative py-24 bg-white z-20 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark text-center mb-16 tracking-tight">
              Aaj Tech Advantage
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 border-y border-gray-100">
              {[
                {
                  title: "Customization at Every Step",
                  desc: "Built to your exact specs, connector requirements, and application from design to delivery.",
                  icon: Settings2
                },
                {
                  title: "Manufacturing Excellence",
                  desc: "Our harnesses are built to exacting standards, ensuring zero defect output and long-term durability in any environment.",
                  icon: Factory
                },
                {
                  title: "Fully Tested. Fully Trusted.",
                  desc: "100% of our harnesses go through continuity and visual inspections, so what arrives at your site is field-ready.",
                  icon: ShieldCheck
                },
                {
                  title: "End-to-End Support",
                  desc: "From sample development to ramp-up and scale, we stay involved through every stage of your harness journey.",
                  icon: Headset
                },
                {
                  title: "Quick Turnarounds",
                  desc: "We understand that every harness is linked to deadlines. That's why we commit to rapid production timelines, without cutting corners.",
                  icon: Clock
                },
                {
                  title: "Robust Quality Management",
                  desc: "Accredited to global standards including ISO 9001:2015, our QMS ensures quality and compliance across sectors.",
                  icon: CheckCircle2
                }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-8 bg-white hover:bg-brand-light/30 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-brand-red mb-6">
                    <item.icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-black text-brand-dark mb-4 tracking-wide">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 bg-white z-20 mb-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark text-center mb-12 tracking-tight">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Share Your Requirements",
                "Sample Development",
                "Rigorous Testing",
                "Scaled Production",
                "Final QC Check",
                "On-Time Delivery"
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-brand-red text-white py-4 px-6 rounded-full text-center shadow-lg hover:shadow-brand-red/40 transition-all font-black text-sm uppercase tracking-wider cursor-default"
                >
                  {step}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutWireHarnessPage;
