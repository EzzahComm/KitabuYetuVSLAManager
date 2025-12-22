
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppState, Role } from '../types';

interface AiStrategyProps {
  state: AppState;
  scoped: any;
}

const AiStrategy: React.FC<AiStrategyProps> = ({ state, scoped }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<'audit' | 'forecast' | 'impact'>('audit');

  const generateAiInsight = async (type: 'audit' | 'forecast' | 'impact') => {
    setLoading(true);
    setActiveAnalysis(type);
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare financial context for the prompt
    const context = `
      Organization: ${state.tenants.find(t => t.id === state.currentTenantId)?.name}
      Total Groups: ${scoped.vslas.length}
      Active Members: ${scoped.members.length}
      Total Savings: KES ${scoped.financials.savings.toLocaleString()}
      Outstanding Principal: KES ${scoped.financials.outstandingLoanPrincipal.toLocaleString()}
      Available Cash: KES ${scoped.financials.availableCash.toLocaleString()}
      Active Projects: ${scoped.projects.length}
    `;

    const prompts = {
      audit: `Act as a senior microfinance auditor. Analyze the following VSLA portfolio data and identify risks regarding capital utilization, default likelihood, and liquidity health. Provide 3 actionable recommendations: ${context}`,
      forecast: `Act as an economic development strategist. Based on the current savings velocity and capital availability, suggest the next 2 high-ROI investment projects for these groups. Justify your choices with the provided data: ${context}`,
      impact: `Act as a senior M&E officer. Generate a donor-ready impact narrative (150 words) that highlights the resilience and financial progress of this program, suitable for an annual report: ${context}`
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompts[type],
        config: {
          thinkingConfig: { thinkingBudget: 2000 }
        }
      });
      setInsight(response.text || "Insight generation failed. Please try again.");
    } catch (error) {
      console.error("Gemini API Error:", error);
      setInsight("Error connecting to Gemini Intelligence Node. Ensure your API key is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
             </div>
             AI Intelligence Desk
          </h1>
          <p className="text-slate-500 font-medium mt-1">Institutional-grade strategic insights powered by Gemini 3 Pro.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => generateAiInsight('audit')}
          disabled={loading}
          className={`p-8 rounded-[2.5rem] border text-left transition-all ${activeAnalysis === 'audit' ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500'} group relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Risk Management</p>
          <h3 className="text-xl font-black tracking-tight mb-2">Portfolio Audit</h3>
          <p className="text-xs opacity-60 font-medium">Identify default risks and liquidity gaps across all VSLA groups.</p>
        </button>

        <button 
          onClick={() => generateAiInsight('forecast')}
          disabled={loading}
          className={`p-8 rounded-[2.5rem] border text-left transition-all ${activeAnalysis === 'forecast' ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500'} group relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Growth Modeling</p>
          <h3 className="text-xl font-black tracking-tight mb-2">Livelihood Forecast</h3>
          <p className="text-xs opacity-60 font-medium">AI-suggested investment projects based on current capital velocity.</p>
        </button>

        <button 
          onClick={() => generateAiInsight('impact')}
          disabled={loading}
          className={`p-8 rounded-[2.5rem] border text-left transition-all ${activeAnalysis === 'impact' ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500'} group relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Reporting</p>
          <h3 className="text-xl font-black tracking-tight mb-2">Impact Narrative</h3>
          <p className="text-xs opacity-60 font-medium">Generate professional donor-ready progress stories from raw data.</p>
        </button>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm min-h-[400px] relative overflow-hidden flex flex-col">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center space-y-4">
             <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Querying Gemini Intelligence...</p>
          </div>
        )}

        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
           <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              Strategy Output: {activeAnalysis.toUpperCase()}
           </h3>
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Powered by Gemini 3 Pro</span>
        </div>

        <div className="p-12 flex-1 relative">
          {!insight && !loading ? (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Select an analysis path above to generate intelligence.</p>
             </div>
          ) : (
             <div className="prose prose-slate max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-emerald-500/5 p-8 rounded-3xl border border-emerald-500/10 shadow-inner">
                   <p className="text-slate-800 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                      {insight}
                   </p>
                </div>
                
                <div className="mt-8 flex gap-4">
                   <button className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                      Copy Insight
                   </button>
                   <button className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      Export to PDF
                   </button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiStrategy;
