import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BarChart3, Download, RefreshCw, FileSpreadsheet, Filter } from 'lucide-react';

export const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('1');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const reportList = [
    { id: '1', label: '1. Complete Project Inventory' },
    { id: '2', label: '2. Project-wise Budget Allocation' },
    { id: '3', label: '3. Actual Expenditure Breakdown' },
    { id: '4', label: '4. Accepted Projects Report' },
    { id: '5', label: '5. Rejected Projects Report' },
    { id: '6', label: '6. In-Progress Delivery Report' },
    { id: '7', label: '7. On-Hold Risk & Impact' },
    { id: '8', label: '8. Completed Projects Performance' },
    { id: '9', label: '9. Delivered & Warranty Report' },
    { id: '10', label: '10. Employee-wise Project Allocation' },
    { id: '11', label: '11. Employee Workload & Capacity' },
    { id: '12', label: '12. Project Manager Delivery' },
    { id: '13', label: '13. Client-wise Project Portfolio' },
    { id: '14', label: '14. Monthly Project Intake/Outflow' },
    { id: '15', label: '15. Delayed & Overdue Critical Report' },
    { id: '16', label: '16. Project Profitability & Cost Margin' },
  ];

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.getReportData(selectedReport, 'json');
      if (res.success) {
        setReportData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedReport]);

  const handleDownloadCSV = () => {
    window.open(`/api/reports?reportType=${selectedReport}&format=csv`, '_blank');
  };

  const rows = reportData?.data || [];
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5 max-w-7xl mx-auto text-xs max-w-full overflow-x-hidden font-sans animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium">
            <span>Atmosphere</span>
            <span>&rsaquo;</span>
            <span>Analytics</span>
            <span>&rsaquo;</span>
            <span className="text-[#253142] font-semibold">Reports Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#253142] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#2563EB]" /> Reports & Analytics Hub
          </h1>
          <p className="text-xs text-[#7C8998] mt-0.5">
            Audit-grade business intelligence and regulatory compliance reporting generated from live database records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-xs font-semibold shadow-md shadow-blue-500/25 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Selection Dropdown & Pills */}
      <div className="bg-[#F4F7FA] p-5 rounded-3xl border border-[#DDE4EC] shadow-atmo-card space-y-2">
        <label className="block text-[#253142] font-bold text-xs uppercase tracking-wider font-mono">
          Select Analytical Report
        </label>
        <select
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
          className="w-full p-3 border border-[#DDE4EC] rounded-xl bg-[#E8EDF3]/70 text-[#253142] font-semibold shadow-atmo-well focus:outline-none focus:border-[#2563EB] text-xs"
        >
          {reportList.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Report Table View */}
      <div className="bg-[#F4F7FA] rounded-3xl border border-[#DDE4EC] shadow-atmo-card overflow-hidden">
        <div className="p-4 border-b border-[#DDE4EC] bg-[#E3E9F0]/60 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[#253142] text-xs uppercase tracking-wider font-mono">
              {reportData?.title || 'Report Output'}
            </h2>
            <div className="text-[11px] text-[#7C8998] mt-0.5">
              Live Database Audit • Generated on {new Date().toLocaleDateString()}
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-white text-[#253142] font-mono font-bold text-[10px] shadow-atmo-btn border border-[#DDE4EC]">
            {rows.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#E3E9F0] text-[#7C8998] font-bold uppercase text-[10px] tracking-wider border-b border-[#DDE4EC] select-none">
              <tr>
                {headers.map((h, idx) => (
                  <th key={idx} className="py-3 px-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE4EC]">
              {loading ? (
                <tr>
                  <td colSpan={headers.length || 1} className="py-12 text-center text-[#7C8998]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#2563EB]" />
                    Compiling live dataset...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length || 1} className="py-8 text-center text-[#7C8998]">
                    No records found for this report criteria.
                  </td>
                </tr>
              ) : (
                rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#E8EDF3]/40 transition-colors">
                    {headers.map((header, cIdx) => (
                      <td key={cIdx} className="py-3 px-4 whitespace-nowrap text-[#253142]">
                        {header.includes('₹') || header.includes('Budget') || header.includes('Cost') || header.includes('Value') ? (
                          <span className="font-mono font-semibold text-[#2563EB]">
                            {typeof row[header] === 'number'
                              ? `₹${row[header].toLocaleString('en-IN')}`
                              : row[header]}
                          </span>
                        ) : (
                          row[header]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

