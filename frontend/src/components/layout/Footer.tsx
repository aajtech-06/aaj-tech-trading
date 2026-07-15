'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white pt-16 md:pt-24 pb-12 overflow-hidden">
      <div className="px-4 md:px-12 lg:px-24 xl:px-32 max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20">
          {/* Brand & Description Column */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="block group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="AAJ Tech Trading Logo" 
                className="h-20 sm:h-32 md:h-40 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-lg font-medium italic">
              &quot;Aaj Tech Trading Corporation introduce ourselves as one of the Leading Trader, Importer and Distributors of all type of Connectors for Connectivity and Power Systems in Applications of Power, Data and Signal.&quot;
            </p>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-red/20 transition-colors">
                  <MapPin size={18} className="text-brand-red" />
                </div>
                <a
                  href="https://maps.google.com/maps?q=AAJ%20TECH%20TRADING%20CORPORATION,%20Ground%20Floor,%20Y-39,%20near%20Harkesh%20Nagar%20metro%20station,%20phase-II,%20Sanjay%20Colony,%20Okhla%20Phase%20II,%20Okhla%20Industrial%20Area,%20New%20Delhi,%20Delhi%20110020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-brand-red hover:underline font-bold leading-snug transition-colors"
                >
                  AAJ TECH TRADING CORPORATION, Ground Floor, Y-39,
                  near Harkesh Nagar metro station, phase-II, Sanjay Colony,
                  Okhla Phase II, Okhla Industrial Area, New Delhi, Delhi 110020
                </a>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-red/20 transition-colors">
                  <Phone size={18} className="text-brand-red" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 font-black flex items-center gap-1.5 flex-wrap">
                    <a href="tel:+919910009227" className="hover:text-brand-red hover:underline transition-colors">+91-9910009227</a>
                    <span>,</span>
                    <a href="tel:+919971002657" className="hover:text-brand-red hover:underline transition-colors">+91-9971002657</a>
                  </p>
                  <p className="text-sm text-gray-400 font-black flex items-center gap-1.5 flex-wrap">
                    <a href="tel:+911146575560" className="hover:text-brand-red hover:underline transition-colors">011-46575560</a>
                    <span>,</span>
                    <a href="tel:+911140534531" className="hover:text-brand-red hover:underline transition-colors">40534531</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-red/20 transition-colors">
                  <Mail size={18} className="text-brand-red" />
                </div>
                <div className="space-y-1">
                  <a href="mailto:info@aajtechtrading.com" className="text-sm text-gray-400 hover:text-brand-red font-black block hover:underline transition-colors">info@aajtechtrading.com</a>
                  <a href="mailto:accountattc@hotmail.com" className="text-sm text-gray-400 hover:text-brand-red font-black block hover:underline transition-colors">accountattc@hotmail.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40 border-l-2 border-brand-red pl-4">Quick Links</h4>
            <ul className="space-y-5">
              {[
                { title: 'Home', href: '/' },
                { title: 'Connectors', href: '/products' },
                { title: 'Wire Harness', href: '/about-wire-harness' },
                { title: 'About Us', href: '/about' },
                { title: 'Catalog', href: '/catalog' },
                { title: 'Blog', href: '/blog' },
                { title: 'Contact Us', href: '/contact' }
              ].map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="text-sm font-black text-gray-400 hover:text-white transition-all flex items-center gap-3 group">
                    <ArrowRight size={14} className="text-brand-red -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Column */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40 border-l-2 border-brand-red pl-4">Social Connect</h4>
            <div className="flex flex-wrap gap-4">
              {[
                { 
                  name: 'Facebook', 
                  url: 'https://www.facebook.com/aajtechtradingcorp', 
                  icon: (props: React.SVGProps<SVGSVGElement>) => (
                    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )
                },
                { 
                  name: 'LinkedIn', 
                  url: 'https://www.linkedin.com/', 
                  icon: (props: React.SVGProps<SVGSVGElement>) => (
                    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )
                },
                { 
                  name: 'Twitter', 
                  url: 'https://x.com/AajTech12653/', 
                  icon: (props: React.SVGProps<SVGSVGElement>) => (
                    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                    </svg>
                  )
                },
                { 
                  name: 'Youtube', 
                  url: 'https://www.youtube.com/@Aajtechchannel/', 
                  icon: (props: React.SVGProps<SVGSVGElement>) => (
                    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  )
                },
                { 
                  name: 'Instagram', 
                  url: 'https://www.instagram.com/aajtechtrading/', 
                  icon: (props: React.SVGProps<SVGSVGElement>) => (
                    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  )
                }
              ].map((social) => (
                <Link
                  key={social.name}
                  href={social.url.startsWith('http') ? social.url : `https://${social.url}`}
                  target="_blank"
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all group"
                  title={social.name}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between gap-8 items-center">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} AAJ TECH TRADING CORPORATION
            </p>
            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-[0.2em]">
              Leading Importer & Distributor of Industrial Interconnect Solutions
            </p>
          </div>

          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((item) => (
              <Link key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
