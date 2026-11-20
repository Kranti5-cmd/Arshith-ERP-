import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Maximize2,
  Minimize2,
  Building2,
  IndianRupee,
  Layers,
  Database,
  TrendingUp,
  FileSpreadsheet,
  Wallet,
  Receipt,
  FileCheck,
  AlertCircle
} from 'lucide-react';

const COMPANIES = [
  { id: 'all', name: 'All Companies', short: 'All', badge: 'Consolidated View', color: 'emerald', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { id: '1', name: 'ArshithFresh', short: 'AFR', badge: 'Fresh Produce & Grocery', color: 'green', bg: 'bg-green-500/20 text-green-300 border-green-500/40' },
  { id: '2', name: 'Arshith Infotech', short: 'AIT', badge: 'Software & IT Services', color: 'blue', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  { id: '3', name: 'CodeLekho', short: 'CLK', badge: 'EdTech & Admissions', color: 'purple', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
];

const MODULE_LINKS = [
  { label: 'Dashboard', path: '/' },
  { label: 'Income', path: '/income' },
  { label: 'Expenses', path: '/expenses' },
  { label: 'Receivables', path: '/receivables' },
  { label: 'Payables', path: '/payables' },
  { label: 'Banking', path: '/banking' },
  { label: 'Reports', path: '/reports' },
  { label: 'Tax', path: '/tax' },
  { label: 'Payroll', path: '/payroll' },
];

export const FinanceWorkspace = ({ onReturnToErm }) => {
  const [selectedCompany, setSelectedCompany] = useState(() => {
    try {
      return localStorage.getItem('erp.company') || 'all';
    } catch {
      return 'all';
    }
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [financeOnline, setFinanceOnline] = useState(true);
  const [currentModulePath, setCurrentModulePath] = useState('/');
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const FINANCE_BASE_URL = 'http://localhost:3100';

  const getIframeSrc = (modPath = currentModulePath, co = selectedCompany) => {
    const destination = `${modPath}${modPath.includes('?') ? '&' : '?'}company=${co}`;
    return `${FINANCE_BASE_URL}/api/auth/auto-login?redirect=${encodeURIComponent(destination)}`;
  };

  const checkHealth = async () => {
    try {
      const res = await fetch(`${FINANCE_BASE_URL}/api/health`, {
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) setFinanceOnline(true);
    } catch {}
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleCoChange = (e) => {
      if (e.detail) {
        handleSelectCompany(e.detail);
      }
    };
    window.addEventListener('finance-company-change', handleCoChange);
    return () => window.removeEventListener('finance-company-change', handleCoChange);
  }, []);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'FINANCE_COMPANY_CHANGED' && e.data.company !== undefined) {
        const co = String(e.data.company);
        setSelectedCompany(co);
        try {
          localStorage.setItem('erp.company', co);
        } catch {}
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSelectCompany = (companyId) => {
    const co = String(companyId);
    setSelectedCompany(co);
    try {
      localStorage.setItem('erp.company', co);
    } catch {}

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'SWITCH_COMPANY', company: co },
        '*'
      );
    }

    if (iframeRef.current) {
      iframeRef.current.src = getIframeSrc(currentModulePath, co);
    }
  };

  const handleNavigateModule = (path) => {
    setCurrentModulePath(path);
    if (iframeRef.current) {
      iframeRef.current.src = getIframeSrc(path, selectedCompany);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setFinanceOnline(true);
    checkHealth();
    if (iframeRef.current) {
      iframeRef.current.src = getIframeSrc(currentModulePath, selectedCompany);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const activeCompanyObj = COMPANIES.find((c) => c.id === selectedCompany) || COMPANIES[0];

  return (
    <div
      ref={containerRef}
      className={`flex flex-col w-full bg-[#0F172A] select-none overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : 'relative h-full'
      }`}
      style={{ height: isFullscreen ? '100vh' : 'calc(100vh - 64px)' }}
    >
      {/* Sleek, Single-Row Navigation Header (42px) */}
      <div className="bg-[#0B132B] border-b border-[#1E293B] px-3 py-1 flex items-center justify-between text-white shadow-xs z-30 shrink-0 h-[42px] gap-2">
        {/* Left: Return button & Brand */}
        <div className="flex items-center gap-2">
          {onReturnToErm && (
            <button
              onClick={onReturnToErm}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1E293B] hover:bg-[#334155] text-slate-200 hover:text-white border border-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer group"
              title="Return to Main Portal"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">ERM Portal</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-white shadow-xs">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-xs tracking-wider text-white uppercase hidden md:inline">
              Arshith <span className="text-emerald-400">Finance ERP</span>
            </span>
          </div>
        </div>

        {/* Center: The Core Company Selector Dropdown + Quick Badges */}
        <div className="flex items-center gap-1.5 bg-[#141E33] px-2 py-0.5 rounded-lg border border-slate-700/80">
          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline">Company:</span>

          <select
            aria-label="Select Company"
            value={selectedCompany}
            onChange={(e) => handleSelectCompany(e.target.value)}
            className="bg-[#0B132B] text-white font-bold text-xs px-2.5 py-1 rounded-md border border-slate-600 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
            style={{ minWidth: 155 }}
          >
            <option value="all">🌐 All Companies (Consolidated)</option>
            <option value="1">🥬 ArshithFresh</option>
            <option value="2">💻 Arshith Infotech</option>
            <option value="3">🎓 CodeLekho</option>
          </select>

          <div className="hidden lg:flex items-center gap-1 pl-1">
            {COMPANIES.map((co) => {
              const active = selectedCompany === co.id;
              return (
                <button
                  key={co.id}
                  onClick={() => handleSelectCompany(co.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    active
                      ? `${co.bg} shadow-xs border`
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={`Switch to ${co.name}`}
                >
                  {co.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Module Shortcuts & Tools */}
        <div className="flex items-center gap-1">
          <div className="hidden xl:flex items-center gap-1 mr-1">
            {MODULE_LINKS.slice(0, 5).map((mod) => (
              <button
                key={mod.path}
                onClick={() => handleNavigateModule(mod.path)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  currentModulePath === mod.path
                    ? 'bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {mod.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleReload}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Reload Finance Workspace"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <a
            href={`${FINANCE_BASE_URL}?company=${selectedCompany}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-xs font-medium transition-colors border border-slate-700"
            title="Open in Standalone Window"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline text-[11px]">Standalone</span>
          </a>

          <button
            onClick={toggleFullscreen}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Full-Height Viewport Frame */}
      <div 
        className="flex-1 relative w-full bg-white overflow-hidden"
        style={{ height: 'calc(100% - 42px)' }}
      >
        {/* Loading Spinner Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-lg">
                <IndianRupee className="w-6 h-6 text-emerald-100" />
              </div>
              <div className="absolute -inset-1 rounded-2xl border-2 border-emerald-500/40 border-t-emerald-500 animate-spin pointer-events-none" />
            </div>

            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">
                Loading {activeCompanyObj.name} Ledger...
              </h3>
            </div>
          </div>
        )}

        {/* Live Finance Application Frame */}
        <iframe
          ref={iframeRef}
          src={getIframeSrc()}
          title="Arshith Group Multi-Company Finance ERP"
          className="w-full h-full border-0 bg-white"
          style={{ width: '100%', height: '100%', display: 'block' }}
          allow="clipboard-read; clipboard-write; fullscreen; print"
          onLoad={() => {
            setIsLoading(false);
            setFinanceOnline(true);
          }}
          onError={() => {
            setFinanceOnline(false);
            setIsLoading(false);
          }}
        />
      </div>
    </div>
  );
};

export default FinanceWorkspace;
