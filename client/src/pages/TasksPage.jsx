import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  Clock,
  Trash2,
  Edit2,
  Calendar,
  AlertTriangle,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';

export const TasksPage = ({ onSelectProject }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    projectId: '',
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TO_DO',
    dueDate: '',
    estimatedHours: 8,
  });
  const [saving, setSaving] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);

      const [taskRes, projRes] = await Promise.all([
        api.getTasks(params.toString()),
        api.getProjects('limit=100'),
      ]);

      if (taskRes.success) setTasks(taskRes.tasks || []);
      if (projRes.success) setProjects(projRes.projects || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.projectId || !newTask.title.trim()) {
      alert('Please select a project and enter a task title');
      return;
    }

    try {
      setSaving(true);
      const res = await api.createTask({
        ...newTask,
        estimatedHours: Number(newTask.estimatedHours) || 0,
      });

      if (res.success) {
        setIsModalOpen(false);
        setNewTask({
          projectId: '',
          title: '',
          description: '',
          priority: 'MEDIUM',
          status: 'TO_DO',
          dueDate: '',
          estimatedHours: 8,
        });
        fetchTasks();
      } else {
        alert(res.message || 'Failed to create task');
      }
    } catch (err) {
      alert('Error creating task: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Are you sure you want to delete task ${task.taskId} (${task.title})?`)) {
      return;
    }

    try {
      const res = await api.deleteTask(task.id);
      if (res.success) {
        fetchTasks();
      } else {
        alert(res.message || 'Failed to delete task');
      }
    } catch (err) {
      alert('Error deleting task: ' + err.message);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (t.taskId && t.taskId.toLowerCase().includes(q)) ||
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.project?.projectId && t.project.projectId.toLowerCase().includes(q)) ||
      (t.project?.title && t.project.title.toLowerCase().includes(q)) ||
      (t.assignedEmployee?.name && t.assignedEmployee.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium"><span>Atmosphere</span><span>&rsaquo;</span><span>Delivery</span><span>&rsaquo;</span><span className="text-[#253142] font-semibold">Tasks</span></div>
          <h1 className="text-2xl font-extrabold text-[#253142] tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-[#2563EB]" /> Universal Project Task Management
          </h1>
          <p className="text-xs text-[#7C8998] mt-0.5">
            Cross-project engineering sprint tasks, developer assignments, and completion hours tracking.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl text-xs font-semibold shadow-md shadow-blue-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-[#F4F7FA] p-4 rounded-3xl border border-[#DDE4EC] shadow-atmo-card">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Task ID (TSK-001), Title, Project (AIP-2026)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-[#E8EDF3]/70 border border-[#DDE4EC] rounded-xl text-[#253142] shadow-atmo-well focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs"
        >
          <option value="ALL">All Task Statuses</option>
          <option value="TO_DO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs"
        >
          <option value="ALL">All Priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <button
          onClick={fetchTasks}
          className="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
          title="Refresh tasks"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase select-none">
            <tr>
              <th className="py-2.5 px-4">Task ID</th>
              <th className="py-2.5 px-4">Task Title</th>
              <th className="py-2.5 px-4">Project</th>
              <th className="py-2.5 px-4">Assignee</th>
              <th className="py-2.5 px-4">Priority</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Due Date</th>
              <th className="py-2.5 px-4">Hours</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                  Loading task backlog records...
                </td>
              </tr>
            ) : filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center bg-white">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-800 mb-2">
                    <CheckSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">No Tasks in System (0 Records)</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-3">
                    The task backlog is currently clean with 0 records. Click below to create your first engineering task.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Task</span>
                  </button>
                </td>
              </tr>
            ) : (
              filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{t.taskId}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 max-w-xs truncate">{t.title}</td>
                  <td className="py-2.5 px-4">
                    <button
                      onClick={() => t.project && onSelectProject(t.project.id)}
                      className="font-mono text-blue-800 hover:underline font-bold"
                      title="Open Project Workspace"
                    >
                      {t.project ? t.project.projectId : 'N/A'}
                    </button>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">{t.assignedEmployee?.name || 'Unassigned'}</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : t.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-500">{t.dueDate || '—'}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-800 font-bold">{t.actualHoursSpent || 0}h</td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteTask(t)}
                      className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Total Tasks: {filteredTasks.length}</span>
          <span className="font-mono text-[11px]">Sprint Task Repository</span>
        </div>
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Create Sprint Task</h3>
                  <p className="text-[11px] text-slate-500">Log a new task for any active project</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Select Project <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.projectId} — {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Payment Gateway Webhook Handler"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="TO_DO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description / Acceptance Criteria</label>
                <textarea
                  rows={2}
                  placeholder="Task details and scope of work..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1 px-4 py-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-semibold shadow-xs transition-colors disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Creating...' : 'Create Task'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
