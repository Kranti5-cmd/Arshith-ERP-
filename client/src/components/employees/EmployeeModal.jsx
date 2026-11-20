import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

const DEPARTMENTS = [
  'Engineering',
  'Project Delivery',
  'Design',
  'QA & Testing',
  'DevOps & Cloud',
  'Data & AI',
  'Finance & Accounts',
  'Executive Management',
];

const COMMON_DESIGNATIONS = [
  'Senior Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Technical Architect & Lead',
  'Senior Project Manager',
  'Project Manager',
  'UI/UX Designer',
  'QA Automation Lead',
  'DevOps & Cloud Engineer',
  'AI / ML Engineer',
  'Database Administrator',
  'Head of Financial Operations',
];

export const EmployeeModal = ({ isOpen, onClose, onSuccess, employee = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: 'Senior Full Stack Developer',
    skills: '',
    experienceYears: 3,
    hourlyRate: 1500,
    maxActiveProjects: 3,
    status: 'ACTIVE',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || 'Engineering',
        designation: employee.designation || 'Senior Full Stack Developer',
        skills: Array.isArray(employee.skills) ? employee.skills.join(', ') : employee.skills || '',
        experienceYears: employee.experienceYears || 0,
        hourlyRate: employee.hourlyRate || 1500,
        maxActiveProjects: employee.maxActiveProjects || 3,
        status: employee.status || 'ACTIVE',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Engineering',
        designation: 'Senior Full Stack Developer',
        skills: 'React.js, Node.js, PostgreSQL',
        experienceYears: 3,
        hourlyRate: 1500,
        maxActiveProjects: 3,
        status: 'ACTIVE',
      });
    }
    setError('');
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please provide Employee Name and Email Address');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        ...formData,
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        experienceYears: Number(formData.experienceYears) || 0,
        hourlyRate: Number(formData.hourlyRate) || 0,
        maxActiveProjects: Number(formData.maxActiveProjects) || 3,
      };

      if (employee) {
        await api.updateEmployee(employee.id, payload);
      } else {
        await api.createEmployee(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#253142]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#F4F7FA] rounded-3xl max-w-xl w-full p-6 shadow-atmo-card-lg border border-[#DDE4EC] overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4EC]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] shadow-atmo-btn">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#253142]">
                {employee ? `Edit Employee (${employee.empId})` : 'Add New Employee'}
              </h2>
              <p className="text-xs text-[#7C8998]">
                {employee
                  ? 'Update employee profile, skills, department and allocation parameters'
                  : 'Register a new team member into the Arshith Infotech employee directory'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ananya Deshmukh"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. ananya@arshith.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Designation</label>
              <input
                type="text"
                list="designations-list"
                placeholder="Select or enter title e.g. Senior Full Stack Developer"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <datalist id="designations-list">
                {COMMON_DESIGNATIONS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>

            {/* Skills */}
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Core Competencies & Skills <span className="text-slate-400 font-normal">(Comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="React.js, Node.js, Python, PostgreSQL, AWS, Docker"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Experience Years */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Experience (Years)</label>
              <input
                type="number"
                min="0"
                max="40"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Billing Rate (₹/Hour)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Max Active Projects */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Max Active Projects Limit</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.maxActiveProjects}
                onChange={(e) => setFormData({ ...formData, maxActiveProjects: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Employment Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
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
              <span>{loading ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

