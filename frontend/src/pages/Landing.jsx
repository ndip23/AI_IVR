import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Stethoscope, MessageCircle, PhoneCall } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-2xl font-bold text-teal-700">
          <Heart className="text-rose-500 fill-rose-500" size={32} /> MamaCare AI
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-slate-600 font-medium px-4 py-2">Login</Link>
          <Link to="/register" className="bg-teal-600 text-white px-5 py-2 rounded-full font-medium hover:bg-teal-700 transition-all">Sign Up</Link>
        </div>
      </nav>

      <header className="text-center max-w-4xl mx-auto mt-16 px-4">
        <span className="bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">Dedicated to Cameroon Healthcare</span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mt-6 leading-tight">
          Every Second Counts in <span className="text-teal-600">Child Healthcare</span>
        </h1>
        <p className="text-lg text-slate-600 mt-6 max-w-2xl mx-auto">
          Instant first-aid guidance for mothers and caregivers. Use voice or text to identify symptoms like fever, diarrhea, and respiratory distress.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="bg-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-700 shadow-lg shadow-teal-200">Get Emergency Support</Link>
          <button className="flex items-center justify-center gap-2 bg-white border-2 border-teal-600 text-teal-700 px-8 py-4 rounded-full font-bold text-lg">
            <PhoneCall size={20}/> Learn About IVR
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 px-4 pb-20">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="bg-rose-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-rose-600"><Heart/></div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Maternal Guidance</h3>
          <p className="text-slate-600 text-sm">Personalized prenatal and postnatal advice tailored to local socio-linguistic contexts.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="bg-teal-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-teal-600"><Stethoscope/></div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Symptom Checker</h3>
          <p className="text-slate-600 text-sm">Identify critical childhood symptoms early and receive immediate first-aid instructions.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="bg-amber-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-amber-600"><MessageCircle/></div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Voice & Text</h3>
          <p className="text-slate-600 text-sm">Designed for everyone. Interact via WhatsApp, Voice, or Text for maximum accessibility.</p>
        </div>
      </section>
    </div>
  );
}