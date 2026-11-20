import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Package, Plus, Download, Upload, Archive, ArchiveRestore, Pencil, Image as ImageIcon, Tags, Truck, Star, ArrowLeft } from 'lucide-react';
import { api, download, qs } from '../lib/api.js';
import { useApi } from '../lib/useApi.js';
import { inr, qty, fdate, fdatetime, words } from '../lib/format.js';
import { useAuth } from '../lib/auth.jsx';
import { PageHeader, Spinner, ErrorBox, Empty, Pill, Table, FormModal, Modal, Tabs, SearchBox, Kpi, useToast, useAction } from '../components/ui.jsx';

const blankProduct = { name: '', sku: '', barcode: '', categoryId: '', subcategoryId: '', description: '', unit: 'kg', packSize: '', purchasePrice: '', sellingPrice: '', gstPercent: 5, minStockLevel: 0, reorderQty: 0, shelfLifeDays: '', preferredSupplierId: '', status: 'ACTIVE', websiteProductId: '' };

export function ProductForm({ open, onClose, product, onSaved }) {
  const { data: cats } = useApi(open ? '/categories' : null);
  const { data: sups } = useApi(open ? '/suppliers' : null);
  const { data: meta } = useApi('/meta');
  const toast = useToast();
  const init = product ? { ...blankProduct, ...Object.fromEntries(Object.entries(product).filter(([k]) => k in blankProduct).map(([k, v]) => [k, v ?? ''])) } : blankProduct;
  if (open && !cats) return null;
  const cat = (f) => cats?.find((c) => String(c.id) === String(f.categoryId));
  return (
    <FormModal open={open} onClose={onClose} size="lg" title={product ? `Edit ${product.name}` : 'Add product'} subtitle={product ? product.productCode : 'Product ID is generated automatically'} initial={init}
      fields={[
        ['name', 'Product name', 'text', null, { required: true }], ['sku', 'SKU', 'text', null, { required: true, hint: 'Unique stock-keeping code, e.g. GNO-1L' }],
        ['barcode', 'Barcode'], ['categoryId', 'Category', 'select', [['', 'Select…'], ...(cats || []).map((c) => [c.id, c.name])], { required: true }],
        ['subcategoryId', 'Subcategory', 'select', [['', '—'], ...(cats || []).flatMap((c) => c.children.map((s) => [s.id, `${c.name} › ${s.name}`]))]],
        ['unit', 'Unit of measurement', 'select', (meta?.units || []).map((u) => [u, u]), { required: true }], ['packSize', 'Pack size', 'text', null, { hint: 'e.g. 1 Litre, 500 g' }],
        ['purchasePrice', 'Purchase price (₹)', 'number', null, { required: true }], ['sellingPrice', 'Selling price (₹)', 'number', null, { required: true }],
        ['gstPercent', 'GST %', 'select', [0, 5, 12, 18, 28].map((g) => [g, `${g}%`])], ['minStockLevel', 'Minimum stock level', 'number', null, { hint: 'Low-stock alert below this' }],
        ['reorderQty', 'Reorder quantity', 'number'], ['shelfLifeDays', 'Shelf life (days)', 'number', null, { hint: 'Used to suggest expiry when receiving' }],
        ['preferredSupplierId', 'Preferred supplier', 'select', [['', '—'], ...(sups || []).map((s) => [s.id, s.name])]], ['status', 'Status', 'select', [['ACTIVE', 'Active'], ['INACTIVE', 'Inactive']]],
        ['websiteProductId', 'Website product ID', 'text', null, { hint: 'MongoDB _id on arshithfresh.com (set automatically by import)' }], ['description', 'Description', 'textarea'],
      ]}
      onSubmit={async (f) => {
        const body = { ...f, subcategoryId: f.subcategoryId || null, preferredSupplierId: f.preferredSupplierId || null, shelfLifeDays: f.shelfLifeDays === '' ? null : f.shelfLifeDays };
        if (body.subcategoryId && cat(f) && !cat(f).children.some((s) => String(s.id) === String(body.subcategoryId))) throw new Error('Subcategory does not belong to the chosen category');
        const r = product ? await api(`/products/${product.id}`, { method: 'PUT', body }) : await api('/products', { method: 'POST', body });
        toast(product ? 'Product updated' : `Product ${r.productCode} created`); onSaved?.(r);
      }} />
  );
}

export function Products() {
  const { can } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [sp] = useSearchParams();
  const [f, setF] = useState({ q: sp.get('q') || '', categoryId: '', stock: '', status: '' });
  const { data, error, reload } = useApi(`/products${qs(f)}`);
  const { data: cats } = useApi('/categories');
  const [form, setForm] = useState(false);
  const [imp, setImp] = useState(null);
  const importCsv = async (file) => { const form2 = new FormData(); form2.append('file', file); try { setImp(await api('/products/import', { method: 'POST', form: form2 })); reload(); } catch (e) { toast(e.message, 'error'); } };
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader icon={Package} eyebrow="Catalogue" title="Products" subtitle="Every product with live stock. Stock changes only through purchases, sales, transfers, returns, wastage or approved adjustments."
        actions={<>
          {can('product.import') && <><label className="btn-ghost cursor-pointer"><Upload className="h-4 w-4" />Import CSV<input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files[0] && importCsv(e.target.files[0])} /></label>
            <button className="btn-ghost" onClick={() => download(`/products/export${qs(f)}`, 'products.csv')}><Download className="h-4 w-4" />Export</button></>}
          {can('product.manage') && <button className="btn-primary" onClick={() => setForm(true)}><Plus className="h-4 w-4" />Add Product</button>}
        </>} />
      <div className="mb-4 flex flex-wrap gap-2">
        <SearchBox value={f.q} onChange={(q) => setF({ ...f, q })} placeholder="Name, SKU, barcode or product ID…" />
        <select className="input w-auto" value={f.categoryId} onChange={(e) => setF({ ...f, categoryId: e.target.value })}><option value="">All categories</option>{cats?.flatMap((c) => [<option key={c.id} value={c.id}>{c.name}</option>, ...c.children.map((s) => <option key={s.id} value={s.id}>&nbsp;&nbsp;› {s.name}</option>)])}</select>
        <select className="input w-auto" value={f.stock} onChange={(e) => setF({ ...f, stock: e.target.value })}><option value="">Any stock</option><option value="IN_STOCK">In stock</option><option value="LOW_STOCK">Low stock</option><option value="OUT_OF_STOCK">Out of stock</option></select>
        <select className="input w-auto" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}><option value="">Active & inactive</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="ARCHIVED">Archived</option></select>
      </div>
      <ErrorBox error={error} />
      <div className="card">
        {!data ? <Spinner /> : <Table rows={data} onRowClick={(p) => nav(`/products/${p.id}`)} minWidth={1100}
          empty={<Empty icon={Package} title="No products" text="Add products, import a CSV, or import the catalogue from arshithfresh.com (Website Orders → Integration)." />}
          columns={[
            { label: 'Product', render: (p) => <div className="flex items-center gap-3">{p.imageUrl ? <img src={p.imageUrl} alt="" className="h-10 w-10 rounded-xl object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream"><ImageIcon className="h-4 w-4 text-ink-muted" /></div>}<div><div className="font-semibold">{p.name}</div><div className="text-[11px] text-ink-muted">{p.productCode} · {p.sku}{p.websiteProductId && ' · 🌐 linked'}</div></div></div> },
            { label: 'Category', render: (p) => <div className="text-xs">{p.category.name}{p.subcategory && <div className="text-ink-muted">› {p.subcategory.name}</div>}</div> },
            { label: 'Unit', render: (p) => <span className="text-xs">{p.unit}{p.packSize && ` · ${p.packSize}`}</span> },
            ...(can('finance.view') ? [{ label: 'Purchase', right: true, render: (p) => inr(p.purchasePrice) }] : []),
            { label: 'Selling', right: true, render: (p) => inr(p.sellingPrice) },
            { label: 'GST', right: true, render: (p) => `${Number(p.gstPercent)}%` },
            { label: 'Available', right: true, render: (p) => <b>{qty(p.stock.sellable)}</b> },
            { label: 'Reserved', right: true, render: (p) => qty(p.stock.reserved) },
            { label: 'Min', right: true, render: (p) => qty(p.minStockLevel) },
            { label: 'Stock', render: (p) => <Pill status={p.stockState} /> },
            { label: 'Status', render: (p) => <Pill status={p.status} /> },
          ]} />}
      </div>
      <ProductForm open={form} onClose={() => setForm(false)} onSaved={(p) => nav(`/products/${p.id}`)} />
      <Modal open={!!imp} onClose={() => setImp(null)} title="Import result" footer={<button className="btn-primary" onClick={() => setImp(null)}>Done</button>}>
        {imp && <><div className="grid grid-cols-3 gap-3"><Kpi label="Created" value={imp.created} /><Kpi label="Updated (same SKU)" value={imp.updated} /><Kpi label="Errors" value={imp.errors.length} tone={imp.errors.length ? 'bad' : 'default'} /></div>
          {imp.errors.length > 0 && <div className="max-h-48 overflow-y-auto rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{imp.errors.map((e) => <div key={e}>{e}</div>)}</div>}
          <div className="text-xs text-ink-muted">CSV columns: name, sku, barcode, category, subcategory, unit, packSize, purchasePrice, sellingPrice, gstPercent, minStockLevel, reorderQty, shelfLifeDays, status, description. Export once to get a ready template.</div></>}
      </Modal>
    </div>
  );
}

export function ProductDetail() {
  const { id } = useParams();
  const { can } = useAuth();
  const act = useAction();
  const { data: p, error, reload } = useApi(`/products/${id}`);
  const [edit, setEdit] = useState(false);
  const [tab, setTab] = useState('batches');
  if (error) return <ErrorBox error={error} />;
  if (!p) return <Spinner />;
  const s = p.stock;
  const uploadImg = (file) => { const form = new FormData(); form.append('image', file); act(() => api(`/products/${p.id}/image`, { method: 'POST', form }), 'Image uploaded', reload); };
  const archive = () => { const ok = p.status === 'ARCHIVED' || window.confirm(`Archive ${p.name}? It will be hidden from lists and can't be ordered. History is kept.`); if (ok) act(() => api(`/products/${p.id}/archive`, { method: 'POST', body: { archive: p.status !== 'ARCHIVED', force: true } }), p.status === 'ARCHIVED' ? 'Restored' : 'Archived', reload); };
  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"><ArrowLeft className="h-4 w-4" />Products</Link>
      <div className="card flex flex-wrap items-start gap-5 p-5">
        <label className={`relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream ${can('product.manage') ? 'cursor-pointer' : ''}`}>
          {p.imageUrl ? <img src={p.imageUrl} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-8 w-8 text-ink-muted" />}
          {can('product.manage') && <><span className="absolute bottom-0 w-full bg-charcoal/70 py-0.5 text-center text-[10px] text-white">Change</span><input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadImg(e.target.files[0])} /></>}
        </label>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">{p.productCode} · SKU {p.sku}{p.barcode && ` · ${p.barcode}`} <Pill status={p.status} /><Pill status={p.stockState} /></div>
          <h1 className="mt-1 font-display text-2xl font-extrabold">{p.name}</h1>
          <div className="text-sm text-ink-muted">{p.category.name}{p.subcategory && ` › ${p.subcategory.name}`} · {p.unit}{p.packSize && ` (${p.packSize})`} · GST {Number(p.gstPercent)}%{p.preferredSupplier && ` · Preferred: ${p.preferredSupplier.name}`}</div>
          {p.description && <p className="mt-2 max-w-3xl text-sm">{p.description}</p>}
          {p.websiteProductId && <div className="mt-1 text-xs text-ink-muted">🌐 Linked to website product {p.websiteProductId}{p.lastSyncedAt && ` · synced ${fdatetime(p.lastSyncedAt)}`}</div>}
        </div>
        <div className="flex gap-2">
          {can('product.manage') && <button className="btn-ghost" onClick={() => setEdit(true)}><Pencil className="h-4 w-4" />Edit</button>}
          {can('product.manage') && <button className="btn-ghost" onClick={archive}>{p.status === 'ARCHIVED' ? <><ArchiveRestore className="h-4 w-4" />Restore</> : <><Archive className="h-4 w-4" />Archive</>}</button>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 xl:grid-cols-10">
        {[['Opening', s.opening], ['Purchased', s.purchased], ['Sold', s.sold], ['Reserved', s.reserved], ['Available', s.sellable], ['Damaged', s.damaged], ['Expired', s.expired], ['Returned', s.returned], ['Adjusted', s.adjusted]].map(([l, v]) => <Kpi key={l} label={l} value={qty(v)} tone={l === 'Available' ? 'brand' : l === 'Expired' && v > 0 ? 'bad' : 'default'} />)}
        <Kpi label="Stock value" value={can('finance.view') ? inr(s.value, true) : '—'} tone="dark" />
      </div>
      <Tabs value={tab} onChange={setTab} items={[['batches', 'Batches (FEFO order)', p.batches.length], ['warehouses', 'By warehouse', p.balances.length], ['movements', 'Stock movements', p.movements.length], ['suppliers', 'Suppliers', p.suppliers.length]]} />
      <div className="card">
        {tab === 'batches' && <Table rows={p.batches} columns={[{ label: 'Batch', render: (b) => <span className="font-mono text-xs">{b.batchCode}</span> }, { label: 'Warehouse', render: (b) => b.warehouse.name }, { label: 'Supplier', render: (b) => b.supplier?.name || '—' }, { label: 'Mfg', render: (b) => fdate(b.mfgDate) }, { label: 'Expiry', render: (b) => <span className={b.expiryDate && new Date(b.expiryDate) < new Date() ? 'font-semibold text-rose-600' : ''}>{fdate(b.expiryDate)}</span> }, { label: 'Received', right: true, render: (b) => qty(b.receivedQty) }, { label: 'Available', right: true, render: (b) => <b>{qty(b.availableQty)}</b> }, { label: 'Reserved', right: true, render: (b) => qty(b.reservedQty) }, { label: 'Damaged', right: true, render: (b) => qty(b.damagedQty) }, { label: 'Quality', render: (b) => <Pill status={b.qualityStatus} /> }]} empty={<Empty title="No batches yet" text="Stock arrives through Goods Received or an approved opening-stock adjustment." />} />}
        {tab === 'warehouses' && <Table rows={p.balances} minWidth={500} columns={[{ label: 'Warehouse', render: (b) => b.warehouse.name }, { label: 'Available', right: true, render: (b) => qty(b.availableQty, p.unit) }, { label: 'Reserved', right: true, render: (b) => qty(b.reservedQty, p.unit) }, { label: 'Damaged', right: true, render: (b) => qty(b.damagedQty, p.unit) }]} />}
        {tab === 'movements' && <Table rows={p.movements} columns={[{ label: 'When', render: (m) => fdatetime(m.createdAt) }, { label: 'Type', render: (m) => <Pill status={m.type} tone={Number(m.quantity) > 0 ? 'ok' : 'brand'} /> }, { label: 'Bucket', render: (m) => <span className="text-xs">{words(m.bucket)}</span> }, { label: 'Qty', right: true, render: (m) => <b className={Number(m.quantity) > 0 ? 'text-blue-700' : 'text-blue-700'}>{Number(m.quantity) > 0 ? '+' : ''}{qty(m.quantity)}</b> }, { label: 'Batch', render: (m) => <span className="font-mono text-xs">{m.batch?.batchCode}</span> }, { label: 'Warehouse', render: (m) => m.warehouse.name }, { label: 'Reference', render: (m) => m.refNumber || '—' }, { label: 'By', render: (m) => m.userName || '—' }, { label: 'Note', render: (m) => <span className="text-xs text-ink-muted">{m.note}</span> }]} />}
        {tab === 'suppliers' && <Table rows={p.suppliers} rowKey="supplierId" minWidth={400} columns={[{ label: 'Supplier', render: (x) => <Link className="text-blue-700 hover:underline" to={`/suppliers?open=${x.supplier.id}`}>{x.supplier.name}</Link> }, { label: 'Last rate', right: true, render: (x) => (can('finance.view') || can('purchase.view') ? inr(x.lastRate) : '—') }]} />}
      </div>
      <ProductForm open={edit} onClose={() => setEdit(false)} product={p} onSaved={reload} />
    </div>
  );
}

export function Categories() {
  const { can } = useAuth();
  const toast = useToast();
  const { data, reload } = useApi('/categories');
  const [form, setForm] = useState(null);
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader icon={Tags} eyebrow="Catalogue" title="Categories" subtitle="Arshith Fresh categories and subcategories. Add more any time."
        actions={can('category.manage') && <button className="btn-primary" onClick={() => setForm({ parentId: '' })}><Plus className="h-4 w-4" />Add Category</button>} />
      {!data ? <Spinner /> : (
        <div className="grid gap-4 md:grid-cols-2">{data.map((c) => (
          <div key={c.id} className="card p-5">
            <div className="flex items-center justify-between"><div><div className="font-display text-lg font-bold">{c.name}</div><div className="text-xs text-ink-muted">{c.productCount} product(s){!c.isActive && ' · inactive'}</div></div>
              {can('category.manage') && <div className="flex gap-1"><button className="btn-ghost btn-sm" onClick={() => setForm({ parentId: c.id })}><Plus className="h-3.5 w-3.5" />Sub</button><button className="btn-ghost btn-sm" onClick={() => setForm({ id: c.id, name: c.name, isActive: c.isActive })}><Pencil className="h-3.5 w-3.5" /></button></div>}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">{c.children.length === 0 ? <span className="text-xs text-ink-muted">No subcategories</span> : c.children.map((s) => <button key={s.id} disabled={!can('category.manage')} onClick={() => setForm({ id: s.id, name: s.name, isActive: s.isActive })} className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium hover:bg-blue-50">{s.name} <span className="text-ink-muted">({s.productCount})</span></button>)}</div>
          </div>
        ))}</div>
      )}
      <FormModal open={!!form} size="sm" onClose={() => setForm(null)} title={form?.id ? 'Edit category' : form?.parentId ? 'Add subcategory' : 'Add category'} initial={{ name: form?.name || '', isActive: form?.isActive ?? true }}
        fields={[['name', 'Name', 'text', null, { required: true, full: true }], form?.id && ['isActive', 'Active', 'checkbox']]}
        onSubmit={async (f) => { form.id ? await api(`/categories/${form.id}`, { method: 'PUT', body: f }) : await api('/categories', { method: 'POST', body: { name: f.name, parentId: form.parentId || null } }); toast('Saved'); reload(); }} />
    </div>
  );
}

export function Suppliers() {
  const { can } = useAuth();
  const toast = useToast();
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = useState('');
  const { data, reload } = useApi(`/suppliers${qs({ q, active: 'all' })}`);
  const { data: prods } = useApi('/products');
  const [form, setForm] = useState(null);
  const openId = sp.get('open');
  const { data: detail } = useApi(openId ? `/suppliers/${openId}` : null, [openId]);
  const fin = can('finance.view') || can('purchase.create');
  const blank = { name: '', companyName: '', contactPerson: '', phone: '', email: '', gstin: '', address: '', city: '', state: '', paymentTerms: 'Net 30', isActive: true, bankName: '', bankAccountNo: '', bankIfsc: '', upiId: '', productIds: [] };
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader icon={Truck} eyebrow="Catalogue" title="Suppliers" subtitle="Supplier database with purchase value, outstanding payments and performance. Bank details are visible only to Finance / Super Admin."
        actions={can('supplier.manage') && <button className="btn-primary" onClick={() => setForm(blank)}><Plus className="h-4 w-4" />Add Supplier</button>} />
      <div className="mb-4"><SearchBox value={q} onChange={setQ} placeholder="Name, company, supplier ID or GSTIN…" /></div>
      <div className="card">
        {!data ? <Spinner /> : <Table rows={data} onRowClick={(s) => setSp({ open: s.id })} minWidth={1100} empty={<Empty icon={Truck} title="No suppliers yet" />}
          columns={[
            { label: 'Supplier', render: (s) => <div><div className="font-semibold">{s.name}</div><div className="text-[11px] text-ink-muted">{s.supplierCode}{s.companyName && ` · ${s.companyName}`}</div></div> },
            { label: 'Contact', render: (s) => <div className="text-xs">{s.contactPerson || '—'}<div className="text-ink-muted">{s.phone} {s.email}</div></div> },
            { label: 'GSTIN', render: (s) => <span className="font-mono text-xs">{s.gstin || '—'}</span> },
            { label: 'Products', render: (s) => <span className="text-xs">{(s.products || []).length ? s.products.slice(0, 3).map((x) => x.product?.name || x.name || 'Product').join(', ') + (s.products.length > 3 ? ` +${s.products.length - 3}` : '') : '—'}</span> },
            { label: 'Terms', render: (s) => <span className="text-xs">{s.paymentTerms || '—'}</span> },
            ...(fin ? [{ label: 'Purchase value', right: true, render: (s) => inr(s.totals?.purchaseValue) }, { label: 'Pending', right: true, render: (s) => <b className={s.totals?.pending > 0 ? 'text-blue-700' : ''}>{inr(s.totals?.pending)}</b> }] : []),
            { label: 'Status', render: (s) => <Pill status={s.isActive ? 'ACTIVE' : 'INACTIVE'} /> },
          ]} />}
      </div>
      <Modal open={!!openId} onClose={() => setSp({})} size="xl" title={detail?.name || 'Supplier'} subtitle={detail && `${detail.supplierCode || ''} · ${detail.companyName || ''}`}
        footer={<>{can('supplier.manage') && detail && <button className="btn-ghost" onClick={() => { setForm({ ...blank, ...Object.fromEntries(Object.entries(detail).filter(([k]) => k in blank).map(([k, v]) => [k, v ?? ''])), id: detail.id, productIds: (detail.products || []).map((x) => x.productId || x.id) }); }}><Pencil className="h-4 w-4" />Edit</button>}<button className="btn-primary" onClick={() => setSp({})}>Close</button></>}>
        {!detail ? <Spinner /> : <>
          <div className="grid gap-3 md:grid-cols-4">
            <Kpi label="Purchase value" value={inr(detail.totals?.purchaseValue, true)} sub="goods received incl. GST" />
            <Kpi label="Paid" value={inr(detail.totals?.paid, true)} />
            <Kpi label="Outstanding" value={inr(detail.totals?.pending, true)} tone={detail.totals?.pending > 0 ? 'brand' : 'default'} />
            <Kpi label="Purchase orders" value={detail.performance?.orders || 0} />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[['Fill rate', detail.performance?.fillRate, 'received vs ordered'], ['Damage rate', detail.performance?.damageRate, 'damaged on receipt'], ['On-time delivery', detail.performance?.onTimeRate, 'GRN by expected date']].map(([l, v, sub]) => <div key={l} className="rounded-2xl bg-cream p-4"><div className="flex items-center gap-1 text-xs font-semibold text-ink-muted"><Star className="h-3.5 w-3.5 text-blue-600" />{l}</div><div className="font-display text-2xl font-extrabold">{v == null ? '—' : `${v}%`}</div><div className="text-[11px] text-ink-muted">{sub}</div></div>)}
          </div>
          <div className="grid gap-3 text-sm md:grid-cols-3">
            <div><div className="eyebrow">Contact</div>{detail.contactPerson || '—'}<br />{detail.phone || ''}<br />{detail.email || ''}</div>
            <div><div className="eyebrow">Address & GSTIN</div>{[detail.address, detail.city, detail.state].filter(Boolean).join(', ') || '—'}<br /><span className="font-mono text-xs">{detail.gstin || ''}</span></div>
            <div><div className="eyebrow">Bank / payment {detail.bankRestricted && '(restricted)'}</div>{detail.bankName || '—'}<br />A/c {detail.bankAccountNo || '—'} · IFSC {detail.bankIfsc || '—'}<br />UPI {detail.upiId || '—'}</div>
          </div>
          <div><div className="eyebrow mb-2">Purchase history</div>
            <Table rows={detail.purchaseOrders || []} minWidth={600} columns={[{ label: 'PO', render: (p) => <Link className="font-medium text-blue-700 hover:underline" to={`/purchases/${p.id}`}>{p.poNumber}</Link> }, { label: 'Date', render: (p) => fdate(p.orderDate) }, { label: 'Status', render: (p) => <Pill status={p.status} /> }, { label: 'Total', right: true, render: (p) => inr(p.totalAmount) }]} empty={<div className="text-sm text-ink-muted">No purchase orders yet.</div>} />
          </div>
        </>}
      </Modal>
      <FormModal open={!!form} onClose={() => setForm(null)} size="lg" title={form?.id ? 'Edit supplier' : 'Add supplier'} initial={form}
        fields={[['name', 'Supplier name', 'text', null, { required: true }], ['companyName', 'Company name'], ['contactPerson', 'Contact person'], ['phone', 'Phone'], ['email', 'Email', 'email'], ['gstin', 'GSTIN', 'text', null, { hint: '15 characters, e.g. 37ABCDE1234F1Z5' }], ['address', 'Address', 'text', null, { full: true }], ['city', 'City'], ['state', 'State'], ['paymentTerms', 'Payment terms', 'select', ['Advance', 'On delivery', 'Net 7', 'Net 15', 'Net 30', 'Net 45', 'Net 60'].map((x) => [x, x])], ['isActive', 'Active', 'checkbox'],
          ...(can('supplier.bank') ? [['bankName', 'Bank name'], ['bankAccountNo', 'Account number'], ['bankIfsc', 'IFSC'], ['upiId', 'UPI ID']] : []),
          ['productIds', 'Products supplied (Ctrl/Cmd-click for many)', 'multiselect', (prods || []).map((p) => [p.id, p.name]), { full: true }]]}
        onSubmit={async (f) => { form.id ? await api(`/suppliers/${form.id}`, { method: 'PUT', body: f }) : await api('/suppliers', { method: 'POST', body: f }); toast('Supplier saved'); reload(); }} />
    </div>
  );
}
