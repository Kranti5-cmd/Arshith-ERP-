import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  ShoppingCart,
  FileText,
  PackageCheck,
  Boxes,
  CalendarClock,
  Warehouse,
  Globe,
  Receipt,
  Undo2,
  Trash2,
  IndianRupee,
  BarChart3,
  Bell,
  Users,
  Settings,
  History,
  Search,
  LogOut,
  Menu,
  X,
  Leaf,
  Shield,
  CheckCircle2,
  Plus,
  ChevronDown,
  Building2,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { useAuth } from '../lib/auth.jsx';
import { api } from '../lib/api.js';
import { fdatetime } from '../lib/format.js';
import { CompanySwitcherDropdown } from '../../components/layout/CompanySwitcherDropdown';

const NAV = [
  ['Core Inventory', [
    ['/', 'Executive Dashboard', LayoutDashboard],
    ['/finance-erp', 'Finance & Accounts (₹)', IndianRupee],
    ['/products', 'Products Inventory', Package, ['product.view']],
    ['/categories', 'Product Categories', Tags, ['product.view']],
    ['/suppliers', 'Suppliers Directory', Truck, ['supplier.view', 'purchase.view']],
  ]],
  ['Purchasing & Inbound', [
    ['/purchases', 'Purchase Requests', ShoppingCart, ['purchase.view']],
    ['/purchase-orders', 'Purchase Orders', FileText, ['purchase.view']],
    ['/goods-received', 'Goods Received (GRN)', PackageCheck, ['purchase.view', 'grn.manage']],
  ]],
  ['Warehouses & Stock', [
    ['/inventory', 'Stock Overview', Boxes, ['inventory.view']],
    ['/batches', 'Batches & Expiry', CalendarClock, ['inventory.view']],
    ['/warehouses', 'Warehouse Facilities', Warehouse, ['inventory.view']],
  ]],
  ['Sales & Outbound', [
    ['/website-orders', 'Website Orders Sync', Globe, ['order.view']],
    ['/sales', 'Sales Orders', Receipt, ['order.view']],
    ['/returns', 'Returns & Exchanges', Undo2, ['return.manage', 'order.view', 'purchase.view']],
    ['/wastage', 'Wastage & Damages', Trash2, ['wastage.manage', 'wastage.approve', 'finance.view']],
  ]],
  ['Finance & Analytics', [
    ['/finance', 'Budget & Spend (₹)', IndianRupee, ['finance.view']],
    ['/reports', 'Reports & Analytics', BarChart3, ['report.view', 'report.finance']],
    ['/notifications', 'Alerts & Notifications', Bell],
  ]],
  ['Administration', [
    ['/users', 'Access Control', Users, ['user.manage']],
    ['/settings', 'Platform Settings', Settings],
    ['/audit', 'Audit Trail', History, ['audit.view']],
  ]],
];

const FRESH_FINANCE_PROJECTS = [
  { coId: '1', label: 'ArshithFresh Finance', icon: Leaf, color: 'text-green-400', badge: 'AFR' },
  { coId: '2', label: 'Infotech Finance', icon: Building2, color: 'text-blue-400', badge: 'AIT' },
  { coId: '3', label: 'CodeLekho Finance', icon: GraduationCap, color: 'text-purple-400', badge: 'CLK' },
  { coId: 'all', label: 'All Companies (Consolidated)', icon: Layers, color: 'text-emerald-400', badge: 'ALL' },
];

function Sidebar({ onNavigate, unread }) {
  const { can } = useAuth();
  const navigate = useNavigate();
  const [financeMenuOpen, setFinanceMenuOpen] = useState(true);

  const handleSelectFinance = (coId) => {
    try {
      localStorage.setItem('erp.company', coId);
      window.dispatchEvent(new CustomEvent('finance-company-change', { detail: coId }));
    } catch {}
    navigate('/finance-erp');
    if (onNavigate) onNavigate();
  };
  return (
    <aside className="w-64 bg-[#101827] text-slate-300 flex flex-col flex-shrink-0 border-r border-[#1E293B] select-none shadow-2xl z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-[#1E293B] bg-[#0B0F19]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-9 rounded-xl bg-white flex items-center justify-center shadow-md p-0.5 border border-slate-700/60 overflow-hidden flex-shrink-0">
            <img src="/logos/arshith-fresh-logo.jpg" alt="Arshith Fresh" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-extrabold text-[13px] tracking-wider text-white uppercase font-sans flex items-center gap-1.5">
              <span>Arshith</span>
              <span className="text-emerald-400 font-semibold">Fresh</span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
              Inventory & Supply Chain OS
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {NAV.map(([group, all]) => {
          const items = all.filter(([, , , perms]) => !perms || perms.some(can));
          return items.length > 0 && (
            <div key={group} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                {group}
              </div>
              {items.map(([to, label, Icon]) => {
                if (to === '/finance-erp') {
                  return (
                    <div key={to} className="space-y-1">
                      <button
                        onClick={() => {
                          setFinanceMenuOpen(!financeMenuOpen);
                          handleSelectFinance('1');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group relative cursor-pointer bg-emerald-600/20 text-white font-semibold border-l-4 border-emerald-500 shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className="w-4 h-4 shrink-0 text-emerald-400" />
                          <span className="truncate">{label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Dropdown
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${financeMenuOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {financeMenuOpen && (
                        <div className="pl-6 pr-1 py-1 space-y-1 bg-slate-900/60 rounded-xl border border-slate-800">
                          {FRESH_FINANCE_PROJECTS.map((fOpt) => {
                            const FIcon = fOpt.icon;
                            const isCurrentCo = localStorage.getItem('erp.company') === fOpt.coId;
                            return (
                              <button
                                key={fOpt.coId}
                                onClick={() => handleSelectFinance(fOpt.coId)}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-all cursor-pointer ${
                                  isCurrentCo
                                    ? 'bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <FIcon className={`w-3.5 h-3.5 ${fOpt.color}`} />
                                  <span className="truncate">{fOpt.label}</span>
                                </div>
                                <span className="text-[9px] font-mono font-bold text-slate-500">
                                  {fOpt.badge}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group relative cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/20 text-white font-semibold border-l-4 border-blue-500 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span className="truncate">{label}</span>
                      </div>
                      {to === '/notifications' && unread > 0 && (
                        <span className="rounded-full bg-blue-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                          {unread}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
            </div>
          );
        })}
      </nav>

      {/* Footer System Status matching Arshith Infotech */}
      <div className="p-3 border-t border-[#1E293B] bg-[#0B0F19]/60">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Cloud Sync Active</span>
          </div>
          <span className="text-slate-500">v2.4.0</span>
        </div>
        <div className="text-[9px] text-slate-500 font-mono mt-1">
          External Enterprise Mode • 2026
        </div>
      </div>
    </aside>
  );
}

function BellDropdown({ data, reload }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const sev = { CRITICAL: 'bg-rose-500', WARNING: 'bg-amber-500', SUCCESS: 'bg-emerald-500', INFO: 'bg-sky-500' };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); reload(); }}
        className="relative p-2 text-[#64748B] hover:text-[#111827] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        title="System Notifications"
      >
        <Bell className="w-4 h-4" />
        {data.unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-96 overflow-hidden bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-2.5 bg-[#F5F7FA]">
            <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">Notifications</span>
            <button
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => api('/notifications/read-all', { method: 'POST' }).then(reload)}
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-[#F1F5F9]">
            {data.items.length === 0 && (
              <div className="px-4 py-8 text-center text-xs text-[#64748B]">No notifications</div>
            )}
            {data.items.slice(0, 12).map((n) => (
              <Link
                key={n.id}
                to={n.link || '/notifications'}
                onClick={() => {
                  setOpen(false);
                  api(`/notifications/${n.id}/read`, { method: 'POST' }).then(reload);
                }}
                className={`flex gap-3 px-4 py-2.5 hover:bg-slate-50 transition ${
                  n.isRead ? '' : 'bg-blue-50/40'
                }`}
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${sev[n.severity] || 'bg-blue-500'}`} />
                <div>
                  <div className="text-xs font-semibold text-[#111827]">{n.title}</div>
                  <div className="text-[11px] text-[#64748B]">{n.message}</div>
                  <div className="mt-0.5 text-[10px] text-slate-400">{fdatetime(n.createdAt)}</div>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="block py-2 text-center text-xs font-semibold text-blue-600 hover:bg-slate-50 border-t border-[#E2E8F0]"
          >
            View all alerts
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [mobile, setMobile] = useState(false);
  const [notes, setNotes] = useState({ items: [], unread: 0 });

  const loadNotes = () => api('/notifications').then(setNotes).catch(() => {});
  useEffect(() => {
    loadNotes();
    const t = setInterval(loadNotes, 60000);
    return () => clearInterval(t);
  }, []);

  const ini = user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'FK';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F7FA] font-sans">
      {/* Unified 16-item Left Sidebar */}
      <div className="hidden lg:block">
        <Sidebar unread={notes.unread} />
      </div>

      {mobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <Sidebar unread={notes.unread} onNavigate={() => setMobile(false)} />
          <button className="flex-1 bg-black/60 backdrop-blur-xs" onClick={() => setMobile(false)}>
            <X className="ml-3 mt-3 h-6 w-6 text-white" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header matching Arshith Infotech exact layout */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          {/* Mobile hamburger */}
          <button className="p-2 -ml-2 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-slate-100 lg:hidden mr-2 cursor-pointer" onClick={() => setMobile(true)}>
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Bar */}
          <div className="flex items-center gap-4 flex-1 min-w-[150px] max-w-xs md:max-w-sm lg:max-w-md">
            <form
              className="relative w-full group"
              onSubmit={(e) => {
                e.preventDefault();
                nav(`/products?q=${encodeURIComponent(q)}`);
              }}
            >
              <Search className="w-4 h-4 text-[#64748B] group-focus-within:text-[#2563EB] absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-8 pr-16 py-2 text-xs bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] focus:bg-white transition-all text-[#111827] placeholder-[#64748B]"
              />
              <kbd className="hidden lg:inline-flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[#64748B] bg-white border border-[#E2E8F0] rounded shadow-2xs pointer-events-none select-none">
                Ctrl K
              </kbd>
            </form>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Telemetry pill: Live Warehouse Stock */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-emerald-50/80 border border-emerald-200/80 rounded-full text-[11px] font-semibold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Live Stock • Main Warehouse</span>
            </div>

            {/* Quick Action Button: New Product */}
            <Link
              to="/products"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Product</span>
            </Link>

            {/* UNIFIED COMPANY SELECTION DROPDOWN (NOT SIDE BY SIDE) */}
            <CompanySwitcherDropdown />

            {/* Admin Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F7FA] border border-[#E2E8F0] text-[#111827] rounded-lg text-xs font-semibold tracking-wide">
              <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="font-mono text-[11px]">ADMINISTRATOR</span>
            </div>

            {/* Notifications */}
            <BellDropdown data={notes} reload={loadNotes} />

            {/* User Info & Avatar */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] text-white font-bold text-xs flex items-center justify-center border border-blue-400/30 shadow-2xs">
                {ini}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-[#111827] leading-tight">{user?.name || 'Farook'}</div>
                <div className="text-[10px] text-[#64748B] font-medium">{user?.designation || 'Managing Director & Supply Chain Admin'}</div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-1 ml-1 px-2.5 py-1.5 text-[#64748B] hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors border border-[#E2E8F0] cursor-pointer"
                title="Log out of Admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet with Arshith Infotech Page Background */}
        <main className="flex-1 overflow-y-auto px-6 py-6 bg-[#F5F7FA]">
          <Outlet context={{ reloadNotes: loadNotes }} />
        </main>
      </div>
    </div>
  );
}
