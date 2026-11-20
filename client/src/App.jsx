import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { PipelinePage } from './pages/PipelinePage';
import { TeamsPage } from './pages/TeamsPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { TasksPage } from './pages/TasksPage';
import { MilestonesPage } from './pages/MilestonesPage';
import { FinancesPage } from './pages/FinancesPage';
import { FinanceWorkspace } from './components/finance/FinanceWorkspace';
import { HrWorkspace } from './components/hr/HrWorkspace';
import { OnHoldPage } from './pages/OnHoldPage';
import { CalendarPage } from './pages/CalendarPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { LoginPage } from './pages/LoginPage';
import { CentralDashboardPage } from './pages/CentralDashboardPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { CodeLekhoCrmWorkspace } from './components/codelekho/CodeLekhoCrmWorkspace';
import { CodeLekhoApp } from './codelekho/App';
import { ArshithFreshApp } from './arshithfresh/App';

// Modals
import { ProjectFormModal } from './components/projects/ProjectFormModal';
import { StatusChangeModal } from './components/projects/StatusChangeModal';
import { ProjectHoldModal } from './components/projects/ProjectHoldModal';
import { ProjectResumeModal } from './components/projects/ProjectResumeModal';
import { ProjectCompleteModal } from './components/projects/ProjectCompleteModal';
import { ProjectDeliverModal } from './components/projects/ProjectDeliverModal';

import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-16 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <span className="text-xl font-bold">!</span>
          </div>
          <h2 className="text-base font-bold text-[#111827]">Something went wrong loading this view</h2>
          <p className="text-xs text-[#64748B]">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold"
          >
            Reload Module
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function AppContent() {
  const { isAuthenticated, company, switchCompany } = useAuth();
  const [activeTab, setActiveTab] = useState('central-dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectStatusFilter, setProjectStatusFilter] = useState('ALL');
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Modals state
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [statusModalProject, setStatusModalProject] = useState(null);
  const [holdModalProject, setHoldModalProject] = useState(null);
  const [resumeModalProject, setResumeModalProject] = useState(null);
  const [completeModalProject, setCompleteModalProject] = useState(null);
  const [deliverModalProject, setDeliverModalProject] = useState(null);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.getNotifications();
      if (res.success) setUnreadNotificationsCount(res.unreadCount || 0);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
    const handleNav = (e) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener('navigate-tab', handleNav);
    return () => window.removeEventListener('navigate-tab', handleNav);
  }, [isAuthenticated]);

  // If not authenticated as Admin, show Admin Login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // If logged in under CodeLekho company - Launch Complete CodeLekho CRM
  if (company === 'codelekho') {
    return (
      <ErrorBoundary>
        <CodeLekhoCrmWorkspace
          onReturnToErm={() => {
            if (switchCompany) switchCompany('arshith');
            setActiveTab('central-dashboard');
          }}
        />
      </ErrorBoundary>
    );
  }

  // If logged in under Arshith Fresh company
  if (company === 'arshithfresh') {
    return (
      <ErrorBoundary>
        <ArshithFreshApp />
      </ErrorBoundary>
    );
  }

  // If logged in under Finance ERP
  if (company === 'finance') {
    return (
      <ErrorBoundary>
        <FinanceWorkspace
          onReturnToErm={() => {
            if (switchCompany) switchCompany('arshith');
            setActiveTab('central-dashboard');
          }}
        />
      </ErrorBoundary>
    );
  }

  // If logged in under HRMS
  if (company === 'hr') {
    return (
      <ErrorBoundary>
        <HrWorkspace
          onReturnToErm={() => {
            if (switchCompany) switchCompany('arshith');
            setActiveTab('central-dashboard');
          }}
        />
      </ErrorBoundary>
    );
  }

  // When clicking a dashboard KPI card
  const handleNavigateToProjectsWithFilter = (status) => {
    setProjectStatusFilter(status);
    setActiveTab('projects');
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveTab('project-details');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#E8EDF3] font-sans">
      {/* 16-item Sidebar */}
      <Sidebar activeTab={activeTab === 'project-details' ? 'projects' : activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header with Admin Badge & Logout */}
        <Header
          setActiveTab={setActiveTab}
          onOpenNewProjectModal={() => {
            setEditingProject(null);
            setIsNewProjectModalOpen(true);
          }}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        {/* Dynamic Page Router with Error Boundary */}
        <main className="flex-1 overflow-y-auto">
          <ErrorBoundary>
            {activeTab === 'central-dashboard' && (
              <CentralDashboardPage
                onNavigateToIntegrations={() => setActiveTab('integrations')}
                onNavigateToFinance={() => setActiveTab('finances')}
                onNavigateToHr={() => setActiveTab('hr-workforce')}
              />
            )}

            {activeTab === 'integrations' && <IntegrationsPage />}
            {activeTab === 'codelekho-crm' && (
              <CodeLekhoCrmWorkspace onReturnToErm={() => setActiveTab('central-dashboard')} />
            )}

            {activeTab === 'dashboard' && (
              <DashboardPage
                onNavigateToProjectsWithFilter={handleNavigateToProjectsWithFilter}
                onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsPage
                initialStatusFilter={projectStatusFilter}
                onSelectProject={handleSelectProject}
                onOpenNewProjectModal={() => {
                  setEditingProject(null);
                  setIsNewProjectModalOpen(true);
                }}
                onOpenEditModal={(proj) => {
                  setEditingProject(proj);
                  setIsNewProjectModalOpen(true);
                }}
                onOpenStatusModal={(proj) => setStatusModalProject(proj)}
                onOpenHoldModal={(proj) => setHoldModalProject(proj)}
              />
            )}

            {activeTab === 'project-details' && selectedProjectId && (
              <ProjectDetailsPage
                projectId={selectedProjectId}
                onBack={() => setActiveTab('projects')}
                onOpenEditModal={(proj) => {
                  setEditingProject(proj);
                  setIsNewProjectModalOpen(true);
                }}
                onOpenStatusModal={(proj) => setStatusModalProject(proj)}
                onOpenHoldModal={(proj) => setHoldModalProject(proj)}
                onOpenResumeModal={(proj) => setResumeModalProject(proj)}
                onOpenCompleteModal={(proj) => setCompleteModalProject(proj)}
                onOpenDeliverModal={(proj) => setDeliverModalProject(proj)}
              />
            )}

            {activeTab === 'pipeline' && <PipelinePage onSelectProject={handleSelectProject} />}
            {activeTab === 'teams' && <TeamsPage onSelectProject={handleSelectProject} />}
            {activeTab === 'employees' && <EmployeesPage onSelectProject={handleSelectProject} />}
            {activeTab === 'tasks' && <TasksPage onSelectProject={handleSelectProject} />}
            {activeTab === 'milestones' && <MilestonesPage onSelectProject={handleSelectProject} />}
            {activeTab === 'finances' && (
              <FinanceWorkspace onReturnToErm={() => setActiveTab('central-dashboard')} />
            )}
            {(activeTab === 'hr-workforce' || activeTab === 'hr') && (
              <HrWorkspace onReturnToErm={() => setActiveTab('central-dashboard')} />
            )}
            {activeTab === 'on-hold' && (
              <OnHoldPage
                onSelectProject={handleSelectProject}
                onOpenResumeModal={(proj) => setResumeModalProject(proj)}
                onOpenHoldModal={(proj) => setHoldModalProject(proj)}
              />
            )}
            {activeTab === 'calendar' && <CalendarPage onSelectProject={handleSelectProject} />}
            {activeTab === 'documents' && <DocumentsPage onSelectProject={handleSelectProject} />}
            {activeTab === 'reports' && <ReportsPage />}
            {activeTab === 'notifications' && <NotificationsPage onSelectProject={handleSelectProject} />}
            {activeTab === 'users' && <UsersPage />}
            {activeTab === 'settings' && <SettingsPage />}
            {activeTab === 'audit-logs' && <AuditLogsPage />}
          </ErrorBoundary>
        </main>
      </div>

      {/* Global Modals */}
      <ProjectFormModal
        isOpen={isNewProjectModalOpen}
        onClose={() => {
          setIsNewProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSuccess={() => {
          fetchUnreadCount();
        }}
        editProject={editingProject}
      />

      <StatusChangeModal
        isOpen={Boolean(statusModalProject)}
        onClose={() => setStatusModalProject(null)}
        onSuccess={() => {
          fetchUnreadCount();
        }}
        project={statusModalProject}
      />

      <ProjectHoldModal
        isOpen={Boolean(holdModalProject)}
        onClose={() => setHoldModalProject(null)}
        onSuccess={() => {
          fetchUnreadCount();
        }}
        project={holdModalProject}
      />

      <ProjectResumeModal
        isOpen={Boolean(resumeModalProject)}
        onClose={() => setResumeModalProject(null)}
        onSuccess={() => {
          fetchUnreadCount();
        }}
        project={resumeModalProject}
      />

      <ProjectCompleteModal
        isOpen={Boolean(completeModalProject)}
        onClose={() => setCompleteModalProject(null)}
        onSuccess={() => {
          fetchUnreadCount();
        }}
        project={completeModalProject}
      />

      <ProjectDeliverModal
        isOpen={Boolean(deliverModalProject)}
        onClose={() => setDeliverModalProject(null)}
        onSuccess={() => {
          fetchUnreadCount();
        }}
        project={deliverModalProject}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
