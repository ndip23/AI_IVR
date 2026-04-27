import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Database, LogOut, ShieldCheck } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Import Pages
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserDashboard from './pages/User/UserDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import KnowledgeBase from './pages/Admin/KnowledgeManager';

/**
 * SECURITY GUARD: AdminRoute
 * Prevents non-admins from accessing the admin panel via URL typing.
 */
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

/**
 * SECURITY GUARD: ProtectedRoute
 * Prevents logged-out users from accessing the private dashboard.
 */
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

/**
 * ADMIN LAYOUT WRAPPER
 * Provides the sidebar for all admin-related pages.
 */
const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 shadow-xl">
        <div className="p-6 text-xl font-bold text-white border-b border-slate-800 flex items-center gap-2">
          <ShieldCheck className="text-blue-500" size={24} /> AI_IVR Admin
        </div>
        
        <nav className="p-4 flex-1 space-y-2 font-medium">
          <Link 
            to="/admin" 
            className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-all hover:text-white"
          >
            <LayoutDashboard size={18}/> Analytics
          </Link>
          <Link 
            to="/admin/knowledge" 
            className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-all hover:text-white"
          >
            <Database size={18}/> Knowledge Base
          </Link>
        </nav>

        {/* Admin Footer / Logout */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg font-medium transition-all"
          >
            <LogOut size={18}/> Log out to website
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
       <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- USER PORTAL (PROTECTED) --- */}
        {/* 
            Note the /* at the end of the path. 
            This allows UserDashboard to handle its own sub-routes 
            like /dashboard/profile inside its own component.
        */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- ADMIN PANEL (HIGH SECURITY) --- */}
        {/* 
            Wrapped in AdminRoute to block non-admin users.
            Wrapped in AdminLayout to provide the sidebar.
        */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          } 
        />
        
        <Route 
          path="/admin/knowledge" 
          element={
            <AdminRoute>
              <AdminLayout>
                <KnowledgeBase />
              </AdminLayout>
            </AdminRoute>
          } 
        />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}