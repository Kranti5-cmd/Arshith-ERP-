import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, ArrowRight, Loader2, PackageCheck, CalendarClock, Truck } from 'lucide-react';
import { useAuth } from '../lib/auth.jsx';
import { ErrorBox } from '../components/ui.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  if (user) return <Navigate to="/" replace />;
  const submit = async (e) => { e.preventDefault(); setBusy(true); setError(null); try { await login(email, password); nav('/'); } catch (err) { setError(err); } finally { setBusy(false); } };
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-charcoal p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500"><Leaf className="h-6 w-6" /></div><div className="font-display text-xl font-extrabold">Arshith <span className="text-orange-400">Fresh</span></div></div>
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">Inventory & Supply Chain</div>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight">From farm-gate purchase<br />to customer doorstep.</h1>
          <div className="mt-8 space-y-3 text-sm text-[#CFCAC0]">
            {[[Truck, 'Supplier purchases, approvals & GRN'], [CalendarClock, 'Batch-wise expiry with FEFO dispatch'], [PackageCheck, 'Live stock synced with arshithfresh.com orders']].map(([I, t]) => <div key={t} className="flex items-center gap-3"><span className="rounded-xl bg-white/5 p-2 text-orange-400"><I className="h-4 w-4" /></span>{t}</div>)}
          </div>
        </div>
        <div className="relative text-xs text-[#8F8A80]">Arshith Fresh India Pvt. Ltd.</div>
      </div>
      <div className="flex items-center justify-center bg-cream p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <div className="lg:hidden flex items-center gap-2 font-display text-xl font-extrabold"><Leaf className="h-6 w-6 text-blue-600" />Arshith Fresh</div>
          <div><h2 className="font-display text-2xl font-extrabold">Sign in</h2><p className="text-sm text-ink-muted">Inventory Control Center</p></div>
          <ErrorBox error={error} />
          <label className="block"><span className="mb-1 block text-xs font-semibold">Email</span><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" /><input className="input py-2.5 pl-10" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@arshithfresh.com" /></div></label>
          <label className="block"><span className="mb-1 flex justify-between text-xs font-semibold">Password{import.meta.env.DEV && <button type="button" className="font-medium text-blue-600 underline" onClick={() => { setEmail('admin@arshithfresh.com'); setPassword('admin123'); }}>Fill default admin</button>}</span><div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" /><input className="input py-2.5 pl-10" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></div></label>
          <button disabled={busy} className="btn-primary w-full py-3">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}</button>
          {import.meta.env.DEV && <div className="rounded-xl bg-white p-3 text-center text-xs text-ink-muted">Dev login: <b className="text-ink">admin@arshithfresh.com</b> / <b className="text-ink">admin123</b></div>}
        </form>
      </div>
    </div>
  );
}
