import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export const ProjectCompleteModal = ({ isOpen, onClose, onSuccess, project }) => {
  const [deploymentUrl, setDeploymentUrl] = useState(project?.deploymentUrl || '');
  const [gitRepoUrl, setGitRepoUrl] = useState(project?.gitRepoUrl || '');
  const [finalReportUrl, setFinalReportUrl] = useState(project?.finalReportUrl || '');
  const [managerApprovalRemarks, setManagerApprovalRemarks] = useState('');
  const [confirmedChecks, setConfirmedChecks] = useState({
    tasksDone: true,
    milestonesDone: true,
    testingDone: true,
    docsUploaded: true,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmedChecks.tasksDone || !confirmedChecks.milestonesDone || !confirmedChecks.testingDone) {
      alert('All quality assurance and milestone checkboxes must be confirmed.');
      return;
    }

    try {
      setLoading(true);
      await api.completeProject(project.id, {
        deploymentUrl,
        gitRepoUrl,
        finalReportUrl,
        managerApprovalRemarks: managerApprovalRemarks || 'All acceptance criteria validated and signed off by PM.',
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
    <div className="fixed inset-0 bg-[#253142]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-[#F4F7FA] rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-atmo-card-lg border border-[#DDE4EC] text-xs max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4EC]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-[#253142]">Project Completion Workflow Sign-Off</h3>
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
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-200 text-emerald-950 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Formal Completion Verification
            </div>
            <p className="text-[11px] text-emerald-900/80">
              Confirming this workflow records an authorized project manager approval, locks progress at 100%, and prepares
              the project for client delivery and handover.
            </p>
          </div>

          {/* Mandatory Checklist Items */}
          <div className="space-y-2 bg-[#E8EDF3]/70 p-3.5 rounded-2xl border border-[#DDE4EC] shadow-atmo-well">
            <div className="text-[11px] font-bold text-[#7C8998] uppercase tracking-wider font-mono">
              Prerequisite Completion Checklist
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-[#253142]">
              <input
                type="checkbox"
                checked={confirmedChecks.tasksDone}
                onChange={(e) => setConfirmedChecks({ ...confirmedChecks, tasksDone: e.target.checked })}
                className="w-4 h-4 text-[#2563EB] rounded accent-[#2563EB]"
              />
              <span>All mandatory development tasks and code reviews completed</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-[#253142]">
              <input
                type="checkbox"
                checked={confirmedChecks.milestonesDone}
                onChange={(e) => setConfirmedChecks({ ...confirmedChecks, milestonesDone: e.target.checked })}
                className="w-4 h-4 text-[#2563EB] rounded accent-[#2563EB]"
              />
              <span>All scheduled contractual milestones achieved</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-[#253142]">
              <input
                type="checkbox"
                checked={confirmedChecks.testingDone}
                onChange={(e) => setConfirmedChecks({ ...confirmedChecks, testingDone: e.target.checked })}
                className="w-4 h-4 text-[#2563EB] rounded accent-[#2563EB]"
              />
              <span>User Acceptance Testing (UAT) and security scan signed off</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-[#253142]">
              <input
                type="checkbox"
                checked={confirmedChecks.docsUploaded}
                onChange={(e) => setConfirmedChecks({ ...confirmedChecks, docsUploaded: e.target.checked })}
                className="w-4 h-4 text-[#2563EB] rounded accent-[#2563EB]"
              />
              <span>Required technical and user documentation uploaded</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#253142] font-semibold mb-1">Production / Deployment URL</label>
              <input
                type="url"
                placeholder="https://app.client.com"
                value={deploymentUrl}
                onChange={(e) => setDeploymentUrl(e.target.value)}
                className="w-full p-2.5 border border-[#DDE4EC] rounded-xl bg-[#E8EDF3]/60 focus:bg-white focus:border-[#2563EB] text-[#253142] font-mono text-[11px] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#253142] font-semibold mb-1">Git Repository URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={gitRepoUrl}
                onChange={(e) => setGitRepoUrl(e.target.value)}
                className="w-full p-2.5 border border-[#DDE4EC] rounded-xl bg-[#E8EDF3]/60 focus:bg-white focus:border-[#2563EB] text-[#253142] font-mono text-[11px] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#253142] font-semibold mb-1">Project Manager Approval Sign-Off Remarks</label>
            <textarea
              rows={2}
              placeholder="e.g. Code passed all unit tests; security clearance certificate attached; ready for client delivery."
              value={managerApprovalRemarks}
              onChange={(e) => setManagerApprovalRemarks(e.target.value)}
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm transition-all"
            >
              {loading ? 'Processing...' : 'Approve & Mark Completed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

