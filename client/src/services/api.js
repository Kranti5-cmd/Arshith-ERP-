const RAW_URL = import.meta.env.VITE_API_URL || '';
const BASE_URL = RAW_URL ? `${RAW_URL.replace(/\/$/, '')}/api` : '/api';

export const getAuthToken = () => {
  return localStorage.getItem('arshith_auth_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('arshith_auth_token', token);
  } else {
    localStorage.removeItem('arshith_auth_token');
  }
};

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => request('/auth/me'),
  getUsers: () => request('/auth/users'),

  // Dashboard
  getDashboardStats: (params = '') => request(`/dashboard/stats${params ? `?${params}` : ''}`),

  // Projects
  getProjects: (params = '') => request(`/projects${params ? `?${params}` : ''}`),
  getProjectById: (id) => request(`/projects/${id}`),
  createProject: (payload) => request('/projects', { method: 'POST', body: JSON.stringify(payload) }),
  updateProject: (id, payload) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  changeStatus: (id, payload) => request(`/projects/${id}/status`, { method: 'PATCH', body: JSON.stringify(payload) }),
  placeOnHold: (id, payload) => request(`/projects/${id}/hold`, { method: 'POST', body: JSON.stringify(payload) }),
  resumeProject: (id, payload) => request(`/projects/${id}/resume`, { method: 'POST', body: JSON.stringify(payload) }),
  completeProject: (id, payload) => request(`/projects/${id}/complete`, { method: 'POST', body: JSON.stringify(payload) }),
  deliverProject: (id, payload) => request(`/projects/${id}/deliver`, { method: 'POST', body: JSON.stringify(payload) }),
  archiveProject: (id, payload) => request(`/projects/${id}/archive`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteProject: (id, payload) => request(`/projects/${id}`, { method: 'DELETE', body: JSON.stringify(payload) }),

  // Assignments
  getAssignments: (params = '') => request(`/employees/assignments/all${params ? `?${params}` : ''}`),
  assignEmployee: (projectId, payload) => request(`/projects/${projectId}/assignments`, { method: 'POST', body: JSON.stringify(payload) }),
  createAssignment: (payload) => request('/employees/assignments', { method: 'POST', body: JSON.stringify(payload) }),
  updateAssignment: (id, payload) => request(`/employees/assignments/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAssignment: (id) => request(`/employees/assignments/${id}`, { method: 'DELETE' }),
  releaseEmployee: (assignmentId) => request(`/employees/assignments/${assignmentId}/release`, { method: 'POST' }),

  // Employees
  getEmployees: (params = '') => request(`/employees${params ? `?${params}` : ''}`),
  getEmployeeById: (id) => request(`/employees/${id}`),
  createEmployee: (payload) => request('/employees', { method: 'POST', body: JSON.stringify(payload) }),
  updateEmployee: (id, payload) => request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteEmployee: (id) => request(`/employees/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: (params = '') => request(`/tasks${params ? `?${params}` : ''}`),
  createTask: (payload) => request('/tasks', { method: 'POST', body: JSON.stringify(payload) }),
  updateTask: (id, payload) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  addTaskComment: (taskId, comment) => request(`/tasks/${taskId}/comments`, { method: 'POST', body: JSON.stringify({ comment }) }),
  logTimeEntry: (taskId, payload) => request(`/tasks/${taskId}/time-entries`, { method: 'POST', body: JSON.stringify(payload) }),
  manualUpdateProgress: (projectId, payload) => request(`/tasks/projects/${projectId}/progress`, { method: 'POST', body: JSON.stringify(payload) }),

  // Milestones
  getMilestones: (params = '') => request(`/milestones${params ? `?${params}` : ''}`),
  createMilestone: (payload) => request('/milestones', { method: 'POST', body: JSON.stringify(payload) }),
  updateMilestone: (id, payload) => request(`/milestones/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  // Finances
  getExpenses: (params = '') => request(`/finances/expenses${params ? `?${params}` : ''}`),
  createExpense: (payload) => request('/finances/expenses', { method: 'POST', body: JSON.stringify(payload) }),
  updateExpenseStatus: (id, payload) => request(`/finances/expenses/${id}/status`, { method: 'PATCH', body: JSON.stringify(payload) }),
  recordPayment: (payload) => request('/finances/payments', { method: 'POST', body: JSON.stringify(payload) }),
  getProjectFinances: (projectId) => request(`/finances/projects/${projectId}`),

  // Holds
  getOnHoldProjects: () => request('/on-hold-projects'),

  // Risks
  getRisks: (params = '') => request(`/risks${params ? `?${params}` : ''}`),
  createRisk: (payload) => request('/risks', { method: 'POST', body: JSON.stringify(payload) }),
  updateRisk: (id, payload) => request(`/risks/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  // Documents
  getDocuments: (params = '') => request(`/documents${params ? `?${params}` : ''}`),
  createDocument: (payload) => request('/documents', { method: 'POST', body: JSON.stringify(payload) }),

  // Reports
  getReportData: (reportType, format = 'json') => request(`/reports?reportType=${reportType}&format=${format}`),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/mark-all-read', { method: 'POST' }),

  // Audit Logs
  getAuditLogs: (params = '') => request(`/audit-logs${params ? `?${params}` : ''}`),

  // Clients
  getClients: () => request('/clients'),
  createClient: (payload) => request('/clients', { method: 'POST', body: JSON.stringify(payload) }),

  // Integrations & Central Management
  getIntegrations: () => request('/integrations'),
  getIntegrationByKey: (key) => request(`/integrations/${key}`),
  testIntegration: (key) => request(`/integrations/${key}/test`, { method: 'POST' }),
  syncIntegration: (key, syncType = 'FULL') => request(`/integrations/${key}/sync`, { method: 'POST', body: JSON.stringify({ syncType }) }),
  updateIntegrationConfig: (key, config) => request(`/integrations/${key}/config`, { method: 'PUT', body: JSON.stringify({ config }) }),
  getSyncJobs: (key) => request(`/integrations/${key}/jobs`),
  getSyncLogs: (key, jobId = '', limit = 100) => request(`/integrations/${key}/logs?limit=${limit}${jobId ? `&jobId=${jobId}` : ''}`),
  getSyncedRecords: (params = '') => request(`/integrations/records${params ? `?${params}` : ''}`),
  getCentralAnalytics: (params = '') => request(`/integrations/analytics/overview${params ? `?${params}` : ''}`),
};

