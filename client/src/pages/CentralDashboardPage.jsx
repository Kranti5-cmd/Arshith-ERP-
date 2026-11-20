import React, { useState, useEffect } from 'react';
import {
  Building2,
  Leaf,
  GraduationCap,
  Briefcase,
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  Users,
  BookOpen,
  Award,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck2,
  ChevronRight,
  ExternalLink,
  PackageCheck,
  AlertOctagon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CentralDashboardPage = ({ onNavigateToIntegrations, onNavigateToFinance, onNavigateToHr }) => {
  const { switchCompany } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (comp = selectedCompany) => {
    try {
      setRefreshing(true);
      const res = await api.getCentralAnalytics(`company=${comp}`);
      if (res.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to load central analytics:', err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(selectedCompany);
  }, [selectedCompany]);

  if (loading && !analytics) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <div className="font-semibold text-slate-700">Loading Central Business Intelligence Hub...</div>
      </div>
    );
  }

  const consolidated = analytics?.consolidated || {};
  const fresh = analytics?.companies?.arshithfresh || {};
  const lekho = analytics?.companies?.codelekho || {};
  const infotech = analytics?.companies?.arshith_infotech || {};
  const trends = analytics?.monthlyTrends || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-blue-900 text-white flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">
                Central Business Hub
              </h1>
              <p className="text-xs text-[#64748B]">
                Consolidated Enterprise Telemetry • Arshith Group Multi-Entity Operations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Data freshness indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-[11px] text-slate-600 shadow-2xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real Sync Data ({analytics?.dataFreshness?.totalSyncedRecords || 0} Records)</span>
          </div>

          {onNavigateToFinance && (
            <button
              onClick={onNavigateToFinance}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Open Multi-Company Finance ERP & Ledger"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Open Finance ERP</span>
            </button>
          )}

          <button
            onClick={() => {
              if (onNavigateToHr) onNavigateToHr();
              else window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'hr-workforce' }));
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 rounded-xl transition-all shadow-sm cursor-pointer"
            title="Open Central Multi-Company HRMS Portal"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Central HRMS</span>
          </button>

          <button
            onClick={() => fetchAnalytics(selectedCompany)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] hover:bg-slate-50 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Company Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl w-fit max-w-full overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setSelectedCompany('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedCompany === 'all'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>All Companies (Consolidated)</span>
        </button>

        <button
          onClick={() => setSelectedCompany('arshithfresh')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedCompany === 'arshithfresh'
              ? 'bg-white text-emerald-950 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>ArshithFresh (E-Commerce)</span>
        </button>

        <button
          onClick={() => setSelectedCompany('codelekho')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedCompany === 'codelekho'
              ? 'bg-white text-indigo-950 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
          <span>CodeLekho (Academic)</span>
        </button>

        <button
          onClick={() => setSelectedCompany('arshith_infotech')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedCompany === 'arshith_infotech'
              ? 'bg-white text-sky-950 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-sky-600" />
          <span>Arshith Infotech (Portfolio)</span>
        </button>
      </div>

      {/* 4 Primary Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Consolidated Revenue */}
        <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Consolidated Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#111827] font-mono">
              ₹{Number(consolidated.totalRevenue || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
              <span className="text-emerald-600 font-semibold">Live Traceable</span>
              <span>from verified transactions</span>
            </div>
          </div>
        </div>

        {/* Transactions / Orders */}
        <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Total Transactions</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#111827] font-mono">
              {Number(consolidated.totalTransactions || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Orders & contracts across subsidiaries
            </div>
          </div>
        </div>

        {/* Total Users & Customers */}
        <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">User Base & Learners</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#111827] font-mono">
              {Number(consolidated.totalUsersBase || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Customers, students & stakeholders
            </div>
          </div>
        </div>

        {/* Active Integrations */}
        <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Active Database Connectors</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#111827] font-mono">
              {consolidated.activeIntegrationsCount} / {consolidated.totalIntegrationsCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
              <span className="text-blue-600 font-semibold">2 Live Connected</span>
              <span>• 1 Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Subsidiary Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. ArshithFresh Subsidiary Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-9 rounded-xl bg-white border border-emerald-200 flex items-center justify-center overflow-hidden p-0.5 shadow-2xs">
                <img src="/logos/arshith-fresh-logo.jpg" alt="ArshithFresh" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">ArshithFresh</h3>
                <span className="text-[10px] text-slate-400 font-mono">MongoDB Atlas</span>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                fresh.connectionStatus === 'CONNECTED'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {fresh.connectionStatus}
            </span>
          </div>

          {!fresh.dataAvailable ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <AlertTriangle className="w-6 h-6 text-slate-300 mx-auto mb-1" />
              <div className="font-semibold text-slate-500">Data not available</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Please run sync from Integrations page.</div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] text-slate-400">Total Sales (₹)</div>
                  <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                    ₹{Number(fresh.metrics?.totalRevenue || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] text-slate-400">Orders Logged</div>
                  <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                    {fresh.metrics?.totalOrders || 0}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600 pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Delivered Orders:</span>
                  <strong className="text-emerald-700">{fresh.metrics?.deliveredOrders || 0}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Pending / Processing:</span>
                  <strong className="text-amber-700">{fresh.metrics?.pendingOrders || 0}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Catalog Products:</span>
                  <strong className="text-slate-900">{fresh.metrics?.totalProducts || 0}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Registered Suppliers:</span>
                  <strong className="text-slate-900">{fresh.metrics?.totalSuppliers || 0}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-800">ArshithFresh IMS</div>
                  <div className="text-[10px] text-slate-500">Inventory & Supply Chain</div>
                </div>
                <button
                  onClick={() => switchCompany('arshithfresh')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer group"
                >
                  <span>Open IMS</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. CodeLekho Subsidiary Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-8 rounded-lg bg-white border border-indigo-200 flex items-center justify-center overflow-hidden p-1 shadow-2xs">
                <img src="/logos/codelekho-logo.png" alt="CodeLekho" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">CodeLekho</h3>
                <span className="text-[10px] text-slate-400 font-mono">Supabase PostgreSQL</span>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                lekho.connectionStatus === 'CONNECTED'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {lekho.connectionStatus}
            </span>
          </div>

          {!lekho.dataAvailable ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <AlertTriangle className="w-6 h-6 text-slate-300 mx-auto mb-1" />
              <div className="font-semibold text-slate-500">Data not available</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Please run sync from Integrations page.</div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] text-slate-400">Offered Courses</div>
                  <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                    {lekho.metrics?.totalCourses || 0}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] text-slate-400">Enrolled Learners</div>
                  <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                    {lekho.metrics?.enrolledLearners || 0}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600 pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Issued Certificates:</span>
                  <strong className="text-indigo-700">{lekho.metrics?.certificatesIssued || 0}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Project Submissions:</span>
                  <strong className="text-slate-900">{lekho.metrics?.projectSubmissions || 0}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Course Revenue:</span>
                  <strong className="text-slate-900 font-mono">
                    ₹{Number(lekho.metrics?.totalRevenue || 0).toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>LMS Operating Status:</span>
                  <strong className="text-emerald-700">Operational</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-800">CodeLekho CRM</div>
                  <div className="text-[10px] text-slate-500">Education, Student & CRM Management</div>
                </div>
                <button
                  onClick={() => switchCompany('codelekho')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#013A2B] hover:bg-[#0C2D26] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer group"
                >
                  <span>Open CRM Workspace</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Arshith Infotech Subsidiary Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-9 rounded-lg bg-white border border-sky-200 flex items-center justify-center overflow-hidden p-0.5 shadow-2xs">
                <img src="/logos/arshith-infotech-logo.jpg" alt="Arshith Infotech" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Arshith Infotech</h3>
                <span className="text-[10px] text-slate-400 font-mono">Internal Portfolio</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono bg-amber-50 text-amber-800 border border-amber-200">
              Pending Integration
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-[10px] text-slate-400">Total Projects</div>
                <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                  {infotech.metrics?.totalProjects || 0}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-[10px] text-slate-400">Active Clients</div>
                <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                  {infotech.metrics?.totalClients || 0}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600 pt-1">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Active Projects:</span>
                <strong className="text-blue-700">{infotech.metrics?.activeProjects || 0}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Delivered Sign-offs:</span>
                <strong className="text-emerald-700">{infotech.metrics?.completedProjects || 0}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Proposed Pipeline (₹):</span>
                <strong className="text-slate-900 font-mono">
                  ₹{Number(infotech.metrics?.portfolioProposedBudget || 0).toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Received Revenue (₹):</span>
                <strong className="text-slate-900 font-mono">
                  ₹{Number(infotech.metrics?.portfolioReceivedRevenue || 0).toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Performance Trend Chart */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Multi-Subsidiary Performance & Revenue Trend (INR ₹)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated from verified synchronized orders and customer payments
            </p>
          </div>
        </div>

        {trends.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <Clock className="w-6 h-6 text-slate-300 mx-auto mb-1" />
            <div className="font-semibold text-slate-600">No trend data available for selected period</div>
          </div>
        ) : (
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorFresh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }}
                />
                <Area
                  type="monotone"
                  dataKey="freshRevenue"
                  name="ArshithFresh Revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorFresh)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Sync Activity Timeline */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Real-Time Integration Sync Timeline</span>
            </h3>
            <p className="text-xs text-slate-500">
              Audit log of latest synchronization jobs from ArshithFresh and CodeLekho
            </p>
          </div>
          {onNavigateToIntegrations && (
            <button
              onClick={onNavigateToIntegrations}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Manage Connectors</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {analytics?.recentSyncActivity?.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            No synchronization activity recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {analytics.recentSyncActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      act.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  ></span>
                  <div>
                    <span className="font-bold text-slate-800 capitalize font-mono">
                      {act.sourceSystem} Sync
                    </span>
                    <span className="text-slate-400 text-[10px] ml-2 font-mono">{act.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
                  <span>
                    +{act.created} created, {act.updated} updated, {act.skipped} skipped
                  </span>
                  <span className="text-slate-400">
                    {new Date(act.time).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

