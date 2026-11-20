import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Building2,
  Calendar,
  Clock,
  IndianRupee,
  Briefcase,
  FileText,
  Award,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Plus,
  RefreshCw,
  ExternalLink,
  Shield,
  Layers,
  Leaf,
  GraduationCap,
  Filter,
  Download,
  Camera,
  Check,
  UserPlus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const COMPANIES = [
  { id: 'ALL', name: 'All Companies (Consolidated)', badge: 'Group HRMS', icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'ARSHITH_INFOTECH', name: 'Arshith Infotech', badge: 'IT Services', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'CODELEKHO', name: 'CodeLekho', badge: 'EdTech & Academics', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
];

export const HrWorkspace = ({ initialCompany = 'ALL', onReturnToErm }) => {
  const [selectedCompany, setSelectedCompany] = useState(() => {
    return localStorage.getItem('hrms.company') || initialCompany;
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [recruitment, setRecruitment] = useState({ jobs: [], candidates: [] });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  // Form states
  const [newEmpForm, setNewEmpForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: selectedCompany === 'ALL' ? 'ARSHITH_INFOTECH' : selectedCompany,
    department: 'Engineering',
    designation: '',
    salaryMonthly: '',
    workLocation: 'Hyderabad HQ',
  });

  const [leaveForm, setLeaveForm] = useState({
    employeeId: '',
    name: '',
    leaveType: 'Casual Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    totalDays: 1,
    reason: '',
  });

  const fetchHrData = async () => {
    setLoading(true);
    try {
      const coParam = selectedCompany === 'ALL' ? 'all' : selectedCompany;

      // 1. Dashboard
      const dashRes = await fetch(`/api/hr/dashboard?company=${coParam}`);
      if (dashRes.ok) {
        const dJson = await dashRes.json();
        setDashboardData(dJson);
      }

      // 2. Employees
      const empRes = await fetch(`/api/hr/employees?company=${coParam}`);
      if (empRes.ok) {
        const eJson = await empRes.json();
        setEmployees(eJson.employees || []);
      }

      // 3. Attendance
      const attRes = await fetch(`/api/hr/attendance?company=${coParam}`);
      if (attRes.ok) {
        const aJson = await attRes.json();
        setAttendance(aJson.attendance || []);
      }

      // 4. Leaves
      const lvRes = await fetch(`/api/hr/leaves?company=${coParam}`);
      if (lvRes.ok) {
        const lJson = await lvRes.json();
        setLeaves(lJson.leaves || []);
      }

      // 5. Payroll
      const prRes = await fetch(`/api/hr/payroll?company=${coParam}`);
      if (prRes.ok) {
        const pJson = await prRes.json();
        setPayroll(pJson.payroll || []);
      }

      // 6. Recruitment
      const recRes = await fetch(`/api/hr/recruitment?company=${coParam}`);
      if (recRes.ok) {
        const rJson = await recRes.json();
        setRecruitment(rJson);
      }
    } catch (err) {
      console.error('Failed to load HRMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('hrms.company', selectedCompany);
    fetchHrData();
  }, [selectedCompany]);

  const handleCompanyChange = (coId) => {
    setSelectedCompany(coId);
    setCompanyDropdownOpen(false);
  };

  // Add Employee handler
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/hr/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmpForm),
      });
      if (res.ok) {
        setShowAddEmpModal(false);
        setNewEmpForm({
          name: '',
          email: '',
          phone: '',
          company: selectedCompany === 'ALL' ? 'ARSHITH_INFOTECH' : selectedCompany,
          department: 'Engineering',
          designation: '',
          salaryMonthly: '',
          workLocation: 'Hyderabad HQ',
        });
        fetchHrData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Check-In handler
  const handleCheckIn = async () => {
    try {
      const res = await fetch('/api/hr/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: 'AIT-101',
          name: 'Farook (Admin Check-in)',
          company: selectedCompany === 'ALL' ? 'ARSHITH_INFOTECH' : selectedCompany,
          workMode: 'Office',
        }),
      });
      if (res.ok) {
        fetchHrData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Review Leave handler
  const handleReviewLeave = async (id, status) => {
    try {
      const res = await fetch(`/api/hr/leaves/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewerName: 'Farook (Admin)' }),
      });
      if (res.ok) {
        fetchHrData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Apply Leave handler
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/hr/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leaveForm,
          company: selectedCompany === 'ALL' ? 'ARSHITH_INFOTECH' : selectedCompany,
        }),
      });
      if (res.ok) {
        setShowApplyLeaveModal(false);
        fetchHrData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentCoObj = COMPANIES.find((c) => c.id === selectedCompany) || COMPANIES[0];
  const CurrentCoIcon = currentCoObj.icon;

  const filteredEmployees = employees.filter((emp) => {
    if (departmentFilter !== 'ALL' && emp.department !== departmentFilter) return false;
    if (statusFilter !== 'ALL' && emp.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        (emp.name && emp.name.toLowerCase().includes(q)) ||
        (emp.empId && emp.empId.toLowerCase().includes(q)) ||
        (emp.designation && emp.designation.toLowerCase().includes(q)) ||
        (emp.department && emp.department.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const departmentsList = Array.from(new Set(employees.map((e) => e.department))).filter(Boolean);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#E8EDF3] overflow-y-auto font-sans">
      {/* Top Header Bar */}
      <div className="bg-[#E8EDF3] border-b border-[#DDE4EC] px-6 py-4 sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-[#253142] tracking-tight">Arshith Connect HRMS</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-50 text-[#2563EB] border border-blue-200">
                  Central Multi-Company
                </span>
              </div>
              <p className="text-xs text-[#7C8998]">
                Workforce management, attendance tracking, payroll & leaves across Arshith ecosystem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Multi-Company Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-[#F4F7FA] hover:bg-white border border-[#DDE4EC] hover:border-[#2563EB]/60 rounded-2xl text-xs font-bold text-[#253142] transition-all shadow-atmo-card-sm cursor-pointer group"
              >
                <div className={`w-5 h-5 rounded-md ${currentCoObj.bg} flex items-center justify-center`}>
                  <CurrentCoIcon className={`w-3.5 h-3.5 ${currentCoObj.color}`} />
                </div>
                <span>{currentCoObj.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white border border-[#DDE4EC] text-[#7C8998] rounded-md">
                  {currentCoObj.badge}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#7C8998] transition-transform ${companyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {companyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#F4F7FA] rounded-3xl shadow-atmo-card-lg border border-[#DDE4EC] p-2.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7C8998] font-mono border-b border-[#DDE4EC] mb-1">
                    Select Business Entity
                  </div>
                  {COMPANIES.map((c) => {
                    const Icon = c.icon;
                    const isSelected = c.id === selectedCompany;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleCompanyChange(c.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-2xl text-left transition-all cursor-pointer ${
                          isSelected ? 'bg-white border border-[#2563EB]/60 text-[#253142] font-bold shadow-atmo-btn' : 'hover:bg-white/60 text-[#7C8998]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-6 h-6 rounded-xl ${c.bg} flex items-center justify-center`}>
                            <Icon className={`w-3.5 h-3.5 ${c.color}`} />
                          </div>
                          <div>
                            <div className="text-xs font-bold">{c.name}</div>
                            <div className="text-[10px] text-[#7C8998]">{c.badge}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#2563EB]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Check-in Button */}
            <button
              onClick={handleCheckIn}
              className="atmo-btn-primary"
              title="Record instant check-in for attendance"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Quick Check-In</span>
            </button>

            {/* Refresh */}
            <button
              onClick={fetchHrData}
              disabled={loading}
              className="atmo-btn-icon"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#2563EB]' : ''}`} />
            </button>

            {onReturnToErm && (
              <button
                onClick={onReturnToErm}
                className="atmo-btn-secondary"
              >
                Back to ERM
              </button>
            )}
          </div>
        </div>

        {/* Atmosphere Recessed Well: HR Module Navigation Tabs */}
        <div className="atmo-well p-1.5 rounded-2xl flex items-center gap-1.5 mt-4 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'HR Dashboard', icon: TrendingUp },
            { id: 'employees', label: 'Employee Directory', icon: UserCheck, count: employees.length },
            { id: 'attendance', label: 'Attendance & Check-Ins', icon: Clock, count: attendance.length },
            { id: 'leaves', label: 'Leaves & Absences', icon: Calendar, badge: dashboardData?.summary?.pendingLeaveRequests ? `${dashboardData.summary.pendingLeaveRequests} Pending` : null },
            { id: 'payroll', label: 'Payroll & Salaries', icon: IndianRupee },
            { id: 'recruitment', label: 'Recruitment & Jobs', icon: Briefcase, count: recruitment.jobs?.length || 0 },
            { id: 'departments', label: 'Organization & Teams', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 font-bold'
                    : 'text-[#7C8998] hover:text-[#253142] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#7C8998]'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-white text-[#7C8998] border border-[#DDE4EC]'}`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500 text-white font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase font-mono">
                  <span>Total Headcount</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">
                  {dashboardData?.summary?.totalHeadcount || employees.length}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                  <span className="text-emerald-600 font-bold">
                    {dashboardData?.summary?.activeHeadcount || employees.filter(e => e.status === 'ACTIVE').length} Active
                  </span>
                  <span>•</span>
                  <span>{dashboardData?.summary?.probationHeadcount || 0} Probation</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase font-mono">
                  <span>Attendance Today</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">
                  {dashboardData?.summary?.attendanceRate || 95}%
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">
                  <span className="text-emerald-600 font-bold">{dashboardData?.summary?.presentToday || 0} Present</span>
                  <span className="mx-1">•</span>
                  <span className="text-rose-600 font-bold">{dashboardData?.summary?.onLeaveToday || 0} On Leave</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase font-mono">
                  <span>Pending Leave Reviews</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">
                  {dashboardData?.summary?.pendingLeaveRequests || leaves.filter(l => l.status === 'PENDING').length}
                </div>
                <div className="text-[11px] text-amber-600 mt-1 font-semibold">
                  Requires Manager Review & Approval
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase font-mono">
                  <span>Monthly Payroll Cost</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">
                  ₹{((dashboardData?.summary?.monthlyPayrollTotal || 0) / 100000).toFixed(2)} L
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">
                  {dashboardData?.summary?.activeOpenings || 0} Active Job Openings
                </div>
              </div>
            </div>

            {/* Consolidated Multi-Company Breakdown Cards (Only when ALL or viewable) */}
            {selectedCompany === 'ALL' && dashboardData?.companyBreakdown && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Subsidiary Workforce Breakdown</h3>
                  <span className="text-xs text-slate-500 font-mono">Enterprise Units</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => handleCompanyChange('ARSHITH_INFOTECH')}
                    className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Arshith Infotech</div>
                        <div className="text-[10px] text-slate-500">IT Solutions & Engineering</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Headcount</div>
                        <div className="text-lg font-bold text-slate-800">
                          {dashboardData.companyBreakdown?.ARSHITH_INFOTECH?.count || 8} Staff
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Payroll</div>
                        <div className="text-sm font-bold text-blue-700">
                          ₹{((dashboardData.companyBreakdown?.ARSHITH_INFOTECH?.payroll || 0) / 100000).toFixed(2)} L/mo
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleCompanyChange('CODELEKHO')}
                    className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">CodeLekho</div>
                        <div className="text-[10px] text-slate-500">EdTech, Faculty & Tech</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Headcount</div>
                        <div className="text-lg font-bold text-slate-800">
                          {dashboardData.companyBreakdown?.CODELEKHO?.count || 6} Staff
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Payroll</div>
                        <div className="text-sm font-bold text-purple-700">
                          ₹{((dashboardData.companyBreakdown?.CODELEKHO?.payroll || 0) / 100000).toFixed(2)} L/mo
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions & Pending Approvals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Pending Leaves Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>Pending Leave Requests</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('leaves')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {leaves.filter(l => l.status === 'PENDING').length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No pending leave applications for this company scope.
                    </div>
                  ) : (
                    leaves
                      .filter(l => l.status === 'PENDING')
                      .slice(0, 4)
                      .map((lv) => (
                        <div key={lv.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-900">{lv.name} ({lv.employeeId})</div>
                            <div className="text-[11px] text-slate-500">
                              {lv.leaveType} • {lv.startDate} ({lv.totalDays} day{lv.totalDays > 1 ? 's' : ''})
                            </div>
                            <div className="text-[10px] text-slate-600 italic mt-0.5 font-sans">
                              "{lv.reason}"
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleReviewLeave(lv.id, 'APPROVED')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewLeave(lv.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold cursor-pointer border border-rose-200"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Today's Attendance Feed Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Live Attendance Stream</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <span>Full Log</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {attendance.slice(0, 5).map((att) => (
                    <div key={att.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[10px] flex items-center justify-center font-mono">
                          {att.employeeId.split('-')[1] || 'EMP'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{att.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            In: {att.checkIn} • Mode: {att.workMode}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          att.status === 'PRESENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : att.status === 'LATE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {att.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EMPLOYEES TAB */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, ID, designation..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">All Departments</option>
                  {departmentsList.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PROBATION">Probation</option>
                  <option value="ON_LEAVE">On Leave</option>
                </select>

                <button
                  onClick={() => setShowAddEmpModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Employee</span>
                </button>
              </div>
            </div>

            {/* Employee Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((emp) => (
                <div key={emp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow transition-all space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-indigo-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                        {emp.avatar || emp.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{emp.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">({emp.empId})</span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium">{emp.designation}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        emp.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono text-[10px]">Company:</span>
                      <span className="font-bold text-slate-800">{emp.company}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono text-[10px]">Department:</span>
                      <span className="font-semibold">{emp.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono text-[10px]">Location:</span>
                      <span>{emp.workLocation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono text-[10px]">Reporting:</span>
                      <span>{emp.reportingManager}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono text-[10px]">Monthly Comp:</span>
                      <span className="font-mono font-bold text-emerald-700">₹{Number(emp.salaryMonthly).toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                    <span>Email:</span>
                    <a href={`mailto:${emp.email}`} className="text-indigo-600 hover:underline truncate">{emp.email}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Attendance Log</h3>
                <p className="text-xs text-slate-500">Selfie verification & working hours verification</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCheckIn}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Check In / Out</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Check-In</th>
                    <th className="py-3 px-4">Check-Out</th>
                    <th className="py-3 px-4">Hours</th>
                    <th className="py-3 px-4">Work Mode</th>
                    <th className="py-3 px-4">Selfie Verification</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendance.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{att.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{att.employeeId}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">{att.company}</td>
                      <td className="py-3 px-4 text-slate-600">{att.date}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">{att.checkIn}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">{att.checkOut}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{att.hoursWorked}h</td>
                      <td className="py-3 px-4 text-slate-700">{att.workMode}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            att.status === 'PRESENT'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : att.status === 'LATE'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LEAVES TAB */}
        {activeTab === 'leaves' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Leave Applications & Balances</h3>
                <p className="text-xs text-slate-500">Review employee leave requests and policy entitlements</p>
              </div>
              <button
                onClick={() => setShowApplyLeaveModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Apply for Leave</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaves.map((lv) => (
                    <tr key={lv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{lv.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{lv.employeeId}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">{lv.company}</td>
                      <td className="py-3 px-4 text-slate-600">{lv.department}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{lv.leaveType}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {lv.startDate} to {lv.endDate} ({lv.totalDays}d)
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={lv.reason}>
                        {lv.reason}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            lv.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : lv.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {lv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {lv.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleReviewLeave(lv.id, 'APPROVED')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewLeave(lv.id, 'REJECTED')}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs font-semibold cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">Reviewed by {lv.reviewedBy}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYROLL TAB */}
        {activeTab === 'payroll' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Monthly Compensation & Payslips</h3>
                <p className="text-xs text-slate-500">Gross pay, statutory deductions, PF, and net disbursements</p>
              </div>
              <div className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
                Cycle: November 2026
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Basic Pay</th>
                    <th className="py-3 px-4">HRA & Allowances</th>
                    <th className="py-3 px-4">Gross Salary</th>
                    <th className="py-3 px-4">Deductions (TDS/PF)</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Payslip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payroll.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{p.employeeId}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">{p.company}</td>
                      <td className="py-3 px-4 font-mono">₹{p.basicSalary?.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 font-mono">₹{((p.hra || 0) + (p.allowances || 0)).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">₹{p.gross?.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 font-mono text-rose-600">-₹{((p.pf || 0) + (p.taxDeduction || 0)).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">₹{p.netSalary?.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedPayslip(p)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          View Slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RECRUITMENT TAB */}
        {activeTab === 'recruitment' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hiring Pipeline & Open Positions</h3>
                <p className="text-xs text-slate-500">Track candidates and job openings across entities</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recruitment.jobs?.map((job) => (
                <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{job.title}</h4>
                      <p className="text-[11px] text-slate-500">{job.department} • {job.location}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-mono font-bold">
                      {job.openings} Open
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span>Company: <strong className="text-slate-800">{job.company}</strong></span>
                    <span className="font-mono text-indigo-600 font-bold">{job.applicantsCount} Applicants</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Active Candidates in Pipeline</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                      <th className="py-2.5 px-4">Candidate</th>
                      <th className="py-2.5 px-4">Position</th>
                      <th className="py-2.5 px-4">Company</th>
                      <th className="py-2.5 px-4">Experience</th>
                      <th className="py-2.5 px-4">Rating</th>
                      <th className="py-2.5 px-4">Pipeline Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recruitment.candidates?.map((cand) => (
                      <tr key={cand.id}>
                        <td className="py-3 px-4 font-bold text-slate-900">{cand.name}</td>
                        <td className="py-3 px-4 text-slate-700">{cand.jobTitle}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{cand.company}</td>
                        <td className="py-3 px-4 text-slate-600">{cand.experienceYears} Years</td>
                        <td className="py-3 px-4 text-amber-600 font-bold">★ {cand.rating}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-mono font-bold">
                            {cand.stage}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DEPARTMENTS TAB */}
        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentsList.map((dept) => {
              const deptStaff = employees.filter((e) => e.department === dept);
              return (
                <div key={dept} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{dept}</h4>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-mono font-bold">
                      {deptStaff.length} Members
                    </span>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    {deptStaff.map((st) => (
                      <div key={st.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                        <span className="text-slate-700 font-medium">{st.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{st.designation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddEmpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Employee Profile</h3>
              <button onClick={() => setShowAddEmpModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newEmpForm.name}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="e.g. Ramesh Chandra"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Company</label>
                  <select
                    value={newEmpForm.company}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, company: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="ARSHITH_INFOTECH">Arshith Infotech</option>
                    <option value="CODELEKHO">CodeLekho</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={newEmpForm.department}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    placeholder="e.g. Engineering, Logistics"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={newEmpForm.designation}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    placeholder="e.g. Senior Developer"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    required
                    value={newEmpForm.salaryMonthly}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, salaryMonthly: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    placeholder="e.g. 75000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmpForm.email}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={newEmpForm.phone}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    placeholder="+91 98480 00000"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold"
                >
                  Save Employee Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showApplyLeaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Submit Leave Application</h3>
              <button onClick={() => setShowApplyLeaveModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Employee</label>
                <select
                  required
                  value={leaveForm.employeeId}
                  onChange={(e) => {
                    const emp = employees.find(x => x.empId === e.target.value);
                    setLeaveForm({ ...leaveForm, employeeId: e.target.value, name: emp?.name || '' });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                >
                  <option value="">Select an employee...</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.empId}>{e.name} ({e.empId} - {e.department})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Leave Type</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned / Privilege Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason</label>
                <textarea
                  required
                  rows={3}
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="Provide reason for absence..."
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyLeaveModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslip View Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Arshith Group • Salary Slip</h3>
                <p className="text-[11px] text-slate-500 font-mono">{selectedPayslip.month} • {selectedPayslip.company}</p>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Employee Name:</span>
                <span className="font-bold text-slate-900">{selectedPayslip.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Employee ID:</span>
                <span className="font-mono text-slate-800">{selectedPayslip.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Disbursement Status:</span>
                <span className="font-semibold text-emerald-700">{selectedPayslip.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 mb-2 border-b pb-1">Earnings</div>
                <div className="flex justify-between">
                  <span>Basic Salary:</span>
                  <span className="font-mono">₹{selectedPayslip.basicSalary?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>HRA:</span>
                  <span className="font-mono">₹{selectedPayslip.hra?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Special Allowance:</span>
                  <span className="font-mono">₹{selectedPayslip.allowances?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t text-slate-900">
                  <span>Gross Pay:</span>
                  <span className="font-mono">₹{selectedPayslip.gross?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 mb-2 border-b pb-1">Deductions</div>
                <div className="flex justify-between">
                  <span>Provident Fund (PF):</span>
                  <span className="font-mono">₹{selectedPayslip.pf?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Income Tax (TDS):</span>
                  <span className="font-mono">₹{selectedPayslip.taxDeduction?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t text-rose-700">
                  <span>Total Deductions:</span>
                  <span className="font-mono">₹{((selectedPayslip.pf || 0) + (selectedPayslip.taxDeduction || 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-emerald-800 uppercase font-mono font-bold">Net Salary Transferred</div>
                <div className="text-xl font-black text-emerald-900 font-mono">
                  ₹{selectedPayslip.netSalary?.toLocaleString('en-IN')}
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 bg-white text-emerald-800 font-semibold rounded-lg border border-emerald-300">
                Direct Bank Transfer
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

