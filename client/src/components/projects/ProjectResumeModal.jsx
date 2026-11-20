import React, { useState } from 'react';
import { X, PlayCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const ProjectResumeModal = ({ isOpen, onClose, onSuccess, project }) => {
  const [resumeRemarks, setResumeRemarks] = useState('');
  const [targetStatus, setTargetStatus] = useState('IN_PROGRESS');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.resumeProject(project.id, {
        resumeRemarks: resumeRemarks || 'Resumed by authorized manager',
        targetStatus,
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
      <div className="bg-[#F4F7FA] rounded-3xl max-w-md w-full p-6 shadow-atmo-card-lg border border-[#DDE4EC] text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4EC]">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-[#2563EB]" />
            <div>
              <h3 className="text-sm font-bold text-[#253142]">Resume On-Hold Project</h3>
              <p className="text-[11px] text-[#7C8998] font-mono">
                {project.projectId} – {project.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#A0ACBA] hover:text-[#253142]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="p-3 bg-[#E8EDF3]/70 rounded-2xl border border-[#DDE4EC] shadow-atmo-well text-[#253142] text-xs">
            Resuming this project will record the end of the hold duration in the historical audit ledger and reactivate
            sprint execution.
          </div>

          <div>
            <label className="block text-[#253142] font-semibold mb-1">Resume to Workflow State</label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value)}
              className="w-full p-2.5 border border-[#DDE4EC] rounded-xl bg-[#E8EDF3]/60 focus:bg-white focus:border-[#2563EB] text-xs font-semibold text-[#253142] outline-none"
            >
              <option value="IN_PROGRESS">In Progress (Active Development)</option>
              <option value="TESTING">Testing / QA Verification</option>
              <option value="ASSIGNED">Assigned (Team Allocation Review)</option>
            </select>
          </div>

          <div>
            <label className="block text-[#253142] font-semibold mb-1">Resume Remarks / Clearance Reason</label>
            <textarea
              rows={3}
              placeholder="e.g. Client ethics committee clearance received; resuming data ingestion pipeline."
              value={resumeRemarks}
              onChange={(e) => setResumeRemarks(e.target.value)}
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
              {loading ? 'Resuming...' : 'Confirm Resume'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

