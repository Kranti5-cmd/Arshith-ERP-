import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  PauseCircle,
  PlayCircle,
  Clock,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Shield,
  CheckCircle2,
  RefreshCw,
  Search,
  Building2,
  User,
  DollarSign,
  Layers,
  ExternalLink,
} from 'lucide-react';

export const OnHoldPage = ({ onSelectProject, onOpenResumeModal, onOpenHoldModal }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'historical'

  const fetchHolds = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getOnHoldProjects();
      if (res.success) {
        setData(res);
      } else {
        setError(res.message || 'Failed to load on-hold projects');
      }
    } catch (err) {
      console.error('Error fetching on-hold projects:', err);
      setError(err.message || 'Network error fetching on-hold records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolds();
  }, []);

  const activeHolds = (data?.activeHolds || []).filter((h) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (h.project?.projectId && h.project.projectId.toLowerCase().includes(q)) ||
      (h.project?.title && h.project.title.toLowerCase().includes(q)) ||
      (h.holdReason && h.holdReason.toLowerCase().includes(q)) ||
      (h.responsiblePerson?.name && h.responsiblePerson.name.toLowerCase().includes(q))
    );
  });

  const resolvedHolds = (data?.resolvedHolds || []).filter((h) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (h.project?.projectId && h.project.projectId.toLowerCase().includes(q)) ||
      (h.project?.title && h.project.title.toLowerCase().includes(q)) ||
      (h.holdReason && h.holdReason.toLowerCase().includes(q)) ||
      (h.responsiblePerson?.name && h.responsiblePerson.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium"><span>Atmosphere</span><span>&rsaquo;</span><span>Projects</span><span>&rsaquo;</span><span className="text-[#253142] font-semibold">On-Hold</span></div>
          <h1 className="text-2xl font-extrabold text-[#253142] tracking-tight flex items-center gap-2">
            <PauseCircle className="w-6 h-6 text-amber-500" /> On-Hold Projects Management
          </h1>
          <p className="text-xs text-[#7C8998] mt-0.5">
            Audit stalled and suspended projects, track hold duration, evaluate root causes, and clear resumption barriers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchHolds}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E8EDF3] border border-[#DDE4EC] hover:bg-[#DDE4EC] text-[#253142] rounded-2xl text-xs font-semibold shadow-atmo-btn transition-all"
            title="Refresh on-hold list"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center justify-between">
            <span>Active Projects On Hold</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">{data?.totalActiveOnHold || 0}</div>
          <div className="text-[10px] text-amber-700 mt-1">Requires executive review and barrier clearance</div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
            <span>Total Hold Events Logged</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">{data?.totalHistoricalHolds || 0}</div>
          <div className="text-[10px] text-slate-400 mt-1">Cumulative suspension and restart tracking</div>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-2xs">
          <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center justify-between">
            <span>Historical Resumptions</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-900 mt-1">{data?.resolvedHolds?.length || 0}</div>
          <div className="text-[10px] text-blue-600 mt-1">Successfully cleared and returned to development</div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Tab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F4F7FA] p-4 rounded-3xl border border-[#DDE4EC] shadow-atmo-card">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Project ID (AIP-2026), Title, Hold Reason, or Manager..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-[#E8EDF3]/70 border border-[#DDE4EC] rounded-xl text-[#253142] shadow-atmo-well focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#E8EDF3]/80 p-1.5 rounded-2xl border border-[#DDE4EC] shadow-atmo-well">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-white text-[#253142] shadow-atmo-btn rounded-xl font-bold'
                : 'text-[#7C8998] hover:text-[#253142]'
            }`}
          >
            Active On-Hold ({data?.totalActiveOnHold || 0})
          </button>
          <button
            onClick={() => setActiveTab('historical')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'historical'
                ? 'bg-white text-[#253142] shadow-atmo-btn rounded-xl font-bold'
                : 'text-[#7C8998] hover:text-[#253142]'
            }`}
          >
            Historical Resumptions ({data?.resolvedHolds?.length || 0})
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-600" />
          Loading on-hold project portfolio...
        </div>
      ) : activeTab === 'active' ? (
        /* ================= ACTIVE HOLDS ================= */
        <div className="space-y-4">
          {activeHolds.length > 0 ? (
            activeHolds.map((h) => (
              <div
                key={h.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3.5 hover:border-amber-300 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                        {h.project?.projectId || 'AIP-ONHOLD'}
                      </span>
                      <h3
                        onClick={() => onSelectProject(h.projectId)}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                        title="Open Project Workspace"
                      >
                        {h.project?.title || 'Unknown Project'}
                      </h3>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-medium">
                        Client: {h.project?.client?.companyName || 'Enterprise Client'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                        {h.project?.categoryName}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                      onClick={() => onSelectProject(h.projectId)}
                      className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      View Workspace
                    </button>
                    {onOpenResumeModal && (
                      <button
                        onClick={() => onOpenResumeModal(h.project)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Resume Project</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary Hold Details Card */}
                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2">
                  <div>
                    <span className="font-bold text-amber-950">Primary Reason for Hold: </span>
                    <span className="text-slate-800 font-medium">{h.holdReason}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Pending Tasks at Freeze: </span>
                    <span className="text-slate-600">{h.pendingTasksSummary}</span>
                  </div>
                  {h.financialImpact && (
                    <div>
                      <span className="font-semibold text-slate-700">Financial & Resource Impact: </span>
                      <span className="text-slate-600">{h.financialImpact}</span>
                    </div>
                  )}
                  {h.remarks && (
                    <div>
                      <span className="font-semibold text-slate-700">Internal Remarks: </span>
                      <span className="text-slate-600 italic">{h.remarks}</span>
                    </div>
                  )}
                </div>

                {/* Metadata & Audit Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 pt-1">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span>
                      Hold Started:{' '}
                      <span className="font-mono text-slate-800 font-semibold">
                        {h.holdDate?.split('T')[0] || '2026-04-10'}
                      </span>
                    </span>
                    <span>
                      Hold Duration:{' '}
                      <span className="font-mono text-amber-800 font-bold px-1.5 py-0.5 bg-amber-100 rounded">
                        {h.durationDays || 14} Days
                      </span>
                    </span>
                    <span>
                      Expected Resume:{' '}
                      <span className="font-mono text-slate-800 font-semibold">
                        {h.expectedResumeDate || 'Pending Committee Review'}
                      </span>
                    </span>
                  </div>

                  <div>
                    Responsible Manager:{' '}
                    <span className="font-semibold text-slate-800">
                      {h.responsiblePerson?.name || 'Priya Sundaram (Project Manager)'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Projects Currently On Hold</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                All company projects in the portfolio are actively advancing through development, testing, or review.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* ================= HISTORICAL RESUMPTIONS ================= */
        <div className="space-y-4">
          {resolvedHolds.length > 0 ? (
            resolvedHolds.map((h) => (
              <div key={h.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {h.project?.projectId}
                    </span>
                    <h3
                      onClick={() => onSelectProject(h.projectId)}
                      className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                    >
                      {h.project?.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-[10px]">
                      Resumed
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Resumed on: {h.resumeDate?.split('T')[0] || 'N/A'}</span>
                </div>
                <div className="text-slate-600 text-xs">
                  <strong>Original Hold Reason: </strong> {h.holdReason}
                </div>
                {h.resumeRemarks && (
                  <div className="text-slate-600 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <strong>Resumption Notes: </strong> {h.resumeRemarks}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
              No historical hold-resumption records logged yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
