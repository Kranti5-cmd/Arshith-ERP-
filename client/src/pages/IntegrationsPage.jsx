import React, { useState, useEffect } from 'react';
import {
  Network,
  Database,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Settings2,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Layers,
  ArrowRight,
  Eye,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { api } from '../services/api';

export const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testingKey, setTestingKey] = useState(null);
  const [syncingKey, setSyncingKey] = useState(null);
  const [testResult, setTestResult] = useState(null); // { key, success, message, latencyMs, details }
  const [toast, setToast] = useState(null); // { type, message }

  // Modals state
  const [configModalIntegration, setConfigModalIntegration] = useState(null);
  const [configPayload, setConfigPayload] = useState({});
  const [logsModalIntegration, setLogsModalIntegration] = useState(null);
  const [syncJobs, setSyncJobs] = useState([]);
  const [syncLogs, setSyncLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [selectedPayloadRecord, setSelectedPayloadRecord] = useState(null);
  const [infotechReqModalOpen, setInfotechReqModalOpen] = useState(false);

  // Synchronized Records Explorer state
  const [records, setRecords] = useState([]);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [recordsPage, setRecordsPage] = useState(1);
  const [recordsTotalPages, setRecordsTotalPages] = useState(1);
  const [filterSource, setFilterSource] = useState('ALL');
  const [filterEntity, setFilterEntity] = useState('ALL');
  const [recordSearch, setRecordSearch] = useState('');
  const [loadingRecords, setLoadingRecords] = useState(false);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await api.getIntegrations();
      if (res.success) {
        setIntegrations(res.data);
      }
    } catch (err) {
      showToast('error', `Failed to load integrations: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async (page = 1) => {
    try {
      setLoadingRecords(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        sourceSystem: filterSource,
        entityType: filterEntity,
        search: recordSearch,
      });
      const res = await api.getSyncedRecords(params.toString());
      if (res.success) {
        setRecords(res.data || []);
        setRecordsTotal(res.total || 0);
        setRecordsPage(res.page || 1);
        setRecordsTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      // ignore
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
    fetchRecords(1);
  }, []);

  useEffect(() => {
    fetchRecords(1);
  }, [filterSource, filterEntity]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Test Connection
  const handleTestConnection = async (key) => {
    try {
      setTestingKey(key);
      setTestResult(null);
      const res = await api.testIntegration(key);
      if (res.success) {
        setTestResult({ key, ...res.data });
        showToast(
          res.data.success ? 'success' : 'warn',
          res.data.message || 'Connection test finished.'
        );
        fetchIntegrations();
      }
    } catch (err) {
      setTestResult({ key, success: false, message: err.message });
      showToast('error', `Connection test failed: ${err.message}`);
    } finally {
      setTestingKey(null);
    }
  };

  // Trigger Sync
  const handleTriggerSync = async (key, syncType = 'FULL') => {
    try {
      setSyncingKey(key);
      const res = await api.syncIntegration(key, syncType);
      if (res.success) {
        showToast(
          res.data.status === 'COMPLETED' ? 'success' : 'warn',
          `${res.data.dataSource || 'Source'} synchronized: ${res.data.totalFetched} records processed (${res.data.created} new, ${res.data.updated} updated, ${res.data.skipped} skipped).`
        );
        fetchIntegrations();
        fetchRecords(1);
      }
    } catch (err) {
      showToast('error', `Sync failed: ${err.message}`);
    } finally {
      setSyncingKey(null);
    }
  };

  // Open Configure Modal
  const handleOpenConfig = (item) => {
    setConfigModalIntegration(item);
    setConfigPayload(item.config || {});
  };

  // Save Config
  const handleSaveConfig = async () => {
    if (!configModalIntegration) return;
    try {
      const res = await api.updateIntegrationConfig(configModalIntegration.key, configPayload);
      if (res.success) {
        showToast('success', 'Configuration saved.');
        setConfigModalIntegration(null);
        fetchIntegrations();
      }
    } catch (err) {
      showToast('error', `Failed to save configuration: ${err.message}`);
    }
  };

  // Open Logs Modal
  const handleOpenLogs = async (item) => {
    setLogsModalIntegration(item);
    setLoadingLogs(true);
    try {
      const [jobsRes, logsRes] = await Promise.all([
        api.getSyncJobs(item.key),
        api.getSyncLogs(item.key),
      ]);
      if (jobsRes.success) setSyncJobs(jobsRes.data || []);
      if (logsRes.success) setSyncLogs(logsRes.data || []);
    } catch (err) {
      showToast('error', `Failed to fetch logs: ${err.message}`);
    } finally {
      setLoadingLogs(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-semibold ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : toast.type === 'warn'
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {toast.type === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
          {toast.type === 'error' && <XCircle className="w-4 h-4 text-rose-600" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE4EC] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium">
            <span>Atmosphere</span>
            <span>&rsaquo;</span>
            <span>Platform</span>
            <span>&rsaquo;</span>
            <span className="text-[#253142] font-semibold">Integrations</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shadow-atmo-btn">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#253142] tracking-tight">
                Integration Management
              </h1>
              <p className="text-xs text-[#7C8998]">
                Centralized Multi-Database Synchronization Engine & Business Connectors
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchIntegrations();
              fetchRecords(recordsPage);
            }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#253142] bg-[#E8EDF3] border border-[#DDE4EC] hover:bg-[#DDE4EC] rounded-2xl transition-all shadow-atmo-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#2563EB]' : ''}`} />
            <span>Refresh State</span>
          </button>
        </div>
      </div>

      {/* Connection Test Banner if tested */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start justify-between gap-4 transition-all ${
            testResult.success
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : testResult.status === 'PENDING_INTEGRATION'
              ? 'bg-amber-50/70 border-amber-200 text-amber-900'
              : 'bg-rose-50/70 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-start gap-3">
            {testResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : testResult.status === 'PENDING_INTEGRATION' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold">
                {testResult.key?.toUpperCase()} Connection Test Result ({testResult.latencyMs || 0}ms)
              </div>
              <div className="mt-0.5 text-[11px] leading-relaxed">{testResult.message}</div>
            </div>
          </div>
          <button onClick={() => setTestResult(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3 Main Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const isPending = item.status === 'PENDING_INTEGRATION';
          const isConnected = item.status === 'CONNECTED';
          const isDisconnected = item.status === 'DISCONNECTED' || item.status === 'ERROR';
          const isPendingConfig = item.status === 'PENDING_CONFIG';

          const isTesting = testingKey === item.key;
          const isSyncing = syncingKey === item.key;

          return (
            <div
              key={item.key}
              className={`bg-[#F4F7FA] rounded-3xl border border-[#DDE4EC] shadow-atmo-card hover:shadow-atmo-card-lg transition-all flex flex-col justify-between overflow-hidden ${
                isConnected ? 'ring-1 ring-emerald-500/20' : ''
              }`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-[#DDE4EC]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-atmo-btn ${
                        item.key === 'arshithfresh'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.key === 'codelekho'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-[#E8EDF3] text-[#253142] border border-[#DDE4EC]'
                      }`}
                    >
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#253142]">{item.name}</h3>
                      <p className="text-[10px] font-mono text-[#7C8998]">{item.databaseName}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isPending ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-800 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Integration Pending</span>
                      </span>
                    ) : isConnected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Connected</span>
                      </span>
                    ) : isPendingConfig ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                        <Info className="w-3 h-3 text-sky-600" />
                        <span>Setup Required</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>Disconnected</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#7C8998] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Statistics & Metadata */}
              <div className="p-5 bg-[#E8EDF3]/40 space-y-3 flex-1 text-xs">
                {isPending ? (
                  <div className="p-3 bg-white/80 rounded-2xl border border-dashed border-[#DDE4EC] text-[#7C8998] text-[11px] space-y-1">
                    <div className="font-semibold text-[#253142] flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pending External Release</span>
                    </div>
                    <p className="text-[10px] text-[#A0ACBA]">
                      Target APIs and database schema currently in development. Pre-configured integration interface ready.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-3 bg-white rounded-2xl border border-[#DDE4EC] shadow-atmo-card">
                        <div className="text-[10px] text-[#7C8998] font-medium">Synchronized Records</div>
                        <div className="text-base font-extrabold text-[#253142] mt-0.5 font-mono">
                          {item.syncedRecordsCount || 0}
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded-2xl border border-[#DDE4EC] shadow-atmo-card">
                        <div className="text-[10px] text-[#7C8998] font-medium">Last Sync Status</div>
                        <div className="text-xs font-bold text-[#2563EB] mt-1 capitalize font-mono">
                          {item.lastSyncStatus || 'Never Synced'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-[#7C8998] pt-1">
                      <div className="flex items-center justify-between">
                        <span>Last Successful Sync:</span>
                        <span className="font-mono text-[#253142] font-medium">
                          {item.lastSyncAt ? new Date(item.lastSyncAt).toLocaleTimeString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Source Engine:</span>
                        <span className="font-mono text-[#253142] font-medium">{item.sourceType}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-[#F4F7FA] border-t border-[#DDE4EC] flex items-center justify-between gap-2">
                {isPending ? (
                  <>
                    <button
                      onClick={() => setInfotechReqModalOpen(true)}
                      className="flex-1 px-3 py-2 text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#FFE6D5] rounded-2xl transition-all text-center border border-[#BFDBFE]"
                    >
                      View Requirements
                    </button>
                    <button
                      onClick={() => showToast('warn', 'Configuration is locked until external endpoints are released.')}
                      className="px-3 py-2 text-xs font-semibold text-[#7C8998] bg-[#E8EDF3] hover:bg-[#DDE4EC] rounded-2xl transition-all"
                    >
                      Configure Later
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleTestConnection(item.key)}
                        disabled={isTesting}
                        className="px-3 py-1.5 text-xs font-semibold text-[#253142] bg-[#E8EDF3] border border-[#DDE4EC] hover:bg-[#DDE4EC] rounded-2xl transition-all shadow-atmo-btn flex items-center gap-1.5"
                        title="Ping source database/API"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-[#2563EB]' : ''}`} />
                        <span>Test</span>
                      </button>

                      <button
                        onClick={() => handleOpenConfig(item)}
                        className="p-2 text-[#7C8998] hover:text-[#253142] hover:bg-[#E8EDF3] rounded-2xl border border-transparent hover:border-[#DDE4EC] transition-all"
                        title="Integration Configuration"
                      >
                        <Settings2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenLogs(item)}
                        className="p-2 text-[#7C8998] hover:text-[#253142] hover:bg-[#E8EDF3] rounded-2xl border border-transparent hover:border-[#DDE4EC] transition-all"
                        title="View Sync History & Logs"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleTriggerSync(item.key, 'INCREMENTAL')}
                        disabled={isSyncing}
                        className="px-3 py-1.5 text-xs font-semibold text-[#253142] bg-[#E8EDF3] border border-[#DDE4EC] hover:bg-[#DDE4EC] rounded-2xl transition-all shadow-atmo-btn"
                        title="Sync updated records since last sync"
                      >
                        <span>Sync</span>
                      </button>

                      <button
                        onClick={() => handleTriggerSync(item.key, 'FULL')}
                        disabled={isSyncing}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-2xl shadow-md shadow-blue-500/25 transition-all flex items-center gap-1"
                        title="Full catalog synchronization"
                      >
                        {isSyncing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Syncing...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Full Sync</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Synchronized Records Explorer */}
      <div className="bg-[#F4F7FA] rounded-3xl border border-[#DDE4EC] shadow-atmo-card overflow-hidden">
        {/* Table Header */}
        <div className="p-5 border-b border-[#DDE4EC] bg-[#E3E9F0]/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#253142] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2563EB]" />
              <span>Synchronized Business Records Repository</span>
            </h2>
            <p className="text-xs text-[#7C8998]">
              Composite uniqueness records unified across independent source databases
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by System */}
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-3 py-2 bg-[#E8EDF3]/70 border border-[#DDE4EC] rounded-xl text-xs font-semibold text-[#253142] shadow-atmo-well focus:outline-none focus:border-[#2563EB]"
            >
              <option value="ALL">All Sources</option>
              <option value="arshithfresh">ArshithFresh (MongoDB)</option>
              <option value="codelekho">CodeLekho (Supabase)</option>
            </select>

            {/* Filter by Entity */}
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="px-3 py-2 bg-[#E8EDF3]/70 border border-[#DDE4EC] rounded-xl text-xs font-semibold text-[#253142] shadow-atmo-well focus:outline-none focus:border-[#2563EB]"
            >
              <option value="ALL">All Entities</option>
              <option value="product">Products</option>
              <option value="order">Orders</option>
              <option value="customer">Customers</option>
              <option value="supplier">Suppliers</option>
              <option value="course">Courses</option>
              <option value="learner">Learners</option>
              <option value="certificate">Certificates</option>
              <option value="submission">Submissions</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#7C8998] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name or ID..."
                value={recordSearch}
                onChange={(e) => setRecordSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchRecords(1)}
                className="pl-8 pr-3 py-2 bg-[#E8EDF3]/70 border border-[#DDE4EC] rounded-xl text-xs text-[#253142] shadow-atmo-well focus:outline-none focus:border-[#2563EB] w-48"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#E3E9F0] text-[#7C8998] uppercase tracking-wider font-mono text-[10px] border-b border-[#DDE4EC]">
              <tr>
                <th className="px-5 py-3">Source System</th>
                <th className="px-5 py-3">Entity Type</th>
                <th className="px-5 py-3">Record Name / Title</th>
                <th className="px-5 py-3">Source ID</th>
                <th className="px-5 py-3">Amount (₹)</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Sync Timestamp</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {loadingRecords ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400 font-medium">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
                    <span>Loading synchronized records...</span>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <div className="font-semibold text-slate-600">No synchronized records found</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Click "Full Sync" on one of the integrations above to populate real records.
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.compositeKey} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-800 flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          r.sourceSystem === 'arshithfresh' ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`}
                      ></span>
                      <span className="capitalize">{r.sourceSystem}</span>
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px] text-slate-500 uppercase">
                      {r.entityType}
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900 max-w-xs truncate">
                      {r.name}
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-500 text-[11px]">
                      {r.sourceRecordId}
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-800">
                      {r.amount !== null && r.amount !== undefined ? `₹${Number(r.amount).toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono bg-slate-100 text-slate-700">
                        {r.status || 'SYNCED'}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-500 text-[11px]">
                      {r.syncTimestamp ? new Date(r.syncTimestamp).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setSelectedPayloadRecord(r)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        {recordsTotalPages > 1 && (
          <div className="p-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing {records.length} of {recordsTotal} synchronized entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchRecords(recordsPage - 1)}
                disabled={recordsPage <= 1}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="font-mono px-2 font-medium">
                {recordsPage} / {recordsTotalPages}
              </span>
              <button
                onClick={() => fetchRecords(recordsPage + 1)}
                disabled={recordsPage >= recordsTotalPages}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Configure Integration */}
      {configModalIntegration && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Configure {configModalIntegration.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Engine: {configModalIntegration.sourceType}
                </p>
              </div>
              <button
                onClick={() => setConfigModalIntegration(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {configModalIntegration.key === 'arshithfresh' ? (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      MongoDB Atlas Connection URI
                    </label>
                    <input
                      type="text"
                      value={configPayload.mongoUri || ''}
                      onChange={(e) => setConfigPayload({ ...configPayload, mongoUri: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="mongodb+srv://user:pass@cluster0.../arshith_Fresh"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Protected backend connection string. Stored securely on server.
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Database Name</label>
                    <input
                      type="text"
                      value={configPayload.database || ''}
                      onChange={(e) => setConfigPayload({ ...configPayload, database: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="arshith_Fresh"
                    />
                  </div>
                </>
              ) : configModalIntegration.key === 'codelekho' ? (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Supabase Project URL
                    </label>
                    <input
                      type="text"
                      value={configPayload.supabaseUrl || ''}
                      onChange={(e) => setConfigPayload({ ...configPayload, supabaseUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="https://xyzcompany.supabase.co"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Supabase Service Role Secret Key
                    </label>
                    <input
                      type="password"
                      value={configPayload.supabaseKey || ''}
                      onChange={(e) => setConfigPayload({ ...configPayload, supabaseKey: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="sb_secret_... or eyJhbGciOiJIUzI1Ni..."
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Server-side secret key used exclusively for read-only replication.
                    </p>
                  </div>
                </>
              ) : null}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Connection Timeout (ms)</label>
                <input
                  type="number"
                  value={configPayload.timeoutMs || 5000}
                  onChange={(e) => setConfigPayload({ ...configPayload, timeoutMs: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setConfigModalIntegration(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Sync History & Logs */}
      {logsModalIntegration && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {logsModalIntegration.name} - Sync Jobs & Audit Logs
                </h3>
                <p className="text-xs text-slate-500">
                  Immutable audit trail of data synchronization runs
                </p>
              </div>
              <button onClick={() => setLogsModalIntegration(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 mb-2 uppercase text-[10px] tracking-wider font-mono">
                  Recent Sync Jobs
                </h4>
                {loadingLogs ? (
                  <div className="py-8 text-center text-slate-400">Loading audit history...</div>
                ) : syncJobs.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-400">
                    No sync jobs recorded yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {syncJobs.map((j) => (
                      <div
                        key={j.id}
                        className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-[11px] space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 font-mono">{j.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-semibold font-mono ${
                              j.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : j.status === 'RUNNING'
                                ? 'bg-blue-100 text-blue-800 animate-pulse'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {j.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-slate-600 text-[10px] pt-1">
                          <div>Fetched: <strong className="text-slate-900">{j.totalFetched}</strong></div>
                          <div>Created: <strong className="text-emerald-700">{j.created}</strong></div>
                          <div>Updated: <strong className="text-blue-700">{j.updated}</strong></div>
                          <div>Skipped: <strong className="text-slate-500">{j.skipped}</strong></div>
                        </div>
                        <div className="text-[10px] text-slate-400 pt-0.5">
                          Started: {new Date(j.startTime).toLocaleString()}
                        </div>
                        {j.errorDetails && (
                          <div className="p-2 bg-rose-50 text-rose-800 rounded-lg text-[10px] font-mono mt-1">
                            Error: {j.errorDetails}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2 uppercase text-[10px] tracking-wider font-mono">
                  Detailed Diagnostic Logs
                </h4>
                <div className="p-3 bg-slate-950 text-slate-300 font-mono text-[11px] rounded-xl max-h-48 overflow-y-auto space-y-1">
                  {syncLogs.length === 0 ? (
                    <div className="text-slate-500">No logs captured.</div>
                  ) : (
                    syncLogs.map((l) => (
                      <div key={l.id} className="leading-tight">
                        <span className="text-slate-500">[{new Date(l.createdAt).toLocaleTimeString()}]</span>{' '}
                        <span
                          className={`font-semibold ${
                            l.level === 'ERROR'
                              ? 'text-rose-400'
                              : l.level === 'WARN'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {l.level}:
                        </span>{' '}
                        <span>{l.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-right">
              <button
                onClick={() => setLogsModalIntegration(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Inspect Raw Payload */}
      {selectedPayloadRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-mono">
                  {selectedPayloadRecord.compositeKey}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Normalized Entity: {selectedPayloadRecord.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedPayloadRecord(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-[11px] leading-relaxed">
              <pre>{JSON.stringify(selectedPayloadRecord.rawPayload, null, 2)}</pre>
            </div>

            <div className="pt-2 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedPayloadRecord(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Arshith Infotech Requirements */}
      {infotechReqModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Arshith Infotech — Integration Requirements
                </h3>
                <p className="text-xs text-slate-500">Future Central Connector Specification</p>
              </div>
              <button onClick={() => setInfotechReqModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 leading-relaxed text-slate-600">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Status: Pending Integration</strong>
                  <p className="text-[11px] mt-0.5">
                    The external database and APIs for Arshith Infotech are currently under deployment. The connector will activate automatically once endpoints are provided.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Expected Connector Architecture:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>Authentication: Bearer JWT or API Key token validation</li>
                  <li>Protocol: RESTful JSON over HTTPS</li>
                  <li>Required Endpoints: <code>/api/projects</code>, <code>/api/contracts</code>, <code>/api/billing</code></li>
                  <li>Direction: Read-only replication into Central Inventory platform</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-right">
              <button
                onClick={() => setInfotechReqModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

