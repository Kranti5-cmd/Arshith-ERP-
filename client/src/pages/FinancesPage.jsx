import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { IndianRupee, CheckCircle2, XCircle, AlertTriangle, Filter, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const formatINR = (val) => {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
};

export const FinancesPage = ({ onSelectProject }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalFilter, setApprovalFilter] = useState('ALL');

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (approvalFilter !== 'ALL') params.append('approvalStatus', approvalFilter);
      const res = await api.getExpenses(params.toString());
      if (res.success) setExpenses(res.expenses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [approvalFilter]);

  const handleApprove = async (id, status) => {
    try {
      await api.updateExpenseStatus(id, { approvalStatus: status });
      fetchExpenses();
    } catch (err) {
      alert(err.message);
    }
  };

  const totalExpenseVal = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const approvedExpenseVal = expenses
    .filter((e) => e.approvalStatus === 'APPROVED')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const pendingExpenseVal = expenses
    .filter((e) => e.approvalStatus === 'PENDING')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5 max-w-7xl mx-auto text-xs max-w-full overflow-x-hidden font-sans animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium">
          <span>Atmosphere</span>
          <span>&rsaquo;</span>
          <span>Financials</span>
          <span>&rsaquo;</span>
          <span className="text-[#253142] font-semibold">Ledger & Spend</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#253142] tracking-tight flex items-center gap-2">
          <IndianRupee className="w-6 h-6 text-[#2563EB]" /> Budget & Expense Financial Management
        </h1>
        <p className="text-xs text-[#7C8998] mt-0.5">
          Central financial tracking of software licenses, infrastructure, vendor payouts and client receipts.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-[#F4F7FA] rounded-3xl border border-[#DDE4EC] shadow-atmo-card">
          <div className="text-[11px] font-bold text-[#7C8998] uppercase">Total Logged Expenses</div>
          <div className="text-2xl font-extrabold text-[#253142] mt-1">{formatINR(totalExpenseVal)}</div>
          <div className="text-[10px] text-[#A0ACBA] mt-1">{expenses.length} transaction entries</div>
        </div>

        <div className="p-5 bg-[#EFF6FF] rounded-3xl border border-[#BFDBFE] shadow-atmo-card">
          <div className="text-[11px] font-bold text-[#2563EB] uppercase">Approved Expenditures</div>
          <div className="text-2xl font-extrabold text-[#2563EB] mt-1">{formatINR(approvedExpenseVal)}</div>
          <div className="text-[10px] text-[#2563EB]/70 mt-1">Deducted from project budgets</div>
        </div>

        <div className="p-5 bg-amber-500/10 rounded-3xl border border-amber-200 shadow-atmo-card">
          <div className="text-[11px] font-bold text-amber-800 uppercase">Pending Finance Approval</div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">{formatINR(pendingExpenseVal)}</div>
          <div className="text-[10px] text-amber-700/70 mt-1">Awaiting CFO/Finance Manager clearance</div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-[#F4F7FA] p-4 rounded-3xl border border-[#DDE4EC] shadow-atmo-card flex items-center gap-3">
        <select
          value={approvalFilter}
          onChange={(e) => setApprovalFilter(e.target.value)}
          className="px-4 py-2 bg-[#E8EDF3]/70 border border-[#DDE4EC] rounded-xl text-[#253142] font-semibold text-xs shadow-atmo-well focus:outline-none focus:border-[#2563EB]"
        >
          <option value="ALL">All Approval Statuses</option>
          <option value="PENDING">Pending Approval</option>
          <option value="APPROVED">Approved Expenses</option>
          <option value="REJECTED">Rejected Expenses</option>
        </select>
      </div>

      {/* Expense Ledger */}
      <div className="bg-[#F4F7FA] rounded-3xl border border-[#DDE4EC] shadow-atmo-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#E3E9F0] border-b border-[#DDE4EC] text-[#7C8998] font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Expense ID</th>
              <th className="py-3 px-4">Project</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Amount (₹)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE4EC]">
            {expenses.map((e) => (
              <tr key={e.id} className="hover:bg-[#E8EDF3]/40 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-[#2563EB]">{e.expenseId}</td>
                <td className="py-2.5 px-4">
                  <button
                    onClick={() => e.project && onSelectProject(e.project.id)}
                    className="font-mono text-blue-800 hover:underline font-bold"
                  >
                    {e.project ? e.project.projectId : 'N/A'}
                  </button>
                </td>
                <td className="py-2.5 px-4 font-medium text-slate-800">{e.expenseCategory}</td>
                <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate">{e.description}</td>
                <td className="py-2.5 px-4 text-slate-600">{e.vendor || '—'}</td>
                <td className="py-2.5 px-4 font-mono text-slate-500">{e.transactionDate}</td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatINR(e.amount)}</td>
                <td className="py-2.5 px-4 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      e.approvalStatus === 'APPROVED'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : e.approvalStatus === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {e.approvalStatus}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right">
                  {e.approvalStatus === 'PENDING' &&
                    (user?.roleName === 'SUPER_ADMIN' || user?.roleName === 'FINANCE_MANAGER') && (
                      <div className="flex items-center justify-end gap-1 font-semibold">
                        <button
                          onClick={() => handleApprove(e.id, 'APPROVED')}
                          className="text-blue-600 hover:underline"
                        >
                          Approve
                        </button>
                        <span className="text-slate-300">|</span>
                        <button onClick={() => handleApprove(e.id, 'REJECTED')} className="text-rose-600 hover:underline">
                          Reject
                        </button>
                      </div>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

