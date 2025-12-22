
import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-3xl border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-950">
              <span className="text-emerald-600">Kitabu</span> Yetu
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <a href="#governance" className="hover:text-emerald-600 transition-colors">Governance</a>
            <a href="#m-and-e" className="hover:text-emerald-600 transition-colors">M&E Engine</a>
            <a href="#resilience" className="hover:text-emerald-600 transition-colors">Resilience</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-xs font-black text-slate-600 px-5 py-2.5 hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-widest border border-transparent">Login</Link>
            <Link to="/register/ngo" className="text-[10px] font-black text-white bg-slate-950 px-7 py-3 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-950/20 uppercase tracking-widest">Partner Registration</Link>
          </div>
        </div>
      </nav>

      {/* Hero: The Livelihood Catalyst */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-10 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800">Operational in Kenya, Uganda & Tanzania</span>
          </div>
          
          <h1 className="text-6xl md:text-[5.5rem] font-black text-slate-900 tracking-tighter leading-[0.9] mb-12">
            Standardizing the <br />
            <span className="text-emerald-600">Livelihood Ledger.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
            Replace manual bookkeeping with an institutional-grade MIS. 
            Kitabu Yetu empowers NGOs with real-time field data while providing 
            VSLAs with transparent financial identities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register/vsla" className="group w-full sm:w-auto px-12 py-6 bg-emerald-600 text-white font-black rounded-[2.5rem] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30 active:scale-[0.98] flex items-center justify-center gap-3">
              <span className="uppercase text-sm tracking-widest">Onboard a Group</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
            <div className="flex -space-x-3 items-center">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-12 h-12 rounded-full border-4 border-white bg-slate-200 shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400`}>NGO</div>
              ))}
              <span className="ml-6 text-xs font-bold text-slate-500 tracking-tight">Trusted by 40+ Regional Partners</span>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Pulse (Dynamic Statistics) */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid-dark" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid-dark)" /></svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <p className="text-5xl font-black text-emerald-400 tracking-tighter">$4.2M+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Capital Managed</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-black text-white tracking-tighter">1,200+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active VSLAs</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-black text-amber-400 tracking-tighter">98%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Repayment Accuracy</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-black text-white tracking-tighter">150k+</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Lives Impacted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Management Value Props */}
      <section id="governance" className="py-40 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em] mb-4">Enterprise Governance</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Built for Institutional Accountability.</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="p-10 rounded-[3rem] bg-slate-50 hover:bg-emerald-50 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-600/5 mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Fraud Prevention</h4>
              <p className="text-slate-500 font-medium leading-relaxed">Immutable double-entry ledger system ensures zero discrepancies between group box and digital records.</p>
            </div>

            <div className="p-10 rounded-[3rem] bg-slate-50 hover:bg-emerald-50 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-xl shadow-amber-600/5 mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v16m-6 0a2 2 0 002 2h2a2 2 0 002-2"/></svg>
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Impact Reporting</h4>
              <p className="text-slate-500 font-medium leading-relaxed">Automated gender-disaggregated data and livelihood resilience metrics delivered instantly to NGO dashboards.</p>
            </div>

            <div className="p-10 rounded-[3rem] bg-slate-50 hover:bg-emerald-50 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-xl shadow-blue-600/5 mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Offline Continuity</h4>
              <p className="text-slate-500 font-medium leading-relaxed">Edge-first technology allows field officers to capture meeting data in remote wards without persistent internet connectivity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer: The Growth Commitment */}
      <footer className="bg-slate-950 pt-32 pb-16 px-6 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
            <div className="lg:col-span-5 space-y-8">
              <span className="text-4xl font-black tracking-tighter text-white block">Kitabu Yetu</span>
              <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-md">
                We are building the trust layer for community finance in emerging markets. 
                Our mission is to digitalize the next billion livelihood identities.
              </p>
              <div className="pt-6 flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></div>
                 <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></div>
              </div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 text-[10px] font-black uppercase tracking-[0.3em]">
              <div className="space-y-6">
                <h5 className="text-slate-600">Institutional</h5>
                <ul className="space-y-4 text-slate-300">
                  <li><Link to="/register/ngo" className="hover:text-emerald-400 transition-colors">NGO Dashboard</Link></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Donor Portal</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Compliance</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h5 className="text-slate-600">Product</h5>
                <ul className="space-y-4 text-slate-300">
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Digital Ledger</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Impact Analytics</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Field App</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h5 className="text-slate-600">Support</h5>
                <ul className="space-y-4 text-slate-300">
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">SMS Gateway</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">API Docs</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">© {new Date().getFullYear()} Kitabu Yetu MIS. Built with Trust in East Africa.</p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Audit Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
