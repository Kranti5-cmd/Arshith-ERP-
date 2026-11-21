import React from 'react';
import {
  Search,
  Bell,
  Plus,
  Shield,
  LogOut,
  Sun,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CompanySwitcherDropdown } from './CompanySwitcherDropdown';

export const Header = ({ onOpenNewProjectModal, setActiveTab, unreadNotificationsCount = 0, onToggleMobileMenu }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[#E8EDF3] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-50 border-b border-[#DDE4EC]/60 select-none gap-2 sm:gap-4 max-w-full">
      {/* ======================================================== */}
      {/* Left: Mobile Navigation Trigger & Brand / Desktop Search */}
      {/* ======================================================== */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 lg:flex-1 min-w-0">
        {/* Mobile Hamburger & Logo (Only on < lg screens) */}
        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-2xl bg-[#F4F7FA] hover:bg-white text-[#253142] border border-[#DDE4EC] shadow-atmo-btn transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center active:scale-95"
            title="Open Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-[#253142]" />
          </button>
          
          <button
            onClick={() => setActiveTab('central-dashboard')}
            className="flex items-center gap-2 rounded-xl bg-white p-1 border border-[#DDE4EC] shadow-2xs overflow-hidden shrink-0 cursor-pointer"
            title="Go to Home Hub"
          >
            <div className="w-7 h-6 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="/logos/arshith-infotech-logo.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="hidden xs:inline text-xs font-extrabold text-[#253142] tracking-tight">
              Arshith<span className="text-blue-600">OS</span>
            </span>
          </button>
        </div>

        {/* Atmosphere Recessed Search Well (Tablet & Desktop: hidden on mobile to prevent overcrowding) */}
        <div className="hidden md:flex relative flex-1 max-w-sm lg:max-w-md group">
          <Search className="w-4 h-4 text-[#7C8998] group-focus-within:text-[#2563EB] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Search ecosystem, projects, staff..."
            onClick={() => setActiveTab('projects')}
            className="w-full pl-9 pr-14 py-2 text-xs bg-[#E2E8F0] border border-[#DDE4EC] rounded-2xl shadow-atmo-well focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] focus:bg-white transition-all text-[#253142] placeholder-[#A0ACBA] font-medium"
          />
          <kbd className="inline-flex items-center gap-0.5 absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono text-[#7C8998] bg-[#F4F7FA] border border-[#DDE4EC] rounded-lg shadow-2xs pointer-events-none select-none">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Right Controls: Switcher, Actions, Notifications, User   */}
      {/* ======================================================== */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Weather & Live Core Telemetry Pill (Large Desktop only) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#F4F7FA] border border-[#DDE4EC] rounded-full text-[11px] font-semibold text-[#7C8998] shadow-atmo-card-sm">
          <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
          <span>26° clear</span>
          <span className="text-[#DDE4EC]">•</span>
          <span className="flex items-center gap-1.5 text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Live Core</span>
          </span>
        </div>

        {/* Primary Action Button (Visible on screens >= sm; on mobile accessible via drawer & page actions) */}
        <button
          onClick={onOpenNewProjectModal}
          className="hidden sm:flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-xs font-semibold shadow-md shadow-blue-500/25 transition-all cursor-pointer group active:scale-95 min-h-[38px] shrink-0"
          title="Create New Project"
        >
          <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90 duration-200" />
          <span>New project</span>
        </button>

        {/* Company Switcher Dropdown */}
        <CompanySwitcherDropdown />

        {/* Admin Badge Pill (Tablet/Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F7FA] border border-[#DDE4EC] text-[#253142] rounded-2xl text-xs font-semibold shadow-atmo-card-sm">
          <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
          <span className="font-mono text-[10px] tracking-wide text-[#7C8998]">ADMIN</span>
        </div>

        {/* Notification Bell Icon Button */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="relative p-2 sm:p-2.5 rounded-2xl bg-[#F4F7FA] hover:bg-white text-[#7C8998] hover:text-[#253142] border border-[#DDE4EC] shadow-atmo-btn transition-all cursor-pointer active:scale-95 min-h-[38px] min-w-[38px] flex items-center justify-center shrink-0"
          title="System Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF782F] rounded-full ring-2 ring-[#E8EDF3]"></span>
          )}
        </button>

        {/* User Profile & Logout Capsule */}
        <div className="flex items-center gap-1.5 sm:gap-2 sm:pl-2 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-1.5 sm:pr-2.5 bg-[#F4F7FA] border border-[#DDE4EC] rounded-2xl shadow-atmo-card-sm">
            <div className="w-7 h-7 rounded-xl bg-[#253142] text-white font-bold text-xs flex items-center justify-center shadow-2xs">
              {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'FK'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-[11px] font-bold text-[#253142] leading-tight truncate max-w-[100px]">
                {user?.name || 'Farook'}
              </div>
              <div className="text-[9px] text-[#7C8998] truncate max-w-[100px]">
                Director
              </div>
            </div>
          </div>

          {/* Quick Logout Button */}
          <button
            onClick={logout}
            className="p-1.5 sm:p-2 rounded-2xl text-[#7C8998] hover:text-rose-600 hover:bg-rose-50/60 border border-transparent hover:border-rose-200 transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center shrink-0"
            title="Log out of Admin session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
