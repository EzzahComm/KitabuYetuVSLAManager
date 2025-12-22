
import React, { useState, useMemo } from 'react';
import { AppState, Member, Gender, MemberStatus, TransactionType, LoanStatus } from '../types';
import { ICONS } from '../constants';
import { generateKYID } from '../App';

const MemberManagement: React.FC<{ state: AppState, scoped: any, setState: any, logAudit: any }> = ({ state, scoped, setState, logAudit }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ 
    vslaId: '', 
    first: '', 
    last: '', 
    phone: '', 
    idNum: '', 
    role: 'Member',
    gender: Gender.FEMALE,
    dob: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const existingMember = state.members.find(m => m.nationalId === form.idNum || m.phone === form.phone);
    const memberKyId = existingMember ? existingMember.memberKyId : generateKYID('KYM', state.members.length, 4);
    const membershipId = `mem_${Date.now()}`;

    const newMember: Member = {
      id: membershipId,
      memberKyId,
      tenantId: state.currentTenantId,
      vslaId: form.vslaId,
      firstName: form.first,
      lastName: form.last,
      phone: form.phone,
      nationalId: form.idNum,
      role: form.role as any,
      gender: form.gender,
      status: MemberStatus.ACTIVE,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setState((prev: any) => ({ ...prev, members: [...prev.members, newMember] }));
    logAudit('MEMBER_ENROLL', `Enrolled ${form.first} (${memberKyId}) into VSLA ID ${form.vslaId}`);
    setShowForm(false);
    setForm({ vslaId: '', first: '', last: '', phone: '', idNum: '', role: 'Member', gender: Gender.FEMALE, dob: '' });
  };

  const selectedMember = useMemo(() => {
    if (!selectedMemberId) return null;
    return scoped.members.find((m: Member) => m.id === selectedMemberId);
  }, [selectedMemberId, scoped.members]);

  const memberFinancials = useMemo(() => {
    if (!selectedMemberId) return null;
    const mTx = scoped.transactions.filter((t: any) => t.memberId === selectedMemberId);
    const mLoans = scoped.loans.filter((l: any) => l.memberId === selectedMemberId);
    
    const savings = mTx.filter((t: any) => t.type === TransactionType.SAVINGS || t.type === TransactionType.SHARE_PURCHASE).reduce((a: number, b: any) => a + b.amount, 0);
    const totalBorrowed = mLoans.reduce((a: number, b: any) => a + b.principalAmount, 0);
    const repaidPrincipal = mLoans.reduce((a: number, b: any) => a + b.totalPaidPrincipal, 0);
    const outstandingPrincipal = mLoans.reduce((a: number, b: any) => a + b.remainingPrincipal, 0);
    const outstandingInterest = mLoans.reduce((a: number, b: any) => a + b.remainingInterest, 0);

    // Credit Health Score Logic
    const capacity = savings * 3;
    const debtRatio = capacity > 0 ? (outstandingPrincipal / capacity) * 100 : 0;
    const health = debtRatio > 90 ? 'Critical' : debtRatio > 60 ? 'Strained' : 'Healthy';

    return { savings, totalBorrowed, repaidPrincipal, outstandingPrincipal, outstandingInterest, loans: mLoans, transactions: mTx, capacity, debtRatio, health };
  }, [selectedMemberId, scoped.transactions, scoped.loans]);

  const filteredMembers = useMemo(() => {
    return scoped.members.filter((m: Member) => 
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.nationalId.includes(searchQuery) ||
      m.memberKyId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [scoped.members, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Financial Identities</h1>
          <p className="text-slate-500 font-medium tracking-tight">Verified member profiles and digitized passbooks.</p>
        </div>
        <div className="flex gap-2">
          {selectedMemberId && (
             <button 
              onClick={() => setSelectedMemberId(null)} 
              className="bg-white px-6 py-3 rounded-xl font-black text-slate-500 border border-slate-200 text-xs hover:bg-slate-50 transition-all uppercase tracking-widest"
            >
              Close Profile
            </button>
          )}
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-emerald-600 px-6 py-3 rounded-xl font-black text-white shadow-xl shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
          >
            {showForm ? 'Discard Form' : <><ICONS.Plus className="w-3 h-3" /> Enroll Member</>}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-emerald-500 shadow-2xl animate-in zoom-in-95 duration-200 max-w-4xl">
           <h3 className="text-lg font-black text-slate-800 mb-8 uppercase tracking-widest">Membership Registration</h3>
           <form onSubmit={handleAdd} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">VSLA Association</label>
                  <select required value={form.vslaId} onChange={e => setForm({...form, vslaId: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 text-sm font-bold outline-none focus:border-emerald-500 transition-all">
                    <option value="">Link to group...</option>
                    {scoped.vslas.map((v:any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">First Name</label>
                  <input required placeholder="Legal first name" value={form.first} onChange={e => setForm({...form, first: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 text-sm font-bold outline-none focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Last Name</label>
                  <input required placeholder="Legal surname" value={form.last} onChange={e => setForm({...form, last: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 text-sm font-bold outline-none focus:border-emerald-500 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Phone Number</label>
                  <input required placeholder="07XXXXXXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 text-sm font-bold outline-none focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">National ID</label>
                  <input required placeholder="ID Number" value={form.idNum} onChange={e => setForm({...form, idNum: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 text-sm font-bold outline-none focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Demographics</label>
                  <select required value={form.gender} onChange={e => setForm({...form, gender: e.target.value as Gender})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 text-sm font-bold outline-none focus:border-emerald-500 transition-all">
                    {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <button className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 shadow-xl transition-all uppercase tracking-widest">Confirm Enrollment</button>
           </form>
        </div>
      )}

      {selectedMember && memberFinancials ? (
        <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-10">
           <div className="bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]"></div>
              <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                 <div className="w-28 h-28 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-slate-900 shadow-2xl shadow-emerald-500/20 ring-4 ring-slate-900">
                   {selectedMember.firstName.charAt(0)}
                 </div>
                 <div>
                    <h2 className="text-4xl font-black tracking-tight">{selectedMember.firstName} {selectedMember.lastName}</h2>
                    <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mt-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      {selectedMember.memberKyId} • Joined {selectedMember.joinDate}
                    </p>
                    <div className="mt-5 flex gap-3">
                       <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300">{selectedMember.role}</span>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${memberFinancials.health === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                          Credit: {memberFinancials.health}
                       </span>
                    </div>
                 </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-right relative z-10 flex-1">
                 <div>
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Equity (Savings)</p>
                    <p className="text-2xl font-black text-emerald-400">KES {memberFinancials.savings.toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Loans Taken</p>
                    <p className="text-2xl font-black text-white">KES {memberFinancials.totalBorrowed.toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Outstanding</p>
                    <p className="text-2xl font-black text-rose-400">KES {memberFinancials.outstandingPrincipal.toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">Borrowing Cap.</p>
                    <p className="text-2xl font-black text-amber-400">KES {memberFinancials.capacity.toLocaleString()}</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                    <div>
                       <h3 className="text-sm font-black uppercase text-slate-800 tracking-widest">Digital Loan Book</h3>
                       <p className="text-xs text-slate-400 font-bold mt-1">Audit of facility utilization and repayment performance</p>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Repayment Velocity</span>
                       <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{width: '92%'}}></div>
                       </div>
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-black uppercase text-[10px]">
                          <tr>
                             <th className="px-8 py-5">Facility Link</th>
                             <th className="px-8 py-5">Principal (KES)</th>
                             <th className="px-8 py-5">Interest (KES)</th>
                             <th className="px-8 py-5">Cleared (KES)</th>
                             <th className="px-8 py-5">Remaining (KES)</th>
                             <th className="px-8 py-5 text-right">M&E State</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 font-bold">
                          {memberFinancials.loans.map((l: any) => (
                             <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-8 py-6">
                                   <p className="text-slate-900 font-black">REF: {l.id}</p>
                                   <p className="text-[10px] text-slate-400 uppercase font-bold">{l.issuedDate}</p>
                                </td>
                                <td className="px-8 py-6 text-slate-700">{l.principalAmount.toLocaleString()}</td>
                                <td className="px-8 py-6 text-amber-600">{l.remainingInterest > 0 ? l.remainingInterest.toLocaleString() : 'Settled'}</td>
                                <td className="px-8 py-6 text-emerald-600">{(l.totalPaidPrincipal + l.totalPaidInterest).toLocaleString()}</td>
                                <td className="px-8 py-6 font-black text-slate-900">{l.remainingPrincipal.toLocaleString()}</td>
                                <td className="px-8 py-6 text-right">
                                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                                      l.status === 'Active' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                      l.status === 'Repaid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                      'bg-slate-50 text-slate-400 border-slate-100'
                                   }`}>
                                      {l.status}
                                   </span>
                                </td>
                             </tr>
                          ))}
                          {memberFinancials.loans.length === 0 && (
                             <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-black uppercase tracking-widest opacity-40">No credit facilities tracked in this profile.</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                    <h3 className="text-sm font-black uppercase text-slate-800 tracking-widest">Transaction Audit Trail</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">Immutable ledger entries for savings and shares</p>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-black uppercase text-[10px]">
                          <tr>
                             <th className="px-8 py-5">Date</th>
                             <th className="px-8 py-5">Classification</th>
                             <th className="px-8 py-5">Narration</th>
                             <th className="px-8 py-5 text-right">Amount (KES)</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 font-bold">
                          {memberFinancials.transactions.map((t: any) => (
                             <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-8 py-6 text-slate-400 font-mono text-xs">{t.date}</td>
                                <td className="px-8 py-6">
                                   <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                                      t.type === TransactionType.SAVINGS ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                      t.type === TransactionType.SHARE_PURCHASE ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                      'bg-slate-50 text-slate-600 border-slate-100'
                                   }`}>{t.type.replace('_', ' ')}</span>
                                </td>
                                <td className="px-8 py-6 text-slate-500 font-medium italic text-xs">{t.description || 'System Posting'}</td>
                                <td className="px-8 py-6 text-right text-slate-900 font-black text-base">{t.amount.toLocaleString()}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20">
            <h2 className="text-sm font-black uppercase text-slate-800 tracking-widest">Active Member Directory</h2>
            <div className="relative w-full md:w-96 group">
               <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
               <input 
                 type="text" placeholder="Search by name, ID, or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:border-emerald-500 outline-none transition-all shadow-sm focus:shadow-emerald-500/5"
               />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Full Identity</th>
                  <th className="px-8 py-5">Association</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5 text-right">M&E Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredMembers.map((m: Member) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-800 text-base">{m.firstName} {m.lastName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{m.memberKyId} • {m.phone}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-slate-700 font-black text-xs">{scoped.vslas.find((v:any) => v.id === m.vslaId)?.name || 'Unassigned'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Group Portfolio</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{m.role}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setSelectedMemberId(m.id)}
                        className="text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 transition-all hover:scale-105 active:scale-95"
                      >
                        Passbook →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
