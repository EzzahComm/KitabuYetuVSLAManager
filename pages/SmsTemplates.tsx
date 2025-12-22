
import React, { useState, useMemo } from 'react';
import { SmsTemplate, SmsTrigger, SmsLog } from '../types';

interface SmsTemplatesProps {
  templates: SmsTemplate[];
  logs: SmsLog[];
  onUpdate: (id: string, content: string) => void;
}

const SmsTemplates: React.FC<SmsTemplatesProps> = ({ templates, logs, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'logs'>('templates');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const placeholders: Record<SmsTrigger, string[]> = {
    [SmsTrigger.LOAN_REPAYMENT]: ['{member_name}', '{amount}', '{date}', '{vsla_name}'],
    [SmsTrigger.SAVINGS_REMINDER]: ['{member_name}', '{amount}', '{date}', '{vsla_name}'],
    [SmsTrigger.MEETING_NOTIFICATION]: ['{vsla_name}', '{date}', '{location}'],
    [SmsTrigger.BIRTHDAY_WISH]: ['{member_name}', '{vsla_name}'],
  };

  const getPreview = (content: string) => {
    let preview = content;
    preview = preview.replace('{member_name}', 'Jane Wanjiku');
    preview = preview.replace('{amount}', '1,200');
    preview = preview.replace('{date}', 'Jan 15th');
    preview = preview.replace('{vsla_name}', 'Amani Savings');
    preview = preview.replace('{location}', 'Community Hall');
    return preview;
  };

  const handleStartEdit = (template: SmsTemplate) => {
    setEditingId(template.id);
    setEditContent(template.content);
  };

  const handleSave = () => {
    if (editingId) {
      onUpdate(editingId, editContent);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">SMS Hub</h1>
          <p className="text-slate-500 font-medium">Manage notification templates and track communication costs.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'templates' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
          >
            Templates
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'logs' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}
          >
            Delivery Logs
          </button>
        </div>
      </div>

      {activeTab === 'templates' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List of Templates */}
          <div className="lg:col-span-2 space-y-6">
            {templates.map((template) => (
              <div key={template.id} className={`bg-white rounded-3xl border transition-all ${editingId === template.id ? 'border-emerald-500 shadow-xl' : 'border-slate-200 shadow-sm'}`}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        {template.trigger.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-slate-400 mt-2 font-medium">Last updated: {new Date(template.updatedAt || '').toLocaleDateString()}</p>
                    </div>
                    {editingId !== template.id && (
                      <button 
                        onClick={() => handleStartEdit(template)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Edit Template"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                    )}
                  </div>

                  {editingId === template.id ? (
                    <div className="space-y-4 animate-in fade-in zoom-in-95">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-medium focus:border-emerald-500 focus:ring-0 outline-none h-32 resize-none"
                      />
                      <div className="flex flex-wrap gap-2">
                        {placeholders[template.trigger].map(p => (
                          <button 
                            key={p}
                            onClick={() => setEditContent(prev => prev + p)}
                            className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button 
                          onClick={handleSave}
                          className="bg-emerald-600 text-white font-black text-xs px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                        >
                          Save Changes
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="text-slate-500 font-bold text-xs px-4 py-2 hover:bg-slate-100 rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {template.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Smartphone Preview */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center mb-6">Real-time Mobile Preview</p>
              
              <div className="mx-auto w-[280px] h-[560px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl relative p-6">
                {/* Screen elements */}
                <div className="w-20 h-5 bg-slate-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2"></div>
                
                <div className="mt-8 space-y-4 overflow-y-auto h-full no-scrollbar pb-20">
                  <div className="text-center mb-6">
                    <p className="text-[10px] text-slate-500 font-bold">Today, 10:42 AM</p>
                  </div>
                  
                  <div className="bg-slate-800 text-white p-4 rounded-2xl rounded-bl-none text-xs leading-relaxed shadow-lg animate-in slide-in-from-left-4 duration-300">
                    {getPreview(editingId ? editContent : templates[0]?.content || '')}
                  </div>

                  <div className="bg-slate-800/50 text-white p-3 rounded-2xl text-[10px] font-bold text-center mt-12">
                    Credits remaining: 482
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 h-1 bg-slate-800 rounded-full"></div>
              </div>
              
              <p className="mt-8 text-center text-xs text-slate-400 font-medium italic">
                Approx. Cost: <span className="text-emerald-600 font-black">KES 0.80</span> per recipient
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase">
              <tr>
                <th className="px-6 py-4 tracking-widest">Recipient</th>
                <th className="px-6 py-4 tracking-widest">Message Fragment</th>
                <th className="px-6 py-4 tracking-widest">Trigger</th>
                <th className="px-6 py-4 tracking-widest">Status</th>
                <th className="px-6 py-4 tracking-widest text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-slate-900 font-bold">{log.recipientPhone}</p>
                    <p className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="truncate max-w-xs italic text-slate-500">"{log.message}"</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{log.trigger}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                      log.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                      log.status === 'failed' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">
                    KES {log.cost.toFixed(2)}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest">
                    No SMS activity recorded for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SmsTemplates;
