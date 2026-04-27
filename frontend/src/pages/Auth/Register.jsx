import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Welcome to MamaCare AI!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-teal-100 p-8">
        <div className="flex justify-center mb-4">
          <div className="bg-teal-100 p-3 rounded-full">
            <Heart size={40} className="text-rose-500 fill-rose-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">Join MamaCare AI</h2>
        <p className="text-center text-slate-500 mb-8 text-sm px-4">
          Access real-time maternal and child health support across Cameroon.
        </p>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-teal-700 uppercase tracking-wider mb-1 ml-1">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border-2 border-teal-50 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-teal-50/30 transition-all" 
              placeholder="Enter your name" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-700 uppercase tracking-wider mb-1 ml-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border-2 border-teal-50 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-teal-50/30 transition-all" 
              placeholder="maman@example.cm" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-700 uppercase tracking-wider mb-1 ml-1">Secure Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 border-2 border-teal-50 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-teal-50/30 pr-10 transition-all" 
                placeholder="••••••••" 
                minLength="6" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-400 hover:text-teal-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all flex justify-center items-center gap-2 disabled:bg-teal-300 shadow-lg shadow-teal-100 active:scale-[0.98]"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Create My Account'}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8 text-sm">
          Already a member? <Link to="/login" className="text-teal-600 font-bold hover:underline">Sign in here</Link>
        </p>

        <div className="mt-6 pt-6 border-t border-teal-50 flex items-center justify-center gap-2 text-[10px] text-teal-600 font-bold uppercase tracking-widest">
          <ShieldCheck size={14}/> Secure Health Data
        </div>
      </div>
    </div>
  );
}