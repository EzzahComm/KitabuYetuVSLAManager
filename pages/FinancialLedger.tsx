
import React, { useState, useMemo } from 'react';
import { AppState, TransactionType, Transaction } from '../types';

interface LedgerProps {
  state: AppState;
  scoped: any;
  addTransaction: (tx: any) => void;
}

const FinancialLedger: React.FC<LedgerProps> = ({ state, scoped, addTransaction }) => {
  const [form, setForm] = useState({
    memberId: '',
    type: TransactionType.SAVINGS,
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showHistoryForm, setShowHistoryForm] = useState(false);

  const activeCycle = state.cycles.find(c => c.isActive && scoped.vslas.some((v:any) => v.id === c.vslaId));

  const filteredTransactions = useMemo(() => {
    return scoped.transactions.filter((t: Transaction) => {
      const member = scoped.members.find((m:any) => m.id === t.memberId);
      const memberName = member ? `${member.firstName} ${member.lastName}`.toLowerCase() : '';
      const matchesSearch = memberName.includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'ALL' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [scoped.transactions, searchQuery, filterType, scoped.members]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.memberId || !form.amount) return;
    
    const member = scoped.members.find((m:any) => m.id === form.memberId);
    
    addTransaction({
      vslaId: member.vslaId,
      cycleId: activeCycle?.id || 'default',
      memberId: form.memberId,
      type: form.type,
      amount: parseFloat(form.amount),
      date: form.date,
      description: form.description,
      recordedBy: state.currentUser?.id
    });

    setForm({ memberId: '', type: TransactionType.SAVINGS, amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    setShowHistoryForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Financial Ledger</h1>
          <p className="text-slate-500 font-medium">Verified audit trail of all capital movement within groups.</p>
        </div>
        <button 
          onClick={() => setShowHistoryForm(!showHistoryForm)}
          className="px-6 py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
        >
          {showHistoryForm ? 'Cancel Entry' : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg> Add Historical Transaction</>}
        </button>
      </div>

      {showHistoryForm && (
        <div className="bg-white p-8 rounded-2xl border-2 border-slate-900 shadow-xl animate-in zoom-in-95 duration-200">
           <h3 className="text-lg font-black text-slate-800 mb-6">Record Past Transaction</h3>
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Member</label>
                <select 
                  required
                  value={form.memberId}
                  onChange={e => setForm({...form, memberId: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:border-slate-900 outline-none transition-all"
                >
                  <option value="">Select...</option>
                  {scoped.members.map((m:any) => (
                    <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Type</label>
                <select 
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value as TransactionType})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:border-slate-900 outline-none transition-all"
                >
                  {Object.values(TransactionType).map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Amount & Date</label>
                <div className="flex gap-2">
                   <input 
                    type="number"
                    required
                    value={form.amount}
                    onChange={e => setForm({...form, amount: e.target.value})}
                    placeholder="KES"
                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold focus:border-slate-900 outline-none transition-all"
                  />
                  <input 
                    type="date"
                    required
                    value={form.date}
                    onChange={e => setForm({...form, date: e.target.value})}
                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-xs font-bold focus:border-slate-900 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-slate-900 text-white font-black py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                  Save Entry
                </button>
              </div>
           </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1">
             <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
             <input 
              placeholder="Search member or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-slate-900 transition-all"
             />
          </div>
          <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="w-full md:w-48 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-slate-900 transition-all"
          >
            <option value="ALL">All Categories</option>
            {Object.values(TransactionType).map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase">
              <tr>
                <th className="px-6 py-4">Effective Date</th>
                <th className="px-6 py-4">Member Profiling</th>
                <th className="px-6 py-4">Transaction Class</th>
                <th className="px-6 py-4 text-right">Settled Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((t: Transaction) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                       <span className="font-bold text-slate-800">{t.date}</span>
                       <span className="text-[9px] text-slate-400 uppercase font-black">Audit Locked</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-slate-800">
                      {scoped.members.find((m:any) => m.id === t.memberId)?.firstName} {scoped.members.find((m:any) => m.id === t.memberId)?.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400 italic">Ref: {t.description || 'System entry'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                      t.type === TransactionType.SAVINGS ? 'bg-emerald-100 text-emerald-700' :
                      t.type === TransactionType.LOAN_ISSUE ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {t.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-800">
                    KES {t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest">
                    No matching transactions in this ledger view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialLedger;
