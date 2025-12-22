
import React from 'react';
import { AppState, Vsla, TransactionType, Role, Gender } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC<{ state: AppState, scoped: any }> = ({ state, scoped }) => {
  const f = scoped.financials;
  const isVslaOfficer = state.currentUser?.role === Role.VSLA_OFFICER;

  const activeMembers = scoped.members.length;
  const femaleMembers = scoped.members.filter((m: any) => m.gender === Gender.FEMALE).length;
  const inclusionRate = activeMembers > 0 ? (femaleMembers / activeMembers) * 100 : 0;

  // Mock Livelihood Resilience Score based on metrics
  const resilienceScore = activeMembers > 0 ? Math.min(100, (f.savings / (activeMembers * 500)) * 50 + (inclusionRate * 0.5)) : 0;

  const stats = [
    { label: 'Total Portfolio Savings', val: `KES ${f.savings.toLocaleString()}`, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '💰' },
    { label: 'Liquidity Available', val: `KES ${f.availableCash.toLocaleString()}`, color: 'text-slate-800', bg: 'bg-slate-50', icon: '🏦' },
    { label: 'Female Participation', val: `${inclusionRate.toFixed(1)}%`, color: 'text-rose-600', bg: 'bg-rose-50', icon: '👩' },
    { label: 'Capital Outstanding', val: `KES ${f.outstandingLoanPrincipal.toLocaleString()}`, color: 'text-amber-600', bg: 'bg-amber-50', icon: '📉' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {isVslaOfficer ? 'Group Operations' : 'Program Intelligence'}
          </h1>
          <p className="text-slate-500 font-medium">
            {isVslaOfficer 
              ? `Real-time health monitoring for your association.` 
              : `Institutional oversight for ${scoped.vslas.length} associations.`}
          </p>
        </div>
        {!isVslaOfficer && (
          <div className="flex gap-3">
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
               Quarterly Export
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] border border-slate-100 shadow-sm ${s.bg} transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group`}>
            <div className="absolute -right-2 -bottom-2 text-5xl opacity-5 group-hover:scale-110 transition-transform">{s.icon}</div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 relative z-10">{s.label}</p>
            <p className={`text-3xl font-black ${s.color} relative z-10 tracking-tight`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Livelihood Capital Velocity
              </h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Cumulative growth in program equity</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth vs Target</span>
              <p className="text-sm font-black text-emerald-600">+14.2%</p>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoped.transactions.slice(-20)}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={10} fontWeight="black" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorSavings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden border border-slate-800 h-1/2">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]"></div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-4">Resilience Score</p>
                 <h3 className="text-6xl font-black mb-1 tracking-tighter">{resilienceScore.toFixed(0)}<span className="text-2xl text-slate-500">/100</span></h3>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Program-wide Safety Index</p>
              </div>
              <div className="pt-6 border-t border-slate-800 space-y-4 relative z-10">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    <span>Low Risk</span>
                    <span>High Resilience</span>
                 </div>
                 <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{width: `${resilienceScore}%`}}></div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between h-[calc(50%-2rem)]">
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">M&E Monitoring</p>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-700">Audit Compliance</span>
                       <span className="text-xs font-black text-emerald-600">100%</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-700">Reporting Frequency</span>
                       <span className="text-xs font-black text-slate-900">Weekly</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-700">Active IGPs</span>
                       <span className="text-xs font-black text-slate-900">{scoped.projects.length}</span>
                    </div>
                 </div>
              </div>
              <button className="w-full bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100">Audit Center →</button>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
          <div>
            <h3 className="text-sm font-black uppercase text-slate-800 tracking-widest">Institutional Portfolio Matrix</h3>
            <p className="text-xs text-slate-400 font-bold mt-1">Full operational oversight of associations</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase">
              <tr>
                <th className="px-10 py-5">Association Identity</th>
                <th className="px-10 py-5">Engagement</th>
                <th className="px-10 py-5">Portfolio Value</th>
                <th className="px-10 py-5">Loan Utilization</th>
                <th className="px-10 py-5 text-right">Operational State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {scoped.vslas.map((v: Vsla) => {
                const members = scoped.members.filter((m: any) => m.vslaId === v.id).length;
                const savings = scoped.transactions
                  .filter((t: any) => t.vslaId === v.id && (t.type === TransactionType.SAVINGS || t.type === TransactionType.SHARE_PURCHASE))
                  .reduce((a: number, b: any) => a + b.amount, 0);
                const loans = scoped.loans
                  .filter((l: any) => l.vslaId === v.id && l.status === 'Active')
                  .reduce((a: number, b: any) => a + b.remainingPrincipal, 0);
                const util = savings > 0 ? (loans / savings) * 100 : 0;

                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-10 py-6">
                      <p className="font-black text-slate-900 text-base tracking-tight group-hover:text-emerald-600 transition-colors">{v.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{v.village} • {v.county}</p>
                    </td>
                    <td className="px-10 py-6">
                      <p className="font-bold text-slate-700">{members} Profiles</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase">Active Members</p>
                    </td>
                    <td className="px-10 py-6">
                      <p className="font-black text-slate-900">KES {savings.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase">Savings Equity</p>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                            <div className={`h-full ${util > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{width: `${Math.min(100, util)}%`}}></div>
                         </div>
                         <span className="text-[10px] font-black text-slate-400">{util.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase border shadow-sm ${v.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                          {v.status}
                       </span>
                    </td>
                  </tr>
                );
              })}
              {scoped.vslas.length === 0 && (
                <tr><td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-black uppercase tracking-widest opacity-40">No active associations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
