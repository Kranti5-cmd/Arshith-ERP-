import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { IndianRupee, BarChart3, Bell, Users as UsersIcon, Settings as SettingsIcon, History, FileSpreadsheet, FileText, FileDown, Eye, Plus, Wallet, Undo2, ShieldCheck, Save, KeyRound, ChevronLeft, ChevronRight } from 'lucide-react';
import { api, download, qs } from '../lib/api.js';
import { useApi } from '../lib/useApi.js';
import { inr, qty, fdate, fdatetime, words, today } from '../lib/format.js';
import { useAuth } from '../lib/auth.jsx';
import { PageHeader, Spinner, ErrorBox, Empty, Pill, Table, FormModal, Field, Tabs, SearchBox, Kpi, useToast, useAction, askReason } from '../components/ui.jsx';

export function Finance() {
  const { can } = useAuth();
  const toast = useToast();
  const act = useAction();
  const [f, setF] = useState({ from: '', to: '' });
  const [tab, setTab] = useState('suppliers');
  const { data, error, reload } = useApi(`/finance/overview${qs(f)}`);
  const { data: pays, reload: reloadPays } = useApi(tab === 'payments' ? `/supplier-payments${qs(f)}` : null);
  const { data: sups } = useApi('/suppliers');
  const [pay, setPay] = useState(false);
  if (error) return <ErrorBox error={error} />;
  const t = data?.totals;
  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <PageHeader icon={IndianRupee} eyebrow="Insights" title="Financial Overview" subtitle={data?.note}
        actions={<><input type="date" className="input w-auto" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /><input type="date" className="input w-auto" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} />{can('finance.payment') && <button className="btn-primary" onClick={() => setPay(true)}><Wallet className="h-4 w-4" />Supplier payment</button>}</>} />
      {!data ? <Spinner /> : <>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          <Kpi label="Total purchase value" value={inr(t.purchaseValue, true)} sub={`+ GST ${inr(t.purchaseGst, true)}`} />
          <Kpi label="Total sales value" value={inr(t.salesValue, true)} sub={`${t.orders} orders · refunds ${inr(t.salesRefunds)}`} tone="brand" />
          <Kpi label="Inventory valuation" value={inr(t.inventoryValuation, true)} sub={`retail ${inr(t.retailValue, true)}`} tone="dark" />
          <Kpi label="Supplier outstanding" value={inr(t.supplierOutstanding, true)} tone={t.supplierOutstanding > 0 ? 'warn' : 'default'} />
          <Kpi label="Supplier payments" value={inr(t.supplierPayments, true)} />
          <Kpi label="Customer returns" value={inr(t.customerReturnValue, true)} />
          <Kpi label="Supplier returns" value={inr(t.supplierReturnValue, true)} />
          <Kpi label="Wastage value" value={inr(t.wastageValue, true)} tone={t.wastageValue > 0 ? 'bad' : 'default'} />
        </div>
        <Tabs value={tab} onChange={setTab} items={[['suppliers', 'Supplier outstanding'], ['profit', 'Product-wise profit'], ['margins', 'Estimated margins'], ['payments', 'Payment transactions'], ['wastage', 'Wastage by type']]} />
        <div className="card">
          {tab === 'suppliers' && <Table rows={data.suppliers} empty={<Empty title="No supplier purchases yet" />} columns={[{ label: 'Supplier', render: (s) => <Link className="font-medium hover:underline" to={`/suppliers?open=${s.id}`}>{s.name}</Link> }, { label: 'POs', right: true, render: (s) => s.orders }, { label: 'Purchase value', right: true, render: (s) => inr(s.purchaseValue) }, { label: 'Returns', right: true, render: (s) => inr(s.returns) }, { label: 'Paid', right: true, render: (s) => inr(s.paid) }, { label: 'Outstanding', right: true, render: (s) => <b className={s.pending > 0 ? 'text-blue-700' : ''}>{inr(s.pending)}</b> }]} />}
          {tab === 'profit' && <Table rows={data.productProfit} empty={<Empty title="No fulfilled sales yet" text="Profit is calculated from fulfilled orders using the actual FEFO batch cost." />} columns={[{ label: 'Product', render: (p) => p.name }, { label: 'Qty sold (net of returns)', right: true, render: (p) => qty(p.qty) }, { label: 'Revenue', right: true, render: (p) => inr(p.revenue) }, { label: 'Cost (batch)', right: true, render: (p) => inr(p.cost) }, { label: 'Profit', right: true, render: (p) => <b className={p.profit < 0 ? 'text-rose-600' : 'text-blue-700'}>{inr(p.profit)}</b> }, { label: 'Margin', right: true, render: (p) => `${p.margin}%` }]} />}
          {tab === 'margins' && <Table rows={data.estimatedMargins} columns={[{ label: 'Product', render: (p) => p.name }, { label: 'Purchase', right: true, render: (p) => inr(p.purchasePrice) }, { label: 'Selling', right: true, render: (p) => inr(p.sellingPrice) }, { label: 'Unit margin', right: true, render: (p) => inr(p.unitMargin) }, { label: 'Margin %', right: true, render: (p) => <b className={p.marginPct < 15 ? 'text-amber-700' : ''}>{p.marginPct}%</b> }, { label: 'Stock', right: true, render: (p) => qty(p.stock) }]} />}
          {tab === 'payments' && (!pays ? <Spinner /> : <Table rows={pays} empty={<Empty title="No payments" />} columns={[{ label: 'Payment', render: (p) => <b>{p.paymentNumber}</b> }, { label: 'Date', render: (p) => fdate(p.paymentDate) }, { label: 'Supplier', render: (p) => p.supplier.name }, { label: 'PO', render: (p) => p.po?.poNumber || '—' }, { label: 'Method', render: (p) => p.method }, { label: 'Ref', render: (p) => p.reference || '—' }, { label: 'Amount', right: true, render: (p) => <b className={Number(p.amount) < 0 ? 'text-rose-600' : ''}>{inr(p.amount)}</b> }, { label: 'By', render: (p) => p.recordedByName }, { label: '', stop: true, render: (p) => can('finance.payment') && Number(p.amount) > 0 && !p.reversalOfId && !pays.some((x) => x.reversalOfId === p.id) && <button className="btn-ghost btn-sm" onClick={() => { const r = askReason('Reverse this payment? Reason:'); r && act(() => api(`/supplier-payments/${p.id}/reverse`, { method: 'POST', body: { reason: r } }), 'Reversed', () => { reloadPays(); reload(); }); }}><Undo2 className="h-3.5 w-3.5" />Reverse</button> }]} />)}
          {tab === 'wastage' && <div className="p-5">{data.wastageByCategory.length === 0 ? <Empty title="No approved wastage" /> : <ResponsiveContainer width="100%" height={240}><BarChart data={data.wastageByCategory}><CartesianGrid vertical={false} stroke="#F1ECE1" /><XAxis dataKey="category" tick={{ fontSize: 11 }} tickFormatter={words} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v) => inr(v)} /><Bar dataKey="value" name="Loss" fill="#E88735" radius={[4, 4, 0, 0]} maxBarSize={60} /></BarChart></ResponsiveContainer>}</div>}
        </div>
      </>}
      <FormModal open={pay} onClose={() => setPay(false)} title="Record supplier payment" initial={{ supplierId: '', amount: '', paymentDate: today(), method: 'Bank transfer', reference: '', notes: '' }}
        fields={[['supplierId', 'Supplier', 'select', [['', 'Select…'], ...(sups || []).map((s) => [s.id, `${s.name}${s.totals ? ` – outstanding ${inr(s.totals.pending)}` : ''}`])], { required: true, full: true }], ['amount', 'Amount (₹)', 'number', null, { required: true }], ['paymentDate', 'Date', 'date'], ['method', 'Method', 'select', ['Bank transfer', 'UPI', 'Cheque', 'Cash'].map((x) => [x, x])], ['reference', 'Reference / UTR'], ['notes', 'Notes', 'textarea']]}
        onSubmit={async (x) => { await api('/supplier-payments', { method: 'POST', body: x }); toast('Payment recorded'); reload(); }} />
    </div>
  );
}

const show = (v, type) => (v === '' || v == null ? '—' : type === 'money' ? inr(v) : type === 'date' ? fdate(v) : type === 'pct' ? `${v}%` : type === 'qty' ? qty(v) : String(v));
export function Reports() {
  const toast = useToast();
  const { data: list, error } = useApi('/reports');
  const { data: cats } = useApi('/categories');
  const { data: sups } = useApi('/suppliers');
  const { data: whs } = useApi('/warehouses');
  const [f, setF] = useState({ from: '', to: '', categoryId: '', supplierId: '', warehouseId: '', q: '' });
  const [preview, setPreview] = useState(null);
  const { data: rep, loading } = useApi(preview ? `/reports/${preview}${qs(f)}` : null, [JSON.stringify(f)]);
  const get = (key, format) => download(`/reports/${key}${qs({ ...f, format })}`, `${key}.${format}`).then(() => toast('Downloaded')).catch((e) => toast(e.message, 'error'));
  if (error) return <ErrorBox error={error} />;
  if (!list) return <Spinner />;
  const groups = [...new Set(list.map((r) => r.group))];
  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <PageHeader icon={BarChart3} eyebrow="Insights" title="Reports & Analytics" subtitle="All reports are built from live database records. Set filters, preview, then download as Excel, CSV or PDF." />
      <div className="card flex flex-wrap items-end gap-2 p-4">
        <Field label="From"><input type="date" className="input" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></Field>
        <Field label="To"><input type="date" className="input" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></Field>
        <Field label="Category"><select className="input" value={f.categoryId} onChange={(e) => setF({ ...f, categoryId: e.target.value })}><option value="">All</option>{cats?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field label="Supplier"><select className="input" value={f.supplierId} onChange={(e) => setF({ ...f, supplierId: e.target.value })}><option value="">All</option>{sups?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
        <Field label="Warehouse"><select className="input" value={f.warehouseId} onChange={(e) => setF({ ...f, warehouseId: e.target.value })}><option value="">All</option>{whs?.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select></Field>
        <Field label="Product search"><input className="input" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} placeholder="name / SKU" /></Field>
      </div>
      {groups.map((g) => (
        <div key={g}><div className="eyebrow mb-2">{g}</div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{list.filter((r) => r.group === g).map((r) => (
            <div key={r.key} className={`card p-4 ${preview === r.key ? 'ring-2 ring-orange-500' : ''}`}>
              <div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-charcoal text-xs font-bold text-orange-400">{r.no}</span><div className="font-semibold">{r.title}</div></div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <button className="btn-ghost btn-sm" onClick={() => setPreview(r.key)}><Eye className="h-3.5 w-3.5" />Preview</button>
                <button className="btn-ghost btn-sm" onClick={() => get(r.key, 'xlsx')}><FileSpreadsheet className="h-3.5 w-3.5 text-blue-600" />Excel</button>
                <button className="btn-ghost btn-sm" onClick={() => get(r.key, 'csv')}><FileDown className="h-3.5 w-3.5" />CSV</button>
                <button className="btn-ghost btn-sm" onClick={() => get(r.key, 'pdf')}><FileText className="h-3.5 w-3.5 text-rose-600" />PDF</button>
              </div>
            </div>))}</div>
        </div>
      ))}
      {preview && <div className="card">
        <div className="flex items-center justify-between border-b border-[#EFE9DC] p-4"><div><div className="font-display font-bold">{rep?.title || 'Loading…'}</div><div className="text-xs text-ink-muted">{rep?.meta} {rep && `· ${rep.total} records${rep.total > 300 ? ' (preview shows 300)' : ''}`}</div></div><button className="btn-ghost btn-sm" onClick={() => setPreview(null)}>Close</button></div>
        {loading || !rep ? <Spinner /> : rep.rows.length === 0 ? <Empty icon={BarChart3} title="No records for these filters" /> : (
          <div className="max-h-[60vh] overflow-auto"><table className="w-full"><thead className="sticky top-0 bg-cream-100"><tr>{rep.columns.map((c) => <th key={c.key} className="th">{c.label}</th>)}</tr></thead>
            <tbody>{rep.rows.map((r, i) => <tr key={i} className="border-t border-[#F1ECE1]">{rep.columns.map((c) => <td key={c.key} className={`td whitespace-nowrap text-xs ${['money', 'int', 'pct', 'qty'].includes(c.type) ? 'text-right tabular-nums' : ''}`}>{show(r[c.key], c.type)}</td>)}</tr>)}</tbody></table></div>
        )}
      </div>}
    </div>
  );
}

export function Notifications() {
  const { data, reload } = useApi('/notifications');
  const [sev, setSev] = useState('');
  if (!data) return <Spinner />;
  const items = sev ? data.items.filter((n) => n.severity === sev) : data.items;
  const dot = { CRITICAL: 'bg-rose-500', WARNING: 'bg-amber-500', SUCCESS: 'bg-blue-500', INFO: 'bg-sky-500' };
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader icon={Bell} eyebrow="Insights" title="Notifications" subtitle={`${data.unread} unread · low stock, expiry, approvals, website orders and sync errors`} actions={<button className="btn-ghost" onClick={() => api('/notifications/read-all', { method: 'POST' }).then(reload)}>Mark all read</button>} />
      <Tabs value={sev} onChange={setSev} items={[['', 'All'], ['CRITICAL', 'Critical'], ['WARNING', 'Warnings'], ['INFO', 'Info'], ['SUCCESS', 'Completed']]} />
      <div className="card divide-y divide-[#F1ECE1]">
        {items.length === 0 && <Empty icon={Bell} title="Nothing here" />}
        {items.map((n) => (
          <Link key={n.id} to={n.link || '#'} onClick={() => api(`/notifications/${n.id}/read`, { method: 'POST' })} className={`flex items-start gap-3 px-5 py-3 hover:bg-cream-100 ${n.isRead ? '' : 'bg-blue-50/40'}`}>
            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dot[n.severity]}`} />
            <div className="flex-1"><div className="text-sm font-semibold">{n.title}</div><div className="text-sm text-ink-muted">{n.message}</div></div>
            <div className="whitespace-nowrap text-[11px] text-ink-muted">{fdatetime(n.createdAt)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Users() {
  const { user: me } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('users');
  const { data: users, reload } = useApi('/users');
  const { data: rp, reload: reloadRoles } = useApi('/roles');
  const [edit, setEdit] = useState(null);
  const [matrix, setMatrix] = useState(null);
  if (!users || !rp) return <Spinner />;
  const m = matrix || Object.fromEntries(rp.roles.map((r) => [r.id, r.permissions]));
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader icon={UsersIcon} eyebrow="Administration" title="User Management" subtitle="Logins, roles and permissions. Every permission is enforced by the server on every request."
        actions={tab === 'users' && <button className="btn-primary" onClick={() => setEdit({ name: '', email: '', phone: '', roleId: rp.roles.find((r) => r.name === 'WAREHOUSE_STAFF')?.id, password: '', isActive: true })}><Plus className="h-4 w-4" />Add user</button>} />
      <Tabs value={tab} onChange={setTab} items={[['users', 'Users'], ['roles', 'Roles & permissions']]} />
      {tab === 'users' ? <div className="card"><Table rows={users} columns={[{ label: 'Name', render: (u) => <b>{u.name}</b> }, { label: 'Email', render: (u) => u.email }, { label: 'Phone', render: (u) => u.phone || '—' }, { label: 'Role', render: (u) => <Pill tone="brand" label={u.role.label} /> }, { label: 'Status', render: (u) => <Pill status={u.isActive ? 'ACTIVE' : 'INACTIVE'} /> }, { label: 'Last login', render: (u) => fdatetime(u.lastLoginAt) }, { label: '', render: (u) => <button className="btn-ghost btn-sm" onClick={() => setEdit({ id: u.id, name: u.name, email: u.email, phone: u.phone || '', roleId: u.role.id, password: '', isActive: u.isActive })}>Edit</button> }]} /></div> : (
        <div className="card overflow-x-auto"><table className="w-full min-w-[1000px]"><thead className="bg-cream-100"><tr><th className="th">Permission</th>{rp.roles.map((r) => <th key={r.id} className="th text-center">{r.label}<div className="font-normal normal-case tracking-normal">{r.users} user(s)</div></th>)}</tr></thead>
          <tbody>{rp.permissions.map((p) => <tr key={p.key} className="border-t border-[#F1ECE1]"><td className="td"><div className="text-sm">{p.label}</div><div className="font-mono text-[10px] text-ink-muted">{p.key}</div></td>{rp.roles.map((r) => <td key={r.id} className="td text-center"><input type="checkbox" className="h-4 w-4 accent-orange-500" disabled={r.name === 'SUPER_ADMIN'} checked={m[r.id].includes(p.key)} onChange={(e) => setMatrix({ ...m, [r.id]: e.target.checked ? [...m[r.id], p.key] : m[r.id].filter((k) => k !== p.key) })} /></td>)}</tr>)}
            <tr className="border-t bg-cream-100"><td className="td text-xs text-ink-muted">Super Admin always keeps every permission.</td>{rp.roles.map((r) => <td key={r.id} className="td text-center">{r.name !== 'SUPER_ADMIN' && <button className="btn-primary btn-sm" disabled={!matrix} onClick={async () => { try { await api(`/roles/${r.id}`, { method: 'PUT', body: { permissions: matrix[r.id] } }); toast(`${r.label} saved`); reloadRoles(); } catch (e) { toast(e.message, 'error'); } }}>Save</button>}</td>)}</tr></tbody></table></div>
      )}
      <FormModal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit user' : 'Add user'} initial={edit}
        fields={[['name', 'Full name', 'text', null, { required: true }], ['email', 'Email (login)', 'email', null, { required: true }], ['phone', 'Phone'], ['roleId', 'Role', 'select', rp.roles.map((r) => [r.id, r.label])], ['password', edit?.id ? 'New password (blank = keep)' : 'Password', 'password', null, { required: !edit?.id, hint: 'At least 8 characters' }], edit?.id !== me.id && ['isActive', 'Account active', 'checkbox']]}
        onSubmit={async (f) => { const body = { ...f, roleId: Number(f.roleId), isActive: f.isActive ?? true }; edit.id ? await api(`/users/${edit.id}`, { method: 'PUT', body }) : await api('/users', { method: 'POST', body }); toast('User saved'); reload(); }} />
    </div>
  );
}

export function Settings() {
  const { can } = useAuth();
  const toast = useToast();
  const [s, setS] = useState(null);
  const [err, setErr] = useState(null);
  const [pw, setPw] = useState({ current: '', next: '' });
  useEffect(() => { api('/settings').then(setS); }, []);
  if (!s) return <Spinner />;
  const ed = can('settings.manage');
  const set = (k, v) => setS({ ...s, [k]: v });
  const save = async () => { setErr(null); try { setS(await api('/settings', { method: 'PUT', body: s })); toast('Settings saved'); } catch (e) { setErr(e); } };
  const Toggle = ({ k, label, hint }) => <label className="flex items-start gap-3 rounded-xl border border-[#ECE6D8] p-3"><input type="checkbox" disabled={!ed} className="mt-0.5 h-4 w-4 accent-orange-500" checked={!!s[k]} onChange={(e) => set(k, e.target.checked)} /><span><span className="text-sm font-semibold">{label}</span>{hint && <span className="block text-xs text-ink-muted">{hint}</span>}</span></label>;
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <PageHeader icon={SettingsIcon} eyebrow="Administration" title="Settings" subtitle={ed ? 'Company-wide inventory rules.' : 'Only Super Admin can change these settings.'} />
      <ErrorBox error={err} />
      <div className="card space-y-4 p-6">
        <div className="font-display font-bold">Expiry alerts</div>
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Near-expiry alert (days)"><input type="number" className="input" disabled={!ed} value={s.nearExpiryDays} onChange={(e) => set('nearExpiryDays', e.target.value)} /></Field>
          <Field label="Critical expiry (days)"><input type="number" className="input" disabled={!ed} value={s.criticalExpiryDays} onChange={(e) => set('criticalExpiryDays', e.target.value)} /></Field>
          <Field label="Low-stock / expiry scan every (hours)"><input type="number" className="input" disabled={!ed} value={s.lowStockCheckHours} onChange={(e) => set('lowStockCheckHours', e.target.value)} /></Field>
        </div>
        <div className="font-display font-bold">Order fulfilment</div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Deduct stock when order is" hint="Before this stage stock is only reserved"><select className="input" disabled={!ed} value={s.fulfillmentDeductStage} onChange={(e) => set('fulfillmentDeductStage', e.target.value)}><option value="CONFIRMED">Confirmed</option><option value="PROCESSING">Processing (packed)</option><option value="DISPATCHED">Dispatched</option></select></Field>
          <Toggle k="autoReserveWebsiteOrders" label="Auto-reserve stock for website orders" hint="Prevents overselling between order and dispatch" />
        </div>
        <div className="font-display font-bold">arshithfresh.com integration</div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Website URL" className="md:col-span-2"><input className="input" disabled={!ed} value={s.websiteBaseUrl} onChange={(e) => set('websiteBaseUrl', e.target.value)} /></Field>
          <Toggle k="websitePullOrders" label="Pull website orders automatically" hint="Reads GET /api/orders on the website (use if webhooks are not set up)" />
          <Toggle k="websitePushStock" label="Push available stock to website" hint="Updates countInStock on the website so customers can't buy what's not available" />
          <Field label="Sync every (minutes)"><input type="number" className="input" disabled={!ed} value={s.websitePollMinutes} onChange={(e) => set('websitePollMinutes', e.target.value)} /></Field>
          <Field label="Company name"><input className="input" disabled={!ed} value={s.companyName} onChange={(e) => set('companyName', e.target.value)} /></Field>
        </div>
        {ed && <div className="flex justify-end"><button className="btn-primary" onClick={save}><Save className="h-4 w-4" />Save settings</button></div>}
      </div>
      <div className="card space-y-3 p-6"><div className="flex items-center gap-2 font-display font-bold"><KeyRound className="h-4 w-4 text-blue-600" />Change my password</div>
        <div className="grid gap-3 md:grid-cols-2"><Field label="Current password"><input type="password" className="input" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></Field><Field label="New password (min 8)"><input type="password" className="input" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></Field></div>
        <div className="flex justify-end"><button className="btn-ghost" disabled={!pw.current || !pw.next} onClick={async () => { try { await api('/account/password', { method: 'POST', body: pw }); toast('Password changed'); setPw({ current: '', next: '' }); } catch (e) { toast(e.message, 'error'); } }}>Change password</button></div>
      </div>
    </div>
  );
}

export function Audit() {
  const [f, setF] = useState({ entity: '', user: '', from: '', to: '', page: 1 });
  const { data, error } = useApi(`/audit${qs(f)}`);
  if (error) return <ErrorBox error={error} />;
  const short = (o) => (o ? Object.entries(o).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join(' · ') : '');
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader icon={History} eyebrow="Administration" title="Audit Logs" subtitle="Who changed what and when. Audit records cannot be edited or deleted." />
      <div className="mb-4 flex flex-wrap gap-2"><select className="input w-auto" value={f.entity} onChange={(e) => setF({ ...f, entity: e.target.value, page: 1 })}><option value="">All records</option>{data?.entities?.map((e) => <option key={e} value={e}>{words(e)}</option>)}</select><SearchBox value={f.user} onChange={(user) => setF({ ...f, user, page: 1 })} placeholder="User name…" className="w-56" /><input type="date" className="input w-auto" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value, page: 1 })} /><input type="date" className="input w-auto" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value, page: 1 })} /></div>
      <div className="card">{!data ? <Spinner /> : <>
        <Table rows={data.items} minWidth={1100} empty={<Empty icon={History} title="No audit records" />} columns={[{ label: 'When', render: (a) => <span className="whitespace-nowrap text-xs">{fdatetime(a.createdAt)}</span> }, { label: 'User', render: (a) => a.userName || 'system' }, { label: 'Record', render: (a) => <span className="text-xs">{words(a.entity)} #{a.entityId}</span> }, { label: 'Action', render: (a) => <Pill tone="dark" label={a.action} /> }, { label: 'Before', render: (a) => <span className="block max-w-[280px] break-words text-[11px] text-ink-muted">{short(a.before)}</span> }, { label: 'After', render: (a) => <span className="block max-w-[320px] break-words text-[11px]">{short(a.after)}</span> }, { label: 'IP', render: (a) => <span className="font-mono text-[10px] text-ink-muted">{a.ip}</span> }]} />
        <div className="flex items-center justify-between border-t border-[#EFE9DC] px-4 py-3 text-xs text-ink-muted"><span>{data.total} records</span><div className="flex gap-1"><button className="btn-ghost btn-sm" disabled={f.page <= 1} onClick={() => setF({ ...f, page: f.page - 1 })}><ChevronLeft className="h-4 w-4" /></button><button className="btn-ghost btn-sm" disabled={f.page * 50 >= data.total} onClick={() => setF({ ...f, page: f.page + 1 })}><ChevronRight className="h-4 w-4" /></button></div></div>
      </>}</div>
    </div>
  );
}
