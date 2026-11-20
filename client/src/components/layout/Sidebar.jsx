import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderGit2,
  Workflow,
  Users,
  Users2,
  UserCheck,
  CheckSquare,
  Milestone,
  IndianRupee,
  PauseCircle,
  Calendar,
  FileText,
  BarChart3,
  Bell,
  ShieldCheck,
  Settings,
  History,
  Layers,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Building2,
  Network,
  GraduationCap,
  Leaf,
} from 'lucide-react';

export const navSections = [
  {
    title: 'Core Portfolio',
    items: [
      { id: 'central-dashboard', label: 'Central Business Hub', icon: Building2, badge: 'Unified', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
      { id: 'finances', label: 'Finance & Accounts', icon: IndianRupee, badge: 'Dropdown', isDropdown: true, badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
      { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
      { id: 'projects', label: 'Projects Inventory', icon: FolderGit2, badge: 'Main', badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
      { id: 'pipeline', label: 'Portfolio Pipeline', icon: Workflow },
      { id: 'calendar', label: 'Timelines & Deadlines', icon: Calendar },
    ],
  },
  {
    title: 'Operations & Execution',
    items: [
      { id: 'hr-workforce', label: 'HR & Workforce', icon: Users, badge: 'Connect', isDropdown: true, isHrDropdown: true, badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
      { id: 'teams', label: 'Project Teams', icon: Users2 },
      { id: 'employees', label: 'Employee Directory', icon: UserCheck },
      { id: 'tasks', label: 'Tasks & Sprints', icon: CheckSquare },
      { id: 'milestones', label: 'Project Milestones', icon: Milestone },
      { id: 'documents', label: 'Artifacts & Documents', icon: FileText },
    ],
  },
  {
    title: 'Finance & Governance',
    items: [
      { id: 'on-hold', label: 'On-Hold Projects', icon: PauseCircle, badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
      { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: '16', badgeColor: 'bg-sky-500/20 text-sky-300 border border-sky-500/30' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { id: 'integrations', label: 'Integrations & Sync', icon: Network, badge: '3 Hubs', badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
      { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
      { id: 'users', label: 'Access Control', icon: ShieldCheck },
      { id: 'audit-logs', label: 'Audit Trail', icon: History },
      { id: 'settings', label: 'Platform Settings', icon: Settings },
    ],
  },
];

const FINANCE_PROJECT_OPTIONS = [
  { coId: '2', label: 'Infotech Finance', icon: Building2, color: 'text-blue-400', badge: 'AIT' },
  { coId: '1', label: 'ArshithFresh Finance', icon: Leaf, color: 'text-green-400', badge: 'AFR' },
  { coId: '3', label: 'CodeLekho Finance', icon: GraduationCap, color: 'text-purple-400', badge: 'CLK' },
  { coId: 'all', label: 'All Companies (Consolidated)', icon: Layers, color: 'text-emerald-400', badge: 'ALL' },
];

const HR_PROJECT_OPTIONS = [
  { coId: 'ARSHITH_INFOTECH', label: 'Infotech HR & Staff', icon: Building2, color: 'text-blue-400', badge: 'AIT' },
  { coId: 'CODELEKHO', label: 'CodeLekho HR', icon: GraduationCap, color: 'text-purple-400', badge: 'CLK' },
  { coId: 'ALL', label: 'All Companies HRMS', icon: Layers, color: 'text-indigo-400', badge: 'ALL' },
];

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { switchCompany } = useAuth();
  const [financeMenuOpen, setFinanceMenuOpen] = useState(true);
  const [hrMenuOpen, setHrMenuOpen] = useState(true);

  const handleSelectFinanceProject = (coId) => {
    try {
      localStorage.setItem('erp.company', coId);
      window.dispatchEvent(new CustomEvent('finance-company-change', { detail: coId }));
    } catch {}
    setActiveTab('finances');
  };

  const handleSelectHrProject = (coId) => {
    try {
      localStorage.setItem('hrms.company', coId);
      window.dispatchEvent(new CustomEvent('hrms-company-change', { detail: coId }));
    } catch {}
    setActiveTab('hr-workforce');
  };

  return (
    <aside className="w-64 bg-[#101827] text-slate-300 flex flex-col flex-shrink-0 border-r border-[#1E293B] select-none shadow-2xl z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-[#1E293B] bg-[#0B0F19]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md p-1 border border-slate-700/60 overflow-hidden flex-shrink-0">
            <img src="/logos/arshith-infotech-logo.jpg" alt="Arshith InfoTech" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-extrabold text-[13px] tracking-wider text-white uppercase font-sans flex items-center gap-1.5">
              <span>Arshith</span>
              <span className="text-sky-400 font-semibold">Infotech</span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
              Project Portfolio OS
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              // Expandable Finance Dropdown in Sidebar
              if (item.isDropdown && item.id === 'finances') {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => {
                        setFinanceMenuOpen(!financeMenuOpen);
                        setActiveTab('finances');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group relative cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600/20 text-white font-semibold border-l-4 border-emerald-500 shadow-xs'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Dropdown
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${financeMenuOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Finance Sub-Items Dropdown */}
                    {financeMenuOpen && (
                      <div className="pl-6 pr-1 py-1 space-y-1 bg-slate-900/60 rounded-xl border border-slate-800">
                        {FINANCE_PROJECT_OPTIONS.map((fOpt) => {
                          const FIcon = fOpt.icon;
                          const isCurrentCo = localStorage.getItem('erp.company') === fOpt.coId;
                          return (
                            <button
                              key={fOpt.coId}
                              onClick={() => handleSelectFinanceProject(fOpt.coId)}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-all cursor-pointer ${
                                isActive && isCurrentCo
                                  ? 'bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/30'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <FIcon className={`w-3.5 h-3.5 ${fOpt.color}`} />
                                <span className="truncate">{fOpt.label}</span>
                              </div>
                              <span className="text-[9px] font-mono font-bold text-slate-500">
                                {fOpt.badge}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Expandable HR Dropdown in Sidebar
              if (item.isDropdown && item.isHrDropdown) {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => {
                        setHrMenuOpen(!hrMenuOpen);
                        setActiveTab('hr-workforce');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group relative cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600/20 text-white font-semibold border-l-4 border-indigo-500 shadow-xs'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Dropdown
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${hrMenuOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* HR Sub-Items Dropdown */}
                    {hrMenuOpen && (
                      <div className="pl-6 pr-1 py-1 space-y-1 bg-slate-900/60 rounded-xl border border-slate-800">
                        {HR_PROJECT_OPTIONS.map((hOpt) => {
                          const HIcon = hOpt.icon;
                          const isCurrentCo = localStorage.getItem('hrms.company') === hOpt.coId;
                          return (
                            <button
                              key={hOpt.coId}
                              onClick={() => handleSelectHrProject(hOpt.coId)}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-all cursor-pointer ${
                                isActive && isCurrentCo
                                  ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/30'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <HIcon className={`w-3.5 h-3.5 ${hOpt.color}`} />
                                <span className="truncate">{hOpt.label}</span>
                              </div>
                              <span className="text-[9px] font-mono font-bold text-slate-500">
                                {hOpt.badge}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group relative cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-white font-semibold border-l-4 border-blue-500 shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                        item.badgeColor || (isActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-[#1E293B] bg-[#0B0F19]/60 text-[11px]">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 text-[10px]">Multi-Project Finance Active</span>
          </span>
          <span className="font-mono text-slate-400 text-[10px]">v2.4.0</span>
        </div>
        <div className="text-slate-400 text-[10px] truncate font-mono">
          Infotech • Fresh • CodeLekho • 2026
        </div>
      </div>
    </aside>
  );
};
