import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Calendar as CalendarIcon, Clock, AlertTriangle, Layers, Users } from 'lucide-react';

export const CalendarPage = ({ onSelectProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date('2026-11-12');

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        const res = await api.getProjects('limit=100');
        if (res.success) {
          setProjects(res.projects);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const activeProjects = projects.filter((p) => !['REJECTED', 'CANCELLED'].includes(p.status));

  // Months for timeline header (Jan 2026 - Dec 2026)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getPositionPercentage = (dateStr) => {
    if (!dateStr) return 0;
    const d = new Date(dateStr);
    const startYear = new Date('2026-01-01');
    const endYear = new Date('2026-12-31');
    const totalMs = endYear - startYear;
    const currentMs = d - startYear;
    return Math.max(0, Math.min(100, (currentMs / totalMs) * 100));
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto text-xs">
      <div>
        <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium">
          <span>Atmosphere</span>
          <span>&rsaquo;</span>
          <span>Projects</span>
          <span>&rsaquo;</span>
          <span className="text-[#253142] font-semibold">Calendar & Timeline</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#253142] tracking-tight flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-[#2563EB]" /> Project Calendar & Gantt Timeline
        </h1>
        <p className="text-xs text-[#7C8998] mt-0.5">
          Visualize multi-project development schedules, resource overlap conflicts, and delivery deadlines.
        </p>
      </div>

      {/* Gantt Chart View */}
      <div className="bg-[#F4F7FA] rounded-3xl border border-[#DDE4EC] shadow-atmo-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4EC]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
            <span className="font-bold text-[#253142]">2026 Enterprise Portfolio Gantt Timeline</span>
          </div>
          <span className="text-[11px] font-mono text-[#7C8998]">Current Simulation Date: Nov 12, 2026</span>
        </div>

        {/* Timeline Header Months */}
        <div className="grid grid-cols-12 gap-1 text-center font-mono text-[10px] font-bold text-[#7C8998] uppercase py-2.5 bg-[#E8EDF3]/70 rounded-2xl border border-[#DDE4EC] shadow-atmo-well">
          {months.map((m) => (
            <div key={m}>{m}</div>
          ))}
        </div>

        {/* Project Gantt Bars */}
        <div className="space-y-4 pt-2">
          {activeProjects.map((p) => {
            const startPct = getPositionPercentage(p.plannedStartDate || p.receivedDate);
            const endPct = getPositionPercentage(p.expectedCompletionDate || '2026-12-31');
            const barWidth = Math.max(8, endPct - startPct);
            const isOverdue = p.isOverdue;

            return (
              <div key={p.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => onSelectProject(p.id)}
                    className="font-bold text-[#253142] hover:text-[#2563EB] flex items-center gap-2 transition-colors"
                  >
                    <span className="font-mono text-[#2563EB]">{p.projectId}</span>
                    <span>{p.title}</span>
                  </button>
                  <div className="flex items-center gap-3 text-[#7C8998] font-mono text-[10px]">
                    <span>{p.plannedStartDate || 'Start'}</span>
                    <span>→</span>
                    <span className={isOverdue ? 'text-red-500 font-bold' : ''}>
                      {p.expectedCompletionDate || 'End'}
                    </span>
                  </div>
                </div>

                {/* Progress & Timeline Bar Track */}
                <div className="relative h-6 bg-[#E8EDF3] rounded-xl overflow-hidden border border-[#DDE4EC] shadow-atmo-well">
                  <div
                    className={`absolute top-0 bottom-0 rounded-lg flex items-center px-2 text-[10px] text-white font-bold transition-all shadow-xs ${
                      isOverdue
                        ? 'bg-red-500'
                        : p.status === 'COMPLETED' || p.status === 'DELIVERED'
                        ? 'bg-emerald-500'
                        : p.status === 'ON_HOLD'
                        ? 'bg-amber-500'
                        : 'bg-[#2563EB]'
                    }`}
                    style={{ left: `${startPct}%`, width: `${barWidth}%` }}
                  >
                    <span className="truncate">{p.completionPercentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

