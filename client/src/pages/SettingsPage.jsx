import React, { useState } from 'react';
import { Settings, Save, Shield, Database, BellRing } from 'lucide-react';

export const SettingsPage = () => {
  const [budgetThreshold, setBudgetThreshold] = useState(80);
  const [currency, setCurrency] = useState('INR (₹)');
  const [overdueAlertDays, setOverdueAlertDays] = useState(7);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto text-xs">
      <div>
        <div className="flex items-center gap-2 text-xs text-[#7C8998] mb-1 font-medium">
          <span>Atmosphere</span>
          <span>&rsaquo;</span>
          <span>System</span>
          <span>&rsaquo;</span>
          <span className="text-[#253142] font-semibold">Settings</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#253142] tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#2563EB]" /> Enterprise Portfolio Settings & Rules
        </h1>
        <p className="text-xs text-[#7C8998] mt-0.5">
          Configure financial alert thresholds, project ID numbering schemas, and notification triggers.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/10 text-emerald-800 border border-emerald-200 rounded-2xl font-semibold">
          Configuration parameters updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#F4F7FA] rounded-3xl border border-[#DDE4EC] p-6 space-y-5 shadow-atmo-card">
        <div>
          <h3 className="font-bold text-[#253142] uppercase font-mono text-xs mb-3">
            Financial & Budget Governance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#253142] font-semibold mb-1">
                Budget Warning Alert Threshold (%)
              </label>
              <input
                type="number"
                value={budgetThreshold}
                onChange={(e) => setBudgetThreshold(e.target.value)}
                className="w-full p-2.5 border border-[#DDE4EC] rounded-xl bg-[#E8EDF3]/70 focus:bg-white focus:border-[#2563EB] text-[#253142] text-xs font-mono shadow-atmo-well outline-none"
              />
              <p className="text-[10px] text-[#7C8998] mt-1">
                Triggers automatic warning notifications when project spend reaches this % of approved budget.
              </p>
            </div>

            <div>
              <label className="block text-[#253142] font-semibold mb-1">Portfolio Base Currency</label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full p-2.5 border border-[#DDE4EC] rounded-xl bg-[#E8EDF3] text-[#7C8998] text-xs font-mono font-bold shadow-atmo-well"
              />
              <p className="text-[10px] text-[#7C8998] mt-1">Fixed base currency for Arshith Infotech India.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#DDE4EC]">
          <h3 className="font-bold text-[#253142] uppercase font-mono text-xs mb-3">
            Deadline & Escalation Monitoring
          </h3>
          <div>
            <label className="block text-[#253142] font-semibold mb-1">Upcoming Deadline Notice (Days)</label>
            <input
              type="number"
              value={overdueAlertDays}
              onChange={(e) => setOverdueAlertDays(e.target.value)}
              className="w-48 p-2.5 border border-[#DDE4EC] rounded-xl bg-[#E8EDF3]/70 focus:bg-white focus:border-[#2563EB] text-[#253142] text-xs font-mono shadow-atmo-well outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#DDE4EC] flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-2xl shadow-md shadow-blue-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

