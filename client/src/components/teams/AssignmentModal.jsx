import React, { useState, useEffect } from 'react';
import { X, UserCheck, Save, AlertTriangle, AlertCircle, Plus } from 'lucide-react';
import { api } from '../../services/api';
import { EmployeeModal } from '../employees/EmployeeModal';

const PROJECT_ROLES = [
  'Project Manager',
  'Team Lead',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'Database Developer',
  'Tester',
  'DevOps Engineer',
  'Mobile Developer',
  'AI / ML Engineer',
];

export const AssignmentModal = ({
  isOpen,
  onClose,
  onSuccess,
  assignment = null,
  defaultProjectId = '',
  defaultEmployeeId = '',
  initialEmployees = [],
  initialProjects = [],
}) => {
  const [projects, setProjects] = useState(initialProjects || []);
  const [employees, setEmployees] = useState(initialEmployees || []);
  const [formData, setFormData] = useState({
    projectId: '',
    employeeId: '',
    projectRole: 'Full Stack Developer',
    allocationPercentage: 50,
    responsibilities: '',
    expectedReleaseDate: '',
    assignmentStatus: 'ACTIVE',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);

  const loadOptions = async () => {
    try {
      const [projRes, empRes] = await Promise.all([
        api.getProjects('limit=100'),
        api.getEmployees(),
      ]);
      if (projRes.success && projRes.projects?.length) setProjects(projRes.projects);
      if (empRes.success && empRes.employees?.length) setEmployees(empRes.employees);
    } catch (err) {
      console.error('Error loading options:', err);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (initialEmployees && initialEmployees.length > 0) {
      setEmployees(initialEmployees);
    }
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects);
    }
    loadOptions();
  }, [isOpen, initialEmployees, initialProjects]);

  const handleEmployeeCreated = async () => {
    try {
      const empRes = await api.getEmployees();
      if (empRes.success && empRes.employees) {
        setEmployees(empRes.employees);
        if (empRes.employees.length > 0) {
          const latest = empRes.employees[empRes.employees.length - 1];
          setFormData((prev) => ({ ...prev, employeeId: latest.id }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (assignment) {
      setFormData({
        projectId: assignment.projectId || '',
        employeeId: assignment.employeeId || '',
        projectRole: assignment.projectRole || 'Full Stack Developer',
        allocationPercentage: assignment.allocationPercentage || 50,
        responsibilities: assignment.responsibilities || '',
        expectedReleaseDate: assignment.expectedReleaseDate || '',
        assignmentStatus: assignment.assignmentStatus || 'ACTIVE',
      });
    } else {
      setFormData({
        projectId: defaultProjectId || '',
        employeeId: defaultEmployeeId || '',
        projectRole: 'Full Stack Developer',
        allocationPercentage: 50,
        responsibilities: '',
        expectedReleaseDate: '',
        assignmentStatus: 'ACTIVE',
      });
    }
    setError('');
    setWarning('');
  }, [assignment, defaultProjectId, defaultEmployeeId, isOpen]);

  // Recalculate capacity warning
  useEffect(() => {
    if (!formData.employeeId) {
      setWarning('');
      return;
    }

    const emp = employees.find((e) => e.id === formData.employeeId);
    if (!emp) return;

    let baseCommitment = emp.totalAllocationPercentage || 0;
    if (assignment && assignment.employeeId === formData.employeeId) {
      baseCommitment -= Number(assignment.allocationPercentage) || 0;
    }

    const projectedTotal = baseCommitment + (Number(formData.allocationPercentage) || 0);
    if (projectedTotal > 100) {
      setWarning(
        `Over-allocation Warning: ${emp.name} will have ${projectedTotal}% commitment (Max recommended: 100%). Currently committed: ${baseCommitment}%.`
      );
    } else if (emp.activeProjectsCount >= (emp.maxActiveProjects || 3) && !assignment) {
      setWarning(
        `Project Limit Warning: ${emp.name} already has ${emp.activeProjectsCount} active projects (Max: ${emp.maxActiveProjects || 3}).`
      );
    } else {
      setWarning('');
    }
  }, [formData.employeeId, formData.allocationPercentage, employees, assignment]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectId) {
      setError('Please select a project');
      return;
    }
    if (!formData.employeeId) {
      setError('Please select an employee');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        ...formData,
        allocationPercentage: Number(formData.allocationPercentage) || 50,
      };

      if (assignment) {
        await api.updateAssignment(assignment.id, payload);
      } else {
        await api.assignEmployee(formData.projectId, payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#253142]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#F4F7FA] rounded-3xl max-w-lg w-full p-6 shadow-atmo-card-lg border border-[#DDE4EC] overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4EC]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] shadow-atmo-btn">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#253142]">
                {assignment ? 'Edit Project Team Assignment' : 'Assign Employee to Project'}
              </h2>
              <p className="text-xs text-[#7C8998]">
                Allocate developer capacity, define responsibility scope and set release dates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A0ACBA] hover:text-[#253142] rounded-xl hover:bg-[#E8EDF3] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Warning Alert */}
        {warning && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-800 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>{warning}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Project Select */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Select Project <span className="text-rose-500">*</span>
            </label>
            <select
              required
              disabled={Boolean(assignment)}
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white disabled:bg-slate-100"
            >
              <option value="">-- Choose Project --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectId} — {p.title} ({p.status})
                </option>
              ))}
            </select>
          </div>

          {/* Employee Select */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-700 font-semibold">
                Select Employee <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsAddEmployeeModalOpen(true)}
                className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Employee</span>
              </button>
            </div>
            <select
              required
              disabled={Boolean(assignment)}
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white disabled:bg-slate-100"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.empId} — {emp.name} ({emp.designation} • {emp.department}) [{emp.totalAllocationPercentage || 0}% Allocated]
                </option>
              ))}
            </select>
            {employees.length === 0 && (
              <p className="mt-1 text-[11px] text-amber-600">
                No employees registered yet. Click &quot;Add New Employee&quot; above to add personnel.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Project Role */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Project Role <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.projectRole}
                onChange={(e) => setFormData({ ...formData, projectRole: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                {PROJECT_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Allocation Percentage */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Allocation Commitment: <span className="font-bold text-blue-800">{formData.allocationPercentage}%</span>
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={formData.allocationPercentage}
                  onChange={(e) => setFormData({ ...formData, allocationPercentage: Number(e.target.value) })}
                  className="flex-1 accent-blue-600"
                />
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={formData.allocationPercentage}
                  onChange={(e) => setFormData({ ...formData, allocationPercentage: Number(e.target.value) })}
                  className="w-16 px-2 py-1 border border-slate-300 rounded text-center font-bold"
                />
              </div>
            </div>

            {/* Expected Release Date */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Expected Release Date</label>
              <input
                type="date"
                value={formData.expectedReleaseDate}
                onChange={(e) => setFormData({ ...formData, expectedReleaseDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Assignment Status */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Assignment Status</label>
              <select
                value={formData.assignmentStatus}
                onChange={(e) => setFormData({ ...formData, assignmentStatus: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="RELEASED">RELEASED</option>
              </select>
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Key Responsibilities & Scope</label>
            <textarea
              rows={2}
              placeholder="e.g. Lead frontend development, implement checkout flow, coordinate Cypress testing..."
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#DDE4EC]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#DDE4EC] bg-[#E8EDF3] hover:bg-[#DDE4EC] text-[#253142] rounded-2xl font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl font-semibold shadow-md shadow-blue-500/25 transition-all disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : assignment ? 'Update Assignment' : 'Assign Employee'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quick Add Employee Modal */}
      {isAddEmployeeModalOpen && (
        <EmployeeModal
          isOpen={isAddEmployeeModalOpen}
          onClose={() => setIsAddEmployeeModalOpen(false)}
          onSuccess={handleEmployeeCreated}
        />
      )}
    </div>
  );
};

