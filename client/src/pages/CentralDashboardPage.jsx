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
  Sun,
  Activity,
  Flame,
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
      <div className="p-16 text-center text-[#7C8998] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#F4F7FA] border border-[#DDE4EC] shadow-atmo-card flex items-center justify-center mx-auto">
          <RefreshCw className="w-6 h-6 animate-spin text-[#2563EB]" />
        </div>
        <div className="font-bold text-sm text-[#253142]">Loading Atmosphere Business Intelligence Hub...</div>
        <p className="text-xs text-[#A0ACBA]">Aggregating telemetry across Arshith ecosystem</p>
      </div>
    );
  }

  const consolidated = analytics?.consolidated || {};
  const fresh = analytics?.companies?.arshithfresh || {};
  const lekho = analytics?.companies?.codelekho || {};
  const infotech = analytics?.companies?.arshith_infotech || {};
  const trends = analytics?.monthlyTrends || [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-7 animate-in fade-in duration-200 font-sans">
      
      {/* Top Atmosphere Breadcrumb & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7C8998]">
            <span>Atmosphere</span>
            <span>&gt;</span>
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-[#253142] font-bold">Overview</span>
          </div>
          <div className="text-[10px] text-[#A0ACBA] font-mono uppercase tracking-wider">
            FRIDAY, NOVEMBER 20 • 15:50 • CONSOLIDATED MULTI-ENTITY OS
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#253142] tracking-tight">
            Ecosystem at a glance
          </h1>
        </div>

        {/* Right Quick Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Data freshness indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-[#F4F7FA] border border-[#DDE4EC] rounded-2xl text-[11px] text-[#7C8998] shadow-atmo-card-sm font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Verified Sync ({analytics?.dataFreshness?.totalSyncedRecords || 0} Records)</span>
          </div>

          {onNavigateToFinance && (
            <button
              onClick={onNavigateToFinance}
              className="atmo-btn-secondary"
              title="Open Multi-Company Finance ERP & Ledger"
            >
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              <span>Finance ERP</span>
            </button>
          )}

          <button
            onClick={() => {
              if (onNavigateToHr) onNavigateToHr();
              else window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'hr-workforce' }));
            }}
            className="atmo-btn-secondary"
            title="Open Central Multi-Company HRMS Portal"
          >
            <Users className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Central HRMS</span>
          </button>

          <button
            onClick={() => fetchAnalytics(selectedCompany)}
            disabled={refreshing}
            className="atmo-btn-icon"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#2563EB]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Atmosphere Recessed Well: Company Filter Selector */}
      <div className="atmo-well p-1.5 rounded-2xl w-fit max-w-full overflow-x-auto flex items-center gap-1.5 text-xs font-semibold">
        <button
          onClick={() => setSelectedCompany('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedCompany === 'all'
              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 font-bold'
              : 'text-[#7C8998] hover:text-[#253142] hover:bg-white/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Companies</span>
        </button>

        <button
          onClick={() => setSelectedCompany('arshithfresh')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedCompany === 'arshithfresh'
              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 font-bold'
              : 'text-[#7C8998] hover:text-[#253142] hover:bg-white/60'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>ArshithFresh (E-Commerce)</span>
        </button>

        <button
          onClick={() => setSelectedCompany('codelekho')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedCompany === 'codelekho'
              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 font-bold'
              : 'text-[#7C8998] hover:text-[#253142] hover:bg-white/60'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>CodeLekho (Academic)</span>
        </button>

        <button
          onClick={() => setSelectedCompany('arshith_infotech')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            selectedCompany === 'arshith_infotech'
              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 font-bold'
              : 'text-[#7C8998] hover:text-[#253142] hover:bg-white/60'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Arshith Infotech (Portfolio)</span>
        </button>
      </div>

      {/* 4 Primary Executive KPIs (Atmosphere Signature Neumorphic Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Consolidated Revenue */}
        <div className="atmo-card p-6 space-y-4">
          <div className="flex items-center justify-between text-[#7C8998]">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Consolidated Revenue</span>
            <div className="w-9 h-9 rounded-2xl bg-white border border-[#DDE4EC] flex items-center justify-center text-blue-600 shadow-2xs">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#253142] font-mono tracking-tight">
              ₹{Number(consolidated.totalRevenue || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#7C8998] mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-emerald-700 font-semibold font-mono">Live Traceable</span>
              <span>across all entities</span>
            </div>
          </div>
          {/* Atmosphere Status Dots */}
          <div className="flex items-center gap-1 pt-1">
            <span className="w-2.5 h-1.5 rounded-full bg-[#2563EB]"></span>
            <span className="w-2.5 h-1.5 rounded-full bg-[#2563EB]"></span>
            <span className="w-2.5 h-1.5 rounded-full bg-[#2563EB]"></span>
            <span className="w-2.5 h-1.5 rounded-full bg-[#2563EB]"></span>
            <span className="w-2.5 h-1.5 rounded-full bg-[#2563EB]"></span>
            <span className="w-2.5 h-1.5 rounded-full bg-[#DDE4EC]"></span>
          </div>
        </div>

        {/* KPI 2: Total Transactions */}
        <div className="atmo-card p-6 space-y-4">
          <div className="flex items-center justify-between text-[#7C8998]">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Total Transactions</span>
            <div className="w-9 h-9 rounded-2xl bg-white border border-[#DDE4EC] flex items-center justify-center text-emerald-600 shadow-2xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#253142] font-mono tracking-tight">
              {Number(consolidated.totalTransactions || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#7C8998] mt-2 font-mono">
              Orders & contracts across subsidiaries
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              Active Flow
            </span>
            <span className="text-[#A0ACBA]">Live verified</span>
          </div>
        </div>

        {/* KPI 3: User Base & Learners */}
        <div className="atmo-card p-6 space-y-4">
          <div className="flex items-center justify-between text-[#7C8998]">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">User Base & Learners</span>
            <div className="w-9 h-9 rounded-2xl bg-white border border-[#DDE4EC] flex items-center justify-center text-indigo-600 shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#253142] font-mono tracking-tight">
              {Number(consolidated.totalUsersBase || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#7C8998] mt-2 font-mono">
              Customers, students & stakeholders
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden shadow-atmo-well">
            <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>

        {/* KPI 4: Active Database Connectors */}
        <div className="atmo-card p-6 space-y-4">
          <div className="flex items-center justify-between text-[#7C8998]">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Active Connectors</span>
            <div className="w-9 h-9 rounded-2xl bg-white border border-[#DDE4EC] flex items-center justify-center text-blue-600 shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#253142] font-mono tracking-tight">
              {consolidated.activeIntegrationsCount} / {consolidated.totalIntegrationsCount}
            </div>
            <div className="text-[11px] text-[#7C8998] mt-2 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-blue-700 font-semibold">2 Connected</span>
              <span>• 1 Pending</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-bold">
              Atlas & Supabase
            </span>
          </div>
        </div>
      </div>

      {/* 3 Subsidiary Breakdown Cards (Atmosphere Neumorphic Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. ArshithFresh Subsidiary Card */}
        <div className="atmo-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDE4EC] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-24 h-11 rounded-xl bg-white border border-[#DDE4EC] flex items-center justify-center p-1.5 shadow-2xs overflow-hidden">
                  <img src="/logos/arshith-fresh-logo.jpg" alt="ArshithFresh" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#253142]">ArshithFresh</h3>
                  <span className="text-[10px] text-[#7C8998] font-mono">MongoDB Atlas</span>
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
              <div className="p-8 text-center text-[#7C8998] text-xs">
                <AlertTriangle className="w-6 h-6 text-[#A0ACBA] mx-auto mb-1" />
                <div className="font-semibold text-[#253142]">Data not available</div>
                <div className="text-[10px] text-[#A0ACBA] mt-0.5">Please run sync from Integrations page.</div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-[#E2E8F0]/60 rounded-2xl shadow-atmo-well">
                    <div className="text-[10px] text-[#7C8998] font-mono">Total Sales (₹)</div>
                    <div className="text-base font-extrabold text-[#253142] font-mono mt-0.5">
                      ₹{Number(fresh.metrics?.totalRevenue || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-3 bg-[#E2E8F0]/60 rounded-2xl shadow-atmo-well">
                    <div className="text-[10px] text-[#7C8998] font-mono">Orders Logged</div>
                    <div className="text-base font-extrabold text-[#253142] font-mono mt-0.5">
                      {fresh.metrics?.totalOrders || 0}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-[11px] text-[#7C8998] pt-1">
                  <div className="flex justify-between py-1 border-b border-[#DDE4EC]/60">
                    <span>Delivered Orders:</span>
                    <strong className="text-emerald-700 font-bold">{fresh.metrics?.deliveredOrders || 0}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#DDE4EC]/60">
                    <span>Pending / Processing:</span>
                    <strong className="text-amber-700 font-bold">{fresh.metrics?.pendingOrders || 0}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#DDE4EC]/60">
                    <span>Catalog Products:</span>
                    <strong className="text-[#253142] font-bold">{fresh.metrics?.totalProducts || 0}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Registered Suppliers:</span>
                    <strong className="text-[#253142] font-bold">{fresh.metrics?.totalSuppliers || 0}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#DDE4EC] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#253142]">ArshithFresh IMS</div>
              <div className="text-[10px] text-[#7C8998]">Supply chain & retail</div>
            </div>
            <button
              onClick={() => switchCompany('arshithfresh')}
              className="atmo-btn-secondary"
            >
              <span>Open IMS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. CodeLekho Subsidiary Card */}
        <div className="atmo-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDE4EC] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-24 h-11 rounded-xl bg-white border border-[#DDE4EC] flex items-center justify-center p-1.5 shadow-2xs overflow-hidden">
                  <img src="/logos/codelekho-logo.png" alt="CodeLekho" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#253142]">CodeLekho</h3>
                  <span className="text-[10px] text-[#7C8998] font-mono">Supabase PostgreSQL</span>
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
              <div className="p-8 text-center text-[#7C8998] text-xs">
                <AlertTriangle className="w-6 h-6 text-[#A0ACBA] mx-auto mb-1" />
                <div className="font-semibold text-[#253142]">Data not available</div>
                <div className="text-[10px] text-[#A0ACBA] mt-0.5">Please run sync from Integrations page.</div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-[#E2E8F0]/60 rounded-2xl shadow-atmo-well">
                    <div className="text-[10px] text-[#7C8998] font-mono">Offered Courses</div>
                    <div className="text-base font-extrabold text-[#253142] font-mono mt-0.5">
                      {lekho.metrics?.totalCourses || 0}
                    </div>
                  </div>
                  <div className="p-3 bg-[#E2E8F0]/60 rounded-2xl shadow-atmo-well">
                    <div className="text-[10px] text-[#7C8998] font-mono">Enrolled Learners</div>
                    <div className="text-base font-extrabold text-[#253142] font-mono mt-0.5">
                      {lekho.metrics?.enrolledLearners || 0}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-[11px] text-[#7C8998] pt-1">
                  <div className="flex justify-between py-1 border-b border-[#DDE4EC]/60">
                    <span>Issued Certificates:</span>
                    <strong className="text-indigo-700 font-bold">{lekho.metrics?.certificatesIssued || 0}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#DDE4EC]/60">
                    <span>Project Submissions:</span>
                    <strong className="text-[#253142] font-bold">{lekho.metrics?.projectSubmissions || 0}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#DDE4EC]/60">
                    <span>Course Revenue:</span>
                    <strong className="text-[#253142] font-bold font-mono">
                      ₹{Number(lekho.metrics?.totalRevenue || 0).toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>LMS Operating Status:</span>
                    <strong className="text-emerald-700 font-bold">Operational</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#DDE4EC] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#253142]">CodeLekho CRM</div>
              <div className="text-[10px] text-[#7C8998]">Education & LMS</div>
            </div>
            <button
              onClick={() => switchCompany('codelekho')}
              className="atmo-btn-secondary"
            >
              <span>Open CRM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Arshith Infotech Subsidiary Card */}
        <div className="atmo-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDE4EC] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-24 h-11 rounded-xl bg-white border border-[#DDE4EC] flex items-center justify-center p-1.5 shadow-2xs overflow-hidden">
                  <img src="/logos/arshith-infotech-logo.jpg" alt="Arshith Infotech" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#253142]">Arshith Infotech</h3>
                  <span className="text-[10px] text-[#7C8998] font-mono">Internal Portfolio</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono bg-amber-50 text-amber-800 border border-amber-200">
                Pending Integration
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-[#E2E8F0]/60 rounded-2xl shadow-atmo-well">
                  <div className="text-[10px] text-[#7C8998] font-mono">Total Projects</div>
                  <div className="text-base font-extrabold text-[#253142] font-mono mt-0.5">
                    {infotech.metrics?.totalProjects || 0}
                  </div>
                </div>
                <div className="p-3 bg-[#E2E8F0]/60 rounded-2xl shadow-atmo-well">
                  <div className="text-[10px] text-[#7C8998] font-mono">Active Clients</div>
                  <div className="text-base font-extrabold text-[#253142] font-mono mt-0.5">
                    {infotech.metrics?.totalClients || 0}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-[#7C8998] pt-1">
                <div className="flex justify-between py-1 border-b border-[#DDE4EC]/60">
                  <span>Active Projects:</span>
                  <strong className="text-blue-700 font-bold">{infotech.metrics?.activeProjects || 0}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#DDE4EC]/60">
                  <span>Delivered Sign-offs:</span>
                  <strong className="text-emerald-700 font-bold">{infotech.metrics?.completedProjects || 0}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#DDE4EC]/60">
                  <span>Proposed Pipeline (₹):</span>
                  <strong className="text-[#253142] font-bold font-mono">
                    ₹{Number(infotech.metrics?.portfolioProposedBudget || 0).toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Received Revenue (₹):</span>
                  <strong className="text-[#253142] font-bold font-mono">
                    ₹{Number(infotech.metrics?.portfolioReceivedRevenue || 0).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#DDE4EC] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#253142]">Infotech Core</div>
              <div className="text-[10px] text-[#7C8998]">IT services & OS</div>
            </div>
            <button
              onClick={() => switchCompany('arshith')}
              className="atmo-btn-secondary"
            >
              <span>View Projects</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Performance Trend Chart (Atmosphere Chart Aesthetics) */}
      <div className="atmo-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#253142] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Multi-Subsidiary Performance & Revenue Trend (INR ₹)</span>
            </h3>
            <p className="text-xs text-[#7C8998]">
              Aggregated from verified synchronized orders and customer payments
            </p>
          </div>
        </div>

        {trends.length === 0 ? (
          <div className="p-8 text-center text-[#7C8998] text-xs">
            <Clock className="w-6 h-6 text-[#A0ACBA] mx-auto mb-1" />
            <div className="font-semibold text-[#253142]">No trend data available for selected period</div>
          </div>
        ) : (
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDE4EC" />
                <XAxis dataKey="month" stroke="#7C8998" fontSize={11} />
                <YAxis stroke="#7C8998" fontSize={11} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#253142', color: '#fff', borderRadius: '16px', border: 'none', fontSize: '11px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                />
                <Area
                  type="monotone"
                  dataKey="freshRevenue"
                  name="ArshithFresh Revenue"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorBlue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Sync Activity Timeline */}
      <div className="atmo-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#253142] flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Real-Time Integration Sync Timeline</span>
            </h3>
            <p className="text-xs text-[#7C8998]">
              Audit log of latest synchronization jobs from ArshithFresh and CodeLekho
            </p>
          </div>
          {onNavigateToIntegrations && (
            <button
              onClick={onNavigateToIntegrations}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              <span>Manage Connectors</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {analytics?.recentSyncActivity?.length === 0 ? (
          <div className="p-6 text-center text-[#7C8998] text-xs">
            No synchronization activity recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-[#DDE4EC]">
            {analytics.recentSyncActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      act.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  ></span>
                  <div>
                    <span className="font-bold text-[#253142] capitalize font-mono">
                      {act.sourceSystem} Sync
                    </span>
                    <span className="text-[#A0ACBA] text-[10px] ml-2 font-mono">{act.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[#7C8998] font-mono text-[11px]">
                  <span>
                    +{act.created} created, {act.updated} updated, {act.skipped} skipped
                  </span>
                  <span className="text-[#A0ACBA]">
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
