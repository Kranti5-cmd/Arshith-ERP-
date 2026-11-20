import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

export const StatusChangeModal = ({ isOpen, onClose, onSuccess, project }) => {
  const [newStatus, setNewStatus] = useState('');
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !project) return null;

  const validStatuses = [
    { id: 'NEW', label: '1. New' },
    { id: 'UNDER_REVIEW', label: '2. Under Review' },
    { id: 'ACCEPTED', label: '3. Accepted' },
    { id: 'REJECTED', label: '4. Rejected' },
    { id: 'APPROVED', label: '5. Approved' },
    { id: 'ASSIGNED', label: '6. Assigned' },
    { id: 'IN_PROGRESS', label: '7. In Progress' },
    { id: 'TESTING', label: '9. Testing' },
    { id: 'CANCELLED', label: '12. Cancelled' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newStatus) {
      alert('Please select a new target status');
      return;
    }
    if (!reason) {
      alert('A formal justification/reason is required for auditing status transitions');
      return;
    }

    try {
      setLoading(true);
      await api.changeStatus(project.id, {
        newStatus,
        reason,
        remarks,
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#253142]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#F4F7FA] rounded-3xl max-w-lg w-full p-6 shadow-atmo-card-lg border border-[#DDE4EC] text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4EC]">
          <div>
            <h3 className="text-sm font-bold text-[#253142]">Project Status Transition</h3>
            <p className="text-[11px] text-[#7C8998] font-mono mt-0.5">
              {project.projectId} – {project.title}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-[#A0ACBA] hover:text-[#253142]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Transition indicator */}
          <div className="p-3 bg-[#E8EDF3]/70 rounded-2xl border border-[#DDE4EC] shadow-atmo-well flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#7C8998] uppercase font-semibold">Current Status</div>
              <div className="font-bold text-[#253142] text-xs mt-0.5">{project.status.replace(/_/g, ' ')}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#A0ACBA]" />
            <div>
              <div className="text-[10px] text-[#7C8998] uppercase font-semibold">Target Status</div>
              <div className="font-bold text-[#2563EB] text-xs mt-0.5">
                {newStatus ? newStatus.replace(/_/g, ' ') : 'Select below'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#253142] font-semibold mb-1">Select New Status *</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
              className="w-full p-2.5 border border-[#DDE4EC] rounded-xl bg-[#E8EDF3]/60 focus:bg-white focus:border-[#2563EB] text-xs font-medium text-[#253142] outline-none"
            >
              <option value="">-- Choose Target Workflow State --</option>
              {validStatuses.map((s) => (
                <option key={s.id} value={s.id} disabled={s.id === project.status}>
                  {s.label} {s.id === project.status ? '(Current)' : ''}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-[#7C8998] mt-1">
              Note: To move to "On Hold", "Completed", or "Delivered", use the dedicated workflow action buttons in the
              header to ensure prerequisite checks are validated.
            </p>
          </div>

          <div>
            <label className="block text-[#253142] font-semibold mb-1">Reason for Transition *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sprint 1 kicked off / Advance payment credited / Client approved scope"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 border border-[#DDE4EC] rounded-xl bg-[#E8EDF3]/60 focus:bg-white focus:border-[#2563EB] text-[#253142] outline-none"
            />
          </div>

          <div>
            <label className="block text-[#253142] font-semibold mb-1">Remarks / Audit Note</label>
            <textarea
              rows={2}
              placeholder="Additional executive context or operational notes for the permanent history log."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2.5 border border-[#DDE4EC] rounded-xl bg-[#E8EDF3]/60 focus:bg-white focus:border-[#2563EB] text-[#253142] outline-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DDE4EC]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#DDE4EC] bg-[#E8EDF3] hover:bg-[#DDE4EC] text-[#253142] rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl shadow-md shadow-blue-500/25 transition-all"
            >
              {loading ? 'Recording...' : 'Confirm Status Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

