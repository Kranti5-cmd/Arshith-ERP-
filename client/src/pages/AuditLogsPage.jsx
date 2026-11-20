import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { History, Shield, Filter, Search } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (entityFilter !== 'ALL') params.append('entityType', entityFilter);
      const res = await api.getAuditLogs(params.toString());
      if (res.success) setLogs(res.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [entityFilter]);

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto text-xs">
      <div>
        <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium">
          <span>Atmosphere</span>
          <span>&rsaquo;</span>
          <span>Security</span>
          <span>&rsaquo;</span>
          <span className="text-[#253142] font-semibold">Audit Logs</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#253142] tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-[#2563EB]" /> Enterprise Governance Audit Logs
        </h1>
        <p className="text-xs text-[#7C8998] mt-0.5">
          Tamper-evident record of all system events, approvals, financial disbursements, and status modifications.
        </p>
      </div>

      <div className="flex items-center justify-between bg-[#F4F7FA] p-4 rounded-3xl border border-[#DDE4EC] shadow-atmo-card">
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="px-4 py-2 bg-[#E8EDF3]/70 border border-[#DDE4EC] rounded-xl text-[#253142] font-semibold shadow-atmo-well focus:outline-none focus:border-[#2563EB]"
        >
          <option value="ALL">All Entity Audits</option>
          <option value="PROJECT">Projects</option>
          <option value="EXPENSE">Expenses & Financials</option>
          <option value="STATUS">Status Workflow Transitions</option>
          <option value="ASSIGNMENT">Employee Assignments</option>
          <option value="USER">User Authentication</option>
        </select>
      </div>

      <div className="bg-[#F4F7FA] rounded-3xl border border-[#DDE4EC] shadow-atmo-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#E3E9F0] border-b border-[#DDE4EC] text-[#7C8998] font-bold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Performed By</th>
                <th className="py-3 px-4">Audit Payload Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE4EC] font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#E8EDF3]/40 transition-colors">
                  <td className="py-3 px-4 text-[#7C8998] whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#253142]">{log.entityType}</td>
                  <td className="py-3 px-4 font-bold text-[#2563EB]">{log.action}</td>
                  <td className="py-3 px-4 text-[#253142] font-sans">
                    {log.performedBy ? `${log.performedBy.name} (${log.performedBy.role})` : 'System Daemon'}
                  </td>
                  <td className="py-3 px-4 text-[#7C8998] max-w-md truncate">
                    {JSON.stringify(log.changes || {})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

