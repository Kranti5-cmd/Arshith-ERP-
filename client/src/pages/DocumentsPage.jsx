import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FileText, Download, Search, Filter } from 'lucide-react';

export const DocumentsPage = ({ onSelectProject }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docTypeFilter, setDocTypeFilter] = useState('ALL');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (docTypeFilter !== 'ALL') params.append('docType', docTypeFilter);
        const res = await api.getDocuments(params.toString());
        if (res.success) setDocs(res.documents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [docTypeFilter]);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5 max-w-7xl mx-auto text-xs max-w-full overflow-x-hidden font-sans animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium">
          <span>Atmosphere</span>
          <span>&rsaquo;</span>
          <span>Repository</span>
          <span>&rsaquo;</span>
          <span className="text-[#253142] font-semibold">Documents</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#253142] tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#2563EB]" /> Enterprise Document Repository
        </h1>
        <p className="text-xs text-[#7C8998] mt-0.5">
          Proposals, client agreements, SRS documents, architectural specifications and invoices across all projects.
        </p>
      </div>

      <div className="bg-[#F4F7FA] p-4 rounded-3xl border border-[#DDE4EC] shadow-atmo-card flex items-center gap-3">
        <select
          value={docTypeFilter}
          onChange={(e) => setDocTypeFilter(e.target.value)}
          className="px-4 py-2 bg-[#E8EDF3]/70 border border-[#DDE4EC] rounded-xl text-[#253142] font-semibold shadow-atmo-well focus:outline-none focus:border-[#2563EB]"
        >
          <option value="ALL">All Document Types</option>
          <option value="Project Proposal">Project Proposals</option>
          <option value="Client Agreement">Client Agreements</option>
          <option value="SRS Document">SRS Documents</option>
          <option value="Quotations">Quotations</option>
          <option value="Invoices">Invoices</option>
          <option value="Technical Documents">Technical Documents</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((d) => (
          <div key={d.id} className="bg-[#F4F7FA] p-5 rounded-3xl border border-[#DDE4EC] shadow-atmo-card hover:shadow-atmo-card-lg transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center font-bold shadow-atmo-btn">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] bg-white text-[#253142] px-2.5 py-1 rounded-full font-bold shadow-atmo-btn border border-[#DDE4EC]">
                {d.version}
              </span>
            </div>

            <div>
              <div className="font-bold text-[#253142] text-sm line-clamp-1">{d.title}</div>
              <div className="text-[10px] text-[#2563EB] font-semibold mt-0.5">{d.docType}</div>
              {d.description && <div className="text-[#7C8998] text-[11px] mt-1 line-clamp-2">{d.description}</div>}
            </div>

            <div className="pt-3 border-t border-[#DDE4EC] flex items-center justify-between text-[11px]">
              <button
                onClick={() => d.project && onSelectProject(d.project.id)}
                className="font-mono text-[#2563EB] hover:underline font-bold"
              >
                {d.project ? d.project.projectId : 'Project'}
              </button>
              <a
                href={d.fileUrl}
                download={d.fileName}
                className="flex items-center gap-1 text-[#7C8998] hover:text-[#253142] font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

