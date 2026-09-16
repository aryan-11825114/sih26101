import React from 'react';

export const StatusBadge: React.FC<{ status: string; children?: React.ReactNode }> = ({ status, children }) => {
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
      {children || status}
    </span>
  );
};

export const StatCard: React.FC<{ title: string; value: string | number; subtitle?: string }> = ({ title, value, subtitle }) => {
  return (
    <div className="bg-[#0B132B] border border-[#1E2964] rounded-2xl p-5 shadow-xl space-y-1">
      <h4 className="text-xs font-semibold text-slate-400">{title}</h4>
      <div className="text-2xl font-black text-white">{value}</div>
      {subtitle && <p className="text-[10px] text-slate-500">{subtitle}</p>}
    </div>
  );
};
