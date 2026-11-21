import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Sparkles,
  FileSearch,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
  PlayCircle,
  PauseCircle,
  FlaskConical,
  Trophy,
  Truck,
  Ban,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  CreditCard,
  Wallet,
  Clock,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Layers,
  Users,
  Compass,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { api } from '../services/api';

const formatINR = (val) => {
  const num = Number(val) || 0;
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

// Semantic status colors using Atmosphere palette
const STATUS_CONFIG = {
  NEW: { label: 'New', color: '#2563EB', bg: 'bg-blue-50', text: 'text-[#2563EB]', border: 'border-blue-200', dot: 'bg-[#2563EB]' },
  UNDER_REVIEW: { label: 'Under Review', color: '#6366F1', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  ACCEPTED: { label: 'Accepted', color: '#0EA5E9', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-600' },
  APPROVED: { label: 'Approved', color: '#0284C7', bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-300', dot: 'bg-sky-700' },
  ASSIGNED: { label: 'Assigned', color: '#7C8998', bg: 'bg-slate-100', text: 'text-[#253142]', border: 'border-slate-300', dot: 'bg-[#7C8998]' },
  IN_PROGRESS: { label: 'In Progress', color: '#2563EB', bg: 'bg-blue-50', text: 'text-[#2563EB]', border: 'border-orange-300', dot: 'bg-[#2563EB]' },
  TESTING: { label: 'Testing', color: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  ON_HOLD: { label: 'On Hold', color: '#D97706', bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-300', dot: 'bg-amber-600' },
  COMPLETED: { label: 'Completed', color: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-600' },
  DELIVERED: { label: 'Delivered', color: '#059669', bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300', dot: 'bg-emerald-700' },
  CANCELLED: { label: 'Cancelled', color: '#A0ACBA', bg: 'bg-slate-100', text: 'text-[#7C8998]', border: 'border-slate-300', dot: 'bg-[#A0ACBA]' },
  REJECTED: { label: 'Rejected', color: '#EF4444', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-600' },
};

// Atmosphere Floating Tooltip
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#253142] text-white p-3 rounded-2xl shadow-atmo-card-lg border border-[#3A495E] text-xs">
        {label && <div className="font-bold text-slate-200 mb-1.5 pb-1 border-b border-slate-600 font-mono">{label}</div>}
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
              <span>{entry.name}:</span>
            </div>
            <span className="font-mono font-bold text-[#2563EB]">
              {typeof entry.value === 'number' && entry.name && (entry.name.includes('Budget') || entry.name.includes('Spend'))
                ? formatINR(entry.value)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const DashboardPage = ({ onNavigateToProjectsWithFilter, onOpenNewProjectModal }) => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'ALL') queryParams.append('category', selectedCategory);
      const res = await api.getDashboardStats(queryParams.toString());
      if (res.success) {
        setStatsData(res);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedCategory]);

  const stats = statsData?.stats || {};
  const financials = statsData?.financials || {};
  const charts = statsData?.charts || {};

  // Lifecycle Primary Pipeline Stages (1 to 9)
  const pipelineStages = [
    { id: 'NEW', label: '1. New Intake', count: stats.newProjects || 0, icon: Sparkles, color: 'text-[#2563EB] bg-blue-50 border-blue-200' },
    { id: 'UNDER_REVIEW', label: '2. Under Review', count: stats.underReview || 0, icon: FileSearch, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'ACCEPTED', label: '3. Accepted', count: stats.accepted || 0, icon: CheckCircle2, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { id: 'APPROVED', label: '4. Approved', count: stats.approved || 0, icon: ShieldCheck, color: 'text-sky-700 bg-sky-50 border-sky-300' },
    { id: 'ASSIGNED', label: '5. Assigned', count: stats.assigned || 0, icon: UserCheck, color: 'text-[#253142] bg-slate-100 border-slate-300' },
    { id: 'IN_PROGRESS', label: '6. In Progress', count: stats.inProgress || 0, icon: PlayCircle, color: 'text-[#2563EB] bg-orange-100 border-orange-300' },
    { id: 'TESTING', label: '7. Testing & QA', count: stats.testing || 0, icon: FlaskConical, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { id: 'COMPLETED', label: '8. Completed', count: stats.completed || 0, icon: Trophy, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { id: 'DELIVERED', label: '9. Delivered', count: stats.delivered || 0, icon: Truck, color: 'text-emerald-800 bg-emerald-100 border-emerald-300' },
  ];

  // Secondary Governance & Exception States
  const governanceCards = [
    { id: 'ALL', label: 'Total Portfolio', count: stats.totalProjects || 0, icon: FolderGit2, tag: 'All Registered', badgeColor: 'bg-[#253142] text-white' },
    { id: 'UNASSIGNED', label: 'Unassigned', count: stats.unassigned || 0, icon: UserX, tag: 'Resource Gap', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300' },
    { id: 'ON_HOLD', label: 'On Hold', count: stats.onHold || 0, icon: PauseCircle, tag: 'Paused', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300' },
    { id: 'OVERDUE', label: 'Overdue SLA', count: stats.overdue || 0, icon: AlertTriangle, tag: 'Escalation', badgeColor: 'bg-rose-100 text-rose-900 border border-rose-300' },
    { id: 'CANCELLED', label: 'Cancelled', count: stats.cancelled || 0, icon: Ban, tag: 'Terminated', badgeColor: 'bg-slate-100 text-[#7C8998] border border-slate-300' },
    { id: 'REJECTED', label: 'Rejected', count: stats.rejected || 0, icon: XCircle, tag: 'Declined', badgeColor: 'bg-rose-50 text-rose-800 border border-rose-200' },
  ];

  const budgetBurnPercent = financials.totalApprovedBudget > 0
    ? Math.min(100, Math.round((financials.totalActualExpenditure / financials.totalApprovedBudget) * 100))
    : 0;

  return (
    <div className="p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-7 max-w-[1600px] mx-auto text-[#253142] font-sans max-w-full overflow-x-hidden animate-in fade-in duration-200">
      
      {/* 1. ATMOSPHERE EXECUTIVE COMMAND BANNER */}
      <div className="atmo-card p-4 sm:p-6 md:p-8 border border-[#DDE4EC] shadow-atmo-card flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#2563EB] border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
              Arshith Infotech • Portfolio OS
            </span>
            <span className="text-xs text-[#7C8998] font-mono">Fiscal Year 2026-27</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#253142] font-sans">
            Executive Project Portfolio Command Center
          </h1>
          <p className="text-xs md:text-sm text-[#7C8998] max-w-2xl leading-relaxed">
            Unified governance, real-time lifecycle tracking, financial burn surveillance, and commercial delivery monitoring.
          </p>
        </div>

        {/* Quick Category & Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 z-10 w-full lg:w-auto">
          <div className="atmo-well px-3 py-2 text-xs flex items-center gap-2 rounded-2xl flex-1 lg:flex-initial">
            <Filter className="w-4 h-4 text-[#2563EB] shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-[#253142] font-semibold cursor-pointer"
            >
              <option value="ALL">All Categories ({stats.totalProjects || 15})</option>
              <option value="Enterprise Web Application">Enterprise Web Application</option>
              <option value="FinTech & Banking Solutions">FinTech & Banking Solutions</option>
              <option value="Healthcare & Telemedicine">Healthcare & Telemedicine</option>
              <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
              <option value="AI & Machine Learning Solutions">AI & Machine Learning</option>
              <option value="Smart City & Public Infrastructure">Smart City & Public Infrastructure</option>
            </select>
          </div>

          <button
            onClick={fetchStats}
            className="atmo-btn-icon shrink-0"
            title="Refresh Portfolio State"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#2563EB]' : ''}`} />
          </button>

          <button
            onClick={onOpenNewProjectModal}
            className="atmo-btn-primary shrink-0"
          >
            <span>+ New project</span>
          </button>
        </div>
      </div>

      {/* 2. TOP 4 HERO SPOTLIGHT METRICS (ATMOSPHERE NEUMORPHIC CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Spotlight 1: Portfolio Value & Burn Rate */}
        <div className="atmo-card p-6 space-y-3">
          <div className="flex items-center justify-between text-[#7C8998]">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
              Approved Contracts Value
            </span>
            <div className="w-8 h-8 rounded-2xl bg-white border border-[#DDE4EC] flex items-center justify-center text-[#2563EB] shadow-2xs">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#253142] font-mono tracking-tight">
            {formatINR(financials.totalApprovedBudget)}
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#7C8998]">
              <span>Actual Burn: {formatINR(financials.totalActualExpenditure)}</span>
              <span className="font-mono font-bold text-[#2563EB]">{budgetBurnPercent}% Spent</span>
            </div>
            <div className="w-full bg-[#E2E8F0] rounded-full h-2 overflow-hidden shadow-atmo-well">
              <div
                className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                style={{ width: `${budgetBurnPercent}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#A0ACBA] font-medium">
              Available Runway: {formatINR(financials.remainingBudget)}
            </div>
          </div>
        </div>

        {/* Spotlight 2: Active Inventory Volume */}
        <div className="atmo-card p-6 space-y-3">
          <div className="flex items-center justify-between text-[#7C8998]">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
              Total Managed Projects
            </span>
            <div className="w-8 h-8 rounded-2xl bg-white border border-[#DDE4EC] flex items-center justify-center text-sky-600 shadow-2xs">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#253142] font-mono tracking-tight">
            {stats.totalProjects || 0} Projects
          </div>
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 text-[10px] font-bold">
              {stats.inProgress || 0} In Progress
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
              {stats.onHold || 0} On Hold
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
              {stats.delivered || 0} Delivered
            </span>
          </div>
          <div className="text-[10px] text-[#A0ACBA] font-medium">
            Central repository for intake, execution & client handover
          </div>
        </div>

        {/* Spotlight 3: Revenue Realization & Invoicing */}
        <div className="atmo-card p-6 space-y-3">
          <div className="flex items-center justify-between text-[#7C8998]">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
              Total Realized Inflow
            </span>
            <div className="w-8 h-8 rounded-2xl bg-white border border-[#DDE4EC] flex items-center justify-center text-emerald-600 shadow-2xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#253142] font-mono tracking-tight">
            {formatINR(financials.totalProjectRevenue)}
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-[#7C8998] pt-1">
            <span>Pending Receivables</span>
            <span className="font-mono font-bold text-amber-700">{formatINR(financials.pendingPayments)}</span>
          </div>
          <div className="text-[10px] text-[#A0ACBA] font-medium">
            Client billing, invoice settlements, & advance deposits
          </div>
        </div>

        {/* Spotlight 4: Gross Project Margin */}
        <div className="atmo-card p-6 space-y-3">
          <div className="flex items-center justify-between text-[#7C8998]">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
              Gross Project Profit
            </span>
            <div className="w-8 h-8 rounded-2xl bg-white border border-[#DDE4EC] flex items-center justify-center text-[#2563EB] shadow-2xs">
              <Trophy className="w-4 h-4 text-[#2563EB]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#253142] font-mono tracking-tight">
            {formatINR(financials.totalProjectProfit)}
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 text-[10px] font-semibold">
            <Sparkles className="w-3 h-3 text-[#2563EB]" />
            <span>High Profit Margin Portfolio</span>
          </div>
          <div className="text-[10px] text-[#A0ACBA] font-medium">
            Revenue surplus over operational development costs
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE LIFECYCLE PIPELINE TRACK */}
      <div className="atmo-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DDE4EC]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#253142] font-mono flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#2563EB]" /> Project Lifecycle Flow & Status Directory
              </h2>
              <span className="text-[10px] font-bold bg-[#E2E8F0] text-[#7C8998] px-2 py-0.5 rounded-full border border-[#DDE4EC]">
                Click any stage to filter projects
              </span>
            </div>
            <p className="text-xs text-[#7C8998] mt-0.5">
              Chronological workflow progression from project proposal reception to client warranty and release.
            </p>
          </div>
          <button
            onClick={() => onNavigateToProjectsWithFilter('ALL')}
            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1"
          >
            <span>View Full Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Primary Delivery Stages Ribbon (1 to 9) */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#7C8998] font-mono mb-2.5 flex items-center gap-1.5">
            <span>Primary Delivery Pipeline (In Order of Execution)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
            {pipelineStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <button
                  key={stage.id}
                  onClick={() => onNavigateToProjectsWithFilter(stage.id)}
                  className="text-left p-3 rounded-2xl border border-[#DDE4EC] bg-white hover:border-[#2563EB] shadow-atmo-card-sm hover:shadow-atmo-card-hover transition-all group cursor-pointer flex flex-col justify-between min-h-[96px]"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`p-1.5 rounded-xl border ${stage.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-[#A0ACBA] group-hover:text-[#2563EB] transition-colors" />
                  </div>
                  <div className="mt-2">
                    <div className="text-xl font-extrabold text-[#253142] font-mono leading-none">
                      {stage.count}
                    </div>
                    <div className="text-[11px] font-semibold text-[#7C8998] truncate mt-1">
                      {stage.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Governance, Exceptions & Special Status Cards */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#7C8998] font-mono mb-2.5 flex items-center gap-1.5">
            <span>Governance, Operational Exceptions & Review Categories</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {governanceCards.map((gov) => {
              const isOverdueAlert = gov.id === 'OVERDUE' && gov.count > 0;
              return (
                <button
                  key={gov.id}
                  onClick={() => onNavigateToProjectsWithFilter(gov.id)}
                  className={`text-left p-3 rounded-2xl border transition-all group cursor-pointer flex flex-col justify-between min-h-[92px] ${
                    isOverdueAlert
                      ? 'border-rose-300 bg-rose-50/60 shadow-atmo-card-sm ring-1 ring-rose-400'
                      : 'border-[#DDE4EC] bg-white hover:border-[#2563EB] shadow-atmo-card-sm hover:shadow-atmo-card-hover'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${gov.badgeColor}`}>
                      {gov.tag}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-[#A0ACBA] group-hover:text-[#253142] transition-colors" />
                  </div>
                  <div className="mt-2">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-xl font-extrabold font-mono leading-none ${isOverdueAlert ? 'text-rose-700' : 'text-[#253142]'}`}>
                        {gov.count}
                      </span>
                      <span className="text-[11px] font-semibold text-[#7C8998] truncate">
                        {gov.label}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. FINANCIAL LEDGER DASHBOARD (ALL 7 IN INR ₹) */}
      <div className="atmo-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4EC]">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#253142] font-mono flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#2563EB]" /> Commercial Governance & Ledger Balances
            </h2>
            <p className="text-xs text-[#7C8998] mt-0.5">
              Audited project capital allocation, expenditure tracking, receivables and gross operating margin in INR (₹).
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Audited Balance Sheet
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          <div className="p-4 rounded-2xl border border-[#DDE4EC] bg-white shadow-2xs">
            <div className="text-[10px] font-bold text-[#7C8998] uppercase tracking-wider">Proposed Budget</div>
            <div className="text-lg font-black text-[#253142] mt-1.5 font-mono">{formatINR(financials.totalProposedBudget)}</div>
            <div className="text-[10px] text-[#A0ACBA] mt-1">Pre-sanction estimate</div>
          </div>

          <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 shadow-2xs">
            <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Approved Budget</div>
            <div className="text-lg font-black text-[#253142] mt-1.5 font-mono">{formatINR(financials.totalApprovedBudget)}</div>
            <div className="text-[10px] text-[#7C8998] font-medium mt-1">Client signed contracts</div>
          </div>

          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 shadow-2xs">
            <div className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Actual Expenditure</div>
            <div className="text-lg font-black text-rose-950 mt-1.5 font-mono">{formatINR(financials.totalActualExpenditure)}</div>
            <div className="text-[10px] text-rose-600 font-medium mt-1">Operational spend</div>
          </div>

          <div className="p-4 rounded-2xl border border-[#DDE4EC] bg-white shadow-2xs">
            <div className="text-[10px] font-bold text-[#7C8998] uppercase tracking-wider">Remaining Budget</div>
            <div className="text-lg font-black text-[#253142] mt-1.5 font-mono">{formatINR(financials.remainingBudget)}</div>
            <div className="text-[10px] text-[#A0ACBA] font-medium mt-1">Available runway</div>
          </div>

          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-2xs">
            <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Pending Receivables</div>
            <div className="text-lg font-black text-amber-950 mt-1.5 font-mono">{formatINR(financials.pendingPayments)}</div>
            <div className="text-[10px] text-amber-700 font-medium mt-1">Unbilled / unpaid dues</div>
          </div>

          <div className="p-4 rounded-2xl border border-[#DDE4EC] bg-white shadow-2xs">
            <div className="text-[10px] font-bold text-[#7C8998] uppercase tracking-wider">Total Received</div>
            <div className="text-lg font-black text-[#253142] mt-1.5 font-mono">{formatINR(financials.totalProjectRevenue)}</div>
            <div className="text-[10px] text-[#A0ACBA] font-medium mt-1">Cleared client payments</div>
          </div>

          <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/60 shadow-2xs">
            <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Total Profit Margin</div>
            <div className="text-lg font-black text-[#253142] mt-1.5 font-mono">{formatINR(financials.totalProjectProfit)}</div>
            <div className="text-[10px] text-[#7C8998] font-medium mt-1">Gross surplus</div>
          </div>
        </div>
      </div>

      {/* 5. ANALYTICAL CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Project Distribution by Status */}
        <div className="atmo-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE4EC]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#253142] font-mono">
                Project Distribution Across Stages
              </h3>
              <p className="text-[11px] text-[#7C8998]">Current portfolio breakdown across lifecycle workflow</p>
            </div>
            <span className="text-[10px] font-bold text-[#7C8998] bg-[#E2E8F0] px-2.5 py-1 rounded-full border border-[#DDE4EC]">Donut View</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            {charts.statusDistribution && charts.statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.statusDistribution}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={88}
                    innerRadius={52}
                    paddingAngle={3}
                  >
                    {charts.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_CONFIG[entry.status]?.color || '#2563EB'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-[#7C8998]">No status data recorded</div>
            )}
          </div>
        </div>

        {/* Chart 2: Monthly Projects Received vs Completed */}
        <div className="atmo-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE4EC]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#253142] font-mono">
                Monthly Intake vs Delivery Velocity (2026)
              </h3>
              <p className="text-[11px] text-[#7C8998]">Trend of new contracts received vs completed deliverables</p>
            </div>
            <span className="text-[10px] font-bold text-[#7C8998] bg-[#E2E8F0] px-2.5 py-1 rounded-full border border-[#DDE4EC]">Dual Bar</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.monthlyReceived?.map((item, idx) => ({
                  month: item.month,
                  Received: item.count,
                  Completed: charts.monthlyCompleted?.[idx]?.count || 0,
                })) || []}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DDE4EC" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7C8998' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#7C8998' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Received" name="New Projects Received" fill="#253142" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Completed" name="Projects Completed" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Project Budget vs Actual Expenditure */}
        <div className="atmo-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE4EC]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#253142] font-mono">
                Approved Budget vs Actual Expenditure
              </h3>
              <p className="text-[11px] text-[#7C8998]">Financial variance comparison for top enterprise contracts</p>
            </div>
            <span className="text-[10px] font-bold text-[#7C8998] bg-[#E2E8F0] px-2.5 py-1 rounded-full border border-[#DDE4EC]">Variance</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.budgetVsActual || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#DDE4EC" />
                <XAxis type="number" tickFormatter={(v) => formatINR(v)} tick={{ fontSize: 10, fill: '#7C8998' }} />
                <YAxis dataKey="id" type="category" tick={{ fontSize: 10, fill: '#7C8998' }} width={80} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="approvedBudget" name="Approved Budget" fill="#2563EB" radius={[0, 4, 4, 0]} />
                <Bar dataKey="actualExpenditure" name="Actual Spend" fill="#F59E0B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Project Completion Trends (Atmosphere Orange Area Chart) */}
        <div className="atmo-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE4EC]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#253142] font-mono">
                Project Completion Progress Curve
              </h3>
              <p className="text-[11px] text-[#7C8998]">Distribution of projects across progress completion stages</p>
            </div>
            <span className="text-[10px] font-bold text-[#7C8998] bg-[#E2E8F0] px-2.5 py-1 rounded-full border border-[#DDE4EC]">Curve</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.completionTrends || []}>
                <defs>
                  <linearGradient id="colorCountOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DDE4EC" />
                <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: '#7C8998' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#7C8998' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="count" name="Projects" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCountOrange)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
