import React from 'react';

export const StatCard: React.FC<{ label: string; value: string | number; icon: React.ElementType }> = ({ label, value, icon: Icon }) => (
  <div className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964]">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-indigo-900/30 text-indigo-400"><Icon className="w-4 h-4" /></div>
      <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
    </div>
    <p className="text-xl font-black text-white">{value}</p>
  </div>
);

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    Compliant: 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30',
    'Needs Review': 'bg-amber-900/40 text-amber-300 border border-amber-500/30',
    'In Progress': 'bg-blue-900/40 text-blue-300 border border-blue-500/30',
    Completed: 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30',
    'Pending Approval': 'bg-slate-700/60 text-slate-300 border border-slate-600/30',
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${colors[status] || 'bg-slate-700/60 text-slate-300 border border-slate-600/30'}`}>{status}</span>;
};
