import React, { useState } from 'react';
import { Layers, Shield, Lock, Mail, ArrowRight, AlertCircle, Building2, GraduationCap, ChevronDown, Leaf, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const [company, setCompany] = useState('arshith');
  const [email, setEmail] = useState('admin@arshithgroup.com');
  const [password, setPassword] = useState('ArshithInventory');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompanyChange = (newCompany) => {
    setCompany(newCompany);
    setError('');
    if (newCompany === 'arshith') {
      setEmail('admin@arshithgroup.com');
      setPassword('ArshithInventory');
    } else if (newCompany === 'codelekho') {
      setEmail('admin@codelekho.com');
      setPassword('CodeLekho2026');
    } else if (newCompany === 'arshithfresh') {
      setEmail('admin@arshithfresh.com');
      setPassword('admin123');
    }
  };

  const handleFillAdminCredentials = () => {
    if (company === 'arshith') {
      setEmail('admin@arshithgroup.com');
      setPassword('ArshithInventory');
    } else if (company === 'codelekho') {
      setEmail('admin@codelekho.com');
      setPassword('CodeLekho2026');
    } else if (company === 'arshithfresh') {
      setEmail('admin@arshithfresh.com');
      setPassword('admin123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password, company);
      if (!res.success) {
        setError(res.message || 'Invalid administrator credentials for the selected company.');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate administrator.');
    } finally {
      setLoading(false);
    }
  };

  const isArshith = company === 'arshith';
  const isCodeLekho = company === 'codelekho';
  const isFresh = company === 'arshithfresh';

  const companyName = isArshith
    ? 'Arshith Infotech'
    : isCodeLekho
      ? 'CodeLekho ERP'
      : 'Arshith Fresh IMS';

  return (
    <div className="min-h-screen w-screen bg-[#E8EDF3] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">

      {/* Atmosphere Soft Card Container */}
      <div className="max-w-md w-full bg-[#F4F7FA] rounded-3xl shadow-atmo-card-lg border border-[#DDE4EC] overflow-hidden relative z-10 p-8 space-y-6">

        {/* Atmosphere Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-blue-500/25">
            {isArshith ? (
              <Layers className="w-7 h-7" />
            ) : isCodeLekho ? (
              <GraduationCap className="w-7 h-7" />
            ) : (
              <Leaf className="w-7 h-7" />
            )}
          </div>

          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7C8998]">
              Atmosphere Enterprise OS
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#253142]">
              {isArshith ? (
                <>Arshith <span className="text-[#2563EB]">Infotech</span></>
              ) : isCodeLekho ? (
                <>Code<span className="text-[#2563EB]">Lekho</span> <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">CRM</span></>
              ) : (
                <>Arshith <span className="text-[#2563EB]">Fresh</span> <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">IMS</span></>
              )}
            </h1>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DDE4EC] text-[11px] font-semibold text-[#7C8998] shadow-atmo-btn">
            <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Administrator Access Portal</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Selection Dropdown in Recessed Well */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-[#7C8998] uppercase tracking-wider font-mono">
                Organization Scope
              </label>
              <span className="text-[10px] text-[#2563EB] font-semibold">Separate Portals</span>
            </div>
            <div className="relative">
              <Building2 className="w-4 h-4 text-[#7C8998] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={company}
                onChange={(e) => handleCompanyChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-[#E2E8F0] border border-[#DDE4EC] rounded-2xl shadow-atmo-well text-xs text-[#253142] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all cursor-pointer appearance-none"
              >
                <option value="arshith">🏢 Arshith Infotech — Project Portfolio OS</option>
                <option value="codelekho">🎓 CodeLekho — Academic ERP & CRM Hub</option>
                <option value="arshithfresh">🌱 Arshith Fresh — Supply Chain & IMS</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#7C8998] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Email Address in Recessed Well */}
          <div>
            <label className="block text-[11px] font-bold text-[#7C8998] uppercase tracking-wider font-mono mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7C8998] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@arshithgroup.com"
                className="w-full pl-10 pr-3 py-2.5 bg-[#E2E8F0] border border-[#DDE4EC] rounded-2xl shadow-atmo-well text-xs text-[#253142] font-semibold placeholder-[#A0ACBA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
              />
            </div>
          </div>

          {/* Password in Recessed Well */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-[#7C8998] uppercase tracking-wider font-mono">
                Password
              </label>
              <button
                type="button"
                onClick={handleFillAdminCredentials}
                className="text-[10px] text-[#2563EB] hover:text-[#1D4ED8] font-bold underline cursor-pointer"
              >
                Fill Default Credentials
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7C8998] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-[#E2E8F0] border border-[#DDE4EC] rounded-2xl shadow-atmo-well text-xs text-[#253142] font-semibold placeholder-[#A0ACBA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
              />
            </div>
          </div>

          {/* Submit Button (Atmosphere Vibrant Orange) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold tracking-wide uppercase shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{loading ? 'Authenticating...' : `Sign In to ${companyName}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
