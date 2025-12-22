
import React from 'react';
import { AppState, TransactionType } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportsProps {
  state: AppState;
}

const Reports: React.FC<ReportsProps> = ({ state }) => {
  // Aggregate transactions by date for the area chart
  const timelineData = state.transactions
    .reduce((acc: any[], curr) => {
      const date = curr.date;
      const existing = acc.find(a => a.date === date);
      if (existing) {
        if (curr.type === TransactionType.SAVINGS) existing.savings += curr.amount;
        if (curr.type === TransactionType.LOAN_ISSUE) existing.loans += curr.amount;
      } else {
        acc.push({ 
          date, 
          savings: curr.type === TransactionType.SAVINGS ? curr.amount : 0, 
          loans: curr.type === TransactionType.LOAN_ISSUE ? curr.amount : 0 
        });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytical Reports</h1>
          <p className="text-gray-500">In-depth insights into financial and membership trends.</p>
        </div>
        <button className="px-4 py-2 border border-[#1E7F43] text-[#1E7F43] font-bold rounded-lg hover:bg-green-50">
          Export as PDF
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6">Aggregate Savings vs Loans Portfolio</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E7F43" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1E7F43" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F4C430" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#F4C430" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="savings" stroke="#1E7F43" fillOpacity={1} fill="url(#colorSavings)" />
              <Area type="monotone" dataKey="loans" stroke="#F4C430" fillOpacity={1} fill="url(#colorLoans)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">VSLA Growth Index</h3>
          <div className="space-y-4">
            {state.vslas.map(v => {
              const memberCount = state.members.filter(m => m.vslaId === v.id).length;
              const savings = state.transactions.filter(t => t.vslaId === v.id && t.type === TransactionType.SAVINGS).reduce((a, b) => a + b.amount, 0);
              return (
                <div key={v.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-bold text-gray-700">{v.name}</div>
                    <div className="text-xs text-gray-500">{memberCount} Members</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#1E7F43]">KES {savings.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Total Savings</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Operational KPIs</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">Loan Repayment Rate</span>
                <span className="text-green-600 font-bold">94%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#1E7F43] h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">Member Retention</span>
                <span className="text-blue-600 font-bold">88%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">Field Officer Visit Compliance</span>
                <span className="text-yellow-600 font-bold">72%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
