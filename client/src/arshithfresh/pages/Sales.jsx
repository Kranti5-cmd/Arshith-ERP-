import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Globe, Receipt, Undo2, Trash2, Plus, Check, X, RefreshCw, DownloadCloud, UploadCloud, Link2, ArrowLeft, ClipboardCheck, Download, RotateCcw, ShieldAlert } from 'lucide-react';
import { api, download, qs } from '../lib/api.js';
import { useApi } from '../lib/useApi.js';
import { inr, qty, fdate, fdatetime, words } from '../lib/format.js';
import { useAuth } from '../lib/auth.jsx';
import { PageHeader, Spinner, ErrorBox, Empty, Pill, Table, FormModal, Modal, Field, Tabs, SearchBox, Kpi, useToast, useAction, askReason } from '../components/ui.jsx';

function OrderTable({ rows }) {
  const nav = useNavigate();
  return <Table rows={rows} onRowClick={(o) => nav(`/orders/${o.id}`)} minWidth={1300} empty={<Empty icon={Receipt} title="No orders" />} columns={[
    { label: 'Order', render: (o) => <div><b>{o.orderNumber}</b><div className="text-[11px] text-ink-muted">{o.source === 'WEBSITE' ? `🌐 ${o.websiteOrderId?.slice(-8)}` : 'Manual'}</div></div> },
    { label: 'Date', render: (o) => fdatetime(o.orderDate) }, { label: 'Customer', render: (o) => <div>{o.customerName}<div className="text-[11px] text-ink-muted">{o.customerPhone}</div></div> },
    { label: 'Products', render: (o) => <div className="max-w-[260px] text-xs">{o.items.map((i) => <div key={i.id} className={i.productId ? '' : 'text-rose-600'}>{i.productName} × {qty(i.quantity)}{!i.productId && ' (unmapped)'}</div>)}</div> },
    { label: 'Amount', right: true, render: (o) => <b>{inr(o.totalAmount)}</b> }, { label: 'Payment', render: (o) => <Pill status={o.paymentStatus} /> }, { label: 'Order', render: (o) => <Pill status={o.status} /> },
    { label: 'Shipping', render: (o) => <Pill status={o.shippingStatus} /> }, { label: 'Fulfilment', render: (o) => <Pill status={o.fulfillmentStatus} /> },
  ]} />;
}

function OrdersPage({ website }) {
  const { can } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const tab = sp.get('tab') || 'orders';
  const [f, setF] = useState({ q: '', status: '', fulfillment: '' });
  const { data, reload } = useApi(tab === 'orders' ? `/orders${qs({ ...f, source: website ? 'WEBSITE' : '' })}` : null);
  const [neu, setNeu] = useState(false);
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader icon={website ? Globe : Receipt} eyebrow="Sales" title={website ? 'Website Orders' : 'Sales'}
        subtitle={website ? 'Orders from arshithfresh.com. Stock is reserved automatically (FEFO), deducted at the configured fulfilment stage and released when an order is cancelled. Overselling is blocked.' : 'All orders – website and manual. Create authorised manual / offline orders here.'}
        actions={!website && can('order.manual') && <button className="btn-primary" onClick={() => setNeu(true)}><Plus className="h-4 w-4" />Manual order</button>} />
      {website && can('integration.manage') && <Tabs value={tab} onChange={(t) => setSp({ tab: t })} items={[['orders', 'Orders'], ['integration', 'Integration & sync log']]} />}
      {tab === 'orders' ? <>
        <div className="mb-4 flex flex-wrap gap-2">
          <SearchBox value={f.q} onChange={(q) => setF({ ...f, q })} placeholder="Order no., customer, phone…" />
          <select className="input w-auto" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}><option value="">All statuses</option>{['PENDING', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED', 'RETURNED'].map((s) => <option key={s} value={s}>{words(s)}</option>)}</select>
          <select className="input w-auto" value={f.fulfillment} onChange={(e) => setF({ ...f, fulfillment: e.target.value })}><option value="">Any fulfilment</option>{['UNFULFILLED', 'BACKORDER', 'RESERVED', 'FULFILLED', 'RELEASED'].map((s) => <option key={s} value={s}>{words(s)}</option>)}</select>
        </div>
        <div className="card">{!data ? <Spinner /> : <OrderTable rows={data} />}</div>
      </> : <Integration />}
      {neu && <ManualOrder onClose={() => setNeu(false)} onDone={(o) => { toast(`${o.orderNumber} created – stock reserved`); nav(`/orders/${o.id}`); }} />}
    </div>
  );
}
export const WebsiteOrders = () => <OrdersPage website />;
export const Sales = () => <OrdersPage />;

function ManualOrder({ onClose, onDone }) {
  const { data: prods } = useApi('/products?status=ACTIVE');
  const { data: whs } = useApi('/warehouses');
  const [f, setF] = useState({ customerName: '', customerPhone: '', customerEmail: '', shippingAddress: '', warehouseId: '', paymentStatus: 'PENDING', paymentMethod: 'Cash', discount: 0, shippingCharge: 0, notes: '', items: [{ productId: '', quantity: 1, unitPrice: '' }] });
  const [error, setError] = useState(null);
  const wid = f.warehouseId || whs?.find((w) => w.isDefault)?.id || whs?.[0]?.id;
  const set = (i, patch) => setF({ ...f, items: f.items.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const subtotal = f.items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0);
  const submit = async () => { setError(null); try { onDone(await api('/orders', { method: 'POST', body: { ...f, warehouseId: wid, items: f.items.filter((i) => i.productId) } })); } catch (e) { setError(e); } };
  return (
    <Modal open size="lg" onClose={onClose} title="Manual order" subtitle="Stock is reserved immediately from the earliest-expiring sellable batches. The order is refused if stock is not enough."
      footer={<><button className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={submit}>Create & reserve stock</button></>}>
      <ErrorBox error={error} />
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Customer name" required><input className="input" value={f.customerName} onChange={(e) => setF({ ...f, customerName: e.target.value })} /></Field>
        <Field label="Phone"><input className="input" value={f.customerPhone} onChange={(e) => setF({ ...f, customerPhone: e.target.value })} /></Field>
        <Field label="Warehouse"><select className="input" value={wid || ''} onChange={(e) => setF({ ...f, warehouseId: e.target.value })}>{whs?.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select></Field>
        <Field label="Address" className="md:col-span-3"><input className="input" value={f.shippingAddress} onChange={(e) => setF({ ...f, shippingAddress: e.target.value })} /></Field>
      </div>
      {f.items.map((it, i) => { const p = prods?.find((x) => String(x.id) === String(it.productId)); return (
        <div key={i} className="grid grid-cols-12 items-end gap-2">
          <Field label={i === 0 ? 'Product' : ''} className="col-span-6"><select className="input" value={it.productId} onChange={(e) => { const pp = prods.find((x) => String(x.id) === e.target.value); set(i, { productId: e.target.value, unitPrice: pp ? Number(pp.sellingPrice) : '' }); }}><option value="">Select…</option>{prods?.map((x) => <option key={x.id} value={x.id} disabled={x.stock.sellable <= 0}>{x.name} – {qty(x.stock.sellable, x.unit)} available</option>)}</select></Field>
          <Field label={i === 0 ? 'Qty' : ''} className="col-span-2"><input type="number" min="0" step="any" className="input" value={it.quantity} onChange={(e) => set(i, { quantity: e.target.value })} /></Field>
          <Field label={i === 0 ? 'Price ₹' : ''} className="col-span-2"><input type="number" min="0" step="any" className="input" value={it.unitPrice} onChange={(e) => set(i, { unitPrice: e.target.value })} /></Field>
          <div className="col-span-2 pb-2 text-right text-sm font-semibold">{inr((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0))}{p && Number(it.quantity) > p.stock.sellable && <div className="text-[10px] text-rose-600">exceeds stock</div>}</div>
        </div>); })}
      <button className="btn-ghost btn-sm" onClick={() => setF({ ...f, items: [...f.items, { productId: '', quantity: 1, unitPrice: '' }] })}><Plus className="h-3.5 w-3.5" />Add product</button>
      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Discount ₹"><input type="number" className="input" value={f.discount} onChange={(e) => setF({ ...f, discount: e.target.value })} /></Field>
        <Field label="Delivery ₹"><input type="number" className="input" value={f.shippingCharge} onChange={(e) => setF({ ...f, shippingCharge: e.target.value })} /></Field>
        <Field label="Payment"><select className="input" value={f.paymentStatus} onChange={(e) => setF({ ...f, paymentStatus: e.target.value })}><option value="PENDING">Pending</option><option value="PAID">Paid</option></select></Field>
        <div className="rounded-xl bg-cream p-3 text-right"><div className="text-xs text-ink-muted">Total</div><div className="font-display text-xl font-extrabold">{inr(subtotal - Number(f.discount || 0) + Number(f.shippingCharge || 0))}</div></div>
      </div>
    </Modal>
  );
}

export function OrderDetail() {
  const { id } = useParams();
  const { can } = useAuth();
  const act = useAction();
  const nav = useNavigate();
  const { data: o, error, reload } = useApi(`/orders/${id}`, [id]);
  const { data: prods } = useApi(o?.items?.some((i) => !i.productId) ? '/products' : null);
  const [ret, setRet] = useState(false);
  const toast = useToast();
  if (error) return <ErrorBox error={error} />;
  if (!o) return <Spinner />;
  const closed = ['CANCELLED', 'RETURNED', 'DELIVERED'].includes(o.status);
  const next = { PENDING: 'CONFIRMED', CONFIRMED: 'PROCESSING', PROCESSING: 'DISPATCHED', DISPATCHED: 'DELIVERED' }[o.status];
  const move = (status, extra = {}) => act(() => api(`/orders/${o.id}/status`, { method: 'POST', body: { status, ...extra } }), `Order ${words(status).toLowerCase()}`, reload);
  return (
    <div className="mx-auto max-w-[1300px] space-y-5">
      <button onClick={() => nav(-1)} className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"><ArrowLeft className="h-4 w-4" />Back</button>
      <div className="card flex flex-wrap items-start justify-between gap-4 p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2"><h1 className="font-display text-2xl font-extrabold">{o.orderNumber}</h1><Pill status={o.source} /><Pill status={o.status} /><Pill status={o.fulfillmentStatus} /><Pill status={o.paymentStatus} /></div>
          <div className="mt-1 text-sm">{o.customerName} · {o.customerPhone} {o.customerEmail}</div>
          <div className="text-xs text-ink-muted">{o.shippingAddress} · ships from {o.warehouse.name} · ordered {fdatetime(o.orderDate)}{o.trackingNumber && ` · tracking ${o.trackingNumber}`}</div>
          {o.notes && <div className="mt-2 rounded-xl bg-amber-50 px-3 py-1.5 text-sm text-amber-800">{o.notes}</div>}
          {o.cancellationReason && <div className="mt-2 rounded-xl bg-rose-50 px-3 py-1.5 text-sm text-rose-700">Cancelled: {o.cancellationReason}</div>}
        </div>
        <div className="flex flex-wrap gap-2">
          {can('order.manage') && ['UNFULFILLED', 'BACKORDER'].includes(o.fulfillmentStatus) && !closed && <button className="btn-ghost" onClick={() => act(() => api(`/orders/${o.id}/reserve`, { method: 'POST' }), 'Stock reserved', reload)}><ClipboardCheck className="h-4 w-4" />Reserve stock</button>}
          {can('order.manage') && next && <button className="btn-primary" onClick={() => (next === 'DISPATCHED' ? move(next, { trackingNumber: window.prompt('Tracking / AWB number (optional)') || undefined }) : move(next))}>Mark {words(next)}</button>}
          {can('order.manage') && !closed && o.fulfillmentStatus !== 'FULFILLED' && <button className="btn-ghost text-rose-600" onClick={() => { const r = askReason('Cancellation reason:'); r && move('CANCELLED', { reason: r }); }}><X className="h-4 w-4" />Cancel</button>}
          {can('return.manage') && o.fulfillmentStatus === 'FULFILLED' && o.status !== 'RETURNED' && <button className="btn-ghost" onClick={() => setRet(true)}><Undo2 className="h-4 w-4" />Customer return</button>}
          {(can('order.manage') || can('finance.payment')) && o.paymentStatus !== 'PAID' && <button className="btn-ghost" onClick={() => act(() => api(`/orders/${o.id}/payment`, { method: 'POST', body: { paymentStatus: 'PAID' } }), 'Marked paid', reload)}>Mark paid</button>}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-5"><Kpi label="Subtotal" value={inr(o.subtotal)} /><Kpi label="Discount" value={inr(o.discount)} /><Kpi label="Delivery" value={inr(o.shippingCharge)} /><Kpi label="Total" value={inr(o.totalAmount)} tone="brand" /><Kpi label={o.cost !== null ? 'Cost of goods (FEFO)' : 'Refunded'} value={o.cost !== null ? inr(o.cost) : inr(o.refundAmount)} tone="dark" /></div>
      <div className="card"><div className="border-b border-[#EFE9DC] px-5 py-3 font-display font-bold">Items</div>
        <Table rows={o.items} minWidth={700} columns={[
          { label: 'Product', render: (i) => i.productId ? <Link className="font-medium hover:underline" to={`/products/${i.productId}`}>{i.productName}</Link> : <div><span className="font-medium text-rose-600">{i.productName}</span><div className="text-[11px] text-ink-muted">website id {i.websiteProductId || '—'} · not mapped</div></div> },
          { label: 'Qty', right: true, render: (i) => qty(i.quantity, i.product?.unit) }, { label: 'Price', right: true, render: (i) => inr(i.unitPrice) }, { label: 'Total', right: true, render: (i) => <b>{inr(i.lineTotal)}</b> }, { label: 'Returned', right: true, render: (i) => qty(i.returnedQty) },
          { label: '', stop: true, render: (i) => !i.productId && can('order.manage') && <select className="input w-56" defaultValue="" onChange={(e) => e.target.value && act(() => api(`/orders/${o.id}/map-item`, { method: 'POST', body: { itemId: i.id, productId: e.target.value } }), 'Product mapped (remembered for future orders)', reload)}><option value="">Map to product…</option>{prods?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select> },
        ]} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card"><div className="border-b border-[#EFE9DC] px-5 py-3 font-display font-bold">Batch allocation (FEFO)</div>
          <Table rows={o.reservations} minWidth={400} columns={[{ label: 'Batch', render: (r) => <span className="font-mono text-xs">{r.batch.batchCode}</span> }, { label: 'Expiry', render: (r) => fdate(r.batch.expiryDate) }, { label: 'Qty', right: true, render: (r) => qty(r.quantity) }, { label: 'Status', render: (r) => <Pill status={r.status} /> }]} empty={<div className="p-5 text-sm text-ink-muted">No stock reserved yet.</div>} />
        </div>
        <div className="card"><div className="border-b border-[#EFE9DC] px-5 py-3 font-display font-bold">Stock movements</div>
          <Table rows={o.movements} minWidth={400} columns={[{ label: 'When', render: (m) => fdatetime(m.createdAt) }, { label: 'Type', render: (m) => <Pill status={m.type} /> }, { label: 'Bucket', render: (m) => words(m.bucket) }, { label: 'Qty', right: true, render: (m) => qty(m.quantity) }]} empty={<div className="p-5 text-sm text-ink-muted">None.</div>} />
        </div>
      </div>
      <FormModal open={ret} onClose={() => setRet(false)} title="Customer return" subtitle="Stock is restored only after inspection and approval." initial={{ reason: '', resolution: 'REFUND', ...Object.fromEntries(o.items.filter((i) => i.productId).map((i) => [`q${i.id}`, 0])) }}
        fields={[...o.items.filter((i) => i.productId).map((i) => [`q${i.id}`, `${i.productName} – return qty (max ${qty(Number(i.quantity) - Number(i.returnedQty))})`, 'number']), ['resolution', 'Resolution', 'select', [['REFUND', 'Refund'], ['REPLACEMENT', 'Replacement'], ['CREDIT_NOTE', 'Credit note'], ['NONE', 'None']]], ['reason', 'Reason', 'textarea', null, { required: true }]]}
        onSubmit={async (f) => { const items = o.items.filter((i) => i.productId && Number(f[`q${i.id}`]) > 0).map((i) => ({ productId: i.productId, quantity: Number(f[`q${i.id}`]), unitValue: Number(i.unitPrice) })); if (!items.length) throw new Error('Enter a return quantity'); await api('/returns', { method: 'POST', body: { type: 'CUSTOMER', salesOrderId: o.id, warehouseId: o.warehouse.id, reason: f.reason, resolution: f.resolution, items } }); toast('Return created – awaiting inspection'); nav('/returns'); }} />
    </div>
  );
}

function Integration() {
  const act = useAction();
  const { data, reload } = useApi('/integration/events');
  const [st, setSt] = useState('');
  const [paste, setPaste] = useState(null);
  if (!data) return <Spinner />;
  const c = data.config;
  const items = st ? data.items.filter((e) => e.status === st) : data.items;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <Kpi label="Products linked to website" value={`${data.mapping.mapped} / ${data.mapping.total}`} icon={Link2} />
        <Kpi label="Processed events" value={data.counts.PROCESSED || 0} icon={Check} />
        <Kpi label="Failed events" value={data.counts.FAILED || 0} icon={ShieldAlert} tone={data.counts.FAILED ? 'bad' : 'default'} onClick={() => setSt('FAILED')} />
        <Kpi label="Rejected (bad signature)" value={data.counts.SKIPPED || 0} />
      </div>
      <div className="card space-y-3 p-5">
        <div className="font-display font-bold">arshithfresh.com connection</div>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <div>Website: <b>{c.websiteBaseUrl}</b> <span className="text-xs text-ink-muted">(Node.js + Express + MongoDB, REST API at /api)</span></div>
          <div>Webhook URL: <code className="rounded bg-cream px-1.5 text-xs">{window.location.origin}{c.webhookUrl}</code> {c.webhookSecretSet ? <Pill status="OK" label="Secret set" /> : <Pill status="FAILED" label="Secret missing" />}</div>
          <div>Pull orders every {c.pollMinutes} min: <Pill status={c.pullOrders ? 'ACTIVE' : 'INACTIVE'} label={c.pullOrders ? 'On' : 'Off'} /></div>
          <div>Push stock to website: <Pill status={c.pushStock ? 'ACTIVE' : 'INACTIVE'} label={c.pushStock ? 'On' : 'Off'} /> <span className="text-xs text-ink-muted">(change in Settings)</span></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={() => act(() => api('/integration/import-products', { method: 'POST', body: {} }), null, (r) => { alert(`Imported from ${r.source}: ${r.created} new, ${r.linked} linked to existing, ${r.updated} updated, ${r.errors.length} errors`); reload(); })}><DownloadCloud className="h-4 w-4" />Import products from website</button>
          <button className="btn-ghost" onClick={() => act(() => api('/integration/pull-orders', { method: 'POST' }), null, (r) => { alert(`Fetched ${r.fetched} orders, ${r.processed} new/changed`); reload(); })}><RefreshCw className="h-4 w-4" />Pull orders now</button>
          <button className="btn-ghost" onClick={() => act(() => api('/integration/push-stock', { method: 'POST' }), null, (r) => { alert(`Pushed ${r.ok} products, ${r.failed} failed`); reload(); })}><UploadCloud className="h-4 w-4" />Push stock now</button>
          <button className="btn-ghost" onClick={() => setPaste('products')}>Paste products JSON</button>
          <button className="btn-ghost" onClick={() => setPaste('orders')}>Paste orders JSON</button>
        </div>
        <div className="text-xs text-ink-muted">If this server cannot reach the website directly, open <code>{c.websiteBaseUrl}/api/products</code> (or <code>/api/orders</code>) in your browser, copy everything and use “Paste … JSON”. Imports never create duplicates: products are matched by website ID, then by name; orders by website order ID.</div>
      </div>
      <Tabs value={st} onChange={setSt} items={[['', 'All events'], ['FAILED', 'Failed'], ['PROCESSED', 'Processed'], ['SKIPPED', 'Rejected']]} />
      <div className="card"><Table rows={items} minWidth={1000} empty={<Empty title="No sync events yet" />} columns={[
        { label: 'When', render: (e) => fdatetime(e.createdAt) }, { label: 'Direction', render: (e) => <span className="text-xs font-semibold">{e.direction}</span> }, { label: 'Event', render: (e) => e.eventType },
        { label: 'Key', render: (e) => <span className="font-mono text-[10px] text-ink-muted">{(e.eventId || '').slice(0, 40)}</span> }, { label: 'Attempts', right: true, render: (e) => e.attempts }, { label: 'Status', render: (e) => <Pill status={e.status} /> },
        { label: 'Error / next retry', render: (e) => <span className="text-xs text-rose-600">{e.lastError}{e.nextRetryAt && <span className="text-ink-muted"> · retry {fdatetime(e.nextRetryAt)}</span>}</span> },
        { label: '', stop: true, render: (e) => e.status === 'FAILED' && <button className="btn-ghost btn-sm" onClick={() => act(() => api(`/integration/events/${e.id}/retry`, { method: 'POST' }), 'Retried', reload)}><RotateCcw className="h-3.5 w-3.5" />Retry</button> },
      ]} /></div>
      <FormModal open={!!paste} onClose={() => setPaste(null)} size="lg" title={`Paste ${paste} JSON`} subtitle={`Copy the full response of ${c.websiteBaseUrl}/api/${paste}`} initial={{ json: '' }} fields={[['json', 'JSON array', 'textarea']]}
        onSubmit={async (f) => { let arr; try { arr = JSON.parse(f.json); } catch { throw new Error('That is not valid JSON'); } const r = await api(`/integration/import-${paste}`, { method: 'POST', body: { [paste]: arr } }); alert(JSON.stringify(r)); reload(); }} />
    </div>
  );
}

export function Returns() {
  const { can } = useAuth();
  const act = useAction();
  const [tab, setTab] = useState('');
  const { data, reload } = useApi(`/returns${qs({ type: tab })}`);
  const [insp, setInsp] = useState(null);
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader icon={Undo2} eyebrow="Sales" title="Returns" subtitle="Customer and supplier returns. Returned stock is NEVER restored automatically – every return is inspected, then approved. Create customer returns from an order, supplier returns from a purchase order." />
      <Tabs value={tab} onChange={setTab} items={[['', 'All'], ['CUSTOMER', 'Customer returns'], ['SUPPLIER', 'Supplier returns']]} />
      <div className="card">{!data ? <Spinner /> : <Table rows={data} minWidth={1300} empty={<Empty icon={Undo2} title="No returns" />} columns={[
        { label: 'Return', render: (r) => <div><b>{r.returnNumber}</b><div className="text-[11px] text-ink-muted">{fdate(r.createdAt)} · {r.createdByName}</div></div> }, { label: 'Type', render: (r) => <Pill status={r.type} /> },
        { label: 'Against', render: (r) => r.salesOrder ? <Link className="text-blue-700 hover:underline" to={`/orders/${r.salesOrder.id}`}>{r.salesOrder.orderNumber} · {r.salesOrder.customerName}</Link> : r.po ? <Link className="text-blue-700 hover:underline" to={`/purchases/${r.po.id}`}>{r.po.poNumber} · {r.supplier?.name}</Link> : '—' },
        { label: 'Products', render: (r) => <div className="text-xs">{r.items.map((i) => <div key={i.id}>{i.product.name} × {qty(i.quantity, i.product.unit)}{Number(i.restockQty) > 0 && <span className="text-blue-700"> (restock {qty(i.restockQty)})</span>}</div>)}</div> },
        { label: 'Reason', render: (r) => <span className="text-xs">{r.reason}</span> }, { label: 'Inspection', render: (r) => r.inspectionResult ? <div><Pill status={r.inspectionResult} /><div className="text-[11px] text-ink-muted">{r.inspectionNotes}</div></div> : '—' },
        { label: 'Value', right: true, render: (r) => inr(r.totalValue) }, { label: 'Resolution', render: (r) => <span className="text-xs">{words(r.resolution)} · {words(r.resolutionStatus)}</span> }, { label: 'Status', render: (r) => <Pill status={r.status} /> },
        { label: '', stop: true, render: (r) => <div className="flex flex-wrap gap-1">
          {r.status === 'REQUESTED' && can('return.manage') && <button className="btn-primary btn-sm" onClick={() => setInsp(r)}>Inspect</button>}
          {r.status === 'INSPECTED' && can('return.approve') && <button className="btn-sm btn bg-blue-600 text-white hover:bg-blue-700" onClick={() => act(() => api(`/returns/${r.id}/approve`, { method: 'POST' }), r.type === 'CUSTOMER' ? 'Approved – stock restored per inspection' : 'Approved – stock returned to supplier', reload)}><Check className="h-3.5 w-3.5" />Approve</button>}
          {['REQUESTED', 'INSPECTED'].includes(r.status) && can('return.approve') && <button className="btn-ghost btn-sm" onClick={() => { const x = askReason(); x && act(() => api(`/returns/${r.id}/reject`, { method: 'POST', body: { reason: x } }), 'Rejected', reload); }}><X className="h-3.5 w-3.5" /></button>}
          {r.status === 'APPROVED' && (can('return.approve') || can('finance.payment')) && <button className="btn-ghost btn-sm" onClick={() => act(() => api(`/returns/${r.id}/complete`, { method: 'POST', body: {} }), 'Refund / replacement completed', reload)}>Complete {words(r.resolution).toLowerCase()}</button>}
        </div> },
      ]} />}</div>
      <FormModal open={!!insp} onClose={() => setInsp(null)} title={`Inspect ${insp?.returnNumber}`} subtitle={insp?.type === 'CUSTOMER' ? 'Only quantity marked GOOD goes back to sellable stock; the rest is booked as damaged.' : 'Confirm the goods being sent back to the supplier.'}
        initial={insp && { inspectionResult: 'GOOD', inspectionNotes: '', ...Object.fromEntries(insp.items.map((i) => [`r${i.id}`, Number(i.quantity)])) }}
        fields={[['inspectionResult', 'Result', 'select', [['GOOD', 'Good – can be restocked'], ['DAMAGED', 'Damaged'], ['EXPIRED', 'Expired']]], ...(insp?.type === 'CUSTOMER' ? insp.items.map((i) => [`r${i.id}`, `${i.product.name}: restock qty (if good)`, 'number']) : []), ['inspectionNotes', 'Inspection notes', 'textarea', null, { required: true }]]}
        onSubmit={async (f) => { await api(`/returns/${insp.id}/inspect`, { method: 'POST', body: { inspectionResult: f.inspectionResult, inspectionNotes: f.inspectionNotes, restockQty: Object.fromEntries(insp.items.map((i) => [i.id, Number(f[`r${i.id}`] || 0)])) } }); reload(); }} />
    </div>
  );
}

export function Wastage() {
  const { can } = useAuth();
  const act = useAction();
  const [st, setSt] = useState('');
  const { data, reload } = useApi(`/wastage${qs({ status: st })}`);
  const total = (data || []).filter((w) => w.status === 'APPROVED').reduce((s, w) => s + Number(w.financialLoss), 0);
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader icon={Trash2} eyebrow="Sales" title="Wastage" subtitle="Expired, damaged, quality-rejected and storage-damaged stock. Record wastage from a batch (Batch & Expiry). Stock is deducted only after approval." />
      <div className="mb-4 grid gap-3 md:grid-cols-3"><Kpi label="Approved loss (this view)" value={can('finance.view') ? inr(total) : '—'} tone="dark" /><Kpi label="Pending approval" value={(data || []).filter((w) => w.status === 'PENDING').length} tone="warn" onClick={() => setSt('PENDING')} /><Kpi label="Records" value={data?.length ?? '…'} /></div>
      <Tabs value={st} onChange={setSt} items={[['', 'All'], ['PENDING', 'Pending'], ['APPROVED', 'Approved'], ['REJECTED', 'Rejected']]} />
      <div className="card">{!data ? <Spinner /> : <Table rows={data} minWidth={1200} empty={<Empty icon={Trash2} title="No wastage recorded" text="Go to Batch & Expiry and use the bin icon on a batch." action={<Link className="btn-primary" to="/batches?state=expired">Open expired batches</Link>} />} columns={[
        { label: 'Wastage', render: (w) => <div><b>{w.wastageNumber}</b><div className="text-[11px] text-ink-muted">{fdate(w.createdAt)} · {w.requestedByName}</div></div> }, { label: 'Product', render: (w) => w.product.name }, { label: 'Batch', render: (w) => <span className="font-mono text-xs">{w.batchCode}</span> }, { label: 'Warehouse', render: (w) => w.warehouse },
        { label: 'Type', render: (w) => <Pill status={w.category === 'EXPIRED' ? 'EXPIRED' : 'DAMAGED'} label={words(w.category)} /> }, { label: 'Qty', right: true, render: (w) => qty(w.quantity, w.product.unit) }, { label: 'Loss', right: true, render: (w) => <b>{inr(w.financialLoss)}</b> },
        { label: 'Reason', render: (w) => <span className="text-xs">{w.reason}{w.rejectionReason && <span className="text-rose-600"> · {w.rejectionReason}</span>}</span> }, { label: 'Doc', stop: true, render: (w) => w.documentStored && <button className="btn-ghost btn-sm" onClick={() => download(`/wastage/${w.id}/document`, w.documentName)}><Download className="h-3.5 w-3.5" /></button> },
        { label: 'Status', render: (w) => <Pill status={w.status} /> },
        { label: '', stop: true, render: (w) => w.status === 'PENDING' && can('wastage.approve') && <div className="flex gap-1"><button className="btn-sm btn bg-blue-600 text-white hover:bg-blue-700" onClick={() => act(() => api(`/wastage/${w.id}/approve`, { method: 'POST' }), 'Approved – stock written off', reload)}><Check className="h-3.5 w-3.5" /></button><button className="btn-ghost btn-sm" onClick={() => { const r = askReason(); r && act(() => api(`/wastage/${w.id}/reject`, { method: 'POST', body: { reason: r } }), 'Rejected', reload); }}><X className="h-3.5 w-3.5" /></button></div> },
      ]} />}</div>
    </div>
  );
}
