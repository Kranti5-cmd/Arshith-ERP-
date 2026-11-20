import fs from 'fs';
import path from 'path';

// Load store data if present
let storeData = {
  categories: [],
  products: [],
  suppliers: [],
  warehouses: [],
  orders: [],
  purchases: [],
  users: [],
  batches: [],
};

try {
  const jsonPath = path.join(process.cwd(), 'api', 'data.json');
  if (fs.existsSync(jsonPath)) {
    storeData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }
} catch (e) {
  console.warn('Fallback store load failed:', e.message);
}

const DEFAULT_CENTRAL_ANALYTICS = {
  consolidated: {
    totalRevenue: 52469,
    activeEntities: 3,
    totalTransactions: 3,
    totalUsers: 261,
    activeConnectors: 2,
    totalConnectors: 3,
    totalSyncedRecords: 321,
  },
  companies: {
    arshithfresh: {
      connectionStatus: 'CONNECTED',
      metrics: {
        totalRevenue: 2469,
        totalOrders: 3,
        totalProducts: 31,
        inStockProducts: 2015,
        totalCustomers: 1,
      },
      lastSyncAt: new Date().toISOString(),
      lastSyncStatus: 'COMPLETED',
    },
    codelekho: {
      connectionStatus: 'CONNECTED',
      metrics: {
        totalRevenue: 50000,
        totalStudents: 260,
        totalCourses: 4,
        totalCertificates: 260,
      },
      lastSyncAt: new Date().toISOString(),
      lastSyncStatus: 'COMPLETED',
    },
    arshith_infotech: {
      connectionStatus: 'PENDING',
      metrics: {
        totalRevenue: 0,
        totalProjects: 12,
        activeProjects: 8,
        totalClients: 6,
      },
      lastSyncAt: null,
      lastSyncStatus: null,
    },
  },
  monthlyTrends: [
    { month: 'Jun', fresh: 1200, codelekho: 24000, infotech: 0, total: 25200 },
    { month: 'Jul', fresh: 1500, codelekho: 31000, infotech: 0, total: 32500 },
    { month: 'Aug', fresh: 1900, codelekho: 38000, infotech: 0, total: 39900 },
    { month: 'Sep', fresh: 2100, codelekho: 44000, infotech: 0, total: 46100 },
    { month: 'Oct', fresh: 2350, codelekho: 48000, infotech: 0, total: 50350 },
    { month: 'Nov', fresh: 2469, codelekho: 50000, infotech: 0, total: 52469 },
  ],
  recentSyncActivity: [
    {
      id: 'sync-af-01',
      sourceSystem: 'arshithfresh',
      status: 'COMPLETED',
      created: 31,
      updated: 0,
      skipped: 0,
      time: new Date().toISOString(),
    },
    {
      id: 'sync-cl-01',
      sourceSystem: 'codelekho',
      status: 'COMPLETED',
      created: 260,
      updated: 0,
      skipped: 0,
      time: new Date().toISOString(),
    },
  ],
};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = req.url || '';
  const pathname = url.split('?')[0].replace(/^\/api/, '');

  // 1. Auth routes (POST /auth/login, /af/auth/login)
  if (pathname.includes('/auth/login') || pathname.endsWith('auth/login')) {
    const body = req.body || {};
    const email = body.email || 'admin@arshithgroup.com';
    return res.status(200).json({
      success: true,
      token: 'vercel_jwt_token_' + Date.now(),
      user: {
        id: 1,
        name: 'Farook',
        email,
        role: { id: 1, name: 'SUPER_ADMIN', label: 'Super Admin' },
        roleLabel: 'Super Admin',
        roleName: 'SUPER_ADMIN',
        department: 'Executive Management',
        designation: 'Managing Director & CEO',
        employeeId: 'EMP-0101',
        company: pathname.includes('/af') ? 'arshithfresh' : 'arshith',
        permissions: [
          'product.view', 'product.manage', 'product.import',
          'category.manage', 'supplier.view', 'supplier.manage',
          'purchase.view', 'purchase.create', 'purchase.approve',
          'inventory.view', 'inventory.adjust', 'order.view',
          'report.view', 'user.manage'
        ]
      }
    });
  }

  // 2. Current User (/auth/me, /af/auth/me)
  if (pathname.includes('/auth/me') || pathname.endsWith('auth/me')) {
    return res.status(200).json({
      id: 1,
      name: 'Farook',
      email: 'admin@arshithgroup.com',
      role: { id: 1, name: 'SUPER_ADMIN', label: 'Super Admin' },
      roleLabel: 'Super Admin',
      roleName: 'SUPER_ADMIN',
      designation: 'Managing Director & CEO',
      company: 'arshith'
    });
  }

  // 3. Central Analytics
  if (pathname.includes('/central/analytics') || pathname.includes('/analytics/overview')) {
    return res.status(200).json({
      success: true,
      data: DEFAULT_CENTRAL_ANALYTICS
    });
  }

  // 4. ArshithFresh Entity Endpoints
  if (pathname.includes('/af/categories') || pathname === '/categories') {
    return res.status(200).json(storeData.categories || []);
  }

  if (pathname.includes('/af/products') || pathname === '/products') {
    return res.status(200).json(storeData.products || []);
  }

  if (pathname.includes('/af/suppliers') || pathname === '/suppliers') {
    return res.status(200).json(storeData.suppliers || []);
  }

  if (pathname.includes('/af/warehouses') || pathname === '/warehouses') {
    return res.status(200).json(storeData.warehouses || []);
  }

  if (pathname.includes('/af/meta')) {
    return res.status(200).json({
      units: ['kg', 'g', 'litre', 'ml', 'packet', 'bottle', 'piece'],
      roles: storeData.roles || []
    });
  }

  if (pathname.includes('/af/orders')) {
    return res.status(200).json(storeData.orders || []);
  }

  if (pathname.includes('/af/purchases')) {
    return res.status(200).json(storeData.purchases || []);
  }

  // 5. Dashboard Stats
  if (pathname.includes('/dashboard/stats')) {
    return res.status(200).json({
      success: true,
      stats: {
        totalProjects: 12,
        activeProjects: 8,
        completedProjects: 4,
        onHoldProjects: 0,
        totalTasks: 45,
        completedTasks: 38,
        totalBudget: 4500000,
        totalSpent: 3200000,
      }
    });
  }

  // 6. Generic Fallback
  return res.status(200).json({
    success: true,
    data: [],
    message: 'Processed by Vercel Cloud Serverless Handler'
  });
}
