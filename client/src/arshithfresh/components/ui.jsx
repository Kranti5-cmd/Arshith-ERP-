import { createContext, useCallback, useContext, useState } from 'react';
import { X, Loader2, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { words } from '../lib/format.js';

// semantic status colours
const TONE = {
  ok: 'bg-blue-50 text-blue-700 border-blue-200', warn: 'bg-amber-50 text-amber-800 border-amber-200', bad: 'bg-rose-50 text-rose-700 border-rose-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200', neutral: 'bg-mist text-ink-muted border-[#E4E5E8]', brand: 'bg-blue-50 text-blue-700 border-orange-100', dark: 'bg-charcoal text-white border-charcoal',
};
const STATUS_TONE = {
  ACTIVE: 'ok', INACTIVE: 'neutral', ARCHIVED: 'neutral', IN_STOCK: 'ok', LOW_STOCK: 'warn', OUT_OF_STOCK: 'bad',
  DRAFT: 'neutral', PENDING_APPROVAL: 'warn', PENDING: 'warn', APPROVED: 'ok', REJECTED: 'bad', PARTIALLY_RECEIVED: 'info', RECEIVED: 'ok', CLOSED: 'neutral', CANCELLED: 'neutral',
  CONFIRMED: 'info', PROCESSING: 'info', DISPATCHED: 'brand', DELIVERED: 'ok', RETURNED: 'neutral', PAID: 'ok', FAILED: 'bad', REFUNDED: 'neutral', PARTIALLY_REFUNDED: 'warn',
  UNFULFILLED: 'neutral', RESERVED: 'info', FULFILLED: 'ok', RELEASED: 'neutral', BACKORDER: 'bad', REQUESTED: 'warn', INSPECTED: 'info', COMPLETED: 'ok',
  QUARANTINE: 'warn', EXPIRED: 'bad', CRITICAL: 'bad', NEAR: 'warn', OK: 'ok', NO_EXPIRY: 'neutral', PROCESSED: 'ok', SKIPPED: 'neutral', WEBSITE: 'brand', MANUAL: 'neutral',
  NOT_SHIPPED: 'neutral', IN_TRANSIT: 'info', CUSTOMER: 'info', SUPPLIER: 'brand', GOOD: 'ok', DAMAGED: 'bad',
};
export function Pill({ status, label, tone }) {
  const t = TONE[tone || STATUS_TONE[status] || 'neutral'];
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${t}`}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />{label || words(status)}</span>;
}

export function Spinner({ label = 'Loading…' }) {
  return <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-muted"><Loader2 className="h-4 w-4 animate-spin text-blue-600" />{label}</div>;
}
export function ErrorBox({ error }) {
  if (!error) return null;
  return <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error.message || String(error)}</span></div>;
}
export function Empty({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {Icon && <div className="mb-3 rounded-2xl bg-cream p-3 text-blue-600"><Icon className="h-6 w-6" /></div>}
      <div className="font-semibold text-ink">{title}</div>
      {text && <div className="mt-1 max-w-sm text-sm text-ink-muted">{text}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  if (!open) return null;
  const w = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-charcoal/50 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`my-8 w-full ${w} card`}>
        <div className="flex items-start justify-between border-b border-[#EFE9DC] px-5 py-4">
          <div><div className="font-display text-lg font-bold">{title}</div>{subtitle && <div className="mt-0.5 text-xs text-ink-muted">{subtitle}</div>}</div>
          <button onClick={onClose} className="rounded-lg p-1 text-ink-muted hover:bg-cream"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 rounded-b-2xl border-t border-[#EFE9DC] bg-cream-100 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}
export function Field({ label, required, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-semibold text-ink">{label}{required && <span className="text-blue-600"> *</span>}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink-muted">{hint}</span>}
    </label>
  );
}
export function PageHeader({ title, subtitle, eyebrow, actions, icon: Icon }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-start gap-3">
        {Icon && <div className="mt-1 hidden rounded-2xl bg-charcoal p-2.5 text-orange-400 sm:block"><Icon className="h-5 w-5" /></div>}
        <div>
          {eyebrow && <div className="eyebrow mb-1 !text-blue-600">{eyebrow}</div>}
          <h1 className="font-display text-2xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 max-w-3xl text-sm text-ink-muted">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
export function Tabs({ value, onChange, items }) {
  return <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">{items.map(([k, l, count]) => <button key={k} onClick={() => onChange(k)} className={`tab ${value === k ? 'tab-on' : 'tab-off'}`}>{l}{count != null && <span className={`ml-1.5 rounded-full px-1.5 ${value === k ? 'bg-white/20' : 'bg-cream'}`}>{count}</span>}</button>)}</div>;
}
export function SearchBox({ value, onChange, placeholder = 'Search…', className = 'w-72' }) {
  return <div className={`relative ${className}`}><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" /><input className="input pl-9" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></div>;
}
export function Kpi({ label, value, sub, icon: Icon, tone = 'default', onClick }) {
  const tones = {
    default: 'bg-white border-[#E2E8F0]',
    dark: 'bg-[#101827] text-white border-slate-700',
    warn: 'bg-white border-amber-300 ring-1 ring-amber-200',
    bad: 'bg-white border-rose-300 ring-1 ring-rose-200',
    brand: 'bg-[#2563EB] text-white border-blue-600',
  };
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick} className={`rounded-2xl border p-4 text-left card-premium transition-all ${tones[tone]} ${onClick ? 'hover:-translate-y-0.5 hover:shadow-md cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <span className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${tone === 'dark' || tone === 'brand' ? 'text-white/80' : 'text-[#64748B]'}`}>{label}</span>
        {Icon && <span className={`rounded-xl p-2 ${tone === 'dark' ? 'bg-white/10 text-blue-400' : tone === 'brand' ? 'bg-white/20 text-white' : tone === 'bad' ? 'bg-rose-50 text-rose-600' : tone === 'warn' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-[#2563EB]'}`}><Icon className="h-4 w-4" /></span>}
      </div>
      <div className={`mt-2 font-display text-2xl font-extrabold ${tone === 'dark' || tone === 'brand' ? 'text-white' : 'text-[#111827]'}`}>{value}</div>
      {sub && <div className={`mt-0.5 text-xs ${tone === 'dark' || tone === 'brand' ? 'text-white/80' : 'text-[#64748B]'}`}>{sub}</div>}
    </Tag>
  );
}
export function Table({ columns, rows, onRowClick, empty, minWidth = 900, rowKey = 'id' }) {
  if (!rows?.length) return empty || <Empty title="Nothing here yet" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ minWidth }}>
        <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]"><tr>{columns.map((c) => <th key={c.key || c.label} className={`th ${c.right ? 'text-right' : ''}`}>{c.label}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={r[rowKey] ?? i} onClick={onRowClick && (() => onRowClick(r))} className={`border-t border-[#E2E8F0] ${onRowClick ? 'cursor-pointer hover:bg-slate-50/80 transition-colors' : ''}`}>
            {columns.map((c) => <td key={c.key || c.label} className={`td ${c.right ? 'text-right tabular-nums' : ''} ${c.className || ''}`} onClick={c.stop ? (e) => e.stopPropagation() : undefined}>{c.render ? c.render(r) : r[c.key] ?? '—'}</td>)}
          </tr>))}</tbody>
      </table>
    </div>
  );
}

// Generic form modal: fields = [key, label, type, options?, {required, hint, full}]
export function FormModal({ open, title, subtitle, fields, initial, onClose, onSubmit, size = 'md', submitLabel = 'Save', children }) {
  const [f, setF] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  if (open && !f) setF(initial || {});
  const close = () => { setF(null); setError(null); onClose(); };
  const submit = async () => { setBusy(true); setError(null); try { await onSubmit(f); close(); } catch (e) { setError(e); } finally { setBusy(false); } };
  return (
    <Modal open={open && !!f} onClose={close} title={title} subtitle={subtitle} size={size} footer={<><button className="btn-ghost" onClick={close}>Cancel</button><button className="btn-primary" disabled={busy} onClick={submit}>{busy ? 'Saving…' : submitLabel}</button></>}>
      <ErrorBox error={error} />
      {f && <div className="grid gap-3 md:grid-cols-2">{fields.filter(Boolean).map(([k, label, type = 'text', opts, x = {}]) => (
        <Field key={k} label={label} required={x.required} hint={x.hint} className={type === 'textarea' || x.full ? 'md:col-span-2' : ''}>
          {type === 'select' ? <select className="input" value={f[k] ?? ''} onChange={(e) => setF({ ...f, [k]: e.target.value })}>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            : type === 'textarea' ? <textarea className="input min-h-[72px]" value={f[k] ?? ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
            : type === 'file' ? <input type="file" className="input" accept={x.accept} onChange={(e) => setF({ ...f, [k]: e.target.files[0] })} />
            : type === 'checkbox' ? <input type="checkbox" className="h-4 w-4 accent-orange-500" checked={!!f[k]} onChange={(e) => setF({ ...f, [k]: e.target.checked })} />
            : type === 'multiselect' ? <select multiple className="input h-32" value={(f[k] || []).map(String)} onChange={(e) => setF({ ...f, [k]: [...e.target.selectedOptions].map((o) => Number(o.value)) })}>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            : <input type={type} className="input" value={f[k] ?? ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} {...(type === 'number' && { step: 'any' })} />}
        </Field>))}</div>}
      {f && children && children(f, setF)}
    </Modal>
  );
}

const ToastCtx = createContext(() => {});
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((msg, type = 'ok') => { const id = Math.random(); setItems((x) => [...x, { id, msg, type }]); setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 4000); }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] space-y-2">{items.map((t) => (
        <div key={t.id} className={`flex max-w-md items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-lg ${t.type === 'error' ? 'bg-rose-600' : 'bg-charcoal'}`}>{t.type === 'error' ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-400" />}{t.msg}</div>
      ))}</div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);
// run an API action with toast feedback
export function useAction() {
  const toast = useToast();
  return async (fn, okMsg, after) => { try { const r = await fn(); if (okMsg) toast(okMsg); after?.(r); return r; } catch (e) { toast(e.message, 'error'); return null; } };
}
export const askReason = (msg = 'Reason:') => { const r = window.prompt(msg); return r && r.trim().length >= 3 ? r.trim() : null; };
