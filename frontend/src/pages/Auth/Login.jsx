import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Loader2, Eye, EyeOff, Activity } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success(`Welcome back to MamaCare, ${res.data.name.split(' ')[0]}!`);

      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50/30 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-teal-100 p-10">
        <div className="flex justify-center mb-4">
          <div className="bg-teal-100 p-3 rounded-full">
            <Heart size={40} className="text-rose-500 fill-rose-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">Welcome to MamaCare</h2>
        <p className="text-center text-slate-500 mb-8 text-sm">
          Sign in to access your AI-IVR health support.
        </p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-teal-700 uppercase tracking-wider mb-1 ml-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border-2 border-teal-50 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-teal-50/30 transition-all" 
              placeholder="name@email.com" 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 ml-1">
              <label className="block text-xs font-bold text-teal-700 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-teal-500 hover:text-teal-700 uppercase">Forgot?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 border-2 border-teal-50 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-teal-50/30 pr-10 transition-all" 
                placeholder="••••••••" 
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
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Access Dashboard'}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8 text-sm">
          New to MamaCare? <Link to="/register" className="text-teal-600 font-bold hover:underline">Create an account</Link>
        </p>

        <div className="mt-8 flex justify-center items-center gap-4">
           <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
             <Activity size={12}/> Live AI Support
           </div>
           <div className="w-1 h-1 rounded-full bg-slate-300"></div>
           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
             Bilingual (EN/FR)
           </div>
        </div>
      </div>
    </div>
  );
}