import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Lock, Save, CheckCircle } from 'lucide-react';

export default function Profile() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setFormData({ name: user.name, email: user.email, password: '' });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.put('http://localhost:5000/api/auth/profile', formData, config);
      localStorage.setItem('user', JSON.stringify({ ...res.data, token: user.token }));
      setStatus('Profile updated successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Profile Settings</h1>
        
        {status && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 border border-green-100">
            <CheckCircle size={18} /> {status}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <User size={16}/> Full Name
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Mail size={16}/> Email Address
            </label>
            <input 
              type="email" 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Lock size={16}/> New Password (Leave blank to keep current)
            </label>
            <input 
              type="password" 
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-100"
          >
            <Save size={18} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}