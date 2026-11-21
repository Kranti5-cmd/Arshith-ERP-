import React from 'react';
import {
  Building2,
  FolderGit2,
  IndianRupee,
  Users,
  Menu,
} from 'lucide-react';

export const MobileNavigation = ({ activeTab, setActiveTab, onOpenMore }) => {
  const primaryTabs = [
    { id: 'central-dashboard', label: 'Hub', icon: Building2 },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'finances', label: 'Finance', icon: IndianRupee },
    { id: 'hr-workforce', label: 'HRMS', icon: Users },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#E8EDF3]/95 backdrop-blur-md border-t border-[#DDE4EC] shadow-atmo-card h-16 flex items-center justify-around px-2 lg:hidden select-none"
    >
      {primaryTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id || (tab.id === 'projects' && activeTab === 'project-details');
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-200 min-h-[44px] min-w-[44px] relative active:scale-95 ${
              isActive
                ? 'text-[#2563EB]'
                : 'text-[#7C8998] hover:text-[#253142]'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-white shadow-atmo-btn border border-[#DDE4EC]'
                  : 'bg-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span
              className={`text-[10px] font-semibold mt-0.5 tracking-tight ${
                isActive ? 'font-bold text-[#253142]' : 'text-[#7C8998]'
              }`}
            >
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#FF782F]"></span>
            )}
          </button>
        );
      })}

      {/* "More / Menu" button opens the full slide-out drawer */}
      <button
        onClick={onOpenMore}
        className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl text-[#7C8998] hover:text-[#253142] transition-all min-h-[44px] min-w-[44px] active:scale-95"
        title="Open Full Navigation Menu"
      >
        <div className="p-1.5 rounded-xl bg-transparent">
          <Menu className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-semibold mt-0.5 tracking-tight">More</span>
      </button>
    </nav>
  );
};

