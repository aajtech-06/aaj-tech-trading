export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'manager';
  avatar?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalEnquiries: number;
  totalClients: number;
  pendingRFQs: number;
  revenueGrowth: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  lastUpdated: string;
}

export interface Enquiry {
  id: string;
  clientName: string;
  company: string;
  subject: string;
  date: string;
  status: 'new' | 'replied' | 'converted' | 'closed';
  priority: 'low' | 'medium' | 'high';
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}
