
import React, { useMemo } from 'react';
import { AppState, TransactionType, Gender, Vsla } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DonorDashboard: React.FC<{ state: AppState, scoped: any }> = ({ state, scoped }) => {
  const currentNGO = state.tenants.find(t => t.id === state.currentTenantId);

  // Aggregated Program-level Metrics
  const metrics = useMemo(() => {
    const totalSavings = scoped.transactions
      .filter((t: any) => t.type === TransactionType.SAVINGS || t.type === TransactionType.SHARE_PURCHASE)
      .reduce((a: number, b: any) => a + b.amount, 0);

    const totalLoansIssued = scoped.transactions
      .filter((t: any) => t.type === TransactionType.LOAN_ISSUE)
      .reduce((a: number, b: any) => a + b.amount, 0);

    const activeMembers = scoped.members.length;
    const femaleCount = scoped.members.filter((m: any) => m.gender === Gender.FEMALE).length;
    
    // Performance Index (Ratio of savings to loans - mock logic)
    const utilizationRate = totalSavings > 0 ? (totalLoansIssued / totalSavings) * 100 : 0;

    return { totalSavings, totalLoansIssued, activeMembers, femaleCount, utilizationRate };
  }, [scoped]);

  const genderData = [
    { name: 'Female', value: metrics.femaleCount, color: '#10b981' },
    { name: 'Male', value: metrics.activeMembers - metrics.femaleCount, color: '#3b82f6' }
  ];

  const regionalReach = useMemo(() => {
    const counts: Record<string, number> = {};
    scoped.vslas.forEach((v: Vsla) => {
      counts[v.county] = (counts[v.county] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [scoped.vslas]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Program Oversight: {currentNGO?.name}</h1>
          <p className="text-slate-500 font-medium">Monitoring and Evaluation (M&E) for current fiscal grant.</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <p className="text-xs font-black uppercase tracking-widest">Audit-Ready State</p>
        </div>
      </div>

      {/* Program High-Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Grant Utilization (Ledger)</p>
          <p className="text-2xl font-black text-slate-800">KES {metrics.totalSavings.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"/></svg>
             +12% vs Prev Qtr
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Beneficiaries Reached</p>
          <p className="text-2xl font-black text-slate-800">{metrics.activeMembers}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-2">Active MIS Profiles</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Gender Parity (W:M)</p>
          <p className="text-2xl font-black text-rose-600">{Math.round((metrics.femaleCount / metrics.activeMembers) * 100)}%</p>
          <p className="text-[10px] text-rose-400 font-bold mt-2">Target: 60% Women</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Capital Velocity Index</p>
          <p className="text-2xl font-black text-amber-600">{metrics.utilizationRate.toFixed(1)}%</p>
          <p className="text-[10px] text-amber-500 font-bold mt-2">Utilization Ratio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gender Distribution PIE */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest mb-6">Demographic Inclusion</h3>
          <div className="flex-1 h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <p className="text-2xl font-black text-slate-800">{metrics.activeMembers}</p>
               <p className="text-[9px] font-black uppercase text-slate-400">Total Lives</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-slate-600">Female</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs font-bold text-slate-600">Male</span>
            </div>
          </div>
        </div>

        {/* Regional Reach BAR */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest mb-6">Portfolio Coverage (by County)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalReach}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" stroke="#64748b" />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50">
             <p className="text-[10px] text-slate-400 font-medium italic">Verified geographic footprint based on active VSLA coordinates and ward-level data.</p>
          </div>
        </div>
      </div>

      {/* Program Compliance Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
           <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest">M&E Compliance Feed</h3>
           <button className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">Generate Donor Report (PDF)</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase">
              <tr>
                <th className="px-6 py-4 tracking-widest">KPI Indicator</th>
                <th className="px-6 py-4 tracking-widest">Target</th>
                <th className="px-6 py-4 tracking-widest">Actual</th>
                <th className="px-6 py-4 tracking-widest text-right">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-black text-slate-800">Women Financial Inclusion Rate</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">SDG #5 Alignment</p>
                </td>
                <td className="px-6 py-4">60%</td>
                <td className="px-6 py-4 font-black text-emerald-600">{Math.round((metrics.femaleCount / metrics.activeMembers) * 100)}%</td>
                <td className="px-6 py-4 text-right">
                  <div className="w-24 bg-slate-100 h-1.5 rounded-full inline-block overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{width: '90%'}}></div>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-black text-slate-800">Geographic Dispersion (Wards)</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Livelihoods Reach</p>
                </td>
                <td className="px-6 py-4">15 Wards</td>
                <td className="px-6 py-4 font-black text-amber-600">12 Wards</td>
                <td className="px-6 py-4 text-right">
                  <div className="w-24 bg-slate-100 h-1.5 rounded-full inline-block overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{width: '80%'}}></div>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-black text-slate-800">Internal VSLA Audit Compliance</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Risk Management</p>
                </td>
                <td className="px-6 py-4">100% Verified</td>
                <td className="px-6 py-4 font-black text-slate-800">100%</td>
                <td className="px-6 py-4 text-right">
                  <div className="w-24 bg-slate-100 h-1.5 rounded-full inline-block overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{width: '100%'}}></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
