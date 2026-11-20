import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ShoppingCart, FileText, PackageCheck, Plus, Trash2, Send, Check, X, Ban, Upload, Download, Wallet, Undo2, ArrowLeft, Lock } from 'lucide-react';
import { api, download, qs } from '../lib/api.js';
import { useApi } from '../lib/useApi.js';
import { inr, qty, fdate, toInputDate, today } from '../lib/format.js';
import { useAuth } from '../lib/auth.jsx';
import { PageHeader, Spinner, ErrorBox, Empty, Pill, Table, FormModal, Modal, Field, Tabs, SearchBox, Kpi, useToast, useAction, askReason } from '../components/ui.jsx';

const r2 = (v) => Math.round(v * 100) / 100;

export function POEditor({ open, onClose, po, onSaved }) {
  const toast = useToast();
  const { data: sups } = useApi(open ? '/suppliers' : null);
  const { data: whs } = useApi(open ? '/warehouses' : null);
  const { data: prods } = useApi(open ? '/products?status=ACTIVE' : null);
  const [f, setF] = useState(null);
  const [error, setError] = useState(null);
  const [sp] = useSearchParams();
  useEffect(() => {
    if (!open) { setF(null); return; }
    if (po) setF({ supplierId: po.supplierId, warehouseId: po.warehouseId, expectedDate: toInputDate(po.expectedDate), notes: po.notes || '', items: po.items.map((i) => ({ productId: i.productId, quantity: Number(i.quantity), rate: Number(i.rate), gstPercent: Number(i.gstPercent) })) });
    else setF({ supplierId: '', warehouseId: '', expectedDate: '', notes: '', items: [{ productId: '', quantity: '', rate: '', gstPercent: 5 }] });
  }, [open, po]);
  useEffect(() => { if (f && !f.warehouseId && whs?.length) setF((x) => ({ ...x, warehouseId: (whs.find((w) => w.isDefault) || whs[0]).id })); }, [whs, f]);
  if (!open || !f) return null;
  const setItem = (i, patch) => setF({ ...f, items: f.items.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const pickProduct = (i, id) => { const p = prods?.find((x) => String(x.id) === String(id)); setItem(i, { productId: id, rate: p?.purchasePrice ? Number(p.purchasePrice) : '', gstPercent: p ? Number(p.gstPercent) : 5 }); };
  const lines = f.items.map((i) => { const base = r2((Number(i.quantity) || 0) * (Number(i.rate) || 0)); const gst = r2((base * (Number(i.gstPercent) || 0)) / 100); return { base, gst, total: r2(base + gst) }; });
  const tot = lines.reduce((a, l) => ({ base: a.base + l.base, gst: a.gst + l.gst, total: a.total + l.total }), { base: 0, gst: 0, total: 0 });
  const supplierProducts = new Set((sups?.find((s) => String(s.id) === String(f.supplierId))?.products || []).map((x) => x.productId));
  const save = async (submit) => {
    setError(null);
    try {
      const body = { ...f, items: f.items.filter((i) => i.productId).map((i) => ({ ...i, productId: Number(i.productId) })), submit };
      const r = po ? await api(`/purchases/${po.id}`, { method: 'PUT', body }) : await api('/purchases', { method: 'POST', body });
      if (po && submit) await api(`/purchases/${po.id}/submit`, { method: 'POST' });
      toast(submit ? 'Submitted for approval' : 'Saved as draft'); onClose(); onSaved?.(po?.id || r.id);
    } catch (e) { setError(e); }
  };
  return (
    <Modal open size="xl" onClose={onClose} title={po ? `Edit ${po.poNumber}` : 'New purchase request'} subtitle="Rates default to the product purchase price. GST and totals are calculated automatically."
      footer={<><button className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-ghost" onClick={() => save(false)}>Save draft</button><button className="btn-primary" onClick={() => save(true)}><Send className="h-4 w-4" />Submit for approval</button></>}>
      <ErrorBox error={error} />
      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Supplier" required className="md:col-span-2"><select className="input" value={f.supplierId} onChange={(e) => setF({ ...f, supplierId: e.target.value })}><option value="">Select supplier…</option>{sups?.filter((s) => s.isActive).map((s) => <option key={s.id} value={s.id}>{s.name} ({s.supplierCode})</option>)}</select></Field>
        <Field label="Deliver to warehouse" required><select className="input" value={f.warehouseId} onChange={(e) => setF({ ...f, warehouseId: e.target.value })}>{whs?.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select></Field>
        <Field label="Expected delivery"><input type="date" className="input" value={f.expectedDate} onChange={(e) => setF({ ...f, expectedDate: e.target.value })} /></Field>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[#ECE6D8]">
        <table className="w-full min-w-[820px]"><thead className="bg-cream-100"><tr>{['Product', 'Quantity', 'Rate (₹)', 'GST %', 'Amount', 'GST', 'Total', ''].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
          <tbody>{f.items.map((it, i) => { const p = prods?.find((x) => String(x.id) === String(it.productId)); return (
            <tr key={i} className="border-t border-[#F1ECE1]">
              <td className="td w-[34%]"><select className="input" value={it.productId} onChange={(e) => pickProduct(i, e.target.value)}><option value="">Select product…</option>{prods?.map((x) => <option key={x.id} value={x.id}>{supplierProducts.has(x.id) ? '★ ' : ''}{x.name} ({x.sku})</option>)}</select>{p && <div className="mt-1 text-[11px] text-ink-muted">In stock {qty(p.stock.sellable, p.unit)} · min {qty(p.minStockLevel)} · reorder {qty(p.reorderQty)}</div>}</td>
              <td className="td"><input type="number" min="0" step="any" className="input w-24" value={it.quantity} onChange={(e) => setItem(i, { quantity: e.target.value })} placeholder={p?.unit} /></td>
              <td className="td"><input type="number" min="0" step="any" className="input w-24" value={it.rate} onChange={(e) => setItem(i, { rate: e.target.value })} /></td>
              <td className="td"><select className="input w-20" value={it.gstPercent} onChange={(e) => setItem(i, { gstPercent: e.target.value })}>{[0, 5, 12, 18, 28].map((g) => <option key={g} value={g}>{g}%</option>)}</select></td>
              <td className="td text-right tabular-nums">{inr(lines[i].base)}</td><td className="td text-right tabular-nums">{inr(lines[i].gst)}</td><td className="td text-right font-semibold tabular-nums">{inr(lines[i].total)}</td>
              <td className="td"><button className="rounded-lg p-1 text-ink-muted hover:bg-rose-50 hover:text-rose-600" onClick={() => setF({ ...f, items: f.items.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></button></td>
            </tr>); })}</tbody>
          <tfoot className="bg-cream-100"><tr><td className="td" colSpan={4}><button className="btn-ghost btn-sm" onClick={() => setF({ ...f, items: [...f.items, { productId: '', quantity: '', rate: '', gstPercent: 5 }] })}><Plus className="h-3.5 w-3.5" />Add product</button></td><td className="td text-right font-semibold">{inr(tot.base)}</td><td className="td text-right font-semibold">{inr(tot.gst)}</td><td className="td text-right font-display text-lg font-extrabold">{inr(tot.total)}</td><td /></tr></tfoot>
        </table>
      </div>
      <Field label="Notes"><textarea className="input" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></Field>
    </Modal>
  );
}

function POList({ mode }) {
  const nav = useNavigate();
  const { can } = useAuth();
  const [sp, setSp] = useSearchParams();
  const tabs = mode === 'requests'
    ? [['DRAFT,PENDING_APPROVAL,REJECTED', 'All requests'], ['DRAFT', 'Drafts'], ['PENDING_APPROVAL', 'Awaiting approval'], ['REJECTED', 'Rejected']]
    : [['APPROVED,PARTIALLY_RECEIVED', 'Open orders'], ['APPROVED', 'Approved'], ['PARTIALLY_RECEIVED', 'Partially received'], ['RECEIVED', 'Received'], ['CLOSED,CANCELLED', 'Closed / cancelled'], ['APPROVED,PARTIALLY_RECEIVED,RECEIVED,CLOSED,CANCELLED', 'All']];
  const status = sp.get('status') || tabs[0][0];
  const [q, setQ] = useState('');
  const [neu, setNeu] = useState(sp.get('new') === '1');
  const { data, reload } = useApi(`/purchases${qs({ status, q })}`);
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader icon={mode === 'requests' ? ShoppingCart : FileText} eyebrow="Purchasing" title={mode === 'requests' ? 'Purchases' : 'Purchase Orders'}
        subtitle={mode === 'requests' ? 'Purchase requests: pick a supplier, add products, GST is calculated, then submit for approval. Approved requests become purchase orders.' : 'Approved purchase orders. Receive goods (full or partial) to create GRNs, batches and stock.'}
        actions={can('purchase.create') && <button className="btn-primary" onClick={() => setNeu(true)}><Plus className="h-4 w-4" />New purchase request</button>} />
      <Tabs value={status} onChange={(s) => setSp({ status: s })} items={tabs.map(([k, l]) => [k, l])} />
      <div className="mb-3"><SearchBox value={q} onChange={setQ} placeholder="PO number, supplier or invoice…" /></div>
      <div className="card">
        {!data ? <Spinner /> : <Table rows={data} onRowClick={(p) => nav(`/purchases/${p.id}`)} empty={<Empty icon={FileText} title="Nothing here" />}
          columns={[
            { label: 'PO number', render: (p) => <span className="font-semibold">{p.poNumber}</span> }, { label: 'Date', render: (p) => fdate(p.orderDate) }, { label: 'Supplier', render: (p) => p.supplier.name },
            { label: 'Warehouse', render: (p) => p.warehouse.name }, { label: 'Items', right: true, render: (p) => p.items.length }, { label: 'Total', right: true, render: (p) => <b>{inr(p.totalAmount)}</b> },
            { label: 'Paid', right: true, render: (p) => inr(p.paid) }, { label: 'Expected', render: (p) => fdate(p.expectedDate) }, { label: 'Status', render: (p) => <Pill status={p.status} /> },
          ]} />}
      </div>
      <POEditor open={neu} onClose={() => setNeu(false)} onSaved={(id) => nav(`/purchases/${id}`)} />
    </div>
  );
}
export const Purchases = () => <POList mode="requests" />;
export const PurchaseOrders = () => <POList mode="orders" />;

function ReceiveModal({ po, open, onClose, onDone }) {
  const toast = useToast();
  const { data: wh } = useApi(open ? '/warehouses' : null);
  const [f, setF] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => { if (open) setF({ receivedDate: today(), supplierInvoiceNo: po.supplierInvoiceNo || '', remarks: '', items: po.items.map((i) => { const pending = Number(i.quantity) - Number(i.receivedQty) - Number(i.damagedQty) - Number(i.missingQty); const exp = i.product.shelfLifeDays ? new Date(Date.now() + i.product.shelfLifeDays * 86400000).toISOString().slice(0, 10) : ''; return { poItemId: i.id, name: i.product.name, unit: i.product.unit, pending, receivedQty: pending > 0 ? pending : 0, damagedQty: 0, missingQty: 0, expiryDate: exp, mfgDate: '', locationId: '', batchCode: '' }; }) }); else setF(null); }, [open, po]);
  if (!open || !f) return null;
  const locs = wh?.find((w) => w.id === po.warehouseId)?.locations || [];
  const set = (i, patch) => setF({ ...f, items: f.items.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const submit = async () => { setError(null); try { const r = await api(`/purchases/${po.id}/receive`, { method: 'POST', body: { ...f, items: f.items.filter((i) => i.pending > 0).map((i) => ({ ...i, locationId: i.locationId || null, expiryDate: i.expiryDate || null, mfgDate: i.mfgDate || null, batchCode: i.batchCode || null })) } }); toast(`${r.grnNumber} created – stock updated`); onClose(); onDone(); } catch (e) { setError(e); } };
  return (
    <Modal open size="xl" onClose={onClose} title={`Receive goods – ${po.poNumber}`} subtitle="Accepted quantity goes into stock as a new batch. Damaged and missing quantities are recorded against the order but not stocked."
      footer={<><button className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={submit}><PackageCheck className="h-4 w-4" />Create GRN & update stock</button></>}>
      <ErrorBox error={error} />
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Received date"><input type="date" className="input" value={f.receivedDate} onChange={(e) => setF({ ...f, receivedDate: e.target.value })} /></Field>
        <Field label="Supplier invoice no."><input className="input" value={f.supplierInvoiceNo} onChange={(e) => setF({ ...f, supplierInvoiceNo: e.target.value })} /></Field>
        <Field label="Remarks"><input className="input" value={f.remarks} onChange={(e) => setF({ ...f, remarks: e.target.value })} /></Field>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[#ECE6D8]">
        <table className="w-full min-w-[1100px]"><thead className="bg-cream-100"><tr>{['Product', 'Pending', 'Accepted', 'Damaged', 'Missing', 'Mfg date', 'Expiry date', 'Location', 'Batch code'].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
          <tbody>{f.items.map((it, i) => (
            <tr key={it.poItemId} className={`border-t border-[#F1ECE1] ${it.pending <= 0 ? 'opacity-40' : ''}`}>
              <td className="td font-medium">{it.name}</td><td className="td tabular-nums">{qty(it.pending, it.unit)}</td>
              {['receivedQty', 'damagedQty', 'missingQty'].map((k) => <td key={k} className="td"><input type="number" min="0" step="any" disabled={it.pending <= 0} className="input w-24" value={it[k]} onChange={(e) => set(i, { [k]: e.target.value })} /></td>)}
              <td className="td"><input type="date" className="input w-36" disabled={it.pending <= 0} value={it.mfgDate} onChange={(e) => set(i, { mfgDate: e.target.value })} /></td>
              <td className="td"><input type="date" className="input w-36" disabled={it.pending <= 0} value={it.expiryDate} onChange={(e) => set(i, { expiryDate: e.target.value })} /></td>
              <td className="td"><select className="input w-28" disabled={it.pending <= 0} value={it.locationId} onChange={(e) => set(i, { locationId: e.target.value })}><option value="">—</option>{locs.map((l) => <option key={l.id} value={l.id}>{l.code}</option>)}</select></td>
              <td className="td"><input className="input w-32" placeholder="auto" disabled={it.pending <= 0} value={it.batchCode} onChange={(e) => set(i, { batchCode: e.target.value })} /></td>
            </tr>))}</tbody></table>
      </div>
    </Modal>
  );
}

export function PODetail() {
  const { id } = useParams();
  const { can } = useAuth();
  const act = useAction();
  const toast = useToast();
  const nav = useNavigate();
  const { data: po, error, reload } = useApi(`/purchases/${id}`, [id]);
  const [edit, setEdit] = useState(false);
  const [recv, setRecv] = useState(false);
  const [modal, setModal] = useState(null);
  const { data: batches } = useApi(modal === 'return' ? `/batches?all=true&supplierId=${po?.supplierId}` : null);
  if (error) return <ErrorBox error={error} />;
  if (!po) return <Spinner />;
  const post = (path, body, msg) => act(() => api(`/purchases/${po.id}/${path}`, { method: 'POST', body }), msg, reload);
  const m = po.money;
  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <Link to={['DRAFT', 'PENDING_APPROVAL', 'REJECTED'].includes(po.status) ? '/purchases' : '/purchase-orders'} className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"><ArrowLeft className="h-4 w-4" />Back</Link>
      <div className="card flex flex-wrap items-start justify-between gap-4 p-5">
        <div>
          <div className="flex items-center gap-2"><h1 className="font-display text-2xl font-extrabold">{po.poNumber}</h1><Pill status={po.status} /></div>
          <div className="mt-1 text-sm text-ink-muted">{po.supplier.name} · GSTIN {po.supplier.gstin || '—'} · {po.supplier.paymentTerms || 'no terms'} → {po.warehouse.name}</div>
          <div className="mt-1 text-xs text-ink-muted">Created {fdate(po.orderDate)} by {po.createdByName}{po.approvedByName && ` · approved by ${po.approvedByName} on ${fdate(po.approvedAt)}`}{po.expectedDate && ` · expected ${fdate(po.expectedDate)}`}</div>
          {po.rejectionReason && <div className="mt-2 rounded-xl bg-rose-50 px-3 py-1.5 text-sm text-rose-700">{po.status === 'CANCELLED' ? 'Cancelled' : 'Rejected'}: {po.rejectionReason}</div>}
        </div>
        <div className="flex flex-wrap gap-2">
          {['DRAFT', 'REJECTED'].includes(po.status) && can('purchase.create') && <><button className="btn-ghost" onClick={() => setEdit(true)}>Edit</button><button className="btn-primary" onClick={() => post('submit', {}, 'Submitted for approval')}><Send className="h-4 w-4" />Submit</button></>}
          {po.status === 'PENDING_APPROVAL' && can('purchase.approve') && <><button className="btn bg-blue-600 text-white hover:bg-blue-700" onClick={() => post('approve', {}, 'Approved – purchase order issued')}><Check className="h-4 w-4" />Approve</button><button className="btn-ghost" onClick={() => { const r = askReason('Reason for rejection:'); r && post('reject', { reason: r }, 'Rejected'); }}><X className="h-4 w-4" />Reject</button></>}
          {['APPROVED', 'PARTIALLY_RECEIVED'].includes(po.status) && can('grn.manage') && <button className="btn-primary" onClick={() => setRecv(true)}><PackageCheck className="h-4 w-4" />Receive goods</button>}
          {['RECEIVED', 'PARTIALLY_RECEIVED'].includes(po.status) && can('return.manage') && <button className="btn-ghost" onClick={() => setModal('return')}><Undo2 className="h-4 w-4" />Return to supplier</button>}
          {can('finance.payment') && !['DRAFT', 'PENDING_APPROVAL', 'REJECTED', 'CANCELLED'].includes(po.status) && <button className="btn-ghost" onClick={() => setModal('pay')}><Wallet className="h-4 w-4" />Record payment</button>}
          {(can('purchase.create') || can('grn.manage')) && !['DRAFT', 'CANCELLED'].includes(po.status) && <button className="btn-ghost" onClick={() => setModal('invoice')}><Upload className="h-4 w-4" />Supplier invoice</button>}
          {po.status === 'PARTIALLY_RECEIVED' && can('purchase.approve') && <button className="btn-ghost" onClick={() => { const r = askReason('Close this PO without receiving the remaining quantity? Reason:'); r && post('close', { reason: r }, 'Purchase order closed'); }}><Lock className="h-4 w-4" />Close</button>}
          {['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'].includes(po.status) && (can('purchase.create') || can('purchase.approve')) && <button className="btn-ghost text-rose-600" onClick={() => { const r = askReason('Reason for cancelling:'); r && post('cancel', { reason: r }, 'Cancelled'); }}><Ban className="h-4 w-4" />Cancel</button>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Kpi label="Order value" value={inr(m.ordered)} sub={`incl. GST ${inr(po.gstAmount)}`} />
        <Kpi label="Received value" value={inr(m.received)} sub="accepted goods incl. GST" />
        <Kpi label="Returned" value={inr(m.returned)} />
        <Kpi label="Paid" value={inr(m.paid)} />
        <Kpi label="Outstanding" value={inr(m.outstanding)} tone={m.outstanding > 0 ? 'brand' : 'default'} />
      </div>
      <div className="card"><div className="border-b border-[#EFE9DC] px-5 py-3 font-display font-bold">Items</div>
        <Table rows={po.items} columns={[{ label: 'Product', render: (i) => <Link className="font-medium hover:underline" to={`/products/${i.productId}`}>{i.product.name}</Link> }, { label: 'Ordered', right: true, render: (i) => qty(i.quantity, i.product.unit) }, { label: 'Received', right: true, render: (i) => <b className="text-blue-700">{qty(i.receivedQty)}</b> }, { label: 'Damaged', right: true, render: (i) => qty(i.damagedQty) }, { label: 'Missing', right: true, render: (i) => qty(i.missingQty) }, { label: 'Pending', right: true, render: (i) => qty(Number(i.quantity) - Number(i.receivedQty) - Number(i.damagedQty) - Number(i.missingQty)) }, { label: 'Rate', right: true, render: (i) => inr(i.rate) }, { label: 'GST', right: true, render: (i) => `${Number(i.gstPercent)}% · ${inr(i.gstAmount)}` }, { label: 'Total', right: true, render: (i) => <b>{inr(i.lineTotal)}</b> }]} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card"><div className="border-b border-[#EFE9DC] px-5 py-3 font-display font-bold">Goods received notes</div>
          {po.grns.length === 0 ? <div className="p-5 text-sm text-ink-muted">Nothing received yet.</div> : po.grns.map((g) => (
            <div key={g.id} className="border-b border-[#F1ECE1] px-5 py-3 text-sm"><div className="flex justify-between"><b>{g.grnNumber}</b><span className="text-xs text-ink-muted">{fdate(g.receivedDate)} · {g.receivedByName}{g.supplierInvoiceNo && ` · inv ${g.supplierInvoiceNo}`}</span></div>
              {g.items.map((i) => <div key={i.id} className="mt-1 flex justify-between text-xs"><span>{i.product.name} <span className="font-mono text-ink-muted">{i.batch?.batchCode}</span>{i.batch?.expiryDate && ` · exp ${fdate(i.batch.expiryDate)}`}</span><span>+{qty(i.receivedQty)}{Number(i.damagedQty) > 0 && <span className="text-rose-600"> · {qty(i.damagedQty)} damaged</span>}{Number(i.missingQty) > 0 && <span className="text-amber-700"> · {qty(i.missingQty)} missing</span>}</span></div>)}</div>
          ))}
        </div>
        <div className="card"><div className="flex items-center justify-between border-b border-[#EFE9DC] px-5 py-3"><span className="font-display font-bold">Invoice & payments</span>{po.supplierInvoiceFile && <button className="btn-ghost btn-sm" onClick={() => download(`/purchases/${po.id}/invoice`, 'invoice')}><Download className="h-3.5 w-3.5" />Invoice</button>}</div>
          <div className="px-5 py-3 text-sm">Supplier invoice: <b>{po.supplierInvoiceNo || '—'}</b>{po.supplierInvoiceDate && ` dated ${fdate(po.supplierInvoiceDate)}`}</div>
          <Table rows={po.payments} minWidth={400} columns={[{ label: 'Payment', render: (p) => p.paymentNumber }, { label: 'Date', render: (p) => fdate(p.paymentDate) }, { label: 'Method', render: (p) => p.method || '—' }, { label: 'Ref', render: (p) => p.reference || '—' }, { label: 'Amount', right: true, render: (p) => <b className={Number(p.amount) < 0 ? 'text-rose-600' : ''}>{inr(p.amount)}</b> }]} empty={<div className="px-5 pb-4 text-sm text-ink-muted">No payments recorded.</div>} />
          {po.returns.length > 0 && <div className="border-t border-[#EFE9DC] px-5 py-3 text-xs">Supplier returns: {po.returns.map((r) => <span key={r.id} className="mr-2"><Link to="/returns" className="font-semibold text-blue-700">{r.returnNumber}</Link> ({r.status.toLowerCase()}, {inr(r.totalValue)})</span>)}</div>}
        </div>
      </div>
      {po.notes && <div className="card p-4 text-sm"><span className="eyebrow">Notes</span><div>{po.notes}</div></div>}
      <POEditor open={edit} onClose={() => setEdit(false)} po={po} onSaved={reload} />
      <ReceiveModal po={po} open={recv} onClose={() => setRecv(false)} onDone={reload} />
      <FormModal open={modal === 'pay'} onClose={() => setModal(null)} size="sm" title="Record supplier payment" initial={{ amount: m.outstanding > 0 ? m.outstanding : '', paymentDate: today(), method: 'Bank transfer', reference: '', notes: '' }}
        fields={[['amount', 'Amount (₹)', 'number', null, { required: true, full: true }], ['paymentDate', 'Payment date', 'date'], ['method', 'Method', 'select', ['Bank transfer', 'UPI', 'Cheque', 'Cash'].map((x) => [x, x])], ['reference', 'Reference / UTR', 'text', null, { full: true }], ['notes', 'Notes', 'textarea']]}
        onSubmit={async (f) => { await api('/supplier-payments', { method: 'POST', body: { ...f, supplierId: po.supplierId, poId: po.id } }); toast('Payment recorded'); reload(); }} />
      <FormModal open={modal === 'invoice'} onClose={() => setModal(null)} size="sm" title="Supplier invoice" initial={{ invoiceNo: po.supplierInvoiceNo || '', invoiceDate: toInputDate(po.supplierInvoiceDate), file: null }}
        fields={[['invoiceNo', 'Invoice number', 'text', null, { full: true }], ['invoiceDate', 'Invoice date', 'date'], ['file', 'Invoice file (PDF / image)', 'file']]}
        onSubmit={async (f) => { const form = new FormData(); Object.entries(f).forEach(([k, v]) => v && form.append(k, v)); await api(`/purchases/${po.id}/invoice`, { method: 'POST', form }); toast('Invoice saved'); reload(); }} />
      <FormModal open={modal === 'return'} onClose={() => setModal(null)} title="Return goods to supplier" subtitle="Stock leaves only after the return is inspected and approved." initial={{ batchId: '', quantity: '', reason: '' }}
        fields={[['batchId', 'Batch', 'select', [['', 'Select batch…'], ...((batches?.items || []).filter((b) => po.items.some((i) => i.productId === b.productId) && (Number(b.availableQty) + Number(b.damagedQty)) > 0).map((b) => [b.id, `${b.product.name} · ${b.batchCode} · avail ${qty(b.availableQty)} · dmg ${qty(b.damagedQty)}`]))], { full: true, required: true }], ['quantity', 'Quantity', 'number', null, { required: true }], ['reason', 'Reason', 'text', null, { required: true }]]}
        onSubmit={async (f) => { const b = batches.items.find((x) => String(x.id) === String(f.batchId)); const item = po.items.find((i) => i.productId === b.productId); await api('/returns', { method: 'POST', body: { type: 'SUPPLIER', poId: po.id, warehouseId: b.warehouseId, reason: f.reason, resolution: 'CREDIT_NOTE', items: [{ productId: b.productId, batchId: b.id, quantity: f.quantity, unitValue: Number(item.rate) }] } }); toast('Supplier return created – inspect & approve in Returns'); nav('/returns'); }} />
    </div>
  );
}

export function GoodsReceived() {
  const [f, setF] = useState({ q: '', from: '', to: '' });
  const { data } = useApi(`/grns${qs(f)}`);
  const rows = (data || []).flatMap((g) => g.items.map((i) => ({ ...i, grn: g, key: `${g.id}-${i.id}` })));
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader icon={PackageCheck} eyebrow="Purchasing" title="Goods Received" subtitle="Every GRN line with batch, expiry, accepted, damaged and missing quantities. Receive goods from an approved purchase order." />
      <div className="mb-4 flex flex-wrap gap-2"><SearchBox value={f.q} onChange={(q) => setF({ ...f, q })} placeholder="GRN or PO number…" /><input type="date" className="input w-auto" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /><input type="date" className="input w-auto" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></div>
      <div className="card">{!data ? <Spinner /> : <Table rows={rows} rowKey="key" minWidth={1200} empty={<Empty icon={PackageCheck} title="No goods received yet" />}
        columns={[{ label: 'GRN', render: (r) => <b>{r.grn.grnNumber}</b> }, { label: 'Date', render: (r) => fdate(r.grn.receivedDate) }, { label: 'PO', render: (r) => <Link className="text-blue-700 hover:underline" to={`/purchases/${r.grn.po.id}`}>{r.grn.po.poNumber}</Link> }, { label: 'Supplier', render: (r) => r.grn.po.supplier.name }, { label: 'Warehouse', render: (r) => r.grn.warehouse.name }, { label: 'Product', render: (r) => r.product.name }, { label: 'Batch', render: (r) => <span className="font-mono text-xs">{r.batch?.batchCode || '—'}</span> }, { label: 'Expiry', render: (r) => fdate(r.batch?.expiryDate) }, { label: 'Accepted', right: true, render: (r) => <b className="text-blue-700">{qty(r.receivedQty, r.product.unit)}</b> }, { label: 'Damaged', right: true, render: (r) => qty(r.damagedQty) }, { label: 'Missing', right: true, render: (r) => qty(r.missingQty) }, { label: 'Received by', render: (r) => r.grn.receivedByName }]} />}</div>
    </div>
  );
}
