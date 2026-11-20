import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Tags,
  Truck,
  Boxes,
  IndianRupee,
  PackageCheck,
  TrendingDown,
  PackageX,
  CalendarClock,
  CalendarX,
  FileClock,
  ShoppingCart,
  Receipt,
  Trash2,
  RefreshCw,
  ClipboardCheck,
  ArrowRight,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  XCircle,
  Trophy,
  Sparkles,
  Layers,
  FileSearch,
  UserCheck,
  PlayCircle,
  FlaskConical,
  CreditCard,
  PauseCircle,
  AlertTriangle,
  Ban,
  UserX,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { useApi } from '../lib/useApi.js';
import { qs } from '../lib/api.js';
import { inr, qty, fdate, fdatetime } from '../lib/format.js';
import { useAuth } from '../lib/auth.jsx';
import { Spinner, ErrorBox, Kpi } from '../components/ui.jsx';

const C1 = '#2563EB', C2 = '#101827', C3 = '#0284C7';
const axis = { fontSize: 11, fill: '#64748B' };

const CustomTooltip = ({ active, payload, label, money }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#101827] text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md">
        {label && <div className="font-bold text-slate-200 mb-1.5 pb-1 border-b border-slate-700">{label}</div>}
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
              <span>{entry.name}:</span>
            </div>
            <span className="font-mono font-bold text-sky-400">
              {money ? inr(entry.value) : qty(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [f, setF] = useState({ warehouseId: '', categoryId: '', from: '', to: '' });
  const { data, error, loading, reload } = useApi(`/dashboard${qs(f)}`);
  const { data: whs } = useApi('/warehouses');
  const { data: cats } = useApi('/categories');

  if (error) return <ErrorBox error={error} />;
  const k = data?.kpis || {};
  const money = data?.charts?.financeVisible;

  // 9 Primary Supply Chain Pipeline Stages
  const supplyChainStages = [
    { id: 'indent', label: '1. Purchase Indent', count: 0, icon: Sparkles, color: 'text-sky-600 bg-sky-50 border-sky-200', link: '/purchases' },
    { id: 'po', label: '2. PO Raised', count: k.pendingPurchaseOrders || 0, icon: FileSearch, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', link: '/purchase-orders' },
    { id: 'transit', label: '3. Vendor In Transit', count: 0, icon: Truck, color: 'text-blue-600 bg-blue-50 border-blue-200', link: '/purchases' },
    { id: 'grn', label: '4. Goods Received', count: 0, icon: PackageCheck, color: 'text-blue-700 bg-blue-50 border-blue-300', link: '/goods-received' },
    { id: 'qc', label: '5. Quality Check', count: 0, icon: FlaskConical, color: 'text-slate-700 bg-slate-100 border-slate-300', link: '/inventory' },
    { id: 'stock', label: '6. Warehouse Stocked', count: k.totalProducts || 0, icon: Boxes, color: 'text-blue-900 bg-blue-100 border-blue-300', link: '/inventory' },
    { id: 'packing', label: '7. Batch Packaging', count: 0, icon: Tags, color: 'text-amber-700 bg-amber-50 border-amber-200', link: '/batches' },
    { id: 'dispatch', label: '8. Sales Dispatched', count: k.todaysSalesCount || 0, icon: Receipt, color: 'text-blue-700 bg-blue-50 border-blue-200', link: '/sales' },
    { id: 'delivered', label: '9. Retail Delivered', count: k.todaysSalesCount || 0, icon: CheckCircle2, color: 'text-blue-800 bg-blue-100 border-blue-300', link: '/sales' },
  ];

  // 6 Inventory Governance & Exception Cards
  const governanceCards = [
    { id: 'all-catalog', label: 'Total Catalog SKUs', count: k.totalProducts || 0, icon: Package, tag: 'Total Catalog', badgeColor: 'bg-[#101827] text-white', link: '/products' },
    { id: 'low-stock', label: 'Low Stock Reorder Alert', count: k.lowStock || 0, icon: TrendingDown, tag: 'Reorder Gap', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300', link: '/inventory?state=LOW_STOCK' },
    { id: 'quarantine', label: 'Batches In Quarantine', count: 0, icon: PauseCircle, tag: 'Quarantine', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300', link: '/batches' },
    { id: 'expiring', label: 'Near Expiry Batches', count: k.expiring || 0, icon: CalendarClock, tag: 'Expiring Soon', badgeColor: 'bg-rose-100 text-rose-900 border border-rose-300', link: '/batches?state=near' },
    { id: 'wastage', label: 'Approved Wastage & Scraps', count: qty(k.wastageQty) || '0', icon: Trash2, tag: 'Scrapped', badgeColor: 'bg-slate-100 text-slate-700 border border-slate-300', link: '/wastage' },
    { id: 'returns', label: 'Customer / Vendor Returns', count: 0, icon: XCircle, tag: 'Vendor Return', badgeColor: 'bg-rose-50 text-rose-800 border border-rose-200', link: '/returns' },
  ];

  return (
    <div className="space-y-7 max-w-[1600px] mx-auto text-[#111827]">
      {/* 1. EXECUTIVE SUPPLY CHAIN COMMAND BANNER (NAVY BLUE & SILVER) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#101827] via-[#1E293B] to-[#1E3A8A] p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                Arshith Fresh • Supply Chain & Inventory OS
              </span>
              <span className="text-xs text-slate-400 font-mono">Fiscal Year 2026-27</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans">
              Executive Supply Chain & Inventory Command Center
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Unified inventory governance, live warehouse stock, cold-pressed oils, batch expiry surveillance, and retail sales fulfillment.
            </p>
          </div>

          {/* Quick Filter & Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#101827]/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 shadow-inner">
              <Filter className="w-4 h-4 text-blue-400" />
              <select
                value={f.warehouseId}
                onChange={(e) => setF({ ...f, warehouseId: e.target.value })}
                className="bg-transparent focus:outline-none text-slate-200 font-medium cursor-pointer"
              >
                <option value="" className="bg-[#101827] text-white">All Warehouses ({whs?.length || 1})</option>
                {whs?.map((w) => (
                  <option key={w.id} value={w.id} className="bg-[#101827] text-white">{w.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-[#101827]/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 shadow-inner">
              <Tags className="w-4 h-4 text-blue-400" />
              <select
                value={f.categoryId}
                onChange={(e) => setF({ ...f, categoryId: e.target.value })}
                className="bg-transparent focus:outline-none text-slate-200 font-medium cursor-pointer"
              >
                <option value="" className="bg-[#101827] text-white">All Categories ({cats?.length || 4})</option>
                {cats?.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#101827] text-white">{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={reload}
              className="p-2.5 bg-[#101827]/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 hover:text-white transition-all shadow-inner cursor-pointer"
              title="Refresh Inventory State"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>

            <button
              onClick={() => nav('/products')}
              className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>+ New Product</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow decoration in Blue */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"></div>
      </div>

      {/* 2. TOP 4 HERO PULSE SPOTLIGHT METRICS (PURE WHITE CARDS, SILVER BORDERS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Spotlight 1: Inventory Valuation */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-mono">
              Total Inventory Valuation
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#111827] font-sans tracking-tight">
            {money ? inr(k.inventoryValue, true) : '₹0'}
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#64748B]">
              <span>Procurement Burn: {money ? inr(k.todaysPurchases, true) : '₹0'}</span>
              <span className="font-mono font-bold text-[#2563EB]">0% Spent</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full transition-all duration-500"
                style={{ width: `0%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#64748B] font-medium">
              Available Purchasing Budget: ₹0
            </div>
          </div>
        </div>

        {/* Spotlight 2: Active Inventory Volume */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-mono">
              Total Managed Products
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#111827] font-sans tracking-tight">
            {k.totalProducts || 0} Products
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                {qty(k.availableStock) || '0'} In Stock
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                {k.lowStock || 0} Low Stock
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                {k.outOfStock || 0} Out
              </span>
            </div>
            <div className="text-[10px] text-[#64748B] font-medium pt-1">
              Central catalog for raw seeds, cold-pressed oils & FMCG SKUs
            </div>
          </div>
        </div>

        {/* Spotlight 3: Invoiced Sales Cash Flow */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-mono">
              Total Realized Sales Inflow
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#111827] font-sans tracking-tight">
            {money ? inr(k.todaysSales, true) : '₹0'}
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#64748B]">
              <span>Pending Receivables:</span>
              <span className="font-mono font-bold text-amber-600">₹0</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-700 to-indigo-600 rounded-full"
                style={{ width: `0%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#64748B] font-medium">
              Retail store billing, distributor dispatches & advance settlements
            </div>
          </div>
        </div>

        {/* Spotlight 4: Gross Inventory Margin (Dark Hero Theme) */}
        <div className="bg-[#101827] rounded-2xl p-5 border border-slate-800 text-white shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Gross Inventory Margin
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-sans tracking-tight">
            ₹0
          </div>
          <div className="mt-3 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-sky-300 border border-blue-500/30">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>High Margin Cold-Pressed Line</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Operating margin over seed procurement, bottling & logistics costs
            </p>
          </div>
        </div>
      </div>

      {/* 3. INVENTORY SUPPLY CHAIN LIFECYCLE & BATCH FLOW */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
                <Boxes className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-mono">
                Supply Chain & Inventory Lifecycle Flow
              </h2>
              <span className="text-[10px] text-[#64748B] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-medium">
                Click any stage to inspect stock progression
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">
              Chronological workflow progression from raw seed purchase indent to warehouse GRN, bottling, and customer dispatch.
            </p>
          </div>
          <button
            onClick={() => nav('/products')}
            className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 9 Stage Supply Chain Pipeline Row */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2.5 font-mono">
            Primary Supply Chain Pipeline (In Order of Execution)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
            {supplyChainStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <button
                  key={stage.id}
                  onClick={() => nav(stage.link)}
                  className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left group hover:scale-[1.02] cursor-pointer ${stage.color} hover:shadow-xs`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className="w-4 h-4 opacity-80 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-lg font-black font-sans leading-tight">
                    {stage.count}
                  </div>
                  <div className="text-[10px] font-semibold truncate w-full mt-0.5">
                    {stage.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 Governance & Review Exception Categories */}
        <div className="pt-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2.5 font-mono">
            Inventory Exceptions & Quality Controls
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {governanceCards.map((card) => {
              return (
                <button
                  key={card.id}
                  onClick={() => nav(card.link)}
                  className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] hover:bg-white hover:border-blue-400 transition-all text-left flex flex-col justify-between group cursor-pointer hover:shadow-xs"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${card.badgeColor}`}>
                      {card.tag}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <div className="text-base font-black text-[#111827] font-sans">
                      {card.count}
                    </div>
                    <div className="text-[10px] text-[#64748B] font-semibold truncate">
                      {card.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. PENDING APPROVALS ACTION BANNER */}
      {data?.approvals && Object.values(data.approvals).some(Boolean) && (
        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex flex-wrap items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-amber-600" />
          <span className="mr-2 text-xs font-bold text-slate-800">Pending Supply Chain Approvals:</span>
          {[['purchaseOrders', 'Purchase orders', '/purchases?status=PENDING_APPROVAL'], ['adjustments', 'Stock adjustments', '/inventory?tab=adjustments'], ['transfers', 'Transfers', '/warehouses?tab=transfers'], ['returns', 'Returns', '/returns'], ['wastage', 'Wastage', '/wastage']].filter(([k2]) => data.approvals[k2]).map(([k2, l, to]) => (
            <Link key={k2} to={to} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:border-amber-400 transition">
              {l} <span className="ml-1 rounded-full bg-amber-500 px-1.5 text-white">{data.approvals[k2]}</span>
            </Link>
          ))}
        </div>
      )}

      {/* 5. 14-METRIC INVENTORY HEALTH GRID */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="pb-3 border-b border-[#E2E8F0]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] font-mono">
            Granular Warehouse Stock & PO Metrics
          </h3>
          <p className="text-[11px] text-[#64748B]">Real-time audit counters across stock, batches, purchases, and orders</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <Kpi label="Total Products" value={k.totalProducts || 0} icon={Package} onClick={() => nav('/products')} />
          <Kpi label="Categories" value={k.totalCategories || 0} icon={Tags} onClick={() => nav('/categories')} />
          <Kpi label="Suppliers" value={k.totalSuppliers || 0} icon={Truck} onClick={() => nav('/suppliers')} />
          <Kpi label="Total Stock Qty" value={qty(k.totalStockQty) || '0'} sub="units on hand" icon={Boxes} onClick={() => nav('/inventory')} />
          <Kpi label="Available Stock" value={qty(k.availableStock) || '0'} sub="sellable units" icon={PackageCheck} onClick={() => nav('/inventory')} />
          <Kpi label="Low Stock" value={k.lowStock || 0} icon={TrendingDown} tone={k.lowStock ? 'warn' : 'default'} onClick={() => nav('/inventory?state=LOW_STOCK')} />
          <Kpi label="Out of Stock" value={k.outOfStock || 0} icon={PackageX} tone={k.outOfStock ? 'bad' : 'default'} onClick={() => nav('/inventory?state=OUT_OF_STOCK')} />
          <Kpi label="Expiring Batches" value={k.expiring || 0} sub="near-expiry" icon={CalendarClock} tone={k.expiring ? 'warn' : 'default'} onClick={() => nav('/batches?state=near')} />
          <Kpi label="Expired Batches" value={k.expired || 0} sub="blocked from sale" icon={CalendarX} tone={k.expired ? 'bad' : 'default'} onClick={() => nav('/batches?state=expired')} />
          <Kpi label="Pending POs" value={k.pendingPurchaseOrders || 0} icon={FileClock} onClick={() => nav('/purchase-orders')} />
          <Kpi label="Today's Purchases" value={money ? inr(k.todaysPurchases, true) : k.todaysPurchases || '0'} sub="GRN received" icon={ShoppingCart} onClick={() => nav('/goods-received')} />
          <Kpi label="Today's Sales" value={money ? inr(k.todaysSales, true) : k.todaysSalesCount || '0'} sub={`${k.todaysSalesCount || 0} order(s)`} icon={Receipt} tone="brand" onClick={() => nav('/sales')} />
          <Kpi label="Total Wastage" value={qty(k.wastageQty) || '0'} sub={money ? `${inr(k.wastageValue)} loss` : 'approved'} icon={Trash2} onClick={() => nav('/wastage')} />
          <Kpi label="Warehouses" value={whs?.length || 1} sub="active hubs" icon={Boxes} onClick={() => nav('/warehouses')} />
        </div>
      </div>

      {/* 6. CHARTS: PURCHASES VS SALES & STOCK MOVEMENT */}
      {data?.charts && (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
            <div className="mb-4">
              <div className="font-bold text-sm text-[#111827]">Monthly Purchases vs Sales (₹)</div>
              <div className="text-xs text-[#64748B]">Last 12 months • Purchases = Goods Received</div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.charts.monthly} barGap={4}>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} width={60} tickFormatter={(v) => inr(v, true).replace('₹', '')} />
                <Tooltip content={<CustomTooltip money={true} />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="purchases" name="Purchases" fill={C2} radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="sales" name="Sales" fill={C1} radius={[4, 4, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
            <div className="mb-4">
              <div className="font-bold text-sm text-[#111827]">Stock Movement Volume</div>
              <div className="text-xs text-[#64748B]">Units inbound vs outbound per calendar month</div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.charts.movement}>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line dataKey="in" name="Stock In" stroke={C3} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line dataKey="out" name="Stock Out" stroke={C1} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
