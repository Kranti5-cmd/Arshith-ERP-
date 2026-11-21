import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Building2,
  GraduationCap,
  Leaf,
  IndianRupee,
  Check,
  Layers,
  Users,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CompanySwitcherDropdown = () => {
  const { company, switchCompany } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const companies = [
    {
      id: 'arshith',
      name: 'Arshith Infotech',
      projectTitle: 'Project 1: IT & Portfolio Management OS',
      tagline: 'Projects Inventory, Pipelines, Teams & Milestones',
      icon: Building2,
      logoUrl: '/logos/arshith-infotech-logo.jpg',
      badge: 'Projects OS',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      financeCoId: '2',
      financeName: 'Infotech Finance (AIT)',
      hrCoId: 'ARSHITH_INFOTECH',
      hrName: 'Infotech HR (AIT)',
    },
    {
      id: 'arshithfresh',
      name: 'Arshith Fresh IMS',
      projectTitle: 'Project 2: Fresh Inventory & Supply Chain',
      tagline: 'Stock, Warehouses, GRN, Suppliers & Catalogue',
      icon: Leaf,
      logoUrl: '/logos/arshith-fresh-logo.jpg',
      badge: 'Supply Chain',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      financeCoId: '1',
      financeName: 'ArshithFresh Finance (AFR)',
      // ArshithFresh HR omitted as requested
    },
    {
      id: 'codelekho',
      name: 'CodeLekho CRM',
      projectTitle: 'Project 3: Student CRM & Admissions LMS',
      tagline: 'Admissions Pipeline, Student Management & Support',
      icon: GraduationCap,
      logoUrl: '/logos/codelekho-logo.png',
      badge: 'CRM & LMS',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      financeCoId: '3',
      financeName: 'CodeLekho Finance (CLK)',
      hrCoId: 'CODELEKHO',
      hrName: 'CodeLekho HR (CLK)',
    },
  ];

  const current = companies.find((c) => c.id === company) || (company === 'hr' ? {
    id: 'hr',
    name: 'Arshith Connect HRMS',
    icon: Users,
    iconColor: 'text-[#2563EB]',
    badge: 'HR & Staff',
  } : {
    id: 'finance',
    name: 'Arshith Finance ERP',
    icon: IndianRupee,
    iconColor: 'text-blue-600',
    badge: 'Finance ERP',
  });
  const CurrentIcon = current.icon;

  const handleSelectCompany = (id, subCo = null, isHr = false) => {
    setOpen(false);

    if (isHr) {
      if (subCo !== null) {
        try {
          localStorage.setItem('hrms.company', subCo);
          window.dispatchEvent(new CustomEvent('hrms-company-change', { detail: subCo }));
        } catch {}
      }
      if (company === 'arshith') {
        window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'hr-workforce' }));
      } else {
        if (switchCompany) {
          switchCompany('hr');
        } else {
          localStorage.setItem('arshith_company', 'hr');
          window.location.reload();
        }
      }
      return;
    }

    if (subCo !== null) {
      try {
        localStorage.setItem('erp.company', subCo);
      } catch {}
    }

    if (switchCompany) {
      switchCompany(id);
    } else {
      localStorage.setItem('arshith_company', id);
      window.location.reload();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Atmosphere Soft Capsule Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 bg-[#F4F7FA] hover:bg-white border border-[#DDE4EC] hover:border-[#2563EB]/60 rounded-2xl text-xs font-semibold text-[#253142] transition-all shadow-atmo-card-sm cursor-pointer group active:scale-95 min-h-[38px]"
        title="Switch between Enterprise Workspaces & Projects"
        aria-expanded={open}
      >
        <div className="w-7 h-5 sm:w-8 sm:h-6 rounded-lg bg-white border border-[#DDE4EC] flex items-center justify-center overflow-hidden p-0.5 shadow-2xs flex-shrink-0">
          {current.logoUrl ? (
            <img src={current.logoUrl} alt={current.name} className="w-full h-full object-contain" />
          ) : (
            <CurrentIcon className={`w-3.5 h-3.5 ${current.iconColor || 'text-[#253142]'}`} />
          )}
        </div>
        <div className="text-left flex items-center gap-1.5 max-w-[100px] xs:max-w-[140px] sm:max-w-none truncate">
          <span className="font-bold text-[#253142] truncate">{current.name}</span>
          <span className="hidden sm:inline text-[9px] font-mono text-[#7C8998] bg-white border border-[#DDE4EC] px-1.5 py-0.5 rounded-md">
            {current.badge}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#7C8998] transition-transform duration-200 shrink-0 ${
            open ? 'rotate-180 text-[#2563EB]' : ''
          }`}
        />
      </button>

      {/* Atmosphere Floating Card Menu */}
      {open && (
        <div
          className="fixed sm:absolute top-[68px] sm:top-full left-2 right-2 sm:left-auto sm:right-0 sm:mt-2 w-auto sm:w-[440px] max-w-[calc(100vw-1rem)] bg-[#F4F7FA] rounded-3xl shadow-2xl border border-[#DDE4EC] p-3.5 max-h-[85vh] overflow-y-auto"
          style={{ zIndex: 9999 }}
        >
          {/* Header Banner */}
          <div className="px-3 py-2 border-b border-[#DDE4EC] mb-3 flex items-center justify-between bg-white rounded-2xl shadow-2xs">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="text-[11px] font-extrabold text-[#253142] tracking-tight uppercase font-mono">
                  All 3 Enterprise Projects
                </span>
              </div>
              <span className="text-[10px] text-[#7C8998]">
                Switch between active projects & workspaces
              </span>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200 shrink-0">
              3 Projects
            </span>
          </div>

          {/* All 3 Project Cards */}
          <div className="space-y-3">
            {companies.map((c) => {
              const Icon = c.icon;
              const isSelected = c.id === company;
              return (
                <div
                  key={c.id}
                  className={`rounded-2xl border transition-all p-3 ${
                    isSelected
                      ? 'bg-white border-[#2563EB] shadow-md ring-1 ring-[#2563EB]/20'
                      : 'bg-white/90 border-[#DDE4EC] hover:bg-white hover:border-[#CBD5E1] shadow-2xs'
                  }`}
                >
                  {/* Company Row (Click opens workspace) */}
                  <div
                    onClick={() => handleSelectCompany(c.id)}
                    className="flex items-center justify-between cursor-pointer group gap-2.5"
                    title={`Switch to ${c.name} Workspace`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Brand Logo Container */}
                      <div className="w-24 sm:w-28 h-12 rounded-xl bg-white border border-[#DDE4EC] flex items-center justify-center flex-shrink-0 group-hover:border-[#2563EB] group-hover:shadow-xs transition-all overflow-hidden p-1.5 shadow-2xs">
                        {c.logoUrl ? (
                          <img
                            src={c.logoUrl}
                            alt={c.name}
                            className="w-full h-full object-contain object-center transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <Icon className="w-5 h-5 text-[#253142]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#253142] flex items-center gap-1.5 flex-wrap">
                          <span className="truncate">{c.name}</span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md border flex-shrink-0 ${c.badgeColor}`}
                          >
                            {c.badge}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#2563EB] font-medium truncate mt-0.5">
                          {c.projectTitle}
                        </div>
                        <div className="text-[9px] text-[#7C8998] truncate mt-0.5">
                          {c.tagline}
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold flex-shrink-0">
                        <Check className="w-3 h-3 text-[#2563EB]" />
                        <span>Active</span>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCompany(c.id);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer flex-shrink-0 active:scale-95"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Project Sub-Actions: Finance & HR Buttons */}
                  <div className="mt-2.5 pt-2 border-t border-[#DDE4EC]/80 flex flex-col sm:flex-row gap-1.5">
                    {/* Finance Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCompany('finance', c.financeCoId);
                      }}
                      className="flex-1 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#F4F7FA] hover:bg-blue-50 text-blue-900 border border-[#DDE4EC] hover:border-blue-300 text-[10px] font-semibold transition-all cursor-pointer shadow-2xs group"
                      title={`Open ${c.name} Finance Ledger`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <IndianRupee className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">{c.financeName || 'Finance ERP'}</span>
                      </div>
                      <ArrowRight className="w-2.5 h-2.5 text-blue-600 shrink-0 ml-1 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {/* HR Button (Omitted for ArshithFresh as requested) */}
                    {c.hrCoId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCompany('hr', c.hrCoId, true);
                        }}
                        className="flex-1 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#F4F7FA] hover:bg-indigo-50 text-indigo-900 border border-[#DDE4EC] hover:border-indigo-300 text-[10px] font-semibold transition-all cursor-pointer shadow-2xs group"
                        title={`Open ${c.name} HR & Workforce`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <Users className="w-3 h-3 text-indigo-600 shrink-0" />
                          <span className="truncate">{c.hrName || 'HRMS'}</span>
                        </div>
                        <ArrowRight className="w-2.5 h-2.5 text-indigo-600 shrink-0 ml-1 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
