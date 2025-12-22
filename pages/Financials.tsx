
import React, { useState } from 'react';
import { AppState, Transaction, TransactionType } from '../types';
import { ICONS } from '../constants';

interface FinancialsProps {
  state: AppState;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
}

const Financials: React.FC<FinancialsProps> = ({ state, onAddTransaction }) => {
  const [showSavingForm, setShowSavingForm] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    vslaId: '',
    type: TransactionType.SAVINGS as TransactionType,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleMemberChange = (memberId: string) => {
    const member = state.members.find(m => m.id === memberId);
    if (member) {
      setFormData({ ...formData, memberId, vslaId: member.vslaId });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.memberId || formData.amount <= 0) return alert('Invalid entry');
    // Fix: Include missing properties for Omit<Transaction, 'id'>
    onAddTransaction({
      ...formData,
      tenantId: state.currentTenantId,
      isSoftDeleted: false,
      cycleId: 'default',
      recordedBy: state.currentUser?.id || 'sys'
    });
    setShowSavingForm(false);
    setFormData({ ...formData, amount: 0, description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financial Management</h1>
          <p className="text-gray-500">Track group savings, loans issuance, and repayments.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setFormData({...formData, type: TransactionType.SAVINGS}); setShowSavingForm(true); }}
            className="px-4 py-2 bg-[#1E7F43] text-white rounded-lg flex items-center gap-2 hover:bg-[#156233]"
          >
            <ICONS.Plus /> Add Saving
          </button>
          <button 
            onClick={() => { setFormData({...formData, type: TransactionType.LOAN_ISSUE}); setShowSavingForm(true); }}
            className="px-4 py-2 bg-[#F4C430] text-[#1E7F43] font-bold rounded-lg flex items-center gap-2 hover:bg-yellow-500"
          >
            <ICONS.Plus /> Issue Loan
          </button>
        </div>
      </div>

      {showSavingForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-[#1E7F43] animate-in zoom-in-95 duration-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            {formData.type === TransactionType.SAVINGS ? 'New Saving Entry' : 'Issue New Loan'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Member</label>
              <select 
                required
                className="w-full px-4 py-2 border rounded-lg outline-none"
                value={formData.memberId}
                onChange={e => handleMemberChange(e.target.value)}
              >
                <option value="">Select Member...</option>
                {state.members.map(m => (
                  <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({state.vslas.find(v => v.id === m.vslaId)?.name})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Amount (KES)</label>
              <input 
                type="number"
                required
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input 
                type="date"
                required
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="flex-1 py-2 bg-[#1E7F43] text-white font-bold rounded-lg">
                Save
              </button>
              <button 
                type="button" 
                onClick={() => setShowSavingForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-500 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700">Recent Transactions</div>
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Member</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {state.transactions.slice().reverse().map((tx) => {
                  const member = state.members.find(m => m.id === tx.memberId);
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{member ? `${member.firstName} ${member.lastName}` : 'N/A'}</td>
                      <td className="px-6 py-4 capitalize">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          tx.type === TransactionType.SAVINGS ? 'bg-green-100 text-green-700' :
                          tx.type === TransactionType.LOAN_ISSUE ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">KES {tx.amount.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Savings Summary</h3>
            <div className="space-y-4">
              {state.vslas.map(v => {
                const total = state.transactions
                  .filter(t => t.vslaId === v.id && t.type === TransactionType.SAVINGS)
                  .reduce((acc, curr) => acc + curr.amount, 0);
                return (
                  <div key={v.id} className="flex justify-between items-center pb-2 border-b border-gray-50">
                    <span className="text-sm text-gray-600">{v.name}</span>
                    <span className="text-sm font-bold text-[#1E7F43]">KES {total.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-[#1E7F43] p-6 rounded-xl shadow-sm text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ICONS.Dashboard className="text-[#F4C430]" /> System Health
            </h3>
            <div className="text-sm space-y-2 opacity-90">
              <p>Total Capital: KES {(state.transactions.filter(t => t.type === TransactionType.SAVINGS).reduce((a, b) => a + b.amount, 0)).toLocaleString()}</p>
              <p>Utilization: {((state.transactions.filter(t => t.type === TransactionType.LOAN_ISSUE).reduce((a, b) => a + b.amount, 0) / state.transactions.filter(t => t.type === TransactionType.SAVINGS).reduce((a, b) => a + b.amount, 0) || 0) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financials;
