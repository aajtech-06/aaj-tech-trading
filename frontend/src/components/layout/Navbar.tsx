'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/utils/utils';
import { navItems as initialNavItems } from '@/data/mockData';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navItems, setNavItems] = useState(initialNavItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    try {
      const [prodRes, evRes, harnessRes] = await Promise.all([
        fetch('https://aaj-tech-backend.onrender.com/api/products/').then(r => r.ok ? r.json() : []),
        fetch('https://aaj-tech-backend.onrender.com/api/ev/').then(r => r.ok ? r.json() : []),
        fetch('https://aaj-tech-backend.onrender.com/api/harness/').then(r => r.ok ? r.json() : [])
      ]);

      const lowerQuery = query.toLowerCase();

      const hasHarnessMatch = harnessRes.some((p: { title?: string; applications?: string; details?: string }) =>
        (p.title && p.title.toLowerCase().includes(lowerQuery)) ||
        (p.applications && p.applications.toLowerCase().includes(lowerQuery)) ||
        (p.details && p.details.toLowerCase().includes(lowerQuery))
      );

      const hasEvMatch = evRes.some((p: { title?: string; applications?: string; details?: string }) =>
        (p.title && p.title.toLowerCase().includes(lowerQuery)) ||
        (p.applications && p.applications.toLowerCase().includes(lowerQuery)) ||
        (p.details && p.details.toLowerCase().includes(lowerQuery))
      );

      const hasConnectorMatch = prodRes.some((p: { name?: string; description?: string }) =>
        (p.name && p.name.toLowerCase().includes(lowerQuery)) ||
        (p.description && p.description.toLowerCase().includes(lowerQuery))
      );

      if (hasHarnessMatch && !hasEvMatch && !hasConnectorMatch) {
        router.push(`/wire-harness-products?search=${encodeURIComponent(query)}`);
      } else if (hasEvMatch && !hasHarnessMatch && !hasConnectorMatch) {
        router.push(`/ev-products?search=${encodeURIComponent(query)}`);
      } else {
        router.push(`/products?search=${encodeURIComponent(query)}`);
      }
    } catch (error) {
      console.error('Search routing failed:', error);
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }

    setIsOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://aaj-tech-backend.onrender.com/api/categories/');
        if (!res.ok) throw new Error('Failed to fetch');
        const categories = await res.json();

        if (isMounted) {
          const categoryItems = categories.map((cat: { id: string; name: string }) => ({
            title: cat.name,
            href: `/products?category=${cat.id}`,
          }));

          setNavItems((prevItems) =>
            prevItems.map((item) => {
              if (item.title === 'Connectors') {
                return {
                  ...item,
                  items: categoryItems.length > 0 ? categoryItems : item.items,
                };
              }
              return item;
            })
          );
        }
      } catch (error) {
        console.error('Failed to fetch categories for navbar:', error);
      }
    };

    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] py-2'
          : 'bg-white py-4 shadow-sm'
      )}
    >
      <div className="px-4 md:px-12 lg:px-24 xl:px-32 flex justify-between items-center w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="block group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="AAJ Tech Trading Logo"
              className="h-14 sm:h-16 md:h-28 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group"
            >
              <Link
                href={item.href}
                className={cn(
                  "text-sm font-black transition-all hover:text-brand-red py-2 flex items-center gap-1.5 tracking-wider uppercase",
                  pathname === item.href ? "text-brand-red" : "text-gray-600"
                )}
              >
                {item.title}
                {item.items && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
              </Link>

              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-brand-red rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />

              {item.items && (
                item.title === 'Connectors' ? (
                  <div className="absolute top-full left-0 pt-4 w-[720px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 -translate-y-4 group-hover:translate-y-0 z-50 pointer-events-none group-hover:pointer-events-auto">
                    <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl p-6 backdrop-blur-xl">
                      <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="block px-4 py-2.5 text-[11px] text-gray-600 hover:text-brand-red hover:bg-red-50/30 rounded-xl transition-all duration-200 font-bold uppercase tracking-wide leading-relaxed"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-full left-0 pt-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 -translate-y-4 group-hover:translate-y-0 z-50 pointer-events-none group-hover:pointer-events-auto">
                    <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden backdrop-blur-xl p-3">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="block px-6 py-4 text-xs text-gray-700 hover:bg-brand-red hover:text-white rounded-2xl transition-all duration-300 font-black uppercase tracking-widest"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA & Search */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex items-center gap-6"
        >
          {/* Search Box */}
          <form onSubmit={handleSearch} className="relative group/search">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red/50 transition-all w-48 lg:w-64"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-red transition-colors">
              <Search size={18} />
            </button>
          </form>

          <Link
            href="/login"
            className="group relative bg-brand-red hover:bg-brand-red-hover text-white px-10 py-4 rounded-full text-sm font-black transition-all shadow-[0_15px_30px_-5px_rgba(210,35,42,0.4)] active:scale-95 uppercase tracking-widest overflow-hidden"
          >
            <span className="relative z-10">Sign In</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Link>
        </motion.div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-3 text-brand-dark bg-brand-light rounded-2xl active:scale-90 transition-transform"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[100] flex flex-col h-screen overflow-hidden lg:hidden"
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white shrink-0">
              <Link href="/" onClick={() => setIsOpen(false)} className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="AAJ Tech Trading Logo"
                  className="h-14 w-auto object-contain"
                />
              </Link>
              <button
                className="p-3 text-brand-dark bg-brand-light rounded-2xl active:scale-90 transition-transform"
                onClick={() => setIsOpen(false)}
              >
                <X size={28} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
              {/* Mobile Search */}
              <div>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all"
                  />
                  <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-red transition-colors">
                    <Search size={20} />
                  </button>
                </form>
              </div>

              {/* Navigation Items */}
              <div className="flex flex-col gap-1">
                {navItems.map((item, index) => {
                  const hasItems = !!item.items && item.items.length > 0;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-50 py-1"
                    >
                      {hasItems ? (
                        <div>
                          <button
                            onClick={() => toggleExpand(item.title)}
                            className={cn(
                              "text-lg font-bold flex justify-between items-center w-full py-2 uppercase tracking-wide text-left cursor-pointer",
                              pathname.startsWith(item.href) && item.href !== '/' ? "text-brand-red" : "text-brand-dark"
                            )}
                          >
                            <span>{item.title}</span>
                            <ChevronDown
                              size={18}
                              className={cn(
                                "transition-transform duration-300 text-gray-500",
                                expandedItems[item.title] ? "rotate-180" : ""
                              )}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {expandedItems[item.title] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden pl-4 flex flex-col gap-1.5 border-l-2 border-brand-red/20 my-1 bg-brand-light/50 rounded-r-xl py-1"
                              >
                                {item.href && (
                                  <Link
                                    href={item.href}
                                    className="text-sm font-bold text-gray-500 hover:text-brand-red transition-colors uppercase tracking-wider py-1"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    All {item.title}
                                  </Link>
                                )}
                                {item.items!.map((subItem) => (
                                  <Link
                                    key={subItem.title}
                                    href={subItem.href}
                                    className="text-sm font-bold text-gray-500 hover:text-brand-red transition-colors uppercase tracking-wider py-1"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {subItem.title}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "text-lg font-bold block py-2 uppercase tracking-wide",
                            pathname === item.href ? "text-brand-red" : "text-brand-dark"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Sign In CTA */}
              <div className="mt-auto pt-6 shrink-0">
                <Link
                  href="/login"
                  className="bg-brand-red hover:bg-brand-red-hover text-white text-center py-4 rounded-full font-black text-base shadow-xl shadow-brand-red/25 block uppercase tracking-widest transition-all active:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
