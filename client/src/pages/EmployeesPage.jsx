import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Users,
  AlertTriangle,
  Plus,
  Search,
  Building2,
  Briefcase,
  CheckCircle,
  ExternalLink,
  Edit2,
  Trash2,
  Phone,
  Mail,
  IndianRupee,
  Calendar,
} from 'lucide-react';
import { EmployeeModal } from '../components/employees/EmployeeModal';

export const EmployeesPage = ({ onSelectProject }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (departmentFilter !== 'ALL') params.append('department', departmentFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);

      const res = await api.getEmployees(params.toString());
      if (res.success) {
        setEmployees(res.employees);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, departmentFilter, statusFilter]);

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (emp) => {
    const confirmMsg = `Are you sure you want to permanently delete employee ${emp.empId} (${emp.name})?\n\nThis will remove them from the company roster and release them from any active project assignments. This action cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await api.deleteEmployee(emp.id);
      if (res.success) {
        fetchEmployees();
      } else {
        alert(res.message || 'Failed to delete employee');
      }
    } catch (err) {
      alert('Error deleting employee: ' + err.message);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium">
            <span>Atmosphere</span>
            <span>&rsaquo;</span>
            <span>Organization</span>
            <span>&rsaquo;</span>
            <span className="text-[#253142] font-semibold">Employees</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#253142] tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#2563EB]" /> Employee Directory & Talent Roster
          </h1>
          <p className="text-xs text-[#7C8998] mt-0.5">
            Maintain company personnel records, skillsets, capacity commitments, and team availability.
          </p>
        </div>

        {/* Add Employee Button */}
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-xs font-semibold shadow-md shadow-blue-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-[#F4F7FA] p-4 rounded-3xl border border-[#DDE4EC] shadow-atmo-card">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#7C8998] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Employee ID (EMP-0101), Name, Skills (React, Python)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-[#E8EDF3]/70 border border-[#DDE4EC] rounded-xl text-[#253142] shadow-atmo-well focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-3.5 py-2 text-xs bg-[#E8EDF3]/70 border border-[#DDE4EC] rounded-xl text-[#253142] font-medium shadow-atmo-well focus:outline-none focus:border-[#2563EB]"
        >
          <option value="ALL">All Departments</option>
          <option value="Executive Management">Executive Management</option>
          <option value="Project Delivery">Project Delivery</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="QA & Testing">QA & Testing</option>
          <option value="DevOps & Cloud">DevOps & Cloud</option>
          <option value="Data & AI">Data & AI</option>
          <option value="Finance & Accounts">Finance & Accounts</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 text-xs bg-[#E8EDF3]/70 border border-[#DDE4EC] rounded-xl text-[#253142] font-medium shadow-atmo-well focus:outline-none focus:border-[#2563EB]"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active Employees</option>
          <option value="INACTIVE">Inactive Employees</option>
        </select>
      </div>

      {/* Employees Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading employee records...
        </div>
      ) : employees.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-800">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Employees in Directory (0 Records)</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The employee directory is currently empty. Click below to add and configure your company's personnel.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Employee</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className={`bg-white rounded-xl border p-4 shadow-2xs space-y-3 text-xs transition-all flex flex-col justify-between ${
                emp.isOverAllocated ? 'border-amber-300 bg-amber-50/15' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500">{emp.empId}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-600">
                        {emp.department}
                      </span>
                      {emp.status === 'INACTIVE' && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                          INACTIVE
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{emp.name}</h3>
                    <div className="text-[11px] text-slate-500 font-medium">{emp.designation}</div>
                  </div>

                  {/* Over allocation badge */}
                  {emp.isOverAllocated && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Overloaded
                    </span>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-1 text-slate-600 text-[11px] pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  {emp.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                </div>

                {/* Capacity Bar */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Committed Capacity</span>
                    <span
                      className={`font-mono font-bold ${
                        emp.totalAllocationPercentage > 100 ? 'text-amber-800' : 'text-blue-800'
                      }`}
                    >
                      {emp.totalAllocationPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        emp.totalAllocationPercentage > 100
                          ? 'bg-amber-500'
                          : emp.totalAllocationPercentage > 75
                          ? 'bg-blue-600'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, emp.totalAllocationPercentage)}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1.5 flex justify-between">
                    <span>Available: {emp.availableCapacity}%</span>
                    <span>
                      Active: {emp.activeProjectsCount} / {emp.maxActiveProjects || 3}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Core Competencies</div>
                  <div className="flex flex-wrap gap-1">
                    {emp.skills && emp.skills.length > 0 ? (
                      emp.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-[10px]">No skills listed</span>
                    )}
                  </div>
                </div>

                {/* Active Projects List */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Assigned Projects</div>
                  {emp.activeProjects && emp.activeProjects.length > 0 ? (
                    emp.activeProjects.map((p) => (
                      <div
                        key={p.assignmentId}
                        onClick={() => onSelectProject(p.projectId)}
                        className="p-2 rounded bg-slate-50 hover:bg-blue-50/50 border border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                        title="Open Project Workspace"
                      >
                        <div className="truncate pr-2">
                          <div className="font-semibold text-slate-800 truncate max-w-[170px]">{p.projectTitle}</div>
                          <div className="text-[10px] text-blue-800 font-medium">Role: {p.projectRole}</div>
                        </div>
                        <span className="font-mono font-bold text-slate-600 text-[10px] shrink-0">
                          {p.allocationPercentage}%
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 italic text-[11px]">No active projects assigned currently.</div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Edit and Delete */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEditModal(emp)}
                  className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded-lg font-medium transition-colors text-[11px]"
                  title="Edit Employee Information"
                >
                  <Edit2 className="w-3 h-3 text-blue-600" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteEmployee(emp)}
                  className="flex items-center gap-1 px-2.5 py-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg font-semibold transition-colors text-[11px] cursor-pointer"
                  title="Delete Employee Record"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee Modal (Add / Edit) */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEmployees}
        employee={editingEmployee}
      />
    </div>
  );
};
