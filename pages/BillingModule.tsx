
import React from 'react';
import { AppState } from '../types';

const BillingModule: React.FC<{ state: AppState, scoped: any }> = ({ state, scoped }) => {
  const SMS_RATE = 0.80;
  const USER_RATE = 20;

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  
  // Calculate simulated billing
  const activeMembers = scoped.members.length;
  const simulatedSms = activeMembers * 12; // Average 12 SMS per member per month
  const platformFee = activeMembers * USER_RATE;
  const smsFee = simulatedSms * SMS_RATE;
  const total = platformFee + smsFee;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Postpaid Billing & Usage</h1>
        <p className="text-slate-500 font-medium">Monthly utilization fees for {currentMonth}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
               <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest">Usage Breakdown</h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-700 text-lg">Platform Access Fee</p>
                  <p className="text-sm text-slate-500">{activeMembers} Active Users @ KES {USER_RATE}/user</p>
                </div>
                <p className="text-xl font-black text-slate-800">KES {platformFee.toLocaleString()}</p>
              </div>
              
              <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                <div>
                  <p className="font-bold text-slate-700 text-lg">SMS Notifications</p>
                  <p className="text-sm text-slate-500">{simulatedSms} SMS Sent @ KES {SMS_RATE}/SMS</p>
                </div>
                <p className="text-xl font-black text-slate-800">KES {smsFee.toLocaleString()}</p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <p className="text-xl font-black text-slate-800">Total Accrued Due</p>
                <p className="text-3xl font-black text-emerald-600">KES {total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 p-8 rounded-2xl text-white">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Payment Policy</h3>
              <ul className="text-sm space-y-3 text-slate-300">
                <li className="flex gap-3">
                   <span className="text-amber-500 font-bold">•</span>
                   Bills are generated on the 1st of every month.
                </li>
                <li className="flex gap-3">
                   <span className="text-amber-500 font-bold">•</span>
                   Service suspended if overdue by > 15 days.
                </li>
                <li className="flex gap-3">
                   <span className="text-amber-500 font-bold">•</span>
                   SMS charges are based on actual delivery reports.
                </li>
              </ul>
              <button className="w-full mt-8 bg-white text-slate-950 font-black py-4 rounded-xl hover:bg-slate-100 transition-colors">
                 Download Last Statement
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BillingModule;
