'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Layers,
  MessageSquare,
  ShoppingCart,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '../hooks/useAdminAuth';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: Layers, label: 'Harness Products', href: '/admin/harness' },
  { icon: Layers, label: 'EV Products', href: '/admin/ev' },
  { icon: Layers, label: 'Categories', href: '/admin/categories' },
  { icon: ShoppingCart, label: 'Order Inquiries', href: '/admin/orders' },
  { icon: MessageSquare, label: 'General Enquiries', href: '/admin/enquiries' },
  { icon: FileText, label: 'Blogs', href: '/admin/blogs' },
  { icon: Briefcase, label: 'Career', href: '/admin/career' },
  { icon: Users, label: 'Clients', href: '/admin/clients' },
  {
    icon: Settings,
    label: 'Settings',
    href: '#',
    children: [
      { label: 'Upload Catalog', href: '/admin/settings/upload-catalog' },
      { label: 'Upload EV Catalog', href: '/admin/settings/upload-ev-catalog' },
      { label: 'Manage Login', href: '/admin/settings/manage-login' },
    ]
  },
];

interface MenuItemType {
  icon: React.ElementType;
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const MenuItem = ({ item, isSidebarOpen, pathname, onItemClick }: { item: MenuItemType, isSidebarOpen: boolean, pathname: string, onItemClick?: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = pathname === item.href || item.children?.some((c: { href: string }) => pathname === c.href);
  const hasChildren = !!item.children;

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group w-full ${isActive
            ? 'bg-brand-red text-white'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
        >
          <item.icon size={22} className="flex-shrink-0" />
          <span className={`font-bold transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'
            }`}>
            {item.label}
          </span>
          {isSidebarOpen && (
            <ChevronRight size={16} className={`ml-auto transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          )}
        </button>
        <AnimatePresence>
          {isExpanded && isSidebarOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pl-12 space-y-1 overflow-hidden"
            >
              {item.children?.map((child: { label: string; href: string }) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onItemClick}
                  className={`block py-2 text-sm font-bold transition-colors ${pathname === child.href ? 'text-brand-red' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onItemClick}
      className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${isActive
        ? 'bg-brand-red text-white'
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
    >
      <item.icon size={22} className="flex-shrink-0" />
      <span className={`font-bold transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'
        }`}>
        {item.label}
      </span>
      {isActive && isSidebarOpen && (
        <motion.div
          layoutId="active-pill"
          className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
        />
      )}
    </Link>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAdminAuth();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchNotifications = async () => {
      try {
        const [enqRes, appRes] = await Promise.all([
          fetch('https://aajtechtrading.in/api/enquiries/').then(r => r.ok ? r.json() : []),
          fetch('https://aajtechtrading.in/api/career/applications').then(r => r.ok ? r.json() : [])
        ]);

        if (!isMounted) return;

        // Process General Enquiries (Filter by status "New")
        const newEnquiries = enqRes
          .filter((e: any) => e.status === 'New')
          .map((e: any) => ({
            id: e.id,
            title: 'New Enquiry',
            message: `From ${e.fullName} (${e.inquiryType})`,
            type: 'enquiry',
            timestamp: e.createdAt,
            href: '/admin/enquiries',
            rawDate: new Date(e.createdAt || Date.now())
          }));

        // Process Career Applications (Filter by status "Applied")
        const newApplications = appRes
          .filter((a: any) => a.status === 'Applied')
          .map((a: any) => ({
            id: a.id,
            title: 'New Career Application',
            message: `${a.name} applied for ${a.position}`,
            type: 'career',
            timestamp: a.createdAt,
            href: '/admin/career',
            rawDate: new Date(a.createdAt || Date.now())
          }));

        // Combine and sort by date descending
        const combined = [...newEnquiries, ...newApplications].sort(
          (a, b) => b.rawDate.getTime() - a.rawDate.getTime()
        );

        // Synchronize with local storage read notification IDs
        const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
        const withReadStatus = combined.map(item => ({
          ...item,
          read: readIds.includes(item.id)
        }));

        setNotifications(withReadStatus);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // refresh every 15s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const markAsRead = (id: string) => {
    const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem('read_notifications', JSON.stringify(readIds));
    }
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
    notifications.forEach(n => {
      if (!readIds.includes(n.id)) {
        readIds.push(n.id);
      }
    });
    localStorage.setItem('read_notifications', JSON.stringify(readIds));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-brand-dark text-white transition-all duration-300 ease-in-out border-r border-white/5 ${isSidebarOpen ? 'w-72' : 'w-20'
          }`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/admin" className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 bg-brand-red rounded-lg flex-shrink-0" />
            <span className={`font-black text-xl tracking-tighter whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
              }`}>
              AAJ TECH <span className="text-brand-red">ADMIN</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <MenuItem key={item.label} item={item} isSidebarOpen={isSidebarOpen} pathname={pathname} />
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-brand-red transition-all w-full group ${!isSidebarOpen && 'justify-center'
              }`}
          >
            <LogOut size={22} className="flex-shrink-0" />
            <span className={`font-bold transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
              }`}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-2 hover:bg-gray-50 rounded-xl text-gray-400"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-xl text-gray-400"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-gray-400 font-bold">Admin</span>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-brand-dark font-black capitalize">
                {pathname.split('/').pop() || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-red w-64 transition-all outline-none"
              />
            </div>

            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative p-2 rounded-xl transition-all cursor-pointer ${isNotificationOpen ? 'bg-brand-red/10 text-brand-red' : 'text-gray-400 hover:text-brand-red'
                  }`}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-red text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationOpen && (
                  <>
                    {/* Background invisible click-away sheet */}
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setIsNotificationOpen(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-80 bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 overflow-hidden"
                    >
                      <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                        <div>
                          <h3 className="font-black text-brand-dark text-base">Notifications</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {unreadCount} unread updates
                          </p>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-black text-brand-red hover:text-brand-red-hover hover:underline cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="py-10 px-5 text-center text-gray-400">
                            <Bell size={28} className="mx-auto mb-3 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <Link
                              key={n.id}
                              href={n.href}
                              onClick={() => {
                                markAsRead(n.id);
                                setIsNotificationOpen(false);
                              }}
                              className={`flex gap-3 p-4 hover:bg-gray-50/80 transition-colors text-left w-full items-start group ${!n.read ? 'bg-brand-red/5' : ''
                                }`}
                            >
                              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${n.type === 'career' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-brand-red'
                                }`}>
                                {n.type === 'career' ? <Briefcase size={16} /> : <MessageSquare size={16} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs font-black text-brand-dark truncate group-hover:text-brand-red transition-colors">
                                    {n.title}
                                  </p>
                                  {!n.read && (
                                    <span className="w-1.5 h-1.5 bg-brand-red rounded-full shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-gray-500 font-medium leading-normal mt-0.5 line-clamp-2">
                                  {n.message}
                                </p>
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mt-1">
                                  {new Date(n.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-brand-dark uppercase tracking-wider">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.role || 'Super Admin'}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user?.avatar || "https://ui-avatars.com/api/?name=Admin"} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm z-[90] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-brand-dark z-[100] lg:hidden flex flex-col"
            >
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-red rounded-lg" />
                  <span className="font-black text-xl text-white tracking-tighter">AAJ TECH ADMIN</span>
                </div>
                <button onClick={() => setIsMobileOpen(false)} className="text-gray-400">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-2">
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    item={item}
                    isSidebarOpen={true}
                    pathname={pathname}
                    onItemClick={() => !item.children && setIsMobileOpen(false)}
                  />
                ))}
              </nav>
              <div className="p-6 border-t border-white/5">
                <button onClick={logout} className="flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-brand-red transition-all w-full">
                  <LogOut size={22} />
                  <span className="font-bold">Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
