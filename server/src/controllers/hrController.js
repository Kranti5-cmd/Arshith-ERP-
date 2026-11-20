const { store } = require('../services/dataStore');

// Helper to normalize company codes
const normalizeCompany = (co) => {
  if (!co || co === 'all' || co === 'ALL') return 'ALL';
  const c = String(co).toUpperCase().trim();
  if (c === '1' || c === 'ARSHITHFRESH' || c === 'FRESH' || c.includes('FRESH')) return 'ARSHITHFRESH';
  if (c === '2' || c === 'ARSHITH_INFOTECH' || c === 'ARSHITH' || c.includes('INFOTECH')) return 'ARSHITH_INFOTECH';
  if (c === '3' || c === 'CODELEKHO' || c.includes('LEKHO')) return 'CODELEKHO';
  return c;
};

// Seed initial HR data if not present
const ensureHrDataSeeded = () => {
  let employees = store.getCollection('hr_employees');
  if (employees.length === 0) {
    const seedEmployees = [
      // ARSHITH INFOTECH
      {
        id: 'hremp-it-01',
        empId: 'AIT-101',
        name: 'Farook',
        email: 'farook@arshith.com',
        phone: '+91 98480 11221',
        company: 'ARSHITH_INFOTECH',
        department: 'Executive Management',
        designation: 'Managing Director & CEO',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2020-01-15',
        workLocation: 'Hyderabad HQ',
        reportingManager: 'Board of Directors',
        salaryMonthly: 250000,
        avatar: 'FK',
        skills: ['Executive Strategy', 'Cloud Architecture', 'Portfolio Management'],
      },
      {
        id: 'hremp-it-02',
        empId: 'AIT-102',
        name: 'Priya Sundaram',
        email: 'priya.s@arshith.com',
        phone: '+91 98480 11222',
        company: 'ARSHITH_INFOTECH',
        department: 'Project Delivery',
        designation: 'Senior Project Manager',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2021-03-10',
        workLocation: 'Hyderabad HQ',
        reportingManager: 'Farook',
        salaryMonthly: 140000,
        avatar: 'PS',
        skills: ['Scrum', 'Stakeholder Management', 'Sprint Planning'],
      },
      {
        id: 'hremp-it-03',
        empId: 'AIT-103',
        name: 'Vikramaditya Rao',
        email: 'vikram.rao@arshith.com',
        phone: '+91 98480 11223',
        company: 'ARSHITH_INFOTECH',
        department: 'Engineering',
        designation: 'Technical Architect & Lead',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2021-06-01',
        workLocation: 'Hyderabad HQ',
        reportingManager: 'Farook',
        salaryMonthly: 165000,
        avatar: 'VR',
        skills: ['System Design', 'React.js', 'Node.js', 'Microservices'],
      },
      {
        id: 'hremp-it-04',
        empId: 'AIT-104',
        name: 'Ananya Deshmukh',
        email: 'ananya.d@arshith.com',
        phone: '+91 98480 11224',
        company: 'ARSHITH_INFOTECH',
        department: 'Engineering',
        designation: 'Senior Full Stack Developer',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2022-02-15',
        workLocation: 'Bangalore Office',
        reportingManager: 'Vikramaditya Rao',
        salaryMonthly: 115000,
        avatar: 'AD',
        skills: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      },
      {
        id: 'hremp-it-05',
        empId: 'AIT-105',
        name: 'Meena Ramesh',
        email: 'meena.r@arshith.com',
        phone: '+91 98480 11225',
        company: 'ARSHITH_INFOTECH',
        department: 'Design',
        designation: 'Senior UI/UX Designer',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2022-05-18',
        workLocation: 'Bangalore Office',
        reportingManager: 'Priya Sundaram',
        salaryMonthly: 95000,
        avatar: 'MR',
        skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
      },
      {
        id: 'hremp-it-06',
        empId: 'AIT-106',
        name: 'Pranav Dave',
        email: 'pranav.d@arshith.com',
        phone: '+91 98480 11226',
        company: 'ARSHITH_INFOTECH',
        department: 'Quality Assurance',
        designation: 'QA Automation Lead',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2022-08-01',
        workLocation: 'Hyderabad HQ',
        reportingManager: 'Priya Sundaram',
        salaryMonthly: 85000,
        avatar: 'PD',
        skills: ['Cypress', 'Playwright', 'Jest', 'API Testing'],
      },
      {
        id: 'hremp-it-07',
        empId: 'AIT-107',
        name: 'Divya Teja',
        email: 'divya.t@arshith.com',
        phone: '+91 98480 11227',
        company: 'ARSHITH_INFOTECH',
        department: 'Project Delivery',
        designation: 'Associate Project Manager',
        employmentType: 'Full-time',
        status: 'PROBATION',
        joinDate: '2026-09-01',
        workLocation: 'Hyderabad HQ',
        reportingManager: 'Priya Sundaram',
        salaryMonthly: 70000,
        avatar: 'DT',
        skills: ['Jira', 'Agile Coordination', 'Sprint Tracking'],
      },
      {
        id: 'hremp-it-08',
        empId: 'AIT-108',
        name: 'Neha Kulkarni',
        email: 'neha.k@arshith.com',
        phone: '+91 98480 11228',
        company: 'ARSHITH_INFOTECH',
        department: 'Human Resources',
        designation: 'HR & Talent Acquisition Lead',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2023-01-10',
        workLocation: 'Hyderabad HQ',
        reportingManager: 'Farook',
        salaryMonthly: 80000,
        avatar: 'NK',
        skills: ['Talent Sourcing', 'HR Policies', 'Payroll Compliance'],
      },

      // ARSHITHFRESH
      {
        id: 'hremp-af-01',
        empId: 'AFR-201',
        name: 'Ravi Kumar',
        email: 'ravi.k@arshithfresh.com',
        phone: '+91 98480 22331',
        company: 'ARSHITHFRESH',
        department: 'Warehouse & Logistics',
        designation: 'Warehouse & Operations Lead',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2021-04-01',
        workLocation: 'Balanagar Central Warehouse',
        reportingManager: 'Farook',
        salaryMonthly: 75000,
        avatar: 'RK',
        skills: ['Cold Storage Maintenance', 'Stock Audits', 'FIFO/FEFO Governance'],
      },
      {
        id: 'hremp-af-02',
        empId: 'AFR-202',
        name: 'Sita Devi',
        email: 'sita.d@arshithfresh.com',
        phone: '+91 98480 22332',
        company: 'ARSHITHFRESH',
        department: 'Finance & Accounts',
        designation: 'Accounts & Billing Executive',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2022-01-10',
        workLocation: 'Hyderabad HQ',
        reportingManager: 'Ravi Kumar',
        salaryMonthly: 55000,
        avatar: 'SD',
        skills: ['GST Filing', 'FMCG Invoicing', 'Vendor Reconciliation'],
      },
      {
        id: 'hremp-af-03',
        empId: 'AFR-203',
        name: 'Anil Reddy',
        email: 'anil.r@arshithfresh.com',
        phone: '+91 98480 22333',
        company: 'ARSHITHFRESH',
        department: 'Warehouse & Logistics',
        designation: 'Fleet & Last-Mile Delivery Supervisor',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2022-06-15',
        workLocation: 'Secunderabad Fulfillment Hub',
        reportingManager: 'Ravi Kumar',
        salaryMonthly: 45000,
        avatar: 'AR',
        skills: ['Route Optimization', 'Cold Chain Vehicles', 'Dispatch Logs'],
      },
      {
        id: 'hremp-af-04',
        empId: 'AFR-204',
        name: 'Rajesh Patel',
        email: 'rajesh.p@arshithfresh.com',
        phone: '+91 98480 22334',
        company: 'ARSHITHFRESH',
        department: 'Farm Procurement',
        designation: 'Farm Procurement & Seed Aggregation Manager',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2023-02-01',
        workLocation: 'Nizamabad Agricultural Depot',
        reportingManager: 'Ravi Kumar',
        salaryMonthly: 68000,
        avatar: 'RP',
        skills: ['Mandis Procurement', 'Organic Seed Grading', 'Contract Farming'],
      },
      {
        id: 'hremp-af-05',
        empId: 'AFR-205',
        name: 'Kavitha Swaminathan',
        email: 'kavitha.s@arshithfresh.com',
        phone: '+91 98480 22335',
        company: 'ARSHITHFRESH',
        department: 'Quality & Food Safety',
        designation: 'Cold-Pressed Oil Quality Specialist',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2023-05-12',
        workLocation: 'Balanagar Extraction Unit',
        reportingManager: 'Ravi Kumar',
        salaryMonthly: 60000,
        avatar: 'KS',
        skills: ['FSSAI Compliance', 'Peroxide Value Testing', 'Shelf Life Testing'],
      },
      {
        id: 'hremp-af-06',
        empId: 'AFR-206',
        name: 'Suresh Goud',
        email: 'suresh.g@arshithfresh.com',
        phone: '+91 98480 22336',
        company: 'ARSHITHFRESH',
        department: 'Retail Fulfillment',
        designation: 'Store Billing & Dispatch Associate',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2024-01-20',
        workLocation: 'Kukatpally Retail Flagship',
        reportingManager: 'Anil Reddy',
        salaryMonthly: 42000,
        avatar: 'SG',
        skills: ['POS Operations', 'Barcode Scanning', 'Customer Assistance'],
      },
      {
        id: 'hremp-af-07',
        empId: 'AFR-207',
        name: 'Manoj Verma',
        email: 'manoj.v@arshithfresh.com',
        phone: '+91 98480 22337',
        company: 'ARSHITHFRESH',
        department: 'Warehouse & Logistics',
        designation: 'FMCG Packaging Associate',
        employmentType: 'Full-time',
        status: 'PROBATION',
        joinDate: '2026-10-01',
        workLocation: 'Balanagar Central Warehouse',
        reportingManager: 'Ravi Kumar',
        salaryMonthly: 32000,
        avatar: 'MV',
        skills: ['Automated Bottling', 'Sealing', 'Label Inspection'],
      },

      // CODELEKHO
      {
        id: 'hremp-clk-01',
        empId: 'CLK-301',
        name: 'Lakshmi Narayana',
        email: 'lakshmi.n@codelekho.com',
        phone: '+91 98480 33441',
        company: 'CODELEKHO',
        department: 'Academics & Faculty',
        designation: 'Head of Academic Content & Curriculum',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2021-08-01',
        workLocation: 'Hyderabad Digital Studio',
        reportingManager: 'Farook',
        salaryMonthly: 90000,
        avatar: 'LN',
        skills: ['Pedagogy', 'Computer Science Curriculum', 'Python', 'Data Structures'],
      },
      {
        id: 'hremp-clk-02',
        empId: 'CLK-302',
        name: 'Harsha Vardhan',
        email: 'harsha.v@codelekho.com',
        phone: '+91 98480 33442',
        company: 'CODELEKHO',
        department: 'Academics & Faculty',
        designation: 'Senior Full Stack & Python Instructor',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2022-04-15',
        workLocation: 'Hyderabad Digital Studio',
        reportingManager: 'Lakshmi Narayana',
        salaryMonthly: 85000,
        avatar: 'HV',
        skills: ['Python', 'Django', 'FastAPI', 'DSA Coaching'],
      },
      {
        id: 'hremp-clk-03',
        empId: 'CLK-303',
        name: 'Sneha Patil',
        email: 'sneha.p@codelekho.com',
        phone: '+91 98480 33443',
        company: 'CODELEKHO',
        department: 'Student Success',
        designation: 'Student Community & Doubt Resolution Lead',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2022-09-01',
        workLocation: 'Remote',
        reportingManager: 'Lakshmi Narayana',
        salaryMonthly: 52000,
        avatar: 'SP',
        skills: ['Discord Community', 'Mentorship', 'Student Engagement'],
      },
      {
        id: 'hremp-clk-04',
        empId: 'CLK-304',
        name: 'Amit Bansal',
        email: 'amit.b@codelekho.com',
        phone: '+91 98480 33444',
        company: 'CODELEKHO',
        department: 'Course Admissions',
        designation: 'Admissions & Career Counseling Lead',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2023-03-10',
        workLocation: 'Hyderabad HQ',
        reportingManager: 'Farook',
        salaryMonthly: 58000,
        avatar: 'AB',
        skills: ['Lead Nurturing', 'CRM Funnels', 'Career Guidance'],
      },
      {
        id: 'hremp-clk-05',
        empId: 'CLK-305',
        name: 'Pooja Sharma',
        email: 'pooja.s@codelekho.com',
        phone: '+91 98480 33445',
        company: 'CODELEKHO',
        department: 'LMS Platform Tech',
        designation: 'Learning Platform & Video Tech Engineer',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2023-08-01',
        workLocation: 'Hyderabad HQ',
        reportingManager: 'Farook',
        salaryMonthly: 75000,
        avatar: 'PS',
        skills: ['Next.js', 'HLS Streaming', 'Supabase', 'WebRTC'],
      },
      {
        id: 'hremp-clk-06',
        empId: 'CLK-306',
        name: 'Shilpa Shetty',
        email: 'shilpa.s@codelekho.com',
        phone: '+91 98480 33446',
        company: 'CODELEKHO',
        department: 'Career Services',
        designation: 'Placement & Industry Internship Lead',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        joinDate: '2024-02-15',
        workLocation: 'Hyderabad HQ',
        reportingManager: 'Amit Bansal',
        salaryMonthly: 62000,
        avatar: 'SS',
        skills: ['Campus Drives', 'Hiring Partner Relations', 'Resume Reviews'],
      },
    ];

    seedEmployees.forEach((emp) => store.addItem('hr_employees', emp));
  }

  // Attendance Records
  let attendance = store.getCollection('hr_attendance');
  if (attendance.length === 0) {
    const today = new Date().toISOString().split('T')[0];
    const seedAttendance = [
      { id: 'att-101', employeeId: 'AIT-101', name: 'Farook', company: 'ARSHITH_INFOTECH', date: today, checkIn: '08:52 AM', checkOut: '06:30 PM', hoursWorked: 9.6, status: 'PRESENT', workMode: 'Office', selfieVerified: true },
      { id: 'att-102', employeeId: 'AIT-102', name: 'Priya Sundaram', company: 'ARSHITH_INFOTECH', date: today, checkIn: '09:05 AM', checkOut: '06:15 PM', hoursWorked: 9.1, status: 'PRESENT', workMode: 'Office', selfieVerified: true },
      { id: 'att-103', employeeId: 'AIT-103', name: 'Vikramaditya Rao', company: 'ARSHITH_INFOTECH', date: today, checkIn: '09:35 AM', checkOut: '06:45 PM', hoursWorked: 9.2, status: 'LATE', workMode: 'Office', selfieVerified: true },
      { id: 'att-104', employeeId: 'AIT-104', name: 'Ananya Deshmukh', company: 'ARSHITH_INFOTECH', date: today, checkIn: '09:00 AM', checkOut: '06:00 PM', hoursWorked: 9.0, status: 'PRESENT', workMode: 'WFH', selfieVerified: true },
      { id: 'att-105', employeeId: 'AIT-105', name: 'Meena Ramesh', company: 'ARSHITH_INFOTECH', date: today, checkIn: '09:12 AM', checkOut: '06:20 PM', hoursWorked: 9.1, status: 'PRESENT', workMode: 'WFH', selfieVerified: true },
      { id: 'att-106', employeeId: 'AIT-106', name: 'Pranav Dave', company: 'ARSHITH_INFOTECH', date: today, checkIn: '--', checkOut: '--', hoursWorked: 0, status: 'ON_LEAVE', workMode: 'N/A', selfieVerified: false },
      { id: 'att-107', employeeId: 'AIT-107', name: 'Divya Teja', company: 'ARSHITH_INFOTECH', date: today, checkIn: '09:10 AM', checkOut: '06:05 PM', hoursWorked: 8.9, status: 'PRESENT', workMode: 'Office', selfieVerified: true },
      { id: 'att-108', employeeId: 'AIT-108', name: 'Neha Kulkarni', company: 'ARSHITH_INFOTECH', date: today, checkIn: '08:58 AM', checkOut: '06:10 PM', hoursWorked: 9.2, status: 'PRESENT', workMode: 'Office', selfieVerified: true },

      { id: 'att-201', employeeId: 'AFR-201', name: 'Ravi Kumar', company: 'ARSHITHFRESH', date: today, checkIn: '07:45 AM', checkOut: '05:30 PM', hoursWorked: 9.7, status: 'PRESENT', workMode: 'Office', selfieVerified: true },
      { id: 'att-202', employeeId: 'AFR-202', name: 'Sita Devi', company: 'ARSHITHFRESH', date: today, checkIn: '09:00 AM', checkOut: '06:00 PM', hoursWorked: 9.0, status: 'PRESENT', workMode: 'Office', selfieVerified: true },
      { id: 'att-203', employeeId: 'AFR-203', name: 'Anil Reddy', company: 'ARSHITHFRESH', date: today, checkIn: '07:30 AM', checkOut: '05:00 PM', hoursWorked: 9.5, status: 'PRESENT', workMode: 'Office', selfieVerified: true },
      { id: 'att-204', employeeId: 'AFR-204', name: 'Rajesh Patel', company: 'ARSHITHFRESH', date: today, checkIn: '08:15 AM', checkOut: '05:45 PM', hoursWorked: 9.5, status: 'PRESENT', workMode: 'Office', selfieVerified: true },
      { id: 'att-205', employeeId: 'AFR-205', name: 'Kavitha Swaminathan', company: 'ARSHITHFRESH', date: today, checkIn: '08:50 AM', checkOut: '05:55 PM', hoursWorked: 9.1, status: 'PRESENT', workMode: 'Office', selfieVerified: true },
      { id: 'att-206', employeeId: 'AFR-206', name: 'Suresh Goud', company: 'ARSHITHFRESH', date: today, checkIn: '09:40 AM', checkOut: '06:30 PM', hoursWorked: 8.8, status: 'LATE', workMode: 'Office', selfieVerified: true },
      { id: 'att-207', employeeId: 'AFR-207', name: 'Manoj Verma', company: 'ARSHITHFRESH', date: today, checkIn: '08:00 AM', checkOut: '05:00 PM', hoursWorked: 9.0, status: 'PRESENT', workMode: 'Office', selfieVerified: true },

      { id: 'att-301', employeeId: 'CLK-301', name: 'Lakshmi Narayana', company: 'CODELEKHO', date: today, checkIn: '09:00 AM', checkOut: '06:15 PM', hoursWorked: 9.2, status: 'PRESENT', workMode: 'Office', selfieVerified: true },
      { id: 'att-302', employeeId: 'CLK-302', name: 'Harsha Vardhan', company: 'CODELEKHO', date: today, checkIn: '09:05 AM', checkOut: '06:05 PM', hoursWorked: 9.0, status: 'PRESENT', workMode: 'Office', selfieVerified: true },
      { id: 'att-303', employeeId: 'CLK-303', name: 'Sneha Patil', company: 'CODELEKHO', date: today, checkIn: '09:00 AM', checkOut: '06:00 PM', hoursWorked: 9.0, status: 'PRESENT', workMode: 'WFH', selfieVerified: true },
      { id: 'att-304', employeeId: 'CLK-304', name: 'Amit Bansal', company: 'CODELEKHO', date: today, checkIn: '09:20 AM', checkOut: '06:20 PM', hoursWorked: 9.0, status: 'PRESENT', workMode: 'Office', selfieVerified: true },
      { id: 'att-305', employeeId: 'CLK-305', name: 'Pooja Sharma', company: 'CODELEKHO', date: today, checkIn: '09:02 AM', checkOut: '06:10 PM', hoursWorked: 9.1, status: 'PRESENT', workMode: 'Office', selfieVerified: true },
      { id: 'att-306', employeeId: 'CLK-306', name: 'Shilpa Shetty', company: 'CODELEKHO', date: today, checkIn: '08:55 AM', checkOut: '06:00 PM', hoursWorked: 9.1, status: 'PRESENT', workMode: 'Office', selfieVerified: true },
    ];
    seedAttendance.forEach((att) => store.addItem('hr_attendance', att));
  }

  // Leaves Records
  let leaves = store.getCollection('hr_leaves');
  if (leaves.length === 0) {
    const seedLeaves = [
      {
        id: 'lv-01',
        employeeId: 'AIT-106',
        name: 'Pranav Dave',
        company: 'ARSHITH_INFOTECH',
        department: 'Quality Assurance',
        leaveType: 'Casual Leave',
        startDate: '2026-11-20',
        endDate: '2026-11-21',
        totalDays: 2,
        reason: 'Family wedding ceremony in hometown',
        status: 'APPROVED',
        appliedOn: '2026-11-17',
        reviewedBy: 'Priya Sundaram',
        reviewedAt: '2026-11-18',
      },
      {
        id: 'lv-02',
        employeeId: 'AIT-104',
        name: 'Ananya Deshmukh',
        company: 'ARSHITH_INFOTECH',
        department: 'Engineering',
        leaveType: 'Sick Leave',
        startDate: '2026-11-25',
        endDate: '2026-11-25',
        totalDays: 1,
        reason: 'Routine medical appointment',
        status: 'PENDING',
        appliedOn: '2026-11-19',
        reviewedBy: null,
        reviewedAt: null,
      },
      {
        id: 'lv-03',
        employeeId: 'AFR-206',
        name: 'Suresh Goud',
        company: 'ARSHITHFRESH',
        department: 'Retail Fulfillment',
        leaveType: 'Earned Leave',
        startDate: '2026-12-01',
        endDate: '2026-12-04',
        totalDays: 4,
        reason: 'Annual family festival pilgrimage',
        status: 'PENDING',
        appliedOn: '2026-11-19',
        reviewedBy: null,
        reviewedAt: null,
      },
      {
        id: 'lv-04',
        employeeId: 'CLK-303',
        name: 'Sneha Patil',
        company: 'CODELEKHO',
        department: 'Student Success',
        leaveType: 'Casual Leave',
        startDate: '2026-11-24',
        endDate: '2026-11-24',
        totalDays: 1,
        reason: 'Personal family engagement',
        status: 'APPROVED',
        appliedOn: '2026-11-16',
        reviewedBy: 'Lakshmi Narayana',
        reviewedAt: '2026-11-17',
      },
    ];
    seedLeaves.forEach((lv) => store.addItem('hr_leaves', lv));
  }

  // Payroll Records
  let payroll = store.getCollection('hr_payroll');
  if (payroll.length === 0) {
    const seedPayroll = [
      { id: 'pr-101', employeeId: 'AIT-101', name: 'Farook', company: 'ARSHITH_INFOTECH', month: 'November 2026', basicSalary: 150000, hra: 60000, allowances: 40000, gross: 250000, pf: 1800, taxDeduction: 32000, netSalary: 216200, status: 'PROCESSED', paymentDate: '2026-11-01' },
      { id: 'pr-102', employeeId: 'AIT-102', name: 'Priya Sundaram', company: 'ARSHITH_INFOTECH', month: 'November 2026', basicSalary: 84000, hra: 33600, allowances: 22400, gross: 140000, pf: 1800, taxDeduction: 14500, netSalary: 123700, status: 'PROCESSED', paymentDate: '2026-11-01' },
      { id: 'pr-103', employeeId: 'AIT-103', name: 'Vikramaditya Rao', company: 'ARSHITH_INFOTECH', month: 'November 2026', basicSalary: 99000, hra: 39600, allowances: 26400, gross: 165000, pf: 1800, taxDeduction: 19000, netSalary: 144200, status: 'PROCESSED', paymentDate: '2026-11-01' },
      { id: 'pr-201', employeeId: 'AFR-201', name: 'Ravi Kumar', company: 'ARSHITHFRESH', month: 'November 2026', basicSalary: 45000, hra: 18000, allowances: 12000, gross: 75000, pf: 1800, taxDeduction: 3500, netSalary: 69700, status: 'PROCESSED', paymentDate: '2026-11-01' },
      { id: 'pr-202', employeeId: 'AFR-202', name: 'Sita Devi', company: 'ARSHITHFRESH', month: 'November 2026', basicSalary: 33000, hra: 13200, allowances: 8800, gross: 55000, pf: 1800, taxDeduction: 1500, netSalary: 51700, status: 'PROCESSED', paymentDate: '2026-11-01' },
      { id: 'pr-301', employeeId: 'CLK-301', name: 'Lakshmi Narayana', company: 'CODELEKHO', month: 'November 2026', basicSalary: 54000, hra: 21600, allowances: 14400, gross: 90000, pf: 1800, taxDeduction: 6200, netSalary: 82000, status: 'PROCESSED', paymentDate: '2026-11-01' },
      { id: 'pr-302', employeeId: 'CLK-302', name: 'Harsha Vardhan', company: 'CODELEKHO', month: 'November 2026', basicSalary: 51000, hra: 20400, allowances: 13600, gross: 85000, pf: 1800, taxDeduction: 5500, netSalary: 77700, status: 'PROCESSED', paymentDate: '2026-11-01' },
    ];
    seedPayroll.forEach((pr) => store.addItem('hr_payroll', pr));
  }

  // Jobs / Recruitment
  let jobs = store.getCollection('hr_jobs');
  if (jobs.length === 0) {
    const seedJobs = [
      { id: 'job-01', title: 'Senior Cloud & DevOps Engineer', company: 'ARSHITH_INFOTECH', department: 'Engineering', location: 'Hyderabad HQ', openings: 2, status: 'OPEN', applicantsCount: 14, postedDate: '2026-11-05' },
      { id: 'job-02', title: 'React Native Mobile Developer', company: 'ARSHITH_INFOTECH', department: 'Engineering', location: 'Remote / Hybrid', openings: 1, status: 'OPEN', applicantsCount: 9, postedDate: '2026-11-10' },
      { id: 'job-03', title: 'Cold-Chain Warehouse Supervisor', company: 'ARSHITHFRESH', department: 'Warehouse & Logistics', location: 'Balanagar Warehouse', openings: 2, status: 'OPEN', applicantsCount: 8, postedDate: '2026-11-08' },
      { id: 'job-04', title: 'Organic Procurement Field Associate', company: 'ARSHITHFRESH', department: 'Farm Procurement', location: 'Nizamabad', openings: 3, status: 'OPEN', applicantsCount: 12, postedDate: '2026-11-12' },
      { id: 'job-05', title: 'Python & Django Teaching Assistant', company: 'CODELEKHO', department: 'Academics & Faculty', location: 'Hyderabad Studio', openings: 2, status: 'OPEN', applicantsCount: 19, postedDate: '2026-11-02' },
      { id: 'job-06', title: 'EdTech Sales & Admissions Executive', company: 'CODELEKHO', department: 'Course Admissions', location: 'Hyderabad HQ', openings: 3, status: 'OPEN', applicantsCount: 15, postedDate: '2026-11-09' },
    ];
    seedJobs.forEach((job) => store.addItem('hr_jobs', job));
  }

  // Candidates
  let candidates = store.getCollection('hr_candidates');
  if (candidates.length === 0) {
    const seedCandidates = [
      { id: 'cand-01', name: 'Siddharth Rao', jobTitle: 'Senior Cloud & DevOps Engineer', company: 'ARSHITH_INFOTECH', stage: 'Interview', experienceYears: 7, rating: 4.8, phone: '+91 97001 55661', email: 'siddharth.rao@example.com' },
      { id: 'cand-02', name: 'Mrunal Thakur', jobTitle: 'React Native Mobile Developer', company: 'ARSHITH_INFOTECH', stage: 'Screening', experienceYears: 4, rating: 4.2, phone: '+91 97001 55662', email: 'mrunal.t@example.com' },
      { id: 'cand-03', name: 'Naveen Chari', jobTitle: 'Cold-Chain Warehouse Supervisor', company: 'ARSHITHFRESH', stage: 'Offer Extended', experienceYears: 5, rating: 4.9, phone: '+91 97001 55663', email: 'naveen.ch@example.com' },
      { id: 'cand-04', name: 'Pavan Teja', jobTitle: 'Python & Django Teaching Assistant', company: 'CODELEKHO', stage: 'Interview', experienceYears: 2, rating: 4.6, phone: '+91 97001 55664', email: 'pavan.t@example.com' },
    ];
    seedCandidates.forEach((cand) => store.addItem('hr_candidates', cand));
  }
};

// Ensure data is ready when controller loads
ensureHrDataSeeded();

// GET /api/hr/dashboard
exports.getHrDashboard = (req, res) => {
  try {
    ensureHrDataSeeded();
    const companyFilter = normalizeCompany(req.query.company);
    let employees = store.getCollection('hr_employees');
    let attendance = store.getCollection('hr_attendance');
    let leaves = store.getCollection('hr_leaves');
    let payroll = store.getCollection('hr_payroll');
    let jobs = store.getCollection('hr_jobs');

    if (companyFilter !== 'ALL') {
      employees = employees.filter((e) => e.company === companyFilter);
      attendance = attendance.filter((a) => a.company === companyFilter);
      leaves = leaves.filter((l) => l.company === companyFilter);
      payroll = payroll.filter((p) => p.company === companyFilter);
      jobs = jobs.filter((j) => j.company === companyFilter);
    }

    const totalHeadcount = employees.length;
    const activeHeadcount = employees.filter((e) => e.status === 'ACTIVE').length;
    const probationHeadcount = employees.filter((e) => e.status === 'PROBATION').length;
    const presentToday = attendance.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
    const onLeaveToday = attendance.filter((a) => a.status === 'ON_LEAVE').length;
    const pendingLeaveRequests = leaves.filter((l) => l.status === 'PENDING').length;
    const monthlyPayrollTotal = employees.reduce((sum, e) => sum + (Number(e.salaryMonthly) || 0), 0);
    const activeOpenings = jobs.reduce((sum, j) => sum + (Number(j.openings) || 0), 0);

    const attendanceRate = totalHeadcount > 0 ? Math.round((presentToday / totalHeadcount) * 100) : 100;

    // Breakdown per company
    const allEmployees = store.getCollection('hr_employees');
    const companyBreakdown = {
      ARSHITH_INFOTECH: {
        count: allEmployees.filter((e) => e.company === 'ARSHITH_INFOTECH').length,
        payroll: allEmployees.filter((e) => e.company === 'ARSHITH_INFOTECH').reduce((sum, e) => sum + (Number(e.salaryMonthly) || 0), 0),
      },
      ARSHITHFRESH: {
        count: allEmployees.filter((e) => e.company === 'ARSHITHFRESH').length,
        payroll: allEmployees.filter((e) => e.company === 'ARSHITHFRESH').reduce((sum, e) => sum + (Number(e.salaryMonthly) || 0), 0),
      },
      CODELEKHO: {
        count: allEmployees.filter((e) => e.company === 'CODELEKHO').length,
        payroll: allEmployees.filter((e) => e.company === 'CODELEKHO').reduce((sum, e) => sum + (Number(e.salaryMonthly) || 0), 0),
      },
    };

    res.json({
      success: true,
      selectedCompany: companyFilter,
      summary: {
        totalHeadcount,
        activeHeadcount,
        probationHeadcount,
        presentToday,
        onLeaveToday,
        pendingLeaveRequests,
        monthlyPayrollTotal,
        activeOpenings,
        attendanceRate,
      },
      companyBreakdown,
      recentAttendance: attendance.slice(0, 8),
      recentLeaves: leaves.slice(0, 5),
    });
  } catch (err) {
    console.error('HR Dashboard Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/hr/employees
exports.getEmployees = (req, res) => {
  try {
    ensureHrDataSeeded();
    const companyFilter = normalizeCompany(req.query.company);
    const { department, status, search } = req.query;

    let employees = store.getCollection('hr_employees');

    if (companyFilter !== 'ALL') {
      employees = employees.filter((e) => e.company === companyFilter);
    }
    if (department && department !== 'ALL') {
      employees = employees.filter((e) => e.department === department);
    }
    if (status && status !== 'ALL') {
      employees = employees.filter((e) => e.status === status);
    }
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      employees = employees.filter(
        (e) =>
          (e.name && e.name.toLowerCase().includes(q)) ||
          (e.empId && e.empId.toLowerCase().includes(q)) ||
          (e.email && e.email.toLowerCase().includes(q)) ||
          (e.designation && e.designation.toLowerCase().includes(q)) ||
          (e.department && e.department.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/hr/employees
exports.createEmployee = (req, res) => {
  try {
    const { name, email, phone, company, department, designation, salaryMonthly, workLocation, reportingManager, employmentType } = req.body;
    if (!name || !company || !department) {
      return res.status(400).json({ success: false, message: 'Name, Company, and Department are required.' });
    }

    const normCo = normalizeCompany(company);
    const prefix = normCo === 'ARSHITHFRESH' ? 'AFR' : normCo === 'CODELEKHO' ? 'CLK' : 'AIT';
    const randId = Math.floor(100 + Math.random() * 900);

    const newEmp = {
      empId: `${prefix}-${randId}`,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@arshith.com`,
      phone: phone || '+91 98480 00000',
      company: normCo,
      department,
      designation: designation || 'Staff Member',
      employmentType: employmentType || 'Full-time',
      status: 'ACTIVE',
      joinDate: new Date().toISOString().split('T')[0],
      workLocation: workLocation || 'HQ Campus',
      reportingManager: reportingManager || 'Farook',
      salaryMonthly: Number(salaryMonthly) || 50000,
      avatar: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      skills: ['Team Collaboration', 'Role Fundamentals'],
    };

    const saved = store.addItem('hr_employees', newEmp);
    res.status(201).json({ success: true, employee: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/hr/employees/:id
exports.updateEmployee = (req, res) => {
  try {
    const { id } = req.params;
    const updated = store.updateItem('hr_employees', id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, employee: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/hr/attendance
exports.getAttendance = (req, res) => {
  try {
    ensureHrDataSeeded();
    const companyFilter = normalizeCompany(req.query.company);
    let attendance = store.getCollection('hr_attendance');

    if (companyFilter !== 'ALL') {
      attendance = attendance.filter((a) => a.company === companyFilter);
    }
    res.json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/hr/attendance/check-in
exports.checkIn = (req, res) => {
  try {
    const { employeeId, name, company, workMode = 'Office' } = req.body;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = now.toISOString().split('T')[0];

    const newRecord = {
      employeeId: employeeId || 'AIT-101',
      name: name || 'Staff Member',
      company: normalizeCompany(company || 'ARSHITH_INFOTECH'),
      date: today,
      checkIn: timeStr,
      checkOut: '--',
      hoursWorked: 0,
      status: 'PRESENT',
      workMode,
      selfieVerified: true,
    };

    const saved = store.addItem('hr_attendance', newRecord);
    res.json({ success: true, record: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/hr/leaves
exports.getLeaves = (req, res) => {
  try {
    ensureHrDataSeeded();
    const companyFilter = normalizeCompany(req.query.company);
    let leaves = store.getCollection('hr_leaves');

    if (companyFilter !== 'ALL') {
      leaves = leaves.filter((l) => l.company === companyFilter);
    }
    res.json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/hr/leaves
exports.createLeave = (req, res) => {
  try {
    const { employeeId, name, company, department, leaveType, startDate, endDate, totalDays, reason } = req.body;
    const newLeave = {
      employeeId: employeeId || 'AIT-104',
      name: name || 'Employee',
      company: normalizeCompany(company || 'ARSHITH_INFOTECH'),
      department: department || 'General',
      leaveType: leaveType || 'Casual Leave',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString().split('T')[0],
      totalDays: Number(totalDays) || 1,
      reason: reason || 'Personal emergency',
      status: 'PENDING',
      appliedOn: new Date().toISOString().split('T')[0],
      reviewedBy: null,
      reviewedAt: null,
    };

    const saved = store.addItem('hr_leaves', newLeave);
    res.status(201).json({ success: true, leave: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/hr/leaves/:id/review
exports.reviewLeave = (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewerName = 'HR Administrator' } = req.body;
    const updated = store.updateItem('hr_leaves', id, {
      status: status || 'APPROVED',
      reviewedBy: reviewerName,
      reviewedAt: new Date().toISOString().split('T')[0],
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Leave record not found' });
    }
    res.json({ success: true, leave: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/hr/payroll
exports.getPayroll = (req, res) => {
  try {
    ensureHrDataSeeded();
    const companyFilter = normalizeCompany(req.query.company);
    let payroll = store.getCollection('hr_payroll');

    if (companyFilter !== 'ALL') {
      payroll = payroll.filter((p) => p.company === companyFilter);
    }
    res.json({ success: true, payroll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/hr/recruitment
exports.getRecruitment = (req, res) => {
  try {
    ensureHrDataSeeded();
    const companyFilter = normalizeCompany(req.query.company);
    let jobs = store.getCollection('hr_jobs');
    let candidates = store.getCollection('hr_candidates');

    if (companyFilter !== 'ALL') {
      jobs = jobs.filter((j) => j.company === companyFilter);
      candidates = candidates.filter((c) => c.company === companyFilter);
    }
    res.json({ success: true, jobs, candidates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

