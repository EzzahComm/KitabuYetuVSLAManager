
import React, { useState, useMemo } from 'react';
import { AppState, Loan, LoanStatus, TransactionType } from '../types';

interface LoanProps {
  state: AppState;
  scoped: any;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  logAudit: (a: string, d: string) => void;
  addTransaction: (tx: any) => void;
}

const LoanManagement: React.FC<LoanProps> = ({ state, scoped, setState, logAudit, addTransaction }) => {
  const [showForm, setShowForm] = useState(false);
  const [loanForm, setLoanForm] = useState({ memberId: '', amount: '', duration: '1' });
  const [repaymentModal, setRepaymentModal] = useState<{ loanId: string; maxPrincipal: number; maxInterest: number } | null>(null);
  const [repaymentForm, setRepaymentForm] = useState({ principal: '', interest: '' });

  const activeCycle = useMemo(() => scoped.vslas[0] ? state.cycles.find(c => c.vslaId === scoped.vslas[0].id && c.isActive) : null, [scoped.vslas, state.cycles]);

  const calculateLimits = (memberId: string) => {
    const savings = state.transactions
      .filter(t => t.memberId === memberId && (t.type === TransactionType.SAVINGS || t.type === TransactionType.SHARE_PURCHASE))
      .reduce((a, b) => a + b.amount, 0);
    return savings * 3;
  };

  const handleIssueLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCycle || !loanForm.memberId || !loanForm.amount) return;

    const limit = calculateLimits(loanForm.memberId);
    const amount = parseFloat(loanForm.amount);
    
    // Check box liquidity before issuance
    if (amount > scoped.financials.availableCash) {
       return alert(`Insufficient cash in box. Current Liquidity: KES ${scoped.financials.availableCash.toLocaleString()}`);
    }

    if (amount > limit && !window.confirm(`Exceeds 3x limit (KES ${limit}). Continue?`)) return;

    const interestRate = activeCycle.interestRate / 100;
    const totalInterest = amount * interestRate * parseInt(loanForm.duration);

    const newLoan: Loan = {
      id: `loan_${Date.now()}`,
      memberId: loanForm.memberId,
      vslaId: activeCycle.vslaId,
      cycleId: activeCycle.id,
      meetingId: 'direct',
      principalAmount: amount,
      interestRate: activeCycle.interestRate,
      durationMonths: parseInt(loanForm.duration),
      remainingPrincipal: amount,
      remainingInterest: totalInterest,
      totalPaidPrincipal: 0,
      totalPaidInterest: 0,
      status: LoanStatus.ACTIVE,
      issuedDate: new Date().toISOString().split('T')[0]
    };

    setState(prev => ({ ...prev, loans: [...prev.loans, newLoan] }));
    addTransaction({
      vslaId: newLoan.vslaId,
      cycleId: newLoan.cycleId,
      memberId: newLoan.memberId,
      type: TransactionType.LOAN_ISSUE,
      amount: amount,
      date: newLoan.issuedDate,
      description: `Disbursement: KES ${amount} over ${loanForm.duration}mo`,
      recordedBy: state.currentUser?.id || 'sys'
    });

    logAudit('LOAN_ISSUED', `Member ${loanForm.memberId} borrowed KES ${amount}`);
    setShowForm(false);
    setLoanForm({ memberId: '', amount: '', duration: '1' });
  };

  const handleRepaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repaymentModal) return;

    const p = parseFloat(repaymentForm.principal) || 0;
    const i = parseFloat(repaymentForm.interest) || 0;

    // Financial Guard: Principal repayment cannot exceed balance
    const sanitizedP = Math.min(p, repaymentModal.maxPrincipal);
    const sanitizedI = Math.min(i, repaymentModal.maxInterest);

    setState(prev => ({
      ...prev,
      loans: prev.loans.map(l => {
        if (l.id === repaymentModal.loanId) {
          const newRP = Math.max(0, l.remainingPrincipal - sanitizedP);
          const newRI = Math.max(0, l.remainingInterest - sanitizedI);
          const totalPaidP = l.totalPaidPrincipal + sanitizedP;
          const totalPaidI = l.totalPaidInterest + sanitizedI;
          return { 
            ...l, 
            remainingPrincipal: newRP, 
            remainingInterest: newRI, 
            totalPaidPrincipal: totalPaidP,
            totalPaidInterest: totalPaidI,
            status: (newRP + newRI <= 0.01) ? LoanStatus.REPAID : l.status 
          };
        }
        return l;
      })
    }));

    if (sanitizedP > 0) addTransaction({ 
      vslaId: activeCycle?.vslaId || '', 
      cycleId: activeCycle?.id || '', 
      memberId: scoped.loans.find((l:any) => l.id === repaymentModal.loanId)?.memberId || '', 
      type: TransactionType.LOAN_REPAYMENT_PRINCIPAL, 
      amount: sanitizedP, 
      date: new Date().toISOString().split('T')[0], 
      description: `Principal Repayment for ${repaymentModal.loanId}`, 
      recordedBy: state.currentUser?.id || 'sys' 
    });
    
    if (sanitizedI > 0) addTransaction({ 
      vslaId: activeCycle?.vslaId || '', 
      cycleId: activeCycle?.id || '', 
      memberId: scoped.loans.find((l:any) => l.id === repaymentModal.loanId)?.memberId || '', 
      type: TransactionType.LOAN_REPAYMENT_INTEREST, 
      amount: sanitizedI, 
      date: new Date().toISOString().split('T')[0], 
      description: `Interest Repayment for ${repaymentModal.loanId}`, 
      recordedBy: state.currentUser?.id || 'sys' 
    });

    setRepaymentModal(null);
    setRepaymentForm({ principal: '', interest: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Credit Operations</h1>
          <p className="text-slate-500 font-medium tracking-tight">Current Liquidity: KES {scoped.financials.availableCash.toLocaleString()}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl shadow-xl hover:bg-emerald-700 active:scale-95 transition-all text-sm uppercase tracking-widest">
          {showForm ? 'Cancel Application' : 'Request Facility'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-900 shadow-2xl animate-in zoom-in-95 max-w-xl">
           <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-widest">Facility Issuance</h3>
           <form onSubmit={handleIssueLoan} className="space-y-6">
              <div>
                 <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Borrower Identity</label>
                 <select required value={loanForm.memberId} onChange={e => setLoanForm({...loanForm, memberId: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all">
                   <option value="">Select Member...</option>
                   {scoped.members.map((m:any) => <option key={m.id} value={m.id}>{m.firstName} {m.lastName} (Equity: KES {calculateLimits(m.id)/3})</option>)}
                 </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Principal Amount</label>
                    <input type="number" required value={loanForm.amount} onChange={e => setLoanForm({...loanForm, amount: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-emerald-500" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Tenure (Months)</label>
                    <input type="number" min="1" value={loanForm.duration} onChange={e => setLoanForm({...loanForm, duration: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-emerald-500" />
                 </div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                 <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Impact Signaling</p>
                 <p className="text-xs text-slate-600 font-bold">Lending against community capital increases regional velocity and household resilience.</p>
              </div>
              <button className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-widest">Disburse Facility</button>
           </form>
        </div>
      )}

      {repaymentModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95">
              <h3 className="text-xl font-black text-slate-800 mb-2">Facility Settlement</h3>
              <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">Remaining Principal: <span className="text-slate-900">{repaymentModal.maxPrincipal.toLocaleString()}</span></p>
              <form onSubmit={handleRepaySubmit} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Principal Component</label>
                    <div className="relative">
                       <input type="number" step="0.01" value={repaymentForm.principal} onChange={e => setRepaymentForm({...repaymentForm, principal: e.target.value})} placeholder="0.00" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 font-bold outline-none focus:border-emerald-500" />
                       <button type="button" onClick={() => setRepaymentForm(f => ({...f, principal: repaymentModal.maxPrincipal.toString()}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-emerald-600 uppercase">Max</button>
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Interest Component</label>
                    <div className="relative">
                       <input type="number" step="0.01" value={repaymentForm.interest} onChange={e => setRepaymentForm({...repaymentForm, interest: e.target.value})} placeholder="0.00" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 font-bold outline-none focus:border-amber-500" />
                       <button type="button" onClick={() => setRepaymentForm(f => ({...f, interest: repaymentModal.maxInterest.toString()}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-amber-600 uppercase">Max</button>
                    </div>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setRepaymentModal(null)} className="flex-1 text-slate-400 font-black text-[10px] uppercase tracking-widest">Cancel</button>
                    <button type="submit" className="flex-[2] bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-xs">Post Settlement</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
           <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-100">
              <tr>
                 <th className="px-8 py-5">Active Borrower</th>
                 <th className="px-8 py-5">Facility Terms</th>
                 <th className="px-8 py-5">Outstanding Bal.</th>
                 <th className="px-8 py-5">State</th>
                 <th className="px-8 py-5 text-right">Repayment Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 font-medium">
              {scoped.loans.map((l: Loan) => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-800 text-base">{scoped.members.find((m:any) => m.id === l.memberId)?.firstName} {scoped.members.find((m:any) => m.id === l.memberId)?.lastName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{l.id} • {l.issuedDate}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-700">KES {l.principalAmount.toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{l.interestRate}% monthly</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                       <div className="flex justify-between items-center w-full max-w-[140px]">
                          <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Principal:</span>
                          <span className="text-xs font-black text-slate-800">KES {l.remainingPrincipal.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center w-full max-w-[140px]">
                          <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Interest:</span>
                          <span className="text-xs font-black text-amber-600">KES {l.remainingInterest.toLocaleString()}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                      l.status === LoanStatus.ACTIVE ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      l.status === LoanStatus.REPAID ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>{l.status}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {l.status === LoanStatus.ACTIVE && (
                      <button 
                        onClick={() => setRepaymentModal({ loanId: l.id, maxPrincipal: l.remainingPrincipal, maxInterest: l.remainingInterest })}
                        className="text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-100 transition-all shadow-sm"
                      >
                        Repay →
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {scoped.loans.length === 0 && (
                 <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-black uppercase tracking-widest opacity-40">No active credit facilities on record.</td>
                 </tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanManagement;
