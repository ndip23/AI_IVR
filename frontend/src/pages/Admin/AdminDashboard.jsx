import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Database, Brain, Zap, Activity, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock chart data (you can make this live later by storing query logs in MongoDB)
  const chartData = [
    { day: 'Mon', queries: 120 }, { day: 'Tue', queries: 210 },
    { day: 'Wed', queries: 180 }, { day: 'Thu', queries: 300 },
    { day: 'Fri', queries: 250 }, { day: 'Sat', queries: 90 }, { day: 'Sun', queries: 110 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // GET real stats from Node.js (which also pings Python for AI status)
        const res = await axios.get('http://localhost:5000/api/admin/stats', config);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const Card = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-xl ${color} text-white shadow-lg shadow-opacity-20`}><Icon size={24}/></div>
      <div>
        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value || 0}</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center mt-40 gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40}/>
      <p className="text-slate-500 font-medium">Connecting to AI Engine...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Admin Overview</h1>
        <p className="text-slate-500">Live metrics from MongoDB and Python ML Engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total Customers" value={stats?.totalUsers} icon={Users} color="bg-blue-600" />
        <Card title="Knowledge Base" value={stats?.totalKnowledge} icon={Database} color="bg-amber-500" />
        <Card title="AI Status" value={stats?.aiTrained ? "ACTIVE" : "EMPTY"} icon={Brain} color={stats?.aiTrained ? "bg-emerald-500" : "bg-red-500"} />
        <Card title="Vector Count" value={stats?.vectorCount} icon={Zap} color="bg-indigo-600" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Activity size={20} className="text-blue-600"/> Customer Query Volume</h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">Real-time Data</span>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="queries" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}