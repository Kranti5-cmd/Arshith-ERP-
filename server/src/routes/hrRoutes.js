const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hrController');

// Dashboard summary
router.get('/dashboard', hrController.getHrDashboard);

// Employees CRUD
router.get('/employees', hrController.getEmployees);
router.post('/employees', hrController.createEmployee);
router.put('/employees/:id', hrController.updateEmployee);

// Attendance
router.get('/attendance', hrController.getAttendance);
router.post('/attendance/check-in', hrController.checkIn);

// Leaves
router.get('/leaves', hrController.getLeaves);
router.post('/leaves', hrController.createLeave);
router.patch('/leaves/:id/review', hrController.reviewLeave);

// Payroll
router.get('/payroll', hrController.getPayroll);

// Recruitment
router.get('/recruitment', hrController.getRecruitment);

module.exports = router;

