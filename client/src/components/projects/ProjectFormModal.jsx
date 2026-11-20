import React, { useState, useEffect } from 'react';
import { X, Building2, Calendar, IndianRupee, Users, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const ProjectFormModal = ({ isOpen, onClose, onSuccess, editProject = null }) => {
  const isEditing = Boolean(editProject);
  const [activeSection, setActiveSection] = useState('A');
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    // Section A: Basic Info
    title: '',
    clientId: '',
    clientCompany: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    description: '',
    categoryName: 'Enterprise Web Application',
    projectType: 'FIXED_PRICE',
    projectSource: 'DIRECT_CLIENT',
    priority: 'MEDIUM',

    // Section B: Requirements
    objective: '',
    scope: '',
    functionalRequirements: '',
    technicalRequirements: '',
    deliverables: '',
    expectedOutcome: '',
    requiredTechnologies: '',
    dependencies: '',
    specialInstructions: '',

    // Section C: Timeline
    receivedDate: new Date().toISOString().split('T')[0],
    acceptedDate: '',
    plannedStartDate: '',
    expectedCompletionDate: '',

    // Section D: Financials
    proposedBudget: '',
    approvedBudget: '',
    advanceReceived: '',
    estimatedDevCost: '',

    // Section E: Management
    projectManagerId: '',
    status: 'NEW',
    internalRemarks: '',
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const cRes = await api.getClients();
        if (cRes.success) setClients(cRes.clients);
        const eRes = await api.getEmployees();
        if (eRes.success) setEmployees(eRes.employees);
      } catch (err) {
        console.error('Error fetching dropdowns:', err);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (editProject) {
      setFormData({
        title: editProject.title || '',
        clientId: editProject.clientId || '',
        clientCompany: editProject.client?.companyName || '',
        clientName: editProject.client?.contactPerson || '',
        clientEmail: editProject.client?.email || '',
        clientPhone: editProject.client?.phone || '',
        description: editProject.description || '',
        categoryName: editProject.categoryName || 'Enterprise Web Application',
        projectType: editProject.projectType || 'FIXED_PRICE',
        projectSource: editProject.projectSource || 'DIRECT_CLIENT',
        priority: editProject.priority || 'MEDIUM',
        objective: editProject.objective || '',
        scope: editProject.scope || '',
        functionalRequirements: editProject.functionalRequirements || '',
        technicalRequirements: editProject.technicalRequirements || '',
        deliverables: editProject.deliverables || '',
        expectedOutcome: editProject.expectedOutcome || '',
        requiredTechnologies: Array.isArray(editProject.requiredTechnologies)
          ? editProject.requiredTechnologies.join(', ')
          : editProject.requiredTechnologies || '',
        dependencies: editProject.dependencies || '',
        specialInstructions: editProject.specialInstructions || '',
        receivedDate: editProject.receivedDate || '',
        acceptedDate: editProject.acceptedDate || '',
        plannedStartDate: editProject.plannedStartDate || '',
        expectedCompletionDate: editProject.expectedCompletionDate || '',
        proposedBudget: editProject.proposedBudget || '',
        approvedBudget: editProject.approvedBudget || '',
        advanceReceived: editProject.advanceReceived || '',
        estimatedDevCost: editProject.estimatedDevCost || '',
        projectManagerId: editProject.projectManagerId || '',
        status: editProject.status || 'NEW',
        internalRemarks: editProject.internalRemarks || '',
      });
    } else {
      setFormData({
        title: '',
        clientId: '',
        clientCompany: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        description: '',
        categoryName: 'Enterprise Web Application',
        projectType: 'FIXED_PRICE',
        projectSource: 'DIRECT_CLIENT',
        priority: 'MEDIUM',
        objective: '',
        scope: '',
        functionalRequirements: '',
        technicalRequirements: '',
        deliverables: '',
        expectedOutcome: '',
        requiredTechnologies: 'React.js, Node.js, PostgreSQL, Docker',
        dependencies: '',
        specialInstructions: '',
        receivedDate: new Date().toISOString().split('T')[0],
        acceptedDate: '',
        plannedStartDate: '',
        expectedCompletionDate: '',
        proposedBudget: '',
        approvedBudget: '',
        advanceReceived: '',
        estimatedDevCost: '',
        projectManagerId: '',
        status: 'NEW',
        internalRemarks: '',
      });
    }
  }, [editProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        proposedBudget: Number(formData.proposedBudget) || 0,
        approvedBudget: Number(formData.approvedBudget) || 0,
        advanceReceived: Number(formData.advanceReceived) || 0,
        estimatedDevCost: Number(formData.estimatedDevCost) || 0,
        requiredTechnologies: formData.requiredTechnologies
          ? formData.requiredTechnologies.split(',').map((t) => t.trim())
          : [],
      };

      if (isEditing) {
        await api.updateProject(editProject.id, payload);
      } else {
        await api.createProject(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert(`Error saving project: ${err.message}`);
    }
  };

  const sections = [
    { id: 'A', label: 'A. Basic Info' },
    { id: 'B', label: 'B. Requirements' },
    { id: 'C', label: 'C. Timeline' },
    { id: 'D', label: 'D. Financials' },
    { id: 'E', label: 'E. Management' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-[#F4F7FA] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-atmo-card-lg border border-[#DDE4EC] overflow-hidden">
        {/* Header */}
        <div className="p-4 px-6 border-b border-[#DDE4EC] flex items-center justify-between bg-[#F4F7FA] rounded-t-3xl">
          <div>
            <h2 className="text-base font-extrabold text-[#253142]">
              {isEditing ? `Edit Project: ${editProject.projectId}` : 'Register New Enterprise Project'}
            </h2>
            <p className="text-xs text-[#7C8998]">
              {isEditing
                ? 'Update specifications, timelines, or financial allocations'
                : 'Auto-generates unique Project ID (AIP-2026-XXX) and sets up lifecycle record'}
            </p>
          </div>
          <button onClick={onClose} className="atmo-btn-icon">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Tabs in Atmosphere Well */}
        <div className="px-6 pt-3 pb-1">
          <div className="atmo-well p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`py-1.5 px-3.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeSection === s.id
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 font-bold'
                    : 'text-[#7C8998] hover:text-[#253142] hover:bg-white/60'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* SECTION A: BASIC INFO */}
          {activeSection === 'A' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Omnichannel B2B Commerce Platform"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-600 text-slate-900"
                />
              </div>

              {/* Client Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Existing Client Account</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  >
                    <option value="">-- Or Enter New Client Below --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName} ({c.contactPerson})
                      </option>
                    ))}
                  </select>
                </div>

                {!formData.clientId && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">New Client Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Reliance Retail Supply Chain"
                      value={formData.clientCompany}
                      onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                    />
                  </div>
                )}
              </div>

              {!formData.clientId && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Contact Person</label>
                    <input
                      type="text"
                      placeholder="Suresh Chandra"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Client Email</label>
                    <input
                      type="email"
                      placeholder="client@company.com"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Client Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98765 00000"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded bg-white text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Category</label>
                  <select
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  >
                    <option value="Enterprise Web Application">Enterprise Web Application</option>
                    <option value="FinTech & Banking Solutions">FinTech & Banking Solutions</option>
                    <option value="Healthcare & Telemedicine">Healthcare & Telemedicine</option>
                    <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                    <option value="AI & Machine Learning Solutions">AI & Machine Learning</option>
                    <option value="Smart City & Public Infrastructure">Smart City & Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Type</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  >
                    <option value="FIXED_PRICE">Fixed Price Contract</option>
                    <option value="TIME_AND_MATERIALS">Time & Materials (T&M)</option>
                    <option value="DEDICATED_TEAM">Dedicated Engineering Team</option>
                    <option value="INTERNAL">Internal R&D Product</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  >
                    <option value="CRITICAL">Critical (P1)</option>
                    <option value="HIGH">High (P2)</option>
                    <option value="MEDIUM">Medium (P3)</option>
                    <option value="LOW">Low (P4)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Description</label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive description of the enterprise project, target stakeholders, and business context."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                ></textarea>
              </div>
            </div>
          )}

          {/* SECTION B: REQUIREMENTS */}
          {activeSection === 'B' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Objective</label>
                <input
                  type="text"
                  placeholder="Primary objective and quantitative success criteria"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Scope</label>
                <textarea
                  rows={2}
                  placeholder="In-scope features and boundary specifications"
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Functional Requirements</label>
                  <textarea
                    rows={2}
                    placeholder="Key functional workflows and user stories"
                    value={formData.functionalRequirements}
                    onChange={(e) => setFormData({ ...formData, functionalRequirements: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Technical Requirements</label>
                  <textarea
                    rows={2}
                    placeholder="Architecture, API standards, database and security compliance"
                    value={formData.technicalRequirements}
                    onChange={(e) => setFormData({ ...formData, technicalRequirements: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Required Technologies (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React.js, Node.js, PostgreSQL, Docker, AWS"
                  value={formData.requiredTechnologies}
                  onChange={(e) => setFormData({ ...formData, requiredTechnologies: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deliverables & Special Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Source code, Docker compose, user manuals, deployment assistance"
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                ></textarea>
              </div>
            </div>
          )}

          {/* SECTION C: TIMELINE */}
          {activeSection === 'C' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Received Date</label>
                  <input
                    type="date"
                    value={formData.receivedDate}
                    onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Accepted Date</label>
                  <input
                    type="date"
                    value={formData.acceptedDate}
                    onChange={(e) => setFormData({ ...formData, acceptedDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Planned Start Date</label>
                  <input
                    type="date"
                    value={formData.plannedStartDate}
                    onChange={(e) => setFormData({ ...formData, plannedStartDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Completion Date</label>
                  <input
                    type="date"
                    value={formData.expectedCompletionDate}
                    onChange={(e) => setFormData({ ...formData, expectedCompletionDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION D: FINANCIALS */}
          {activeSection === 'D' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-xs">
                All financial figures are recorded and calculated in Indian National Rupee (₹ INR).
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Proposed Budget (₹ INR)</label>
                  <input
                    type="number"
                    placeholder="3500000"
                    value={formData.proposedBudget}
                    onChange={(e) => setFormData({ ...formData, proposedBudget: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Approved Budget (₹ INR)</label>
                  <input
                    type="number"
                    placeholder="3200000"
                    value={formData.approvedBudget}
                    onChange={(e) => setFormData({ ...formData, approvedBudget: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Advance Received (₹ INR)</label>
                  <input
                    type="number"
                    placeholder="960000"
                    value={formData.advanceReceived}
                    onChange={(e) => setFormData({ ...formData, advanceReceived: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Development Cost (₹ INR)</label>
                  <input
                    type="number"
                    placeholder="2100000"
                    value={formData.estimatedDevCost}
                    onChange={(e) => setFormData({ ...formData, estimatedDevCost: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION E: MANAGEMENT */}
          {activeSection === 'E' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Manager</label>
                  <select
                    value={formData.projectManagerId}
                    onChange={(e) => setFormData({ ...formData, projectManagerId: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                  >
                    <option value="">-- Assign Project Manager --</option>
                    {employees && employees.length > 0 ? (
                      employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.empId} — {emp.name} ({emp.designation} • {emp.department})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="usr-001">Farook (Managing Director & CEO)</option>
                        <option value="usr-002">Priya Sundaram (Senior Project Manager)</option>
                        <option value="usr-003">Vikramaditya Rao (Technical Architect & Lead)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  >
                    <option value="NEW">New</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="APPROVED">Approved</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internal Remarks & Notes</label>
                <textarea
                  rows={3}
                  placeholder="Confidential management notes, client payment milestone terms, special SLA conditions"
                  value={formData.internalRemarks}
                  onChange={(e) => setFormData({ ...formData, internalRemarks: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                ></textarea>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-1.5">
              {sections.map((s, idx) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-6 h-6 rounded-full text-[10px] font-bold ${
                    activeSection === s.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm"
              >
                {isEditing ? 'Save Changes' : 'Confirm Registration'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

