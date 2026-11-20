import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Maximize2,
  Minimize2,
  GraduationCap,
  Database,
  ShieldCheck,
  Mail,
  AlertCircle,
  IndianRupee,
  ChevronDown,
  Building2,
  Leaf,
  Layers,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CodeLekhoCrmWorkspace = ({ onReturnToErm }) => {
  const { switchCompany } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [crmOnline, setCrmOnline] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);
  const [checkCount, setCheckCount] = useState(0);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [hrOpen, setHrOpen] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const handleOpenFinance = (coId) => {
    try {
      localStorage.setItem('erp.company', coId);
    } catch {}
    if (switchCompany) switchCompany('finance');
  };

  const handleOpenHr = (coId) => {
    try {
      localStorage.setItem('hrms.company', coId);
    } catch {}
    if (switchCompany) switchCompany('hr');
  };

  const CRM_BASE_URL = 'http://localhost:5173';
  const API_BASE_URL = 'http://localhost:5000/api/health';

  // Check health of CRM backend and frontend
  const checkHealth = async () => {
    try {
      const res = await fetch(API_BASE_URL, { signal: AbortSignal.timeout(3000) });
      setApiOnline(res.ok);
    } catch {
      setApiOnline(false);
    }

    try {
      await fetch(CRM_BASE_URL, { mode: 'no-cors', signal: AbortSignal.timeout(3000) });
      setCrmOnline(true);
    } catch {
      setCrmOnline(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, [checkCount]);

  const handleReturn = () => {
    try {
      localStorage.setItem('arshith_company', 'arshith');
      const savedUser = localStorage.getItem('arshith_user');
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          u.company = 'arshith';
          localStorage.setItem('arshith_user', JSON.stringify(u));
        } catch {}
      }
      if (switchCompany) {
        switchCompany('arshith');
      }
      if (onReturnToErm) {
        onReturnToErm();
      }
    } catch (e) {
      console.error('Error returning to ERM:', e);
      window.location.reload();
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setCheckCount((c) => c + 1);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
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

  return (
    <div
      ref={containerRef}
      className={`flex flex-col w-screen h-screen bg-[#E8EDF3] select-none overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : 'relative'
      }`}
      style={{ height: '100vh', width: '100vw' }}
    >
      {/* Sleek, Minimalist Top Navigation Header (38px high) */}
      <div className="bg-[#E3E9F0] border-b border-[#DDE4EC] px-4 py-1.5 flex items-center justify-between text-[#253142] shadow-atmo-card z-30 shrink-0 h-[46px]">
        {/* Left: Back button & identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReturn}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8EDF3] hover:bg-[#DDE4EC] text-[#253142] border border-[#DDE4EC] rounded-xl text-xs font-semibold shadow-atmo-btn transition-all cursor-pointer group"
            title="Return to Arshith Group ERM Portal"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Return to ERM Portal</span>
          </button>

          <div className="h-4 w-px bg-[#DDE4EC] hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="h-6 px-1.5 rounded-md bg-white flex items-center justify-center border border-blue-400/30 overflow-hidden shadow-2xs">
              <img src="/logos/codelekho-logo.png" alt="CodeLekho" className="h-4 w-auto object-contain" />
            </div>
            <span className="text-[10px] bg-blue-500/20 text-blue-700 border border-blue-500/40 px-1.5 py-0.2 rounded font-mono font-semibold">
              Live Workspace
            </span>
          </div>

          {/* Finance Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setFinanceOpen(!financeOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8EDF3] hover:bg-[#DDE4EC] text-[#253142] border border-[#DDE4EC] rounded-xl text-xs font-semibold shadow-atmo-btn transition-all cursor-pointer"
              title="Open Project Finance ERP"
            >
              <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
              <span>Finance Dropdown</span>
              <ChevronDown className={`w-3 h-3 text-blue-500 transition-transform ${financeOpen ? 'rotate-180' : ''}`} />
            </button>

            {financeOpen && (
              <div className="absolute left-0 mt-1.5 w-64 bg-[#F4F7FA] border border-[#DDE4EC] rounded-2xl p-2 shadow-atmo-card-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2.5 py-1 border-b border-slate-800 mb-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Select Project Finance
                  </div>
                </div>
                <button
                  onClick={() => handleOpenFinance('3')}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-[#253142] hover:text-blue-600 hover:bg-[#E8EDF3] transition-all text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-semibold">CodeLekho Finance</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">CLK</span>
                </button>
                <button
                  onClick={() => handleOpenFinance('2')}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-[#253142] hover:text-blue-600 hover:bg-[#E8EDF3] transition-all text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-semibold">Infotech Finance</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">AIT</span>
                </button>
                <button
                  onClick={() => handleOpenFinance('1')}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-[#253142] hover:text-blue-600 hover:bg-[#E8EDF3] transition-all text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-semibold">ArshithFresh Finance</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-600 border border-blue-500/30">AFR</span>
                </button>
                <button
                  onClick={() => handleOpenFinance('all')}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-[#253142] hover:text-blue-600 hover:bg-[#E8EDF3] transition-all text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-semibold">All Companies (Consolidated)</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-700 border border-blue-500/30">ALL</span>
                </button>
              </div>
            )}
          </div>

          {/* HR Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setHrOpen(!hrOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8EDF3] hover:bg-[#DDE4EC] text-[#253142] border border-[#DDE4EC] rounded-xl text-xs font-semibold shadow-atmo-btn transition-all cursor-pointer"
              title="Open Multi-Company HRMS Portal"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>HR & Staff Dropdown</span>
              <ChevronDown className={`w-3 h-3 text-indigo-300 transition-transform ${hrOpen ? 'rotate-180' : ''}`} />
            </button>

            {hrOpen && (
              <div className="absolute left-0 mt-1.5 w-64 bg-[#F4F7FA] border border-[#DDE4EC] rounded-2xl p-2 shadow-atmo-card-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2.5 py-1 border-b border-slate-800 mb-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Select HRMS Scope
                  </div>
                </div>
                <button
                  onClick={() => handleOpenHr('CODELEKHO')}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-[#253142] hover:text-blue-600 hover:bg-[#E8EDF3] transition-all text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-semibold">CodeLekho HR & Faculty</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">CLK</span>
                </button>
                <button
                  onClick={() => handleOpenHr('ARSHITH_INFOTECH')}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-[#253142] hover:text-blue-600 hover:bg-[#E8EDF3] transition-all text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-semibold">Infotech HR & Staff</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">AIT</span>
                </button>
                <button
                  onClick={() => handleOpenHr('ALL')}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-[#253142] hover:text-blue-600 hover:bg-[#E8EDF3] transition-all text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-semibold">All Companies HRMS</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">ALL</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Live status indicator */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-blue-700">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${crmOnline && apiOnline ? 'bg-blue-500 animate-pulse' : 'bg-amber-400'}`} />
            <span>Connected to Local CRM Engine (Ports 5173 & 5000)</span>
          </span>
        </div>

        {/* Right: Quick Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReload}
            className="p-1 text-slate-600 hover:text-blue-600 hover:bg-[#E8EDF3] rounded-md transition-colors cursor-pointer"
            title="Reload CRM Workspace"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <a
            href={CRM_BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-blue-600 hover:bg-[#E8EDF3] rounded-md text-xs font-medium transition-colors"
            title="Open in Standalone Browser Window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Open Standalone</span>
          </a>

          <button
            onClick={toggleFullscreen}
            className="p-1 text-slate-600 hover:text-blue-600 hover:bg-[#E8EDF3] rounded-md transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Frame: Full 100% Viewport Height */}
      <div 
        className="flex-1 relative w-full bg-[#E8EDF3] overflow-hidden"
        style={{ height: 'calc(100vh - 40px)' }}
      >
        {/* Loading Spinner Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-[#E8EDF3] flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#101827] text-white flex items-center justify-center shadow-xl">
                <GraduationCap className="w-7 h-7 text-blue-400" />
              </div>
              <div className="absolute -inset-1.5 rounded-3xl border-2 border-blue-500/40 border-t-blue-600 animate-spin pointer-events-none" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#253142]">
                Loading CodeLekho CRM Application...
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Opening full CRM admissions interface and student management modules.
              </p>
            </div>
          </div>
        )}

        {/* Offline Diagnostic Fallback if connection fails */}
        {!crmOnline && (
          <div className="absolute inset-0 z-20 bg-slate-50 flex items-center justify-center p-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  CodeLekho CRM Standalone Service Not Detected
                </h3>
                <p className="text-xs text-slate-500">
                  The CRM application is hosted at <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">http://localhost:5173</code>. Ensure the CRM development server is running.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5 font-mono text-slate-700">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Start Command:</div>
                <div className="text-blue-600 select-all font-semibold">cd C:\Users\KRANTI\CRM\client</div>
                <div className="text-blue-600 select-all font-semibold">npm run dev</div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={handleReload}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Connection</span>
                </button>
                <button
                  onClick={handleReturn}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Return to ERM
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live CodeLekho CRM Application iFrame - Full Viewport */}
        <iframe
          ref={iframeRef}
          src={CRM_BASE_URL}
          title="CodeLekho CRM Enterprise Application"
          className="w-full h-full border-0 bg-[#E8EDF3]"
          style={{ width: '100%', height: '100%', display: 'block' }}
          allow="clipboard-read; clipboard-write; fullscreen; camera; microphone"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};


