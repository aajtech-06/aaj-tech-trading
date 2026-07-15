import { AdminUser, DashboardStats, AdminProduct, Enquiry, ActivityLog } from '../types';

export const mockAdminUser: AdminUser = {
  id: 'admin-1',
  name: 'Srishti Gupta',
  email: 'admin@aajtechtrading.com',
  role: 'superadmin',
  avatar: 'https://ui-avatars.com/api/?name=Srishti+Gupta&background=D2232A&color=fff',
};

export const mockStats: DashboardStats = {
  totalProducts: 1245,
  totalEnquiries: 86,
  totalClients: 320,
  pendingRFQs: 12,
  revenueGrowth: '+14.5%',
};

export const mockAdminProducts: AdminProduct[] = [
  { id: 'p1', name: '9-Pin D-Sub Connector', category: 'Connectors', sku: 'ATT-DS-09', stock: 500, status: 'active', lastUpdated: '2024-03-20' },
  { id: 'p2', name: 'Circular M12 Connector', category: 'Connectors', sku: 'ATT-C-M12', stock: 120, status: 'active', lastUpdated: '2024-03-18' },
  { id: 'p3', name: 'Custom Wiring Harness', category: 'Wire Harness', sku: 'ATT-WH-CUS', stock: 45, status: 'draft', lastUpdated: '2024-03-15' },
  { id: 'p4', name: 'Heat Shrink Tube 10mm', category: 'Accessories', sku: 'ATT-HS-10', stock: 2000, status: 'active', lastUpdated: '2024-03-10' },
];

export const mockEnquiries: Enquiry[] = [
  { id: 'e1', clientName: 'Rahul Sharma', company: 'ElectroBuild Pvt Ltd', subject: 'Bulk Quote for D-Sub Connectors', date: '2024-03-21', status: 'new', priority: 'high' },
  { id: 'e2', clientName: 'Jane Doe', company: 'Global Systems', subject: 'Inquiry about M12 Connectors', date: '2024-03-20', status: 'replied', priority: 'medium' },
  { id: 'e3', clientName: 'Amit Patel', company: 'TechNova', subject: 'Custom Wire Harness Specification', date: '2024-03-19', status: 'closed', priority: 'low' },
];

export const mockActivities: ActivityLog[] = [
  { id: 'a1', user: 'Srishti Gupta', action: 'Added new product', target: 'Circular M12 Connector', timestamp: '2 hours ago' },
  { id: 'a2', user: 'Srishti Gupta', action: 'Updated stock', target: '9-Pin D-Sub Connector', timestamp: '4 hours ago' },
  { id: 'a3', user: 'System', action: 'New enquiry received', target: 'from ElectroBuild Pvt Ltd', timestamp: '5 hours ago' },
];
