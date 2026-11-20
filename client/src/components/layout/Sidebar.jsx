import React, { useState, useRef, useEffect } from 'react';
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
  Home,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export const navSections = [
  {
    title: 'Core Portfolio',
    id: 'portfolio',
    icon: Home,
    items: [
      { id: 'central-dashboard', label: 'Central Business Hub', icon: Building2, badge: 'Unified', badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200' },
      { id: 'finances', label: 'Finance & Accounts', icon: IndianRupee, badge: 'Dropdown', isDropdown: true, badgeColor: 'bg-blue-50 text-blue-600 border border-blue-200' },
      { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
      { id: 'projects', label: 'Projects Inventory', icon: FolderGit2, badge: 'Main', badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200' },
      { id: 'pipeline', label: 'Portfolio Pipeline', icon: Workflow },
      { id: 'calendar', label: 'Timelines & Deadlines', icon: Calendar },
    ],
  },
  {
    title: 'Operations & Execution',
    id: 'operations',
    icon: Users,
    items: [
      { id: 'hr-workforce', label: 'HR & Workforce', icon: Users, badge: 'HRMS', isDropdown: true, isHrDropdown: true, badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
      { id: 'teams', label: 'Project Teams', icon: Users2 },
      { id: 'employees', label: 'Employee Directory', icon: UserCheck },
      { id: 'tasks', label: 'Tasks & Sprints', icon: CheckSquare },
      { id: 'milestones', label: 'Project Milestones', icon: Milestone },
      { id: 'documents', label: 'Artifacts & Documents', icon: FileText },
    ],
  },
  {
    title: 'Finance & Governance',
    id: 'governance',
    icon: BarChart3,
    items: [
      { id: 'on-hold', label: 'On-Hold Projects', icon: PauseCircle, badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200' },
      { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: '16', badgeColor: 'bg-sky-50 text-sky-700 border border-sky-200' },
    ],
  },
  {
    title: 'Administration',
    id: 'admin',
    icon: Settings,
    items: [
      { id: 'integrations', label: 'Integrations & Sync', icon: Network, badge: '3 Hubs', badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
      { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
      { id: 'users', label: 'Access Control', icon: ShieldCheck },
      { id: 'audit-logs', label: 'Audit Trail', icon: History },
      { id: 'settings', label: 'Platform Settings', icon: Settings },
    ],
  },
];

const FINANCE_PROJECT_OPTIONS = [
  { coId: '2', label: 'Infotech Finance', icon: Building2, color: 'text-blue-600', badge: 'AIT' },
  { coId: '1', label: 'ArshithFresh Finance', icon: Leaf, color: 'text-blue-600', badge: 'AFR' },
  { coId: '3', label: 'CodeLekho Finance', icon: GraduationCap, color: 'text-purple-600', badge: 'CLK' },
  { coId: 'all', label: 'All Companies (Consolidated)', icon: Layers, color: 'text-blue-600', badge: 'ALL' },
];

const HR_PROJECT_OPTIONS = [
  { coId: 'ARSHITH_INFOTECH', label: 'Infotech HR & Staff', icon: Building2, color: 'text-blue-600', badge: 'AIT' },
  { coId: 'CODELEKHO', label: 'CodeLekho HR', icon: GraduationCap, color: 'text-purple-600', badge: 'CLK' },
  { coId: 'ALL', label: 'All Companies HRMS', icon: Layers, color: 'text-indigo-600', badge: 'ALL' },
];

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, switchCompany } = useAuth();
  const [financeMenuOpen, setFinanceMenuOpen] = useState(true);
  const [hrMenuOpen, setHrMenuOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeFlyout, setActiveFlyout] = useState(null);
  const flyoutRef = useRef(null);

  const handleSelectFinanceProject = (coId) => {
    try {
      localStorage.setItem('erp.company', coId);
      window.dispatchEvent(new CustomEvent('finance-company-change', { detail: coId }));
    } catch {}
    setActiveTab('finances');
    setActiveFlyout(null);
  };

  const handleSelectHrProject = (coId) => {
    try {
      localStorage.setItem('hrms.company', coId);
      window.dispatchEvent(new CustomEvent('hrms-company-change', { detail: coId }));
    } catch {}
    setActiveTab('hr-workforce');
    setActiveFlyout(null);
  };

  // Close flyout on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target)) {
        setActiveFlyout(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine which section the activeTab belongs to
  const currentSection = navSections.find((s) => s.items.some((it) => it.id === activeTab)) || navSections[0];

  return (
    <aside
      className={`h-screen flex flex-col flex-shrink-0 z-30 transition-all duration-300 select-none bg-[#101827] text-slate-300 border-r border-[#1E293B] shadow-2xl ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Top Header / Brand Header matching Arshith Fresh style */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-[#1E293B] bg-[#0B0F19]/90 backdrop-blur-md">
        {isExpanded ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setActiveTab('central-dashboard')}
              className="w-12 h-9 rounded-xl bg-white flex items-center justify-center p-0.5 border border-slate-700/60 overflow-hidden shadow-md flex-shrink-0 cursor-pointer group"
              title="Return to Central Dashboard"
            >
              <img
                src="/logos/arshith-infotech-logo.jpg"
                alt="Arshith Infotech"
                className="w-full h-full object-contain transition-transform group-hover:scale-105"
              />
            </button>
            <div className="min-w-0">
              <div className="font-extrabold text-[13px] tracking-wider text-white uppercase font-sans flex items-center gap-1.5 truncate">
                <span>Arshith</span>
                <span className="text-blue-400 font-semibold">Infotech</span>
              </div>
              <div className="text-[9px] text-slate-400 font-mono tracking-widest uppercase truncate">
                Project Inventory OS
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto">
            <button
              onClick={() => setActiveTab('central-dashboard')}
              className="w-10 h-8 rounded-xl bg-white flex items-center justify-center p-0.5 border border-slate-700/60 overflow-hidden shadow-md cursor-pointer group"
              title="Arshith Infotech"
            >
              <img
                src="/logos/arshith-infotech-logo.jpg"
                alt="Arshith Infotech"
                className="w-full h-full object-contain transition-transform group-hover:scale-105"
              />
            </button>
          </div>
        )}

        {/* Dock Expand / Collapse Button */}
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {navSections.map((section) => {
          const SectionIcon = section.icon;
          const isSectionActive = section.items.some((it) => it.id === activeTab);

          if (!isExpanded) {
            // Collapsed Dock Icon Button
            return (
              <div key={section.id} className="relative flex flex-col items-center">
                <button
                  onClick={() => {
                    if (activeFlyout === section.id) {
                      setActiveFlyout(null);
                    } else {
                      setActiveFlyout(section.id);
                    }
                  }}
                  className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
                    isSectionActive
                      ? 'bg-blue-600/20 text-white border border-blue-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title={section.title}
                >
                  <SectionIcon className={`w-5 h-5 ${isSectionActive ? 'text-blue-400' : ''}`} />
                  {isSectionActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 absolute bottom-1"></span>
                  )}
                </button>

                {/* Floating Flyout Card */}
                {activeFlyout === section.id && (
                  <div
                    ref={flyoutRef}
                    className="absolute left-14 top-0 w-64 bg-[#101827] rounded-2xl border border-[#1E293B] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-left-2 duration-150 text-slate-300"
                  >
                    <div className="px-2.5 py-1.5 mb-2 border-b border-[#1E293B] flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                        {section.title}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setActiveFlyout(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-blue-600/20 text-white border-l-4 border-blue-500 shadow-xs'
                                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
                              <span className="truncate">{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // Expanded Full Sidebar Mode
          return (
            <div key={section.id} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center justify-between">
                <span>{section.title}</span>
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                // Finance Dropdown
                if (item.isDropdown && item.id === 'finances') {
                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        onClick={() => {
                          setFinanceMenuOpen(!financeMenuOpen);
                          setActiveTab('finances');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                          isActive
                            ? 'bg-blue-600/20 text-white border-l-4 border-blue-500 shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Dropdown
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                              financeMenuOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* Nested Finance Sub-Options */}
                      {financeMenuOpen && (
                        <div className="ml-4 pl-3 py-1 space-y-1 border-l border-slate-800">
                          {FINANCE_PROJECT_OPTIONS.map((fOpt) => {
                            const FIcon = fOpt.icon;
                            const isCurrentCo = localStorage.getItem('erp.company') === fOpt.coId;
                            return (
                              <button
                                key={fOpt.coId}
                                onClick={() => handleSelectFinanceProject(fOpt.coId)}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] transition-all cursor-pointer ${
                                  isActive && isCurrentCo
                                    ? 'bg-blue-600/30 text-white font-bold border-l-2 border-blue-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <FIcon className={`w-3.5 h-3.5 ${isActive && isCurrentCo ? 'text-blue-300' : fOpt.color}`} />
                                  <span className="truncate">{fOpt.label}</span>
                                </div>
                                <span className="text-[9px] font-mono font-bold text-slate-400">
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

                // HR Dropdown
                if (item.isDropdown && item.isHrDropdown) {
                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        onClick={() => {
                          setHrMenuOpen(!hrMenuOpen);
                          setActiveTab('hr-workforce');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                          isActive
                            ? 'bg-blue-600/20 text-white border-l-4 border-blue-500 shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            HRMS
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                              hrMenuOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* Nested HR Sub-Options */}
                      {hrMenuOpen && (
                        <div className="ml-4 pl-3 py-1 space-y-1 border-l border-slate-800">
                          {HR_PROJECT_OPTIONS.map((hOpt) => {
                            const HIcon = hOpt.icon;
                            const isCurrentCo = localStorage.getItem('hrms.company') === hOpt.coId;
                            return (
                              <button
                                key={hOpt.coId}
                                onClick={() => handleSelectHrProject(hOpt.coId)}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] transition-all cursor-pointer ${
                                  isActive && isCurrentCo
                                    ? 'bg-indigo-600/30 text-white font-bold border-l-2 border-indigo-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <HIcon className={`w-3.5 h-3.5 ${isActive && isCurrentCo ? 'text-indigo-300' : hOpt.color}`} />
                                  <span className="truncate">{hOpt.label}</span>
                                </div>
                                <span className="text-[9px] font-mono font-bold text-slate-400">
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

                // Normal Menu Item
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/20 text-white font-bold border-l-4 border-blue-500 shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer / User & System Pill */}
      <div className="p-3 border-t border-[#1E293B] bg-[#0B0F19]/80">
        {isExpanded ? (
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center border border-slate-700 shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'FK'}
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs font-bold text-white truncate leading-tight">
                  {user?.name || 'Farook'}
                </div>
                <div className="text-[9px] text-slate-400 font-mono truncate">Director • Arshith OS</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
            <div
              className="w-8 h-8 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center border border-slate-700 cursor-pointer shadow-xs"
              title={user?.name || 'User Profile'}
              onClick={() => setActiveTab('settings')}
            >
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'FK'}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
