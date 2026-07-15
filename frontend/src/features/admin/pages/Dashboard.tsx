'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  MessageSquare,
  Users,
  TrendingUp,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface DashboardData {
  stats: {
    totalProducts: number;
    totalEnquiries: number;
    totalClients: number;
    totalCategories: number;
  };
  recentEnquiries: Array<{
    id: string;
    clientName: string;
    company?: string;
    subject: string;
    status: string;
    date: string;
  }>;
  recentActivities: Array<{
    id: string;
    user: string;
    action: string;
    target: string;
    timestamp: string;
  }>;
}

export default function Dashboard() {
  const { user } = useAdminAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('https://aaj-tech-backend.onrender.com/api/dashboard/');
        if (res.ok) {
          const dashboardData = await res.json();
          setData(dashboardData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statsConfig = data ? [
    { label: 'Total Products', value: data.stats.totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'LIVE' },
    { label: 'Total Enquiries', value: data.stats.totalEnquiries, icon: MessageSquare, color: 'text-brand-red', bg: 'bg-brand-red/5', trend: 'LIVE' },
    { label: 'Total Clients', value: data.stats.totalClients, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'LIVE' },
    { label: 'Total Categories', value: data.stats.totalCategories, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', trend: 'LIVE' },
  ] : [];

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-brand-red animate-spin mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-brand-dark mb-2">Welcome back, {user?.name ? user.name.split(' ')[0] : 'Admin'}!</h1>
        <p className="text-gray-400 font-bold">Here is what&apos;s happening with Aaj Tech Trading today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsConfig.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                <ArrowUpRight size={10} className="text-green-500" />
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-3xl font-black text-brand-dark">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Enquiries */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-brand-dark">Recent Enquiries</h2>
            <button className="text-sm font-black text-brand-red uppercase tracking-widest hover:opacity-70">View All</button>
          </div>
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Client</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Subject</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center">
                      <p className="text-gray-400 font-bold">No recent enquiries</p>
                    </td>
                  </tr>
                ) : (
                  data.recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-black text-brand-dark">{enq.clientName}</p>
                          <p className="text-xs font-bold text-gray-400">{enq.company || 'Individual'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-gray-600 line-clamp-1">{enq.subject}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${enq.status === 'new' ? 'bg-brand-red' :
                            enq.status === 'in progress' ? 'bg-orange-400' : 'bg-green-400'
                            }`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${enq.status === 'new' ? 'bg-red-50 text-brand-red' : 'bg-green-50 text-green-600'
                            }`}>
                            {enq.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-gray-400">{enq.date}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-brand-dark">Activity Log</h2>
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 space-y-6">
            {data.recentActivities.map((activity, idx) => (
              <div key={activity.id} className="flex gap-4 relative group">
                {idx !== data.recentActivities.length - 1 && (
                  <div className="absolute left-2.5 top-8 bottom-0 w-0.5 bg-gray-100" />
                )}
                <div className={`w-5 h-5 rounded-full border-2 border-white shadow-sm mt-1 shrink-0 ${activity.user === 'System' ? 'bg-blue-500' : 'bg-brand-red'
                  }`} />
                <div>
                  <p className="text-sm font-bold text-brand-dark">
                    {activity.user} <span className="text-gray-400 font-medium">{activity.action}</span> {activity.target}
                  </p>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1 flex items-center gap-1">
                    <Clock size={10} />
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
