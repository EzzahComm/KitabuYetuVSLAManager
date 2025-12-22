
import React from 'react';
import { AppState, Role, Tenant } from '../types';

interface SuperConsoleProps {
  state: AppState;
  scoped: any;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const SuperConsole: React.FC<SuperConsoleProps> = ({ state, scoped, setState }) => {
  const platformStats = [
    { label: 'Platform Tenants', val: state.tenants.length, icon: '🏢', color: 'text-emerald-600' },
    { label: 'Total Global VSLAs', val: state.vslas.length, icon: '👥', color: 'text-blue-600' },
    { label: 'Total Global Members', val: state.members.length, icon: '🆔', color: 'text-amber-600' },
    { label: 'Total Equity (AUM)', val: `KES ${scoped.financials.savings.toLocaleString()}`, icon: '🌍', color: 'text-slate-900' },
  ];

  const handleDeleteTenant = (id: string) => {
    if (window.confirm("ARE YOU SURE? This will remove the NGO and its association with data from the current view. All related child records remain in DB but are decoupled.")) {
      setState(prev => ({
        ...prev,
        tenants: prev.tenants.filter(t => t.id !== id)
      }));
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Global Control Center</h1>
          <p className="text-slate-500 font-medium mt-1">Institutional oversight and high-level platform governance.</p>
        </div>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-xs font-black uppercase tracking-widest">Polycap: Master Access</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {platformStats.map((s, i) => (
          <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm transition-all hover:shadow-xl group relative overflow-hidden">
            <div className="absolute -right-2 -bottom-2 text-5xl opacity-5 group-hover:scale-110 transition-transform">{s.icon}</div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 relative z-10">{s.label}</p>
            <p className={`text-3xl font-black ${s.color} relative z-10 tracking-tight`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-800 tracking-widest">Tenant Provisioning Ledger</h3>
              <p className="text-xs text-slate-400 font-bold mt-1">Registered NGO and Donor partners.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase">
                <tr>
                  <th className="px-10 py-5">NGO / Identity</th>
                  <th className="px-10 py-5">Contact Node</th>
                  <th className="px-10 py-5">VSLA Capacity</th>
                  <th className="px-10 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {state.tenants.map((t: Tenant) => {
                  const vslaCount = state.vslas.filter(v => v.tenantId === t.id).length;
                  const memberCount = state.members.filter(m => m.tenantId === t.id).length;
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-10 py-6">
                        <p className="font-black text-slate-900 text-base tracking-tight">{t.name}</p>
                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-0.5">{t.slug}</p>
                      </td>
                      <td className="px-10 py-6 text-slate-500 font-bold text-xs">{t.email}</td>
                      <td className="px-10 py-6">
                        <p className="font-black text-slate-900 text-xs">{vslaCount} Groups</p>
                        <p className="text-[10px] text-slate-400 font-bold">{memberCount} Total Members</p>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <button 
                          onClick={() => handleDeleteTenant(t.id)}
                          className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border border-rose-100"
                         >
                           Suspend
                         </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-950 p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-6">System Health Pulse</p>
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Database Sync</span>
                  <span className="text-xs font-black text-emerald-400">99.8% Online</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">SMS Gateway</span>
                  <span className="text-xs font-black text-emerald-400">Functional</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">AI Logic Core</span>
                  <span className="text-xs font-black text-emerald-400">Operational</span>
               </div>
            </div>
            <div className="mt-10 pt-10 border-t border-slate-800">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                     <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  </div>
                  <div>
                     <p className="text-sm font-black text-white tracking-tight">Immutability Locked</p>
                     <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Digital Ledger Security</p>
                  </div>
               </div>
            </div>
          </div>
          <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] mt-8 text-center">Version 1.4.2 Production Node</p>
        </div>
      </div>
    </div>
  );
};

export default SuperConsole;
