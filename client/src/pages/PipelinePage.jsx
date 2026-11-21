import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ArrowRight, Eye, AlertTriangle, Users } from 'lucide-react';

const formatINR = (val) => {
  const num = Number(val) || 0;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  return `₹${num.toLocaleString('en-IN')}`;
};

export const PipelinePage = ({ onSelectProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const stages = [
    { id: 'NEW', label: '1. New Intake', color: 'border-sky-500' },
    { id: 'UNDER_REVIEW', label: '2. Under Review', color: 'border-indigo-500' },
    { id: 'ACCEPTED', label: '3. Accepted', color: 'border-blue-500' },
    { id: 'APPROVED', label: '4. Approved', color: 'border-blue-600' },
    { id: 'ASSIGNED', label: '5. Assigned', color: 'border-slate-500' },
    { id: 'IN_PROGRESS', label: '6. In Progress', color: 'border-blue-600' },
    { id: 'TESTING', label: '7. Testing & QA', color: 'border-amber-500' },
    { id: 'COMPLETED', label: '8. Completed', color: 'border-teal-600' },
    { id: 'DELIVERED', label: '9. Delivered', color: 'border-teal-700' },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.getProjects('limit=100');
        if (res.success) setProjects(res.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5 max-w-7xl mx-auto max-w-full overflow-x-hidden font-sans animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium">
          <span>Atmosphere</span>
          <span>&rsaquo;</span>
          <span>Projects</span>
          <span>&rsaquo;</span>
          <span className="text-[#253142] font-semibold">Pipeline</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#253142] tracking-tight">Project Portfolio Pipeline Workflow</h1>
        <p className="text-xs text-[#7C8998] mt-0.5">
          End-to-end lifecycle visual pipeline tracking from intake to completion and client delivery.
        </p>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div className="flex gap-4 min-w-max">
          {stages.map((st) => {
            const stageProjects = projects.filter((p) => p.status === st.id);
            return (
              <div
                key={st.id}
                className="w-72 bg-[#E3E9F0]/70 p-3.5 rounded-3xl border border-[#DDE4EC] shadow-atmo-well flex flex-col min-h-[520px]"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#DDE4EC]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                    <span className="font-bold text-xs text-[#253142]">{st.label}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#253142] text-[10px] font-bold shadow-atmo-btn border border-[#DDE4EC]">
                    {stageProjects.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {stageProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onSelectProject(p.id)}
                      className="bg-[#F4F7FA] p-3.5 rounded-2xl border border-[#DDE4EC] shadow-atmo-card hover:shadow-atmo-card-lg cursor-pointer transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold text-[#2563EB]">{p.projectId}</span>
                        <span className="text-[#7C8998] font-medium">{p.priority}</span>
                      </div>

                      <div className="font-bold text-[#253142] line-clamp-2">{p.title}</div>
                      <div className="text-[11px] text-[#7C8998] truncate">{p.client?.companyName}</div>

                      <div className="pt-2 border-t border-[#DDE4EC] flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-[#2563EB]">{formatINR(p.approvedBudget)}</span>
                        <span className="font-mono text-[#7C8998] font-medium">{p.completionPercentage}%</span>
                      </div>
                    </div>
                  ))}

                  {stageProjects.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-[#A0ACBA] text-xs italic">
                      No projects currently in {st.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

