
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../constants';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Nav Placeholder */}
      <nav className="h-20 border-b border-slate-100 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-950">Kitabu Yetu</span>
        </Link>
      </nav>

      <section className="pt-24 pb-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Get in <span className="text-emerald-600">Touch</span> with our Experts.
              </h1>
              <p className="mt-6 text-xl text-slate-500 font-medium leading-relaxed">
                Whether you're an NGO looking to digitalize your field operations or a donor seeking impact transparency, our team is ready to support your transition.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <ICONS.Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Email Strategy</h4>
                  <p className="text-slate-500 font-bold">partnerships@kitabuyetu.org</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mt-1">24h response time target</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                  <ICONS.Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Direct Support</h4>
                  <p className="text-slate-500 font-bold">+254 700 000 000</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mt-1">Mon - Fri: 8:00 AM - 5:00 PM EAT</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-100">
                  <ICONS.MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Regional HQ</h4>
                  <p className="text-slate-500 font-bold">Kilimani Business Hub, Nairobi, Kenya</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mt-1">Nairobi / Kampala / Dar es Salaam</p>
                </div>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all shadow-sm"><ICONS.Facebook /></button>
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all shadow-sm"><ICONS.Twitter /></button>
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all shadow-sm"><ICONS.Linkedin /></button>
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all shadow-sm"><ICONS.Instagram /></button>
            </div>
          </div>

          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95">
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Inquiry Received.</h3>
                <p className="text-slate-500 font-medium">A protocol specialist will review your request and contact you within one business day.</p>
                <button onClick={() => setSubmitted(false)} className="mt-8 text-emerald-600 font-black uppercase text-[10px] tracking-widest underline decoration-2 underline-offset-4">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                  <input required type="text" placeholder="e.g. Polycap Onyango" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Work Email</label>
                  <input required type="email" placeholder="email@organization.org" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Subject</label>
                  <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:border-emerald-500 outline-none transition-all">
                    <option>General Inquiry</option>
                    <option>Partnership Proposal</option>
                    <option>Technical Support</option>
                    <option>Billing Question</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Message Detail</label>
                  <textarea required placeholder="How can we help your organization?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:border-emerald-500 outline-none transition-all h-32 resize-none" />
                </div>
                <button className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all active:scale-[0.98] uppercase tracking-widest text-xs">
                  Dispatch Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
