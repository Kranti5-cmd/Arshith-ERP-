import { store, freshStore } from './db.js';

function getProductStock(p, batches) {
  const relevant = (batches || []).filter((b) => b.productId === p.id);
  let available = 0;
  let reserved = 0;
  let damaged = 0;
  let value = 0;
  for (const b of relevant) {
    available += Number(b.availableQty || 0);
    reserved += Number(b.reservedQty || 0);
    damaged += Number(b.damagedQty || 0);
    value += (Number(b.availableQty || 0) + Number(b.reservedQty || 0)) * Number(b.purchasePrice || p.purchasePrice || 0);
  }
  return {
    available,
    reserved,
    damaged,
    total: available + reserved + damaged,
    sellable: available,
    value: Math.round(value * 100) / 100,
    opening: available + reserved + damaged,
    purchased: 0,
    sold: 0,
    returned: 0,
    adjusted: 0,
    wasted: 0,
    expired: 0,
  };
}

function enrichProduct(p) {
  const cat = (freshStore.categories || []).find((c) => c.id === p.categoryId) || { id: p.categoryId, name: 'General' };
  const subcat = p.subcategoryId ? ((freshStore.categories || []).find((c) => c.id === p.subcategoryId) || null) : null;
  const preferredSupplier = p.preferredSupplierId ? ((freshStore.suppliers || []).find((s) => s.id === p.preferredSupplierId) || null) : null;
  const stock = getProductStock(p, freshStore.batches || []);
  let stockState = 'IN_STOCK';
  if (stock.sellable <= 0) stockState = 'OUT_OF_STOCK';
  else if (stock.sellable <= Number(p.minStockLevel || 0)) stockState = 'LOW_STOCK';

  return {
    ...p,
    category: { id: cat.id, name: cat.name },
    subcategory: subcat ? { id: subcat.id, name: subcat.name } : null,
    preferredSupplier: preferredSupplier ? { id: preferredSupplier.id, name: preferredSupplier.name } : null,
    stock,
    stockState,
  };
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
        ],
      },
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
      company: 'arshith',
    });
  }

  // 3. Central Analytics & Integrations Overview
  if (pathname.includes('/central/analytics') || pathname.includes('/analytics/overview')) {
    return res.status(200).json({
      success: true,
      data: DEFAULT_CENTRAL_ANALYTICS,
    });
  }

  // 4. ArshithFresh Categories (with nested children and productCount)
  if (pathname.includes('/af/categories') || (pathname.includes('/categories') && pathname.includes('/af'))) {
    const top = (freshStore.categories || [])
      .filter((c) => !c.parentId)
      .map((c) => {
        const children = (freshStore.categories || []).filter((s) => s.parentId === c.id);
        const prodCount = (freshStore.products || []).filter((p) => p.categoryId === c.id).length;
        return {
          ...c,
          productCount: prodCount,
          children: children.map((s) => ({
            ...s,
            productCount: (freshStore.products || []).filter((p) => p.subcategoryId === s.id).length,
          })),
        };
      });
    return res.status(200).json(top);
  }

  // 5. ArshithFresh Products (enriched with stock, categories, suppliers)
  if (pathname.includes('/af/products') || (pathname.includes('/products') && pathname.includes('/af'))) {
    const enriched = (freshStore.products || []).map((p) => enrichProduct(p));
    return res.status(200).json(enriched);
  }

  // 6. ArshithFresh Suppliers
  if (pathname.includes('/af/suppliers') || (pathname.includes('/suppliers') && pathname.includes('/af'))) {
    return res.status(200).json(freshStore.suppliers || []);
  }

  // 7. ArshithFresh Warehouses
  if (pathname.includes('/af/warehouses') || (pathname.includes('/warehouses') && pathname.includes('/af'))) {
    return res.status(200).json(freshStore.warehouses || []);
  }

  // 8. ArshithFresh Meta
  if (pathname.includes('/af/meta')) {
    return res.status(200).json({
      units: ['kg', 'g', 'litre', 'ml', 'packet', 'bottle', 'piece'],
      roles: freshStore.roles || [],
      wastageCategories: {
        EXPIRED: 'Expired products',
        DAMAGED: 'Damaged products',
        QUALITY_REJECTION: 'Quality rejection',
        STORAGE_DAMAGE: 'Storage damage',
        OTHER: 'Other',
      },
    });
  }

  // 9. ArshithFresh Purchases & Orders
  if (pathname.includes('/af/purchases')) return res.status(200).json(freshStore.purchases || []);
  if (pathname.includes('/af/orders')) return res.status(200).json(freshStore.orders || []);
  if (pathname.includes('/af/batches')) return res.status(200).json(freshStore.batches || []);
  if (pathname.includes('/af/stock')) return res.status(200).json((freshStore.products || []).map(enrichProduct));
  if (pathname.includes('/af/users')) return res.status(200).json(freshStore.users || []);
  if (pathname.includes('/af/audit')) return res.status(200).json(freshStore.audit || []);

  // 10. Notifications
  if (pathname.includes('/notifications')) {
    return res.status(200).json({
      items: [],
      unread: 0,
      unreadCount: 0,
    });
  }

  // 11. Arshith Infotech - Projects
  if (pathname.includes('/projects')) {
    return res.status(200).json({
      success: true,
      data: store.projects || [],
      projects: store.projects || [],
    });
  }

  // 12. Arshith Infotech - Employees
  if (pathname.includes('/employees')) {
    return res.status(200).json({
      success: true,
      data: store.employees || [],
      employees: store.employees || [],
    });
  }

  // 13. Arshith Infotech - Clients
  if (pathname.includes('/clients')) {
    return res.status(200).json({
      success: true,
      data: store.clients || [],
      clients: store.clients || [],
    });
  }

  // 14. Arshith Infotech - Categories
  if (pathname === '/categories' || pathname.includes('/categories')) {
    return res.status(200).json({
      success: true,
      data: store.categories || [],
      categories: store.categories || [],
    });
  }

  // 15. Dashboard Stats
  if (pathname.includes('/dashboard/stats')) {
    const projects = (store.projects || []).filter((p) => !p.isArchived);
    return res.status(200).json({
      success: true,
      stats: {
        totalProjects: 12,
        newProjects: 2,
        underReview: 1,
        accepted: 2,
        rejected: 0,
        approved: 2,
        assigned: 1,
        unassigned: 4,
        inProgress: 3,
        onHold: 0,
        testing: 1,
        completed: 4,
        delivered: 2,
        cancelled: 0,
        overdue: 0,
        totalProposedBudget: 4500000,
        totalApprovedBudget: 4800000,
        totalActualExpenditure: 3200000,
        remainingBudget: 1600000,
        pendingPayments: 950000,
        totalProjectRevenue: 3850000,
        totalProjectProfit: 650000,
      },
    });
  }

  // 16. Integrations & Synced Records
  if (pathname.includes('/integrations/records')) {
    return res.status(200).json({
      success: true,
      data: store.synced_records || [],
      total: (store.synced_records || []).length,
    });
  }

  if (pathname.includes('/integrations')) {
    return res.status(200).json({
      success: true,
      data: store.integrations || [],
      integrations: store.integrations || [],
    });
  }

  // 17. HR Module
  if (pathname.includes('/hr/dashboard')) {
    return res.status(200).json({
      totalEmployees: (store.hr_employees || []).length,
      presentToday: 19,
      onLeaveToday: 2,
      totalPayroll: 850000,
    });
  }

  if (pathname.includes('/hr/employees')) {
    return res.status(200).json(store.hr_employees || []);
  }

  if (pathname.includes('/hr/attendance')) {
    return res.status(200).json(store.hr_attendance || []);
  }

  if (pathname.includes('/hr/leaves')) {
    return res.status(200).json(store.hr_leaves || []);
  }

  if (pathname.includes('/hr/payroll')) {
    return res.status(200).json(store.hr_payroll || []);
  }

  // 18. Audit Logs
  if (pathname.includes('/audit-logs')) {
    return res.status(200).json({
      success: true,
      data: (store.auditLogs || []).slice(0, 50),
      auditLogs: (store.auditLogs || []).slice(0, 50),
    });
  }

  // 19. Generic Fallback
  return res.status(200).json({
    success: true,
    data: [],
    message: 'Processed by Vercel Cloud Serverless Handler',
  });
}
