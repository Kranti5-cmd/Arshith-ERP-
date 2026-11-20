import React from 'react';
import {
  Search,
  Bell,
  Plus,
  Shield,
  LogOut,
  Activity,
  GraduationCap,
  Building2,
  Leaf,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CompanySwitcherDropdown } from './CompanySwitcherDropdown';

export const Header = ({ onOpenNewProjectModal, setActiveTab, unreadNotificationsCount = 0 }) => {
  const { user, logout, switchCompany } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search Input */}
      <div className="flex items-center gap-4 flex-1 min-w-[160px] max-w-xs md:max-w-sm lg:max-w-md">
        <div className="relative w-full group">
          <Search className="w-4 h-4 text-[#64748B] group-focus-within:text-[#2563EB] absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects..."
            onClick={() => setActiveTab('projects')}
            className="w-full pl-8 pr-16 py-2 text-xs bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] focus:bg-white transition-all text-[#111827] placeholder-[#64748B]"
          />
          <kbd className="hidden lg:inline-flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[#64748B] bg-white border border-[#E2E8F0] rounded shadow-2xs pointer-events-none select-none">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* System telemetry indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-blue-50/80 border border-blue-200/80 rounded-full text-[11px] font-semibold text-blue-800">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
          <span>Live Core • Production</span>
        </div>

        {/* Quick Action Button: New Project */}
        <button
          onClick={onOpenNewProjectModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>

        {/* Company Dropdown Selector (Unified) */}
        <CompanySwitcherDropdown />

        {/* Admin Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F7FA] border border-[#E2E8F0] text-[#111827] rounded-lg text-xs font-semibold tracking-wide">
          <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
          <span className="font-mono text-[11px]">ADMINISTRATOR</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="relative p-2 text-[#64748B] hover:text-[#111827] hover:bg-slate-100 rounded-lg transition-colors"
          title="System Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          )}
        </button>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white font-bold text-xs flex items-center justify-center border border-blue-400/30 shadow-2xs">
            {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'FK'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-[#111827] leading-tight">{user?.name || 'Farook'}</div>
            <div className="text-[10px] text-[#64748B] font-medium">{user?.designation || 'Managing Director & CEO'}</div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1 ml-1 px-2.5 py-1.5 text-[#64748B] hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors border border-[#E2E8F0]"
            title="Log out of Admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
