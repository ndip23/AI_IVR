import React, { useState, useEffect } from 'react';
import { LogOut, Ticket, User as UserIcon, Menu, X } from 'lucide-react';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import ChatWidget from '../../components/ChatWidget';
import Profile from './Profile'; // Import the new page

export default function UserDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) navigate('/login');
    else setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50">
        <h2 className="font-bold text-blue-600">SupportAI</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar - Now Responsive */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b hidden md:block">
          <h2 className="text-xl font-bold text-blue-600">SupportAI</h2>
        </div>
        
        <div className="p-6 border-b">
          <p className="text-sm font-bold text-slate-800">Hi, {user.name}!</p>
          <p className="text-xs text-slate-500">{user.role.toUpperCase()} ACCOUNT</p>
        </div>

        <nav className="p-4 flex-1 space-y-2">
          <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
            <Ticket size={18}/> Support Chat
          </Link>
          <Link to="/dashboard/profile" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
            <UserIcon size={18}/> Profile Settings
          </Link>
        </nav>

        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all">
            <LogOut size={18}/> Log Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Live AI Support</h1>
              <p className="text-slate-500 mb-8">Instant answers from our trained ML model.</p>
              <div className="flex justify-center md:justify-start">
                <ChatWidget />
              </div>
            </>
          } />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}