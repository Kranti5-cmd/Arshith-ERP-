import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Milestone, Calendar, CheckCircle2, Clock } from 'lucide-react';

export const MilestonesPage = ({ onSelectProject }) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setLoading(true);
        const res = await api.getMilestones();
        if (res.success) setMilestones(res.milestones);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMilestones();
  }, []);

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto text-xs">
      <div>
        <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium"><span>Atmosphere</span><span>&rsaquo;</span><span>Delivery</span><span>&rsaquo;</span><span className="text-[#253142] font-semibold">Milestones</span></div>
        <h1 className="text-2xl font-extrabold text-[#253142] tracking-tight flex items-center gap-2">
          <Milestone className="w-6 h-6 text-[#2563EB]" /> Contractual Project Milestones
        </h1>
        <p className="text-xs text-[#7C8998] mt-0.5">
          Delivery checkpoints, technical signoffs and customer billing milestones across the company portfolio.
        </p>
      </div>

      <div className="bg-[#F4F7FA] rounded-3xl border border-[#DDE4EC] shadow-atmo-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#E3E9F0] border-b border-[#DDE4EC] text-[#7C8998] font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Milestone ID</th>
              <th className="py-2.5 px-4">Milestone Name</th>
              <th className="py-2.5 px-4">Responsible Lead</th>
              <th className="py-2.5 px-4">Planned Date</th>
              <th className="py-2.5 px-4">Actual Completion</th>
              <th className="py-2.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE4EC]">
            {milestones.map((m) => (
              <tr key={m.id} className="hover:bg-[#E8EDF3]/40 transition-colors">
                <td className="py-2.5 px-4 font-mono font-bold text-[#2563EB]">{m.milestoneId}</td>
                <td className="py-2.5 px-4">
                  <div className="font-semibold text-slate-900">{m.name}</div>
                  <div className="text-[11px] text-slate-500">{m.description}</div>
                </td>
                <td className="py-2.5 px-4 text-slate-700">{m.responsibleEmployee?.name || 'Assigned Lead'}</td>
                <td className="py-2.5 px-4 font-mono text-slate-600">{m.plannedDate}</td>
                <td className="py-2.5 px-4 font-mono text-blue-600">{m.actualDate || '—'}</td>
                <td className="py-2.5 px-4 text-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      m.completionStatus === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800'
                        : m.completionStatus === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {m.completionStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

