import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  Archive,
  RefreshCw,
  AlertTriangle,
  ArrowUpDown,
  ExternalLink,
  Users,
  Calendar,
  CheckCircle,
  MoreVertical,
  Building2,
  X,
  Clock,
  Sparkles,
  FolderGit2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const formatINR = (val) => {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
};

// Semantic status badges according to Atmosphere specification
const STATUS_BADGES = {
  NEW: { badge: 'bg-blue-50 text-[#2563EB] border-blue-200', dot: 'bg-[#2563EB]' },
  UNDER_REVIEW: { badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
  ACCEPTED: { badge: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-600' },
  APPROVED: { badge: 'bg-sky-50 text-sky-800 border-sky-300', dot: 'bg-sky-700' },
  ASSIGNED: { badge: 'bg-slate-100 text-[#253142] border-slate-300', dot: 'bg-[#7C8998]' },
  IN_PROGRESS: { badge: 'bg-blue-50 text-[#2563EB] border-orange-300', dot: 'bg-[#2563EB]' },
  TESTING: { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  ON_HOLD: { badge: 'bg-amber-100 text-amber-900 border-amber-300', dot: 'bg-amber-600' },
  COMPLETED: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-600' },
  DELIVERED: { badge: 'bg-emerald-100 text-emerald-900 border-emerald-300', dot: 'bg-emerald-700' },
  CANCELLED: { badge: 'bg-slate-100 text-[#7C8998] border-slate-300', dot: 'bg-[#A0ACBA]' },
  REJECTED: { badge: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-600' },
};

const PRIORITY_BADGES = {
  CRITICAL: 'bg-rose-100 text-rose-800 border-rose-200',
  HIGH: 'bg-amber-100 text-amber-800 border-amber-200',
  MEDIUM: 'bg-blue-50 text-[#2563EB] border-blue-200',
  LOW: 'bg-slate-100 text-[#7C8998] border-slate-200',
};

export const ProjectsPage = ({
  initialStatusFilter = 'ALL',
  onSelectProject,
  onOpenNewProjectModal,
  onOpenEditModal,
  onOpenStatusModal,
  onOpenHoldModal,
}) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'ALL' && statusFilter !== 'OVERDUE' && statusFilter !== 'UNASSIGNED') {
        params.append('status', statusFilter);
      }
      if (statusFilter === 'OVERDUE') params.append('overdueOnly', 'true');
      if (statusFilter === 'UNASSIGNED') params.append('unassignedOnly', 'true');
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await api.getProjects(params.toString());
      if (res.success) {
        setProjects(res.projects);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, statusFilter, categoryFilter, priorityFilter, sortBy, sortOrder]);

  const handleExportCSV = () => {
    if (projects.length === 0) return;
    const headers = ['Project ID', 'Title', 'Client', 'Category', 'Status', 'Priority', 'Budget (INR)', 'Progress %', 'Deadline'];
    const rows = projects.map((p) => [
      p.projectId,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.client?.companyName || ''}"`,
      `"${p.categoryName || ''}"`,
      p.status,
      p.priority,
      p.approvedBudget,
      p.completionPercentage,
      p.expectedCompletionDate || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Arshith_Infotech_Projects_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleArchive = async (project) => {
    if (!window.confirm(`Are you sure you want to archive project ${project.projectId} (${project.title})?`)) return;
    try {
      await api.archiveProject(project.id, { archiveReason: 'Archived via Admin project list view' });
      fetchProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (project) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete project ${project.projectId} (${project.title})?\n\nThis action will completely remove this project from the database inventory. This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      const res = await api.deleteProject(project.id, { reason: 'Permanently deleted by Admin' });
      if (res.success) {
        fetchProjects();
      } else {
        alert(res.message || 'Failed to delete project');
      }
    } catch (err) {
      alert('Error deleting project: ' + err.message);
    }
  };

  const statusTabButtons = [
    { id: 'ALL', label: 'All Projects' },
    { id: 'NEW', label: 'New' },
    { id: 'UNDER_REVIEW', label: 'Under Review' },
    { id: 'ACCEPTED', label: 'Accepted' },
    { id: 'APPROVED', label: 'Approved' },
    { id: 'ASSIGNED', label: 'Assigned' },
    { id: 'UNASSIGNED', label: 'Unassigned' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'ON_HOLD', label: 'On Hold' },
    { id: 'TESTING', label: 'Testing' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'DELIVERED', label: 'Delivered' },
    { id: 'OVERDUE', label: 'Overdue' },
    { id: 'REJECTED', label: 'Rejected' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto text-[#253142] font-sans">
      
      {/* 1. Atmosphere Page Title & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7C8998]">
            <span>Atmosphere</span>
            <span>&gt;</span>
            <span>Portfolio</span>
            <span>&gt;</span>
            <span className="text-[#253142] font-bold">Projects Inventory</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#253142] tracking-tight font-sans">
              Projects Repository
            </h1>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#F4F7FA] text-[#7C8998] border border-[#DDE4EC] shadow-atmo-card-sm font-mono">
              {projects.length} Records
            </span>
          </div>
          <p className="text-xs text-[#7C8998]">
            Central repository for contract specifications, budgets, milestone execution, and client deliveries.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleExportCSV}
            className="atmo-btn-secondary"
          >
            <Download className="w-4 h-4 text-[#7C8998]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenNewProjectModal}
            className="atmo-btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add project</span>
          </button>
        </div>
      </div>

      {/* 2. Atmosphere Status Pill Ribbon */}
      <div className="atmo-well p-1.5 rounded-2xl overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {statusTabButtons.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 font-bold'
                    : 'text-[#7C8998] hover:text-[#253142] hover:bg-white/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Search & Secondary Filters Toolbar (Atmosphere Card) */}
      <div className="atmo-card p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Recessed Well Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-[#7C8998] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by ID, title, client company, tech stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-8 py-2 text-xs bg-[#E2E8F0] border border-[#DDE4EC] rounded-2xl shadow-atmo-well focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] focus:bg-white text-[#253142] placeholder-[#A0ACBA] font-medium transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7C8998] hover:text-[#253142] p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns in Recessed Wells */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="atmo-well px-3 py-1.5 text-xs flex items-center rounded-2xl">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-[#253142] font-semibold cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Enterprise Web Application">Enterprise Web</option>
              <option value="FinTech & Banking Solutions">FinTech & Banking</option>
              <option value="Healthcare & Telemedicine">Healthcare</option>
              <option value="Supply Chain & Logistics">Supply Chain</option>
              <option value="AI & Machine Learning Solutions">AI / ML</option>
              <option value="Smart City & Public Infrastructure">Smart City</option>
            </select>
          </div>

          <div className="atmo-well px-3 py-1.5 text-xs flex items-center rounded-2xl">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-[#253142] font-semibold cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div className="atmo-well px-3 py-1.5 text-xs flex items-center rounded-2xl">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="bg-transparent focus:outline-none text-[#253142] font-semibold cursor-pointer"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="projectId-asc">Project ID (Asc)</option>
              <option value="approvedBudget-desc">Highest Budget</option>
              <option value="completionPercentage-desc">Highest Progress</option>
              <option value="expectedCompletionDate-asc">Target Deadline (Earliest)</option>
            </select>
          </div>

          <button
            onClick={fetchProjects}
            className="atmo-btn-icon"
            title="Refresh List"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#2563EB]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4. Main Projects Data Grid (Atmosphere Neumorphic Card) */}
      <div className="atmo-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#E2E8F0] border-b border-[#DDE4EC] text-[#7C8998] font-bold uppercase tracking-wider text-[11px] select-none font-mono">
              <tr>
                <th className="py-3.5 px-4">Project ID</th>
                <th className="py-3.5 px-4">Project Title & Category</th>
                <th className="py-3.5 px-4">Client Company</th>
                <th className="py-3.5 px-4">Manager</th>
                <th className="py-3.5 px-4 text-center">Team</th>
                <th className="py-3.5 px-4">Approved Budget</th>
                <th className="py-3.5 px-4">Progress</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Timeline</th>
                <th className="py-3.5 px-4 text-center sticky right-0 bg-[#E2E8F0] backdrop-blur-xs border-l border-[#DDE4EC] shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] z-10 min-w-[150px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE4EC]">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-[#7C8998]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2563EB]" />
                    Loading portfolio records...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-[#7C8998]">
                    <div className="w-12 h-12 rounded-2xl bg-[#E2E8F0] border border-[#DDE4EC] flex items-center justify-center mx-auto mb-3 text-[#2563EB] shadow-atmo-well">
                      <FolderGit2 className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-[#253142] text-sm">No Projects in Portfolio (0 Records)</div>
                    <div className="text-xs text-[#7C8998] max-w-md mx-auto mt-1 mb-4">
                      The project repository is currently empty. Start building your portfolio by registering your first company project.
                    </div>
                    <button
                      onClick={onOpenNewProjectModal}
                      className="atmo-btn-primary"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Project</span>
                    </button>
                  </td>
                </tr>
              ) : (
                projects.map((p) => {
                  const isOverdue = p.isOverdue;
                  const statusConf = STATUS_BADGES[p.status] || { badge: 'bg-slate-100 text-[#7C8998]', dot: 'bg-slate-400' };
                  const priorityClass = PRIORITY_BADGES[p.priority] || 'bg-slate-100 text-[#7C8998]';

                  return (
                    <tr
                      key={p.id}
                      className={`group hover:bg-white/80 transition-colors ${
                        isOverdue ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Project ID */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onSelectProject(p.id)}
                          className="hover:text-[#2563EB] transition-colors"
                        >
                          <span className="inline-flex items-center px-2.5 py-1 rounded-xl font-mono font-bold text-xs bg-white text-[#253142] border border-[#DDE4EC] group-hover:border-[#2563EB] group-hover:text-[#2563EB] shadow-2xs transition-all">
                            {p.projectId}
                          </span>
                        </button>
                      </td>

                      {/* Project Title & Category */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectProject(p.id)}
                            className="font-bold text-[#253142] hover:text-[#2563EB] text-left line-clamp-1 transition-colors text-xs"
                          >
                            {p.title}
                          </button>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase shrink-0 font-mono ${priorityClass}`}>
                            {p.priority}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#7C8998] font-medium truncate mt-0.5">
                          {p.categoryName || 'Enterprise Solutions'}
                        </div>
                      </td>

                      {/* Client Company */}
                      <td className="py-3.5 px-4 font-medium text-[#253142] max-w-[170px]">
                        <div className="flex items-center gap-1.5 truncate">
                          <Building2 className="w-3.5 h-3.5 text-[#7C8998] shrink-0" />
                          <span className="truncate">{p.client ? p.client.companyName : 'N/A'}</span>
                        </div>
                      </td>

                      {/* Manager */}
                      <td className="py-3.5 px-4 text-[#7C8998]">
                        {p.projectManager ? (
                          <span className="font-semibold text-[#253142]">{p.projectManager.name}</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-[#A0ACBA] bg-[#E2E8F0] border border-[#DDE4EC] italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Team count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#7C8998] text-[10px] font-semibold border border-[#DDE4EC] shadow-2xs">
                          <Users className="w-3 h-3 text-[#7C8998]" />
                          {p.activeAssignmentsCount || 0}
                        </span>
                      </td>

                      {/* Approved Budget */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#253142]">
                        {formatINR(p.approvedBudget)}
                      </td>

                      {/* Progress */}
                      <td className="py-3.5 px-4 min-w-[110px]">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#253142] mb-1">
                          <span>{p.completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden shadow-atmo-well">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              p.completionPercentage === 100
                                ? 'bg-emerald-500'
                                : 'bg-[#2563EB]'
                            }`}
                            style={{ width: `${p.completionPercentage}%` }}
                          ></div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wide uppercase font-mono ${statusConf.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`}></span>
                          <span>{p.status.replace(/_/g, ' ')}</span>
                        </span>
                      </td>

                      {/* Timeline */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {isOverdue ? (
                          <span className="text-rose-600 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {p.expectedCompletionDate}
                          </span>
                        ) : (
                          <span className="text-[#7C8998]">{p.expectedCompletionDate || '—'}</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className={`py-3.5 px-4 text-center sticky right-0 border-l border-[#DDE4EC] ${
                          isOverdue ? 'bg-rose-50/50' : 'bg-[#F4F7FA] group-hover:bg-white'
                        } shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] z-10 min-w-[150px]`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onSelectProject(p.id)}
                            className="p-1.5 text-[#7C8998] hover:text-[#2563EB] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                            title="Open Project Workspace"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenEditModal(p)}
                            className="p-1.5 text-[#7C8998] hover:text-[#2563EB] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleArchive(p)}
                            className="p-1.5 text-[#7C8998] hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                            title="Archive Project"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="py-3.5 px-5 bg-[#E2E8F0]/40 border-t border-[#DDE4EC] flex items-center justify-between text-xs text-[#7C8998]">
          <span className="font-medium">Displaying {projects.length} managed project records</span>
          <span className="font-mono text-[11px] text-[#A0ACBA]">Arshith Infotech Portfolio OS</span>
        </div>
      </div>
    </div>
  );
};
