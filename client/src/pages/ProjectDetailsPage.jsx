import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  IndianRupee,
  Users,
  CheckSquare,
  Milestone,
  FileText,
  AlertTriangle,
  History,
  Building2,
  Shield,
  Clock,
  Sparkles,
  Edit2,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  Truck,
  Plus,
  ExternalLink,
  Download,
  AlertCircle,
  TrendingUp,
  Tag,
  Kanban,
  List,
  Trash2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EmployeeModal } from '../components/employees/EmployeeModal';

const formatINR = (val) => {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
};

export const ProjectDetailsPage = ({
  projectId,
  onBack,
  onOpenEditModal,
  onOpenStatusModal,
  onOpenHoldModal,
  onOpenResumeModal,
  onOpenCompleteModal,
  onOpenDeliverModal,
}) => {
  const { user } = useAuth();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Sub-states for quick modal additions within tabs
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAddRiskModal, setShowAddRiskModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);

  // Employees list for selection in assignments/tasks
  const [allEmployees, setAllEmployees] = useState([]);

  // Form states for in-tab actions
  const [newAssignment, setNewAssignment] = useState({
    employeeId: '',
    projectRole: 'Frontend Developer',
    allocationPercentage: 50,
    responsibilities: '',
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedEmployeeId: '',
    priority: 'MEDIUM',
    status: 'TO_DO',
    dueDate: '',
    estimatedHours: 40,
  });

  const [newMilestone, setNewMilestone] = useState({
    name: '',
    description: '',
    plannedDate: '',
    responsibleEmployeeId: '',
  });

  const [newExpense, setNewExpense] = useState({
    expenseCategory: 'Software Subscriptions',
    description: '',
    amount: '',
    transactionDate: new Date().toISOString().split('T')[0],
    vendor: '',
  });

  const [newPayment, setNewPayment] = useState({
    amount: '',
    invoiceNumber: '',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionReference: '',
    notes: '',
  });

  const [newRisk, setNewRisk] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM',
    probability: 'MEDIUM',
    impact: '',
    mitigationPlan: '',
  });

  const [newDoc, setNewDoc] = useState({
    title: '',
    docType: 'Requirement Document',
    fileName: '',
    version: 'v1.0',
    description: '',
  });

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await api.getProjectById(projectId);
      if (res.success) {
        setProjectData(res.project);
      }
      const empRes = await api.getEmployees();
      if (empRes.success) {
        setAllEmployees(empRes.employees);
      }
    } catch (err) {
      console.error('Error fetching project details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeCreatedInDetails = async () => {
    try {
      const empRes = await api.getEmployees();
      if (empRes.success && empRes.employees) {
        setAllEmployees(empRes.employees);
        if (empRes.employees.length > 0) {
          const latest = empRes.employees[empRes.employees.length - 1];
          setNewAssignment((prev) => ({ ...prev, employeeId: latest.id }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  // Handle adding team member
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const res = await api.assignEmployee(projectId, newAssignment);
      if (res.warning) {
        alert(res.warning);
      }
      setShowAddMemberModal(false);
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle releasing team member
  const handleReleaseMember = async (assignmentId) => {
    if (!window.confirm('Release this employee from the project assignment?')) return;
    try {
      await api.releaseEmployee(assignmentId);
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle removing team member completely
  const handleRemoveMember = async (assignmentId, empName) => {
    if (!window.confirm(`Are you sure you want to remove ${empName || 'this employee'} from this project team?`)) return;
    try {
      await api.deleteAssignment(assignmentId);
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle creating task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.createTask({ ...newTask, projectId });
      setShowAddTaskModal(false);
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle task status update
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle deleting task
  const handleDeleteTask = async (taskId, taskTitle) => {
    if (!window.confirm(`Are you sure you want to delete task "${taskTitle}" permanently?`)) return;
    try {
      await api.deleteTask(taskId);
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle creating milestone
  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    try {
      await api.createMilestone({ ...newMilestone, projectId });
      setShowAddMilestoneModal(false);
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle creating expense
  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      await api.createExpense({ ...newExpense, projectId });
      setShowAddExpenseModal(false);
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle approving expense
  const handleApproveExpense = async (expenseId, approvalStatus) => {
    try {
      await api.updateExpenseStatus(expenseId, { approvalStatus });
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle recording payment
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      await api.recordPayment({ ...newPayment, projectId });
      setShowAddPaymentModal(false);
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle creating risk
  const handleCreateRisk = async (e) => {
    e.preventDefault();
    try {
      await api.createRisk({ ...newRisk, projectId });
      setShowAddRiskModal(false);
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle creating document
  const handleCreateDoc = async (e) => {
    e.preventDefault();
    try {
      await api.createDocument({ ...newDoc, projectId });
      setShowAddDocModal(false);
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle deleting project
  const handleDeleteProject = async () => {
    if (!projectData) return;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete project ${projectData.projectId} (${projectData.title})?\n\nThis will remove the project from the portfolio inventory. This action cannot be undone.`
      )
    ) {
      return;
    }
    try {
      const res = await api.deleteProject(projectData.id, { reason: 'Permanently deleted by Admin via workspace' });
      if (res.success) {
        alert(`Project ${projectData.projectId} deleted successfully.`);
        onBack();
      } else {
        alert(res.message || 'Failed to delete project');
      }
    } catch (err) {
      alert('Failed to delete project: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading project workspace details...
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="p-8 text-center text-slate-600">
        <p>Project not found.</p>
        <button onClick={onBack} className="mt-3 px-3 py-1.5 bg-slate-800 text-white rounded text-xs">
          Return to Projects
        </button>
      </div>
    );
  }

  const p = projectData;
  const metrics = p.financialMetrics || {};

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'team', label: `Team (${p.assignments?.length || 0})`, icon: Users },
    { id: 'tasks', label: `Tasks (${p.tasks?.length || 0})`, icon: CheckSquare },
    { id: 'milestones', label: `Milestones (${p.milestones?.length || 0})`, icon: Milestone },
    { id: 'finances', label: 'Budget & Finance', icon: IndianRupee },
    { id: 'documents', label: `Documents (${p.documents?.length || 0})`, icon: FileText },
    { id: 'risks', label: `Risks (${p.risks?.length || 0})`, icon: AlertTriangle },
    { id: 'activity', label: `Activity History (${p.activityLogs?.length || 0})`, icon: History },
  ];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto max-w-full overflow-x-hidden font-sans animate-in fade-in duration-200">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#DDE4EC]">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onBack}
            className="p-2 sm:p-2.5 bg-[#E8EDF3] border border-[#DDE4EC] hover:bg-[#DDE4EC] text-[#253142] rounded-2xl transition-all shadow-atmo-btn shrink-0"
            title="Back to list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#2563EB] px-2.5 py-0.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
                {p.projectId}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#E8EDF3] text-[#253142] border border-[#DDE4EC]">
                {p.status.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-[#A0ACBA]">•</span>
              <span className="text-xs text-[#7C8998] font-medium">{p.categoryName}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#253142] tracking-tight mt-1">{p.title}</h1>
          </div>
        </div>

        {/* Workflow Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Change Status Modal trigger */}
          <button
            onClick={() => onOpenStatusModal(p)}
            className="px-3.5 py-2 bg-[#E8EDF3] border border-[#DDE4EC] hover:bg-[#DDE4EC] text-[#253142] rounded-2xl text-xs font-semibold shadow-atmo-btn transition-all"
          >
            Update Status
          </button>

          {/* Place On Hold or Resume */}
          {p.status === 'ON_HOLD' ? (
            <button
              onClick={() => onOpenResumeModal(p)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-xs font-semibold shadow-md shadow-blue-500/25 transition-all"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Resume Project</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenHoldModal(p)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/10 border border-amber-300 hover:bg-amber-500/20 text-amber-800 rounded-2xl text-xs font-semibold transition-all"
            >
              <PauseCircle className="w-3.5 h-3.5" />
              <span>Place On Hold</span>
            </button>
          )}

          {/* Complete Project Workflow */}
          {p.status !== 'COMPLETED' && p.status !== 'DELIVERED' && (
            <button
              onClick={() => onOpenCompleteModal(p)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-semibold shadow-sm transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete Project</span>
            </button>
          )}

          {/* Deliver to Client */}
          {p.status === 'COMPLETED' && (
            <button
              onClick={() => onOpenDeliverModal(p)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-semibold shadow-sm transition-all"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Deliver to Client</span>
            </button>
          )}

          <button
            onClick={() => onOpenEditModal(p)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-xs font-semibold shadow-md shadow-blue-500/25 transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Project</span>
          </button>

          <button
            onClick={handleDeleteProject}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-2xl text-xs font-semibold transition-all"
            title="Permanently delete project"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats Banner */}
      <div className="bg-[#F4F7FA] p-5 rounded-3xl border border-[#DDE4EC] shadow-atmo-card grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
        <div>
          <div className="text-[#7C8998] text-[11px] font-medium">Client Company</div>
          <div className="font-bold text-[#253142] mt-0.5 truncate">{p.client?.companyName || 'N/A'}</div>
          <div className="text-[10px] text-[#A0ACBA] truncate">{p.client?.contactPerson}</div>
        </div>

        <div>
          <div className="text-[#7C8998] text-[11px] font-medium">Project Manager</div>
          <div className="font-bold text-[#253142] mt-0.5">{p.projectManager?.name || 'Unassigned'}</div>
          <div className="text-[10px] text-[#A0ACBA]">{p.projectManager?.email || '—'}</div>
        </div>

        <div>
          <div className="text-[#7C8998] text-[11px] font-medium">Approved Budget</div>
          <div className="font-bold text-[#2563EB] mt-0.5 font-sans">{formatINR(p.approvedBudget)}</div>
          <div className="text-[10px] text-[#A0ACBA]">Spend: {formatINR(p.actualDevCost)}</div>
        </div>

        <div>
          <div className="text-[#7C8998] text-[11px] font-medium">Target Deadline</div>
          <div className="font-bold text-[#253142] mt-0.5">{p.expectedCompletionDate || 'Not set'}</div>
          <div className="text-[10px] text-[#A0ACBA]">Start: {p.plannedStartDate || 'N/A'}</div>
        </div>

        <div className="col-span-2">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-[#7C8998] font-medium">Completion Progress</span>
            <span className="font-extrabold text-[#2563EB]">{p.completionPercentage}%</span>
          </div>
          <div className="w-full bg-[#E8EDF3] rounded-full h-2.5 overflow-hidden border border-[#DDE4EC] shadow-atmo-well">
            <div
              className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
              style={{ width: `${p.completionPercentage}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-[#7C8998] mt-1.5 truncate">Current Phase: {p.currentPhase}</div>
        </div>
      </div>

      {/* 8 TABS NAVIGATION */}
      <div className="bg-[#E3E9F0]/80 p-1.5 rounded-2xl border border-[#DDE4EC] shadow-atmo-well flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-[#253142] shadow-atmo-btn'
                  : 'text-[#7C8998] hover:text-[#253142] hover:bg-white/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#7C8998]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="bg-[#F4F7FA] rounded-3xl border border-[#DDE4EC] shadow-atmo-card p-6">
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 text-xs">
            {/* Description & Objective */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Project Description
                </h3>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {p.description || 'No detailed description provided.'}
                </p>

                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono pt-2">
                  Project Objective & Goals
                </h3>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {p.objective || 'Primary objective not explicitly defined.'}
                </p>
              </div>

              {/* Requirements & Scope */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Project Scope & Deliverables
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900">Scope: </span>
                    {p.scope || 'Full lifecycle turnkey delivery.'}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Deliverables: </span>
                    {p.deliverables || 'Production release, Docker image, API docs.'}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Expected Outcome: </span>
                    {p.expectedOutcome || 'Automate and streamline client operations.'}
                  </div>
                </div>

                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono pt-2">
                  Technical Specifications
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900">Functional Requirements: </span>
                    {p.functionalRequirements || 'Refer to signed SRS document.'}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Technical Requirements: </span>
                    {p.technicalRequirements || 'Microservices, REST, encrypted SSL.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies Badges */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono mb-2">
                Required Technologies & Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {p.requiredTechnologies && p.requiredTechnologies.length > 0 ? (
                  p.requiredTechnologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[11px] font-semibold"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic">No specific stack tags logged</span>
                )}
              </div>
            </div>

            {/* Deployment & Git links */}
            {(p.deploymentUrl || p.gitRepoUrl) && (
              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {p.deploymentUrl && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Staging / Production URL</div>
                      <a
                        href={p.deploymentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-blue-600 hover:underline text-xs flex items-center gap-1 mt-0.5"
                      >
                        {p.deploymentUrl} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
                {p.gitRepoUrl && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Git Repository</div>
                      <a
                        href={p.gitRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-blue-700 hover:underline text-xs flex items-center gap-1 mt-0.5"
                      >
                        {p.gitRepoUrl} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: TEAM ================= */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Allocated Project Team Members
                </h3>
                <p className="text-[11px] text-slate-400">
                  Employees assigned to this project with their defined roles and commitment %
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddEmployeeModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-700" />
                  <span>Add Employee</span>
                </button>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign Employee</span>
                </button>
              </div>
            </div>

            {/* Team Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px] uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Emp ID</th>
                    <th className="py-2.5 px-3">Employee Name</th>
                    <th className="py-2.5 px-3">Project Role</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Responsibilities</th>
                    <th className="py-2.5 px-3 text-center">Allocation %</th>
                    <th className="py-2.5 px-3">Assigned Date</th>
                    <th className="py-2.5 px-3">Release Date</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {p.assignments && p.assignments.length > 0 ? (
                    p.assignments.map((asg) => (
                      <tr key={asg.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {asg.employee?.empId || 'EMP-XXXX'}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">{asg.employee?.name || 'Unknown'}</div>
                          <div className="text-[10px] text-slate-400">{asg.employee?.email}</div>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-blue-800">{asg.projectRole}</td>
                        <td className="py-2.5 px-3 text-slate-600">{asg.employee?.department || 'Engineering'}</td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">{asg.responsibilities || '—'}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">
                            {asg.allocationPercentage}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{asg.assignedDate}</td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                          {asg.actualReleaseDate || asg.expectedReleaseDate || 'Ongoing'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {asg.assignmentStatus === 'ACTIVE' && (
                              <button
                                onClick={() => handleReleaseMember(asg.id)}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold text-amber-700 hover:bg-amber-50 border border-amber-200 transition-colors"
                                title="Mark as Released"
                              >
                                Release
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveMember(asg.id, asg.employee?.name)}
                              className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors"
                              title="Remove Team Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        No team members currently assigned. Use "Assign Employee" to build the team.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* In-tab Modal: Add Team Member */}
            {showAddMemberModal && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900">Assign Employee to Project</h3>
                    <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-slate-600">
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleAddMember} className="space-y-3 mt-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-700 font-semibold">
                          Select Employee <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowAddEmployeeModal(true)}
                          className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Employee</span>
                        </button>
                      </div>
                      <select
                        value={newAssignment.employeeId}
                        onChange={(e) => setNewAssignment({ ...newAssignment, employeeId: e.target.value })}
                        required
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      >
                        <option value="">-- Choose Existing Employee Record --</option>
                        {allEmployees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.empId} — {emp.name} ({emp.designation} • {emp.department}) [{emp.totalAllocationPercentage || 0}% Used]
                          </option>
                        ))}
                      </select>
                      {allEmployees.length === 0 && (
                        <p className="mt-1 text-[11px] text-amber-600">
                          No employees registered yet. Click &quot;Add New Employee&quot; above to create one.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Project Role</label>
                      <select
                        value={newAssignment.projectRole}
                        onChange={(e) => setNewAssignment({ ...newAssignment, projectRole: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      >
                        <option value="Project Manager">Project Manager</option>
                        <option value="Team Lead">Team Lead</option>
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="UI/UX Designer">UI/UX Designer</option>
                        <option value="Database Developer">Database Developer</option>
                        <option value="Tester">Tester</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Allocation Percentage (%)</label>
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={newAssignment.allocationPercentage}
                        onChange={(e) =>
                          setNewAssignment({ ...newAssignment, allocationPercentage: parseInt(e.target.value, 10) })
                        }
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Key Responsibilities</label>
                      <textarea
                        rows={2}
                        value={newAssignment.responsibilities}
                        onChange={(e) => setNewAssignment({ ...newAssignment, responsibilities: e.target.value })}
                        placeholder="e.g. Lead React frontend architecture and cart checkout flow"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      ></textarea>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddMemberModal(false)}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="px-3.5 py-1.5 bg-blue-600 text-white font-semibold rounded-lg">
                        Confirm Assignment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: TASKS ================= */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Project Tasks & Kanban Workflow
                </h3>
                <p className="text-[11px] text-slate-400">Track tasks across To Do, In Progress, In Review, and Completed</p>
              </div>

              <button
                onClick={() => setShowAddTaskModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Task</span>
              </button>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['TO_DO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'].map((colStatus) => {
                const colTasks = (p.tasks || []).filter((t) => t.status === colStatus);
                const colTitle = colStatus.replace(/_/g, ' ');

                return (
                  <div key={colStatus} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col min-h-[300px]">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs font-bold text-slate-700">
                      <span>{colTitle}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px]">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1 overflow-y-auto">
                      {colTasks.map((t) => (
                        <div key={t.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2 text-xs">
                          <div className="flex items-center justify-between font-mono text-[10px]">
                            <span className="font-bold text-slate-800">{t.taskId}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                t.priority === 'CRITICAL'
                                  ? 'bg-red-100 text-red-800'
                                  : t.priority === 'HIGH'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {t.priority}
                            </span>
                          </div>

                          <div className="font-semibold text-slate-900">{t.title}</div>
                          {t.description && (
                            <div className="text-[11px] text-slate-500 line-clamp-2">{t.description}</div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                            <span>Due: {t.dueDate || 'No date'}</span>
                            <span className="font-mono">{t.actualHoursSpent || 0}h logged</span>
                          </div>

                          {/* Quick status transition dropdown & actions */}
                          <div className="pt-1 flex items-center justify-between gap-1">
                            <select
                              value={t.status}
                              onChange={(e) => handleUpdateTaskStatus(t.id, e.target.value)}
                              className="text-[10px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-none flex-1 font-medium"
                            >
                              <option value="TO_DO">To Do</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="IN_REVIEW">In Review</option>
                              <option value="COMPLETED">Completed</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleDeleteTask(t.id, t.title)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {colTasks.length === 0 && (
                        <div className="h-24 flex items-center justify-center text-slate-400 text-[11px] italic">
                          No tasks in {colTitle}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* In-tab Modal: Create Task */}
            {showAddTaskModal && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900">Create New Project Task</h3>
                    <button onClick={() => setShowAddTaskModal(false)} className="text-slate-400 hover:text-slate-600">
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleCreateTask} className="space-y-3 mt-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Task Title</label>
                      <input
                        type="text"
                        required
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="e.g. Implement OAuth2 Refresh Token endpoint"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Assign To Employee</label>
                      <select
                        value={newTask.assignedEmployeeId}
                        onChange={(e) => setNewTask({ ...newTask, assignedEmployeeId: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      >
                        <option value="">-- Unassigned --</option>
                        {allEmployees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.designation})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                        >
                          <option value="CRITICAL">Critical</option>
                          <option value="HIGH">High</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="LOW">Low</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Initial Status</label>
                        <select
                          value={newTask.status}
                          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                        >
                          <option value="TO_DO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="IN_REVIEW">In Review</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                        <input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Est. Hours</label>
                        <input
                          type="number"
                          value={newTask.estimatedHours}
                          onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      ></textarea>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddTaskModal(false)}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="px-3.5 py-1.5 bg-blue-600 text-white font-semibold rounded-lg">
                        Create Task
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: MILESTONES ================= */}
        {activeTab === 'milestones' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Project Milestones Schedule
                </h3>
                <p className="text-[11px] text-slate-400">Key contractual and delivery checkpoints</p>
              </div>

              <button
                onClick={() => setShowAddMilestoneModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="space-y-3">
              {p.milestones && p.milestones.length > 0 ? (
                p.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-mono font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{m.name}</span>
                          <span className="font-mono text-[10px] text-slate-400">({m.milestoneId})</span>
                        </div>
                        <div className="text-slate-600 text-[11px] mt-0.5">{m.description}</div>
                        {m.remarks && <div className="text-[10px] text-slate-400 italic mt-1">Remarks: {m.remarks}</div>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-slate-500 font-mono text-[11px]">Planned: {m.plannedDate}</div>
                        {m.actualDate && (
                          <div className="text-blue-600 font-mono text-[10px]">Actual: {m.actualDate}</div>
                        )}
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          m.completionStatus === 'COMPLETED'
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : m.completionStatus === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {m.completionStatus}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">No milestones defined for this project.</div>
              )}
            </div>

            {/* In-tab Modal: Add Milestone */}
            {showAddMilestoneModal && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900">Add Project Milestone</h3>
                    <button onClick={() => setShowAddMilestoneModal(false)} className="text-slate-400 hover:text-slate-600">
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleCreateMilestone} className="space-y-3 mt-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Milestone Name</label>
                      <input
                        type="text"
                        required
                        value={newMilestone.name}
                        onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                        placeholder="e.g. UAT Signoff & Security Audit"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Planned Completion Date</label>
                      <input
                        type="date"
                        required
                        value={newMilestone.plannedDate}
                        onChange={(e) => setNewMilestone({ ...newMilestone, plannedDate: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={newMilestone.description}
                        onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      ></textarea>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddMilestoneModal(false)}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="px-3.5 py-1.5 bg-blue-600 text-white font-semibold rounded-lg">
                        Add Milestone
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: BUDGET & FINANCE ================= */}
        {activeTab === 'finances' && (
          <div className="space-y-6 text-xs">
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-medium">Proposed Budget</div>
                <div className="text-base font-bold text-slate-800 mt-1">{formatINR(p.proposedBudget)}</div>
              </div>
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                <div className="text-[10px] text-blue-800 uppercase font-medium">Approved Budget</div>
                <div className="text-base font-extrabold text-blue-900 mt-1">{formatINR(p.approvedBudget)}</div>
              </div>
              <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-200">
                <div className="text-[10px] text-rose-800 uppercase font-medium">Actual Spend</div>
                <div className="text-base font-bold text-rose-900 mt-1">{formatINR(p.actualDevCost)}</div>
              </div>
              <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-200">
                <div className="text-[10px] text-blue-800 uppercase font-medium">Remaining Budget</div>
                <div className="text-base font-bold text-blue-900 mt-1">{formatINR(metrics.remainingBudget)}</div>
              </div>
              <div className="p-3 bg-teal-50/40 rounded-xl border border-teal-200">
                <div className="text-[10px] text-teal-800 uppercase font-medium">Received From Client</div>
                <div className="text-base font-bold text-teal-900 mt-1">{formatINR(p.totalReceived)}</div>
              </div>
              <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-200">
                <div className="text-[10px] text-amber-800 uppercase font-medium">Pending Client Payment</div>
                <div className="text-base font-bold text-amber-900 mt-1">{formatINR(p.clientPendingPayment)}</div>
              </div>
            </div>

            {/* Budget Utilization Warning Banner */}
            {metrics.isOverBudget ? (
              <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-900 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-700" />
                <div>
                  <div className="font-bold">CRITICAL: PROJECT EXPENDITURE EXCEEDED APPROVED BUDGET</div>
                  <div className="text-[11px]">
                    Current variance: +{formatINR(metrics.budgetVariance)} over sanctioned budget.
                  </div>
                </div>
              </div>
            ) : metrics.budgetUtilization >= 80 ? (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-700" />
                <div>
                  <div className="font-bold">Budget Warning: {metrics.budgetUtilization}% Sanctioned Runway Consumed</div>
                  <div className="text-[11px]">Review pending purchase orders and third-party software subscriptions.</div>
                </div>
              </div>
            ) : null}

            {/* Expenses List & Actions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider font-mono text-[11px]">
                    Logged Project Expenses & Invoices
                  </h4>
                  <p className="text-[10px] text-slate-400">Subject to Finance Manager verification and approval</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddExpenseModal(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-xs font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Expense</span>
                  </button>
                  <button
                    onClick={() => setShowAddPaymentModal(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Record Payment</span>
                  </button>
                </div>
              </div>

              {/* Expense Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Expense ID</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Vendor / Payee</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {p.expenses && p.expenses.length > 0 ? (
                      p.expenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{exp.expenseId}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-700">{exp.expenseCategory}</td>
                          <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">{exp.description}</td>
                          <td className="py-2.5 px-3 text-slate-600">{exp.vendor || '—'}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{exp.transactionDate}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-right">
                            {formatINR(exp.amount)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                exp.approvalStatus === 'APPROVED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : exp.approvalStatus === 'REJECTED'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {exp.approvalStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {exp.approvalStatus === 'PENDING' && (user?.roleName === 'SUPER_ADMIN' || user?.roleName === 'FINANCE_MANAGER') && (
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleApproveExpense(exp.id, 'APPROVED')}
                                  className="text-blue-600 hover:underline font-bold text-[10px]"
                                >
                                  Approve
                                </button>
                                <span className="text-slate-300">|</span>
                                <button
                                  onClick={() => handleApproveExpense(exp.id, 'REJECTED')}
                                  className="text-rose-600 hover:underline font-bold text-[10px]"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-slate-400">
                          No expenses logged yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* In-tab Modal: Add Expense */}
            {showAddExpenseModal && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900">Record Project Expense</h3>
                    <button onClick={() => setShowAddExpenseModal(false)} className="text-slate-400 hover:text-slate-600">
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleCreateExpense} className="space-y-3 mt-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Expense Category</label>
                      <select
                        value={newExpense.expenseCategory}
                        onChange={(e) => setNewExpense({ ...newExpense, expenseCategory: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      >
                        <option value="Employee Cost">Employee Cost</option>
                        <option value="Software Subscriptions">Software Subscriptions</option>
                        <option value="Cloud Hosting Expenses">Cloud Hosting Expenses</option>
                        <option value="Hardware Expenses">Hardware Expenses</option>
                        <option value="Third-Party Service">Third-Party Service</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Amount (₹ INR)</label>
                      <input
                        type="number"
                        required
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        placeholder="e.g. 50000"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Description / Itemized Breakdown</label>
                      <input
                        type="text"
                        required
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        placeholder="e.g. Annual Redis cluster enterprise subscription"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Vendor / Payee</label>
                      <input
                        type="text"
                        value={newExpense.vendor}
                        onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                        placeholder="e.g. AWS India / Redis Labs"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddExpenseModal(false)}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="px-3.5 py-1.5 bg-blue-600 text-white font-semibold rounded-lg">
                        Submit for Approval
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* In-tab Modal: Add Client Payment */}
            {showAddPaymentModal && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900">Record Client Payment Received</h3>
                    <button onClick={() => setShowAddPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleRecordPayment} className="space-y-3 mt-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Payment Amount (₹ INR)</label>
                      <input
                        type="number"
                        required
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                        placeholder="e.g. 500000"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Invoice Number</label>
                      <input
                        type="text"
                        value={newPayment.invoiceNumber}
                        onChange={(e) => setNewPayment({ ...newPayment, invoiceNumber: e.target.value })}
                        placeholder="e.g. INV-AIP-2026-088"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Bank Transaction Reference / UTR</label>
                      <input
                        type="text"
                        value={newPayment.transactionReference}
                        onChange={(e) => setNewPayment({ ...newPayment, transactionReference: e.target.value })}
                        placeholder="e.g. HDFCR5202611029871"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddPaymentModal(false)}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="px-3.5 py-1.5 bg-teal-700 text-white font-semibold rounded-lg">
                        Record Bank Credit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 6: DOCUMENTS ================= */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Project Documents & Artifacts
                </h3>
                <p className="text-[11px] text-slate-400">
                  Proposals, agreements, SRS, technical architecture and design artifacts
                </p>
              </div>

              <button
                onClick={() => setShowAddDocModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Document</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {p.documents && p.documents.length > 0 ? (
                p.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{doc.title}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                          <span className="font-semibold text-blue-800">{doc.docType}</span>
                          <span>•</span>
                          <span className="font-mono">{doc.version}</span>
                          <span>•</span>
                          <span>{doc.createdAt?.split('T')[0]}</span>
                        </div>
                        {doc.description && <div className="text-[11px] text-slate-600 mt-1">{doc.description}</div>}
                      </div>
                    </div>

                    <a
                      href={doc.fileUrl}
                      download={doc.fileName}
                      className="p-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg flex-shrink-0 transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-slate-400 text-xs">
                  No documents uploaded. Click "Upload Document" to attach contracts, proposals or design files.
                </div>
              )}
            </div>

            {/* In-tab Modal: Upload Document */}
            {showAddDocModal && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900">Upload Project Document</h3>
                    <button onClick={() => setShowAddDocModal(false)} className="text-slate-400 hover:text-slate-600">
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleCreateDoc} className="space-y-3 mt-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Document Title</label>
                      <input
                        type="text"
                        required
                        value={newDoc.title}
                        onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                        placeholder="e.g. Master Service Agreement Executed"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Document Category</label>
                      <select
                        value={newDoc.docType}
                        onChange={(e) => setNewDoc({ ...newDoc, docType: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      >
                        <option value="Project Proposal">Project Proposal</option>
                        <option value="Client Agreement">Client Agreement</option>
                        <option value="Requirement Document">Requirement Document</option>
                        <option value="SRS Document">SRS Document</option>
                        <option value="Quotations">Quotations</option>
                        <option value="Invoices">Invoices</option>
                        <option value="Design Files">Design Files</option>
                        <option value="Technical Documents">Technical Documents</option>
                        <option value="Other">Other Attachments</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Version</label>
                      <input
                        type="text"
                        value={newDoc.version}
                        onChange={(e) => setNewDoc({ ...newDoc, version: e.target.value })}
                        placeholder="v1.0"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Description / Notes</label>
                      <textarea
                        rows={2}
                        value={newDoc.description}
                        onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      ></textarea>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddDocModal(false)}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="px-3.5 py-1.5 bg-blue-600 text-white font-semibold rounded-lg">
                        Upload Document
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 7: RISKS & ISSUES ================= */}
        {activeTab === 'risks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Project Risks & Issues Matrix
                </h3>
                <p className="text-[11px] text-slate-400">Severity, probability, mitigation plans and resolution status</p>
              </div>

              <button
                onClick={() => setShowAddRiskModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Risk</span>
              </button>
            </div>

            <div className="space-y-3">
              {p.risks && p.risks.length > 0 ? (
                p.risks.map((r) => (
                  <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">{r.title}</div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.severity === 'CRITICAL'
                              ? 'bg-red-100 text-red-800'
                              : r.severity === 'HIGH'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          Severity: {r.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-semibold">
                          Prob: {r.probability}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                          {r.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-slate-600">{r.description}</div>
                    {r.mitigationPlan && (
                      <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 text-blue-950 text-[11px]">
                        <span className="font-bold">Mitigation Strategy: </span>
                        {r.mitigationPlan}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">No active risks or impediments identified.</div>
              )}
            </div>

            {/* In-tab Modal: Add Risk */}
            {showAddRiskModal && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900">Log Project Risk</h3>
                    <button onClick={() => setShowAddRiskModal(false)} className="text-slate-400 hover:text-slate-600">
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleCreateRisk} className="space-y-3 mt-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Risk Title</label>
                      <input
                        type="text"
                        required
                        value={newRisk.title}
                        onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
                        placeholder="e.g. Third-party SMS gateway throttling"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Severity</label>
                        <select
                          value={newRisk.severity}
                          onChange={(e) => setNewRisk({ ...newRisk, severity: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                        >
                          <option value="CRITICAL">Critical</option>
                          <option value="HIGH">High</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="LOW">Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Probability</label>
                        <select
                          value={newRisk.probability}
                          onChange={(e) => setNewRisk({ ...newRisk, probability: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                        >
                          <option value="HIGH">High</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="LOW">Low</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Mitigation Plan</label>
                      <textarea
                        rows={2}
                        value={newRisk.mitigationPlan}
                        onChange={(e) => setNewRisk({ ...newRisk, mitigationPlan: e.target.value })}
                        placeholder="How will this risk be neutralized or mitigated?"
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      ></textarea>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddRiskModal(false)}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="px-3.5 py-1.5 bg-blue-600 text-white font-semibold rounded-lg">
                        Log Risk
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 8: ACTIVITY HISTORY ================= */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Project Audit & Lifecycle Activity History
              </h3>
              <p className="text-[11px] text-slate-400">Chronological timestamped record of every project modification</p>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {p.activityLogs && p.activityLogs.length > 0 ? (
                p.activityLogs.map((log) => (
                  <div key={log.id} className="relative text-xs">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white"></span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-slate-600 mt-1">
                      {log.changes ? JSON.stringify(log.changes) : 'Lifecycle event recorded'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-xs italic">Initial creation history recorded.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Add Employee Modal */}
      {showAddEmployeeModal && (
        <EmployeeModal
          isOpen={showAddEmployeeModal}
          onClose={() => setShowAddEmployeeModal(false)}
          onSuccess={handleEmployeeCreatedInDetails}
        />
      )}
    </div>
  );
};

