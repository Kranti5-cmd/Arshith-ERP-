import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Boxes, CalendarClock, Warehouse, Plus, Check, X, ArrowRightLeft, PackageCheck, Trash2, ShieldCheck, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { api, qs } from '../lib/api.js';
import { useApi } from '../lib/useApi.js';
import { inr, qty, fdate, fdatetime, words, toInputDate } from '../lib/format.js';
import { useAuth } from '../lib/auth.jsx';
import { PageHeader, Spinner, Empty, Pill, Table, FormModal, Modal, Tabs, SearchBox, Kpi, useToast, useAction, askReason } from '../components/ui.jsx';

function AdjustmentForm({ open, onClose, onDone }) {
  const toast = useToast();
  const { data: prods } = useApi(open ? '/products' : null);
  const { data: whs } = useApi(open ? '/warehouses' : null);
  const [pid, setPid] = useState('');
  const [wid, setWid] = useState('');
  const { data: bs } = useApi(open && pid ? `/batches?productId=${pid}&all=true${wid ? `&warehouseId=${wid}` : ''}` : null, [pid, wid]);
  if (!open) return null;
  return (
    <FormModal open onClose={() => { setPid(''); setWid(''); onClose(); }} size="lg" title="Request stock adjustment" subtitle="Nothing changes until a Super Admin / Inventory Manager approves it. Every approved adjustment creates a stock movement."
      initial={{ productId: '', warehouseId: '', type: 'COUNT_CORRECTION', batchId: '', quantity: '', unitCost: '', expiryDate: '', reason: '' }}
      fields={[
        ['productId', 'Product', 'select', [['', 'Select…'], ...(prods || []).map((p) => [p.id, `${p.name} (${p.sku})`])], { required: true }],
        ['warehouseId', 'Warehouse', 'select', [['', 'Select…'], ...(whs || []).map((w) => [w.id, w.name])], { required: true }],
        ['type', 'Type', 'select', [['OPENING', 'Opening stock (new batch)'], ['FOUND', 'Found stock (new batch)'], ['COUNT_CORRECTION', 'Physical count correction'], ['DAMAGE', 'Mark as damaged'], ['OTHER', 'Other']]],
        ['batchId', 'Batch', 'select', [['', 'New batch (for opening / found stock)'], ...((bs?.items) || []).map((b) => [b.id, `${b.batchCode} · avail ${qty(b.availableQty)} · exp ${fdate(b.expiryDate)}`])], { hint: 'Choose a batch to reduce / correct it' }],
        ['quantity', 'Quantity (+ add / − remove)', 'number', null, { required: true, hint: 'For damage enter the damaged quantity' }],
        ['unitCost', 'Unit cost (₹) – new batch only', 'number'], ['expiryDate', 'Expiry date – new batch only', 'date'], ['reason', 'Reason', 'textarea', null, { required: true }],
      ]}
      children={(f) => { if (f.productId !== pid) setTimeout(() => setPid(f.productId)); if (f.warehouseId !== wid) setTimeout(() => setWid(f.warehouseId)); return null; }}
      onSubmit={async (f) => { await api('/adjustments', { method: 'POST', body: { ...f, batchId: f.batchId || null, unitCost: f.unitCost === '' ? null : f.unitCost, expiryDate: f.expiryDate || null } }); toast('Adjustment requested – awaiting approval'); onDone(); }} />
  );
}

export function Inventory() {
  const { can } = useAuth();
  const act = useAction();
  const [sp, setSp] = useSearchParams();
  const tab = sp.get('tab') || 'stock';
  const [f, setF] = useState({ q: '', state: sp.get('state') || '', warehouseId: '', categoryId: '' });
  const [mv, setMv] = useState({ q: '', type: '', page: 1 });
  const { data: inv } = useApi(tab === 'stock' ? `/inventory${qs(f)}` : null);
  const { data: moves } = useApi(tab === 'movements' ? `/inventory/movements${qs(mv)}` : null);
  const { data: adj, reload: reloadAdj } = useApi(tab === 'adjustments' ? '/adjustments' : null);
  const { data: whs } = useApi('/warehouses');
  const { data: cats } = useApi('/categories');
  const [adjOpen, setAdjOpen] = useState(false);
  const fin = can('finance.view');
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader icon={Boxes} eyebrow="Stock" title="Inventory" subtitle="Real-time stock per product. Stock is never edited directly – it changes only through recorded transactions or approved adjustments."
        actions={can('inventory.adjust') && <button className="btn-primary" onClick={() => setAdjOpen(true)}><Plus className="h-4 w-4" />Stock adjustment</button>} />
      <Tabs value={tab} onChange={(t) => setSp({ tab: t })} items={[['stock', 'Stock by product'], ['movements', 'Stock movements'], ['adjustments', 'Adjustments']]} />
      {tab === 'stock' && <>
        <div className="mb-4 flex flex-wrap gap-2">
          <SearchBox value={f.q} onChange={(q) => setF({ ...f, q })} placeholder="Product, SKU…" />
          <select className="input w-auto" value={f.warehouseId} onChange={(e) => setF({ ...f, warehouseId: e.target.value })}><option value="">All warehouses</option>{whs?.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select>
          <select className="input w-auto" value={f.categoryId} onChange={(e) => setF({ ...f, categoryId: e.target.value })}><option value="">All categories</option>{cats?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select className="input w-auto" value={f.state} onChange={(e) => setF({ ...f, state: e.target.value })}><option value="">All stock levels</option><option value="LOW_STOCK">Low stock</option><option value="OUT_OF_STOCK">Out of stock</option><option value="IN_STOCK">In stock</option></select>
        </div>
        <div className="card">{!inv ? <Spinner /> : <Table rows={inv} minWidth={1400} empty={<Empty icon={Boxes} title="No products" />}
          columns={[
            { label: 'Product', render: (p) => <Link to={`/products/${p.id}`} className="font-semibold hover:underline">{p.name}<div className="text-[11px] font-normal text-ink-muted">{p.sku} · {p.category}</div></Link> },
            ...[['opening', 'Opening'], ['purchased', 'Purchased'], ['sold', 'Sold'], ['reserved', 'Reserved']].map(([k, l]) => ({ label: l, right: true, render: (p) => qty(p.stock[k]) })),
            { label: 'Available', right: true, render: (p) => <b className={p.state === 'OUT_OF_STOCK' ? 'text-rose-600' : p.state === 'LOW_STOCK' ? 'text-amber-700' : 'text-blue-700'}>{qty(p.stock.sellable, p.unit)}</b> },
            ...[['damaged', 'Damaged'], ['expired', 'Expired'], ['returned', 'Returned'], ['adjusted', 'Adjusted']].map(([k, l]) => ({ label: l, right: true, render: (p) => <span className={k === 'expired' && p.stock[k] > 0 ? 'font-semibold text-rose-600' : ''}>{qty(p.stock[k])}</span> })),
            ...(fin ? [{ label: 'Value', right: true, render: (p) => inr(p.stock.value) }] : []),
            { label: 'Status', render: (p) => <Pill status={p.state} /> },
          ]} />}</div>
      </>}
      {tab === 'movements' && <>
        <div className="mb-4 flex flex-wrap gap-2"><SearchBox value={mv.q} onChange={(q) => setMv({ ...mv, q, page: 1 })} placeholder="Product or reference…" />
          <select className="input w-auto" value={mv.type} onChange={(e) => setMv({ ...mv, type: e.target.value, page: 1 })}><option value="">All types</option>{['OPENING', 'PURCHASE_RECEIPT', 'RESERVE', 'RELEASE', 'SALE', 'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT', 'DAMAGED', 'EXPIRED', 'WASTAGE', 'CUSTOMER_RETURN', 'SUPPLIER_RETURN'].map((t) => <option key={t} value={t}>{words(t)}</option>)}</select></div>
        <div className="card">{!moves ? <Spinner /> : <>
          <Table rows={moves.items} minWidth={1100} empty={<Empty title="No movements" />} columns={[{ label: 'When', render: (m) => fdatetime(m.createdAt) }, { label: 'Type', render: (m) => <Pill status={m.type} tone={Number(m.quantity) > 0 ? 'ok' : 'brand'} /> }, { label: 'Product', render: (m) => m.product.name }, { label: 'Warehouse', render: (m) => m.warehouse.name }, { label: 'Batch', render: (m) => <span className="font-mono text-xs">{m.batch?.batchCode}</span> }, { label: 'Bucket', render: (m) => <span className="text-xs">{words(m.bucket)}</span> }, { label: 'Qty', right: true, render: (m) => <b className={Number(m.quantity) > 0 ? 'text-blue-700' : 'text-blue-700'}>{Number(m.quantity) > 0 ? '+' : ''}{qty(m.quantity, m.product.unit)}</b> }, { label: 'Reference', render: (m) => m.refNumber || '—' }, { label: 'User', render: (m) => m.userName || '—' }, { label: 'Note', render: (m) => <span className="text-xs text-ink-muted">{m.note}</span> }]} />
          <div className="flex items-center justify-between border-t border-[#EFE9DC] px-4 py-3 text-xs text-ink-muted"><span>{moves.total} movements</span><div className="flex items-center gap-1"><button className="btn-ghost btn-sm" disabled={mv.page <= 1} onClick={() => setMv({ ...mv, page: mv.page - 1 })}><ChevronLeft className="h-4 w-4" /></button><span className="px-2">{mv.page}</span><button className="btn-ghost btn-sm" disabled={mv.page * 50 >= moves.total} onClick={() => setMv({ ...mv, page: mv.page + 1 })}><ChevronRight className="h-4 w-4" /></button></div></div>
        </>}</div>
      </>}
      {tab === 'adjustments' && <div className="card">{!adj ? <Spinner /> : <Table rows={adj} minWidth={1100} empty={<Empty title="No adjustments" />} columns={[
        { label: 'Number', render: (a) => <b>{a.adjustmentNumber}</b> }, { label: 'Date', render: (a) => fdate(a.createdAt) }, { label: 'Product', render: (a) => a.product.name }, { label: 'Warehouse', render: (a) => a.warehouse }, { label: 'Batch', render: (a) => <span className="font-mono text-xs">{a.batchCode || 'new batch'}</span> },
        { label: 'Type', render: (a) => words(a.type) }, { label: 'Qty', right: true, render: (a) => <b>{Number(a.quantity) > 0 ? '+' : ''}{qty(a.quantity, a.product.unit)}</b> }, { label: 'Reason', render: (a) => <span className="text-xs">{a.reason}{a.rejectionReason && <span className="text-rose-600"> · {a.rejectionReason}</span>}</span> },
        { label: 'Requested', render: (a) => a.requestedByName }, { label: 'Status', render: (a) => <Pill status={a.status} /> },
        { label: '', stop: true, render: (a) => a.status === 'PENDING' && can('inventory.approve') && <div className="flex gap-1"><button className="btn-sm btn bg-blue-600 text-white hover:bg-blue-700" onClick={() => act(() => api(`/adjustments/${a.id}/approve`, { method: 'POST' }), 'Approved – stock updated', reloadAdj)}><Check className="h-3.5 w-3.5" /></button><button className="btn-ghost btn-sm" onClick={() => { const r = askReason('Reason for rejection:'); r && act(() => api(`/adjustments/${a.id}/reject`, { method: 'POST', body: { reason: r } }), 'Rejected', reloadAdj); }}><X className="h-3.5 w-3.5" /></button></div> },
      ]} />}</div>}
      <AdjustmentForm open={adjOpen} onClose={() => setAdjOpen(false)} onDone={() => setSp({ tab: 'adjustments' })} />
    </div>
  );
}

export function Batches() {
  const { can } = useAuth();
  const toast = useToast();
  const [sp] = useSearchParams();
  const [f, setF] = useState({ state: sp.get('state') || '', q: '', warehouseId: '' });
  const { data, reload } = useApi(`/batches${qs(f)}`);
  const { data: whs } = useApi('/warehouses');
  const [edit, setEdit] = useState(null);
  const [waste, setWaste] = useState(null);
  const items = data?.items || [];
  const counts = { expired: items.filter((b) => b.expiryState === 'EXPIRED').length, critical: items.filter((b) => b.expiryState === 'CRITICAL').length, near: items.filter((b) => b.expiryState === 'NEAR').length };
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader icon={CalendarClock} eyebrow="Stock" title="Batch & Expiry" subtitle={`Every batch with expiry. Sales always pick the earliest-expiring batch first (FEFO). Expired, quarantined or rejected batches can never be sold. Near-expiry window: ${data?.nearExpiryDays ?? '…'} days (change in Settings).`} />
      {f.state === '' && data && <div className="mb-4 grid grid-cols-3 gap-3"><Kpi label="Expired (blocked)" value={counts.expired} tone={counts.expired ? 'bad' : 'default'} onClick={() => setF({ ...f, state: 'expired' })} /><Kpi label="Critical" value={counts.critical} tone={counts.critical ? 'warn' : 'default'} onClick={() => setF({ ...f, state: 'near' })} /><Kpi label="Near expiry" value={counts.near} onClick={() => setF({ ...f, state: 'near' })} /></div>}
      <Tabs value={f.state} onChange={(state) => setF({ ...f, state })} items={[['', 'All batches with stock'], ['near', 'Near expiry'], ['expired', 'Expired'], ['quarantine', 'Quarantine / rejected']]} />
      <div className="mb-3 flex flex-wrap gap-2"><SearchBox value={f.q} onChange={(q) => setF({ ...f, q })} placeholder="Batch code or product…" /><select className="input w-auto" value={f.warehouseId} onChange={(e) => setF({ ...f, warehouseId: e.target.value })}><option value="">All warehouses</option>{whs?.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
      <div className="card">{!data ? <Spinner /> : <Table rows={items} minWidth={1400} empty={<Empty icon={CalendarClock} title="No batches here" />} columns={[
        { label: 'Batch', render: (b) => <span className="font-mono text-xs font-semibold">{b.batchCode}</span> }, { label: 'Product', render: (b) => <Link className="hover:underline" to={`/products/${b.product.id}`}>{b.product.name}</Link> }, { label: 'Supplier', render: (b) => b.supplier?.name || '—' }, { label: 'Warehouse', render: (b) => <span className="text-xs">{b.warehouse.name}{b.location && ` · ${b.location.code}`}</span> },
        { label: 'Mfg', render: (b) => fdate(b.mfgDate) }, { label: 'Purchased', render: (b) => fdate(b.purchaseDate) }, { label: 'Expiry', render: (b) => <div>{fdate(b.expiryDate)}{b.daysToExpiry !== null && <div className={`text-[11px] ${b.daysToExpiry < 0 ? 'text-rose-600' : b.expiryState === 'CRITICAL' ? 'text-rose-600' : 'text-ink-muted'}`}>{b.daysToExpiry < 0 ? `${-b.daysToExpiry} days ago` : `${b.daysToExpiry} days left`}</div>}</div> },
        { label: 'Received', right: true, render: (b) => qty(b.receivedQty) }, { label: 'Available', right: true, render: (b) => <b>{qty(b.availableQty, b.product.unit)}</b> }, { label: 'Reserved', right: true, render: (b) => qty(b.reservedQty) }, { label: 'Damaged', right: true, render: (b) => qty(b.damagedQty) },
        ...(can('finance.view') ? [{ label: 'Cost', right: true, render: (b) => inr(b.purchasePrice) }] : []), { label: 'Expiry', render: (b) => <Pill status={b.expiryState} label={b.expiryState === 'NEAR' ? 'Near expiry' : undefined} /> }, { label: 'Quality', render: (b) => <Pill status={b.qualityStatus} /> },
        { label: '', stop: true, render: (b) => <div className="flex gap-1">{can('batch.manage') && <button className="btn-ghost btn-sm" title="Quality / dates" onClick={() => setEdit(b)}><ShieldCheck className="h-3.5 w-3.5" /></button>}{can('wastage.manage') && (Number(b.availableQty) > 0 || Number(b.damagedQty) > 0) && <button className="btn-ghost btn-sm text-rose-600" title="Record wastage" onClick={() => setWaste(b)}><Trash2 className="h-3.5 w-3.5" /></button>}</div> },
      ]} />}</div>
      <FormModal open={!!edit} onClose={() => setEdit(null)} title={`Batch ${edit?.batchCode}`} subtitle="Quarantined / rejected batches are excluded from sales." initial={edit && { qualityStatus: edit.qualityStatus, expiryDate: toInputDate(edit.expiryDate), mfgDate: toInputDate(edit.mfgDate), reason: '' }}
        fields={[['qualityStatus', 'Quality status', 'select', [['APPROVED', 'Approved (sellable)'], ['QUARANTINE', 'Quarantine (on hold)'], ['REJECTED', 'Rejected']]], ['expiryDate', 'Expiry date', 'date'], ['mfgDate', 'Manufacturing date', 'date'], ['reason', 'Reason for change', 'text', null, { required: true, full: true }]]}
        onSubmit={async (f) => { await api(`/batches/${edit.id}`, { method: 'PUT', body: f }); toast('Batch updated'); reload(); }} />
      <FormModal open={!!waste} onClose={() => setWaste(null)} title={`Record wastage – ${waste?.product?.name || ''}`} subtitle={`Batch ${waste?.batchCode}. Stock is deducted only after approval.`} initial={waste && { category: waste.expiryState === 'EXPIRED' ? 'EXPIRED' : 'DAMAGED', quantity: waste.expiryState === 'EXPIRED' ? Number(waste.availableQty) : '', fromBucket: Number(waste.availableQty) > 0 ? 'AVAILABLE' : 'DAMAGED', reason: '', document: null }}
        fields={[['category', 'Wastage type', 'select', [['EXPIRED', 'Expired'], ['DAMAGED', 'Damaged'], ['QUALITY_REJECTION', 'Quality rejection'], ['STORAGE_DAMAGE', 'Storage damage'], ['OTHER', 'Other']]], ['fromBucket', 'Take from', 'select', [['AVAILABLE', `Available (${qty(waste?.availableQty)})`], ['DAMAGED', `Damaged (${qty(waste?.damagedQty)})`]]], ['quantity', 'Quantity', 'number', null, { required: true }], ['document', 'Supporting document / photo', 'file'], ['reason', 'Reason', 'textarea', null, { required: true }]]}
        onSubmit={async (f) => { const form = new FormData(); Object.entries({ ...f, batchId: waste.id }).forEach(([k, v]) => v !== '' && v != null && form.append(k, v)); await api('/wastage', { method: 'POST', form }); toast('Wastage submitted for approval'); reload(); }} />
    </div>
  );
}

export function Warehouses() {
  const { can } = useAuth();
  const toast = useToast();
  const act = useAction();
  const [sp, setSp] = useSearchParams();
  const tab = sp.get('tab') || 'list';
  const { data, reload } = useApi('/warehouses');
  const { data: users } = useApi('/users');
  const { data: trs, reload: reloadTr } = useApi(tab === 'transfers' ? '/transfers' : null);
  const [form, setForm] = useState(null);
  const [loc, setLoc] = useState(null);
  const [tr, setTr] = useState(false);
  const [rcv, setRcv] = useState(null);
  const [from, setFrom] = useState('');
  const { data: srcBatches } = useApi(tr && from ? `/batches?warehouseId=${from}` : null, [from]);
  const [lines, setLines] = useState([]);
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader icon={Warehouse} eyebrow="Stock" title="Warehouses" subtitle="Warehouses, storage locations, capacity and stock transfers (request → approve → receive)."
        actions={<>{can('transfer.manage') && <button className="btn-ghost" onClick={() => { setTr(true); setLines([]); setFrom(''); }}><ArrowRightLeft className="h-4 w-4" />New transfer</button>}{can('warehouse.manage') && <button className="btn-primary" onClick={() => setForm({ name: '', location: '', address: '', managerId: '', capacity: '', capacityUnit: 'kg', isDefault: false, isActive: true })}><Plus className="h-4 w-4" />Add warehouse</button>}</>} />
      <Tabs value={tab} onChange={(t) => setSp({ tab: t })} items={[['list', 'Warehouses'], ['transfers', 'Stock transfers']]} />
      {tab === 'list' && (!data ? <Spinner /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.map((w) => { const used = w.capacity ? Math.min(100, Math.round(((w.stock.available + w.stock.reserved) / Number(w.capacity)) * 100)) : null; return (
          <div key={w.id} className="card p-5">
            <div className="flex items-start justify-between"><div><div className="flex items-center gap-2 font-display text-lg font-bold">{w.name}{w.isDefault && <Pill tone="brand" label="Default (website orders)" />}</div><div className="text-xs text-ink-muted">{w.warehouseCode} · {w.location || '—'}{!w.isActive && ' · inactive'}</div></div>
              {can('warehouse.manage') && <button className="btn-ghost btn-sm" onClick={() => setForm({ ...w, managerId: w.managerId || '', capacity: w.capacity ?? '', location: w.location || '', address: w.address || '' })}>Edit</button>}</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">{[['Available', w.stock.available], ['Reserved', w.stock.reserved], ['Damaged', w.stock.damaged]].map(([l, v]) => <div key={l} className="rounded-xl bg-cream p-2"><div className="font-display text-lg font-extrabold">{qty(v)}</div><div className="text-[11px] text-ink-muted">{l}</div></div>)}</div>
            {used !== null && <div className="mt-3"><div className="flex justify-between text-xs text-ink-muted"><span>Capacity {qty(w.capacity, w.capacityUnit)}</span><span>{used}% used</span></div><div className="mt-1 h-2 overflow-hidden rounded-full bg-cream"><div className={`h-full ${used > 90 ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${used}%` }} /></div></div>}
            <div className="mt-3 text-xs text-ink-muted">Manager: <b className="text-ink">{w.manager?.name || '—'}</b> · {w.stock.products} products{can('finance.view') && ` · ${inr(w.stock.value, true)}`}</div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-ink-muted" />{w.locations.length ? w.locations.map((l) => <span key={l.id} title={l.description || ''} className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-medium">{l.code}</span>) : <span className="text-xs text-ink-muted">No storage locations</span>}{can('warehouse.manage') && <button className="text-xs font-semibold text-blue-600" onClick={() => setLoc(w)}>+ add</button>}</div>
          </div>); })}</div>
      ))}
      {tab === 'transfers' && <div className="card">{!trs ? <Spinner /> : <Table rows={trs} minWidth={1100} empty={<Empty icon={ArrowRightLeft} title="No transfers yet" />} columns={[
        { label: 'Transfer', render: (t) => <b>{t.transferNumber}</b> }, { label: 'Date', render: (t) => fdate(t.createdAt) }, { label: 'From → To', render: (t) => `${t.fromWarehouse.name} → ${t.toWarehouse.name}` },
        { label: 'Items', render: (t) => <div className="text-xs">{t.items.map((i) => <div key={i.id}>{i.product.name} <span className="font-mono text-ink-muted">{i.batch?.batchCode}</span> × {qty(i.quantity, i.product.unit)}{Number(i.damagedQty) > 0 && <span className="text-rose-600"> ({qty(i.damagedQty)} damaged)</span>}</div>)}</div> },
        { label: 'Requested', render: (t) => t.requestedByName }, { label: 'Status', render: (t) => <Pill status={t.status} label={t.status === 'APPROVED' ? 'In transit' : undefined} /> },
        { label: '', stop: true, render: (t) => <div className="flex gap-1">
          {t.status === 'PENDING' && can('transfer.approve') && <><button className="btn-sm btn bg-blue-600 text-white hover:bg-blue-700" onClick={() => act(() => api(`/transfers/${t.id}/approve`, { method: 'POST' }), 'Approved – stock dispatched', reloadTr)}><Check className="h-3.5 w-3.5" />Approve</button><button className="btn-ghost btn-sm" onClick={() => { const r = askReason(); r && act(() => api(`/transfers/${t.id}/reject`, { method: 'POST', body: { reason: r } }), 'Rejected', reloadTr); }}><X className="h-3.5 w-3.5" /></button></>}
          {t.status === 'APPROVED' && can('transfer.manage') && <button className="btn-primary btn-sm" onClick={() => setRcv(t)}><PackageCheck className="h-3.5 w-3.5" />Receive</button>}
        </div> },
      ]} />}</div>}
      <FormModal open={!!form} onClose={() => setForm(null)} title={form?.id ? 'Edit warehouse' : 'Add warehouse'} initial={form}
        fields={[['name', 'Warehouse name', 'text', null, { required: true }], ['location', 'Location / city'], ['address', 'Address', 'text', null, { full: true }], ['managerId', 'Warehouse manager', 'select', [['', '—'], ...(users || []).map((u) => [u.id, `${u.name} (${u.role.label})`])]], ['capacity', 'Capacity', 'number'], ['capacityUnit', 'Capacity unit', 'select', ['kg', 'litre', 'pallets', 'units'].map((x) => [x, x])], ['isDefault', 'Default warehouse (website orders)', 'checkbox'], ['isActive', 'Active', 'checkbox']]}
        onSubmit={async (f) => { const body = { ...f, managerId: f.managerId || null, capacity: f.capacity === '' ? null : f.capacity }; form.id ? await api(`/warehouses/${form.id}`, { method: 'PUT', body }) : await api('/warehouses', { method: 'POST', body }); toast('Warehouse saved'); reload(); }} />
      <FormModal open={!!loc} onClose={() => setLoc(null)} size="sm" title={`Storage location – ${loc?.name}`} initial={{ code: '', description: '' }} fields={[['code', 'Location code', 'text', null, { required: true, hint: 'e.g. RACK-A-01', full: true }], ['description', 'Description', 'text', null, { full: true }]]}
        onSubmit={async (f) => { await api(`/warehouses/${loc.id}/locations`, { method: 'POST', body: f }); toast('Location added'); reload(); }} />
      <Modal open={tr} onClose={() => setTr(false)} size="lg" title="New stock transfer" subtitle="Stock leaves the source warehouse when the transfer is approved and arrives when it is received."
        footer={<><button className="btn-ghost" onClick={() => setTr(false)}>Cancel</button><button className="btn-primary" disabled={!lines.length} onClick={() => act(() => api('/transfers', { method: 'POST', body: { fromWarehouseId: from, toWarehouseId: lines.to, reason: lines.reason, items: lines.filter((l) => Number(l.quantity) > 0) } }), 'Transfer requested', () => { setTr(false); setSp({ tab: 'transfers' }); })}>Request transfer</button></>}>
        <div className="grid gap-3 md:grid-cols-2">
          <label><span className="mb-1 block text-xs font-semibold">From</span><select className="input" value={from} onChange={(e) => { setFrom(e.target.value); setLines([]); }}><option value="">Select…</option>{data?.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select></label>
          <label><span className="mb-1 block text-xs font-semibold">To</span><select className="input" value={lines.to || ''} onChange={(e) => setLines(Object.assign([...lines], { to: e.target.value, reason: lines.reason }))}><option value="">Select…</option>{data?.filter((w) => String(w.id) !== String(from)).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select></label>
        </div>
        {from && <div className="max-h-72 overflow-y-auto rounded-2xl border border-[#ECE6D8]">{(srcBatches?.items || []).filter((b) => Number(b.availableQty) > 0).map((b) => { const l = lines.find((x) => x.batchId === b.id); return (
          <div key={b.id} className="flex items-center justify-between gap-2 border-b border-[#F1ECE1] px-3 py-2 text-sm"><span>{b.product.name} <span className="font-mono text-xs text-ink-muted">{b.batchCode}</span> · exp {fdate(b.expiryDate)} · avail <b>{qty(b.availableQty)}</b></span>
            <input type="number" min="0" max={Number(b.availableQty)} step="any" className="input w-24" placeholder="0" value={l?.quantity || ''} onChange={(e) => { const rest = lines.filter((x) => x.batchId !== b.id); setLines(Object.assign([...rest, ...(e.target.value ? [{ batchId: b.id, quantity: e.target.value }] : [])], { to: lines.to, reason: lines.reason })); }} /></div>); })}</div>}
        <input className="input" placeholder="Reason / note" value={lines.reason || ''} onChange={(e) => setLines(Object.assign([...lines], { to: lines.to, reason: e.target.value }))} />
      </Modal>
      <FormModal open={!!rcv} onClose={() => setRcv(null)} title={`Receive ${rcv?.transferNumber}`} subtitle="Enter any quantity damaged in transit – it is booked as damaged stock, not available." initial={rcv && Object.fromEntries(rcv.items.map((i) => [`d${i.id}`, 0]))}
        fields={(rcv?.items || []).map((i) => [`d${i.id}`, `${i.product.name} (${qty(i.quantity, i.product.unit)}) – damaged qty`, 'number'])}
        onSubmit={async (f) => { await api(`/transfers/${rcv.id}/receive`, { method: 'POST', body: { items: rcv.items.map((i) => ({ id: i.id, damagedQty: f[`d${i.id}`] || 0 })) } }); toast('Transfer received – stock updated'); reloadTr(); }} />
    </div>
  );
}
