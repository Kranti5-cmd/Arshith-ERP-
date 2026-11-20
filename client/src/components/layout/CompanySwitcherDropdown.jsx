import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2, GraduationCap, Leaf, IndianRupee, Check, Layers, Users, ExternalLink, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CompanySwitcherDropdown = () => {
  const { company, switchCompany } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null); // { coId, type: 'finance' | 'hr' }
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const companies = [
    {
      id: 'arshith',
      name: 'Arshith Infotech',
      tagline: 'Project Inventory & Portfolio OS',
      icon: Building2,
      logoUrl: '/logos/arshith-infotech-logo.jpg',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200',
      badge: 'Projects',
      financeCoId: '2',
      financeName: 'Infotech Finance',
      hrCoId: 'ARSHITH_INFOTECH',
      hrName: 'Infotech HR',
    },
    {
      id: 'arshithfresh',
      name: 'Arshith Fresh IMS',
      tagline: 'Inventory & Supply Chain Management',
      icon: Leaf,
      logoUrl: '/logos/arshith-fresh-logo.jpg',
      bgColor: 'bg-white',
      borderColor: 'border-emerald-200',
      badge: 'Supply Chain',
      financeCoId: '1',
      financeName: 'ArshithFresh Finance',
      // ArshithFresh HR omitted as requested
    },
    {
      id: 'codelekho',
      name: 'CodeLekho CRM',
      tagline: 'Education, Student & CRM Management',
      icon: GraduationCap,
      logoUrl: '/logos/codelekho-logo.png',
      bgColor: 'bg-white',
      borderColor: 'border-emerald-200',
      badge: 'CRM & LMS',
      financeCoId: '3',
      financeName: 'CodeLekho Finance',
      hrCoId: 'CODELEKHO',
      hrName: 'CodeLekho HR',
    },
  ];

  const current = companies.find((c) => c.id === company) || (company === 'hr' ? {
    id: 'hr',
    name: 'Arshith Connect HRMS',
    icon: Users,
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    badge: 'HR & Staff',
  } : {
    id: 'finance',
    name: 'Arshith Finance ERP',
    icon: IndianRupee,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    badge: 'Finance ERP',
  });
  const CurrentIcon = current.icon;

  const handleSelectCompany = (id, subCo = null, isHr = false) => {
    setOpen(false);
    setActiveSubmenu(null);
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
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-1.5 bg-[#F5F7FA] hover:bg-slate-100 border border-[#E2E8F0] hover:border-blue-400 rounded-xl text-xs font-semibold text-[#111827] transition-all shadow-2xs cursor-pointer group"
        title="Switch between Enterprise Workspaces, Finance & HR"
      >
        <div className="w-8 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden p-0.5 shadow-2xs flex-shrink-0">
          {current.logoUrl ? (
            <img src={current.logoUrl} alt={current.name} className="w-full h-full object-contain" />
          ) : (
            <CurrentIcon className={`w-3.5 h-3.5 ${current.iconColor || 'text-slate-700'}`} />
          )}
        </div>
        <div className="text-left flex items-center gap-1.5">
          <span className="font-bold text-[#111827]">{current.name}</span>
          <span className="hidden sm:inline text-[10px] font-mono text-slate-500 bg-white border border-[#E2E8F0] px-1.5 py-0.5 rounded">
            {current.badge}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[400px] bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150 max-h-[85vh] overflow-y-auto">
          {/* Section 1: Enterprise Workspaces with nested Finance and HR dropdowns */}
          <div className="px-3 py-1.5 border-b border-[#F1F5F9] mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Enterprise Workspaces
            </span>
            <span className="text-[9px] font-mono text-slate-400">Finance & HR Included</span>
          </div>

          <div className="space-y-2.5 mb-3">
            {companies.map((c) => {
              const Icon = c.icon;
              const isSelected = c.id === company;
              return (
                <div
                  key={c.id}
                  className={`rounded-xl border transition-all p-3 ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Company Row (Click opens workspace) */}
                  <div
                    onClick={() => handleSelectCompany(c.id)}
                    className="flex items-center justify-between cursor-pointer group gap-2.5"
                    title={`Switch to ${c.name} Workspace`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Brand Logo Container - Perfectly Proportioned Rectangular Badge */}
                      <div className="w-28 h-12 rounded-lg bg-white border border-slate-200/90 flex items-center justify-center flex-shrink-0 group-hover:border-blue-400 group-hover:shadow-xs transition-all overflow-hidden p-1.5 shadow-2xs">
                        {c.logoUrl ? (
                          <img
                            src={c.logoUrl}
                            alt={c.name}
                            className="w-full h-full object-contain object-center transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <Icon className={`w-5 h-5 ${c.iconColor}`} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                          <span className="truncate">{c.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-white border border-slate-200 text-slate-600 rounded flex-shrink-0">
                            {c.badge}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {c.tagline}
                        </div>
                      </div>
                    </div>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 ml-1 shadow-2xs">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : (
                      <div className="text-[10px] font-semibold text-slate-400 group-hover:text-blue-600 flex items-center gap-0.5 ml-1 flex-shrink-0">
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Project Dropdown Bar: Finance & HR Buttons (One by One) */}
                  <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                    {/* Finance Dropdown */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCompany('finance', c.financeCoId);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs group"
                      title={`Open ${c.name} Finance Ledger`}
                    >
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Finance Dropdown</span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-white text-emerald-700 rounded border border-emerald-300">
                        ▼
                      </span>
                    </button>

                    {/* HR Dropdown (omitted for ArshithFresh as requested) */}
                    {c.hrCoId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCompany('hr', c.hrCoId, true);
                        }}
                        className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/80 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs group"
                        title={`Open ${c.name} HR & Workforce`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          <span>HR Dropdown</span>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-white text-indigo-700 rounded border border-indigo-300">
                          ▼
                        </span>
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
