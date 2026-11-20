import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Users2,
  AlertTriangle,
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  Building2,
  Calendar,
  Briefcase,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { AssignmentModal } from '../components/teams/AssignmentModal';
import { EmployeeModal } from '../components/employees/EmployeeModal';

export const TeamsPage = ({ onSelectProject }) => {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('by-employee'); // 'by-employee' | 'by-project'

  // Modal State
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [defaultProjectId, setDefaultProjectId] = useState('');
  const [defaultEmployeeId, setDefaultEmployeeId] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, projRes] = await Promise.all([
        api.getEmployees(),
        api.getProjects('limit=100'),
      ]);
      if (empRes.success) setEmployees(empRes.employees || []);
      if (projRes.success) setProjects(projRes.projects || []);
    } catch (err) {
      console.error('Error fetching team allocation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = (projId = '', empId = '') => {
    setEditingAssignment(null);
    setDefaultProjectId(projId);
    setDefaultEmployeeId(empId);
    setIsAssignmentModalOpen(true);
  };

  const handleOpenEdit = (asg) => {
    setEditingAssignment({
      id: asg.assignmentId || asg.id,
      projectId: asg.projectId,
      employeeId: asg.employeeId,
      projectRole: asg.projectRole,
      allocationPercentage: asg.allocationPercentage,
      responsibilities: asg.responsibilities,
      expectedReleaseDate: asg.expectedReleaseDate,
      assignmentStatus: asg.assignmentStatus || 'ACTIVE',
    });
    setDefaultProjectId('');
    setDefaultEmployeeId('');
    setIsAssignmentModalOpen(true);
  };

  const handleOpenAddEmployee = () => {
    setEditingEmployee(null);
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp) => {
    setEditingEmployee(emp);
    setIsEmployeeModalOpen(true);
  };

  const handleDeleteEmployee = async (emp) => {
    const confirmMsg = `Are you sure you want to permanently delete employee ${emp.empId} (${emp.name})?\n\nThis will remove them from the company roster and release them from any active project assignments. This action cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await api.deleteEmployee(emp.id);
      if (res.success) {
        fetchData();
      } else {
        alert(res.message || 'Failed to delete employee');
      }
    } catch (err) {
      alert('Error deleting employee: ' + err.message);
    }
  };

  const handleDeleteAssignment = async (asgId, empName = 'Employee', projName = 'Project') => {
    if (
      !window.confirm(
        `Are you sure you want to remove the project assignment for ${empName} from ${projName}?\n\nThis will unassign the employee from this project.`
      )
    ) {
      return;
    }

    try {
      const res = await api.deleteAssignment(asgId);
      if (res.success) {
        fetchData();
      } else {
        alert(res.message || 'Failed to remove assignment');
      }
    } catch (err) {
      alert('Error removing assignment: ' + err.message);
    }
  };

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (emp.empId && emp.empId.toLowerCase().includes(q)) ||
      (emp.name && emp.name.toLowerCase().includes(q)) ||
      (emp.department && emp.department.toLowerCase().includes(q)) ||
      (emp.designation && emp.designation.toLowerCase().includes(q)) ||
      (emp.activeProjects &&
        emp.activeProjects.some(
          (p) =>
            (p.projectCode && p.projectCode.toLowerCase().includes(q)) ||
            (p.projectTitle && p.projectTitle.toLowerCase().includes(q)) ||
            (p.projectRole && p.projectRole.toLowerCase().includes(q))
        ))
    );
  });

  // Build Project-centric view data
  const projectTeams = projects
    .filter((p) => !p.isArchived)
    .map((prj) => {
      // Find all assignments for this project across employees
      const assignedMembers = [];
      employees.forEach((emp) => {
        if (emp.activeProjects) {
          emp.activeProjects.forEach((ap) => {
            if (ap.projectId === prj.id) {
              assignedMembers.push({
                ...ap,
                employeeId: emp.id,
                empId: emp.empId,
                employeeName: emp.name,
                designation: emp.designation,
                department: emp.department,
              });
            }
          });
        }
      });
      return {
        ...prj,
        assignedMembers,
      };
    })
    .filter((prj) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        prj.projectId.toLowerCase().includes(q) ||
        prj.title.toLowerCase().includes(q) ||
        prj.assignedMembers.some(
          (m) =>
            m.employeeName.toLowerCase().includes(q) ||
            m.empId.toLowerCase().includes(q) ||
            m.projectRole.toLowerCase().includes(q)
        )
      );
    });

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium"><span>Atmosphere</span><span>&rsaquo;</span><span>Organization</span><span>&rsaquo;</span><span className="text-[#253142] font-semibold">Teams & Capacity</span></div>
          <h1 className="text-2xl font-extrabold text-[#253142] tracking-tight flex items-center gap-2">
            <Users2 className="w-6 h-6 text-[#2563EB]" /> Project Teams & Resource Allocation
          </h1>
          <p className="text-xs text-[#7C8998] mt-0.5">
            Assign company personnel to projects, adjust commitment levels, update roles, and manage team workloads.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleOpenAddEmployee}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E8EDF3] border border-[#DDE4EC] hover:bg-[#DDE4EC] text-[#253142] rounded-2xl text-xs font-semibold shadow-atmo-btn transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-blue-700" />
            <span>Add Employee</span>
          </button>
          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-xs font-semibold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Team Member</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F4F7FA] p-4 rounded-3xl border border-[#DDE4EC] shadow-atmo-card">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Employee, Project Code (AIP-2026), Title, or Role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-[#E8EDF3]/70 border border-[#DDE4EC] rounded-xl text-[#253142] shadow-atmo-well focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('by-employee')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'by-employee'
                ? 'bg-white text-blue-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Employee View
          </button>
          <button
            onClick={() => setViewMode('by-project')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'by-project'
                ? 'bg-white text-blue-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Project View
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
          Loading project teams and allocation matrix...
        </div>
      ) : viewMode === 'by-employee' ? (
        /* ================= VIEW 1: BY EMPLOYEE ================= */
        <div className="space-y-4">
          {filteredEmployees.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-800">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Project Team Allocations (0 Records)</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active employee team assignments exist in the system. Register employees or click below to assign team members to projects.
              </p>
              <button
                onClick={() => handleOpenAdd()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Assign Team Member</span>
              </button>
            </div>
          ) : (
            filteredEmployees.map((emp) => (
              <div key={emp.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                {/* Employee Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-slate-600 text-[11px] px-2 py-0.5 rounded bg-slate-100">
                      {emp.empId}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{emp.name}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 font-medium">{emp.designation}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px]">
                      {emp.department}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">Committed: </span>
                      <span
                        className={`font-mono font-bold text-xs ${
                          emp.totalAllocationPercentage > 100 ? 'text-amber-800' : 'text-blue-800'
                        }`}
                      >
                        {emp.totalAllocationPercentage}%
                      </span>
                    </div>

                    {emp.isOverAllocated && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Over-allocated
                      </span>
                    )}

                    {/* Quick Assign to this employee */}
                    <button
                      onClick={() => handleOpenAdd('', emp.id)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                      title={`Assign ${emp.name} to a project`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Assign Project</span>
                    </button>

                    {/* Edit Employee */}
                    <button
                      onClick={() => handleOpenEditEmployee(emp)}
                      className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                      title={`Edit employee ${emp.name} (${emp.empId})`}
                    >
                      <Edit2 className="w-3 h-3 text-blue-600" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Employee */}
                    <button
                      onClick={() => handleDeleteEmployee(emp)}
                      className="flex items-center gap-1 px-2.5 py-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                      title={`Delete employee ${emp.name} (${emp.empId})`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Assigned Projects Grid */}
                <div>
                  {emp.activeProjects && emp.activeProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {emp.activeProjects.map((p) => (
                        <div
                          key={p.assignmentId}
                          className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-2.5"
                        >
                          <div>
                            {/* Project Code & Allocation % */}
                            <div className="flex items-center justify-between font-mono text-[11px]">
                              <button
                                onClick={() => onSelectProject(p.projectId)}
                                className="font-bold text-blue-900 hover:underline flex items-center gap-1"
                                title="Open Project Workspace"
                              >
                                {p.projectCode}
                              </button>
                              <span className="font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px]">
                                {p.allocationPercentage}% Commitment
                              </span>
                            </div>

                            {/* Project Title */}
                            <h4
                              onClick={() => onSelectProject(p.projectId)}
                              className="font-bold text-slate-900 hover:text-blue-800 cursor-pointer mt-1 truncate"
                              title={p.projectTitle}
                            >
                              {p.projectTitle}
                            </h4>

                            {/* Role & Dates */}
                            <div className="mt-1.5 space-y-1 text-[11px] text-slate-600">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-blue-800">Role: {p.projectRole}</span>
                                <span className="text-slate-400 text-[10px]">
                                  Release: {p.expectedReleaseDate || p.expectedCompletionDate || 'Ongoing'}
                                </span>
                              </div>
                              {p.responsibilities && (
                                <p className="text-[10px] text-slate-500 italic line-clamp-1">
                                  {p.responsibilities}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons: Edit and Remove Assignment */}
                          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit({ ...p, employeeId: emp.id })}
                              className="flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-md font-medium text-[10px] transition-colors"
                              title="Edit Assignment Parameters"
                            >
                              <Edit2 className="w-3 h-3 text-blue-600" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteAssignment(p.assignmentId, emp.name, p.projectTitle)
                              }
                              className="flex items-center gap-1 px-2 py-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-md font-medium text-[10px] transition-colors"
                              title="Unassign from Project"
                            >
                              <Trash2 className="w-3 h-3 text-rose-600" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-400 italic text-[11px] py-1 flex items-center justify-between">
                      <span>No active project assignments. Available capacity: 100%.</span>
                      <button
                        onClick={() => handleOpenAdd('', emp.id)}
                        className="text-blue-600 hover:underline font-semibold text-xs"
                      >
                        + Assign first project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* ================= VIEW 2: BY PROJECT ================= */
        <div className="space-y-4">
          {projectTeams.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
              No projects match your search criteria.
            </div>
          ) : (
            projectTeams.map((prj) => (
              <div key={prj.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                {/* Project Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                        {prj.projectId}
                      </span>
                      <button
                        onClick={() => onSelectProject(prj.id)}
                        className="font-bold text-sm text-slate-900 hover:text-blue-800 hover:underline"
                      >
                        {prj.title}
                      </button>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                        {prj.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {prj.categoryName} • Client: {prj.client?.companyName || 'N/A'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-[11px]">
                      Team Members:{' '}
                      <strong className="text-slate-900">{prj.assignedMembers.length}</strong>
                    </span>

                    {/* Quick Add Member button */}
                    <button
                      onClick={() => handleOpenAdd(prj.id, '')}
                      className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[11px] font-semibold transition-colors"
                      title={`Assign member to ${prj.projectId}`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Member</span>
                    </button>
                  </div>
                </div>

                {/* Team Members List */}
                <div>
                  {prj.assignedMembers.length > 0 ? (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px] uppercase border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Emp ID</th>
                            <th className="py-2.5 px-3">Employee Name</th>
                            <th className="py-2.5 px-3">Project Role</th>
                            <th className="py-2.5 px-3">Department</th>
                            <th className="py-2.5 px-3">Responsibilities</th>
                            <th className="py-2.5 px-3 text-center">Commitment %</th>
                            <th className="py-2.5 px-3">Release Date</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {prj.assignedMembers.map((m) => (
                            <tr key={m.assignmentId} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{m.empId}</td>
                              <td className="py-2.5 px-3 font-semibold text-slate-900">{m.employeeName}</td>
                              <td className="py-2.5 px-3 font-semibold text-blue-800">{m.projectRole}</td>
                              <td className="py-2.5 px-3 text-slate-600">{m.department}</td>
                              <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate">
                                {m.responsibilities || '—'}
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px]">
                                  {m.allocationPercentage}%
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                                {m.expectedReleaseDate || 'Ongoing'}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenEdit({ ...m, projectId: prj.id })}
                                    className="p-1 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit Assignment"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteAssignment(
                                        m.assignmentId,
                                        m.employeeName,
                                        prj.title
                                      )
                                    }
                                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                                    title="Remove from Team"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic text-[11px] py-1 flex items-center justify-between">
                      <span>No team members assigned to this project yet.</span>
                      <button
                        onClick={() => handleOpenAdd(prj.id, '')}
                        className="text-blue-600 hover:underline font-semibold text-xs"
                      >
                        + Assign first team member
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Assignment Modal (Add / Edit) */}
      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        onSuccess={fetchData}
        assignment={editingAssignment}
        defaultProjectId={defaultProjectId}
        defaultEmployeeId={defaultEmployeeId}
        initialEmployees={employees}
        initialProjects={projects}
      />

      {/* Add / Edit Employee Modal */}
      {isEmployeeModalOpen && (
        <EmployeeModal
          isOpen={isEmployeeModalOpen}
          onClose={() => {
            setIsEmployeeModalOpen(false);
            setEditingEmployee(null);
          }}
          onSuccess={fetchData}
          employee={editingEmployee}
        />
      )}
    </div>
  );
};
