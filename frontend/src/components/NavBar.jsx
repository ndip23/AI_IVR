import { Link, useLocation } from 'react-router-dom';
import { Package, MessageSquare, Home } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-500";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-blue-600 text-white p-1.5 rounded-lg">Tech</span>Store
        </Link>
        <div className="flex gap-6">
          <Link to="/" className={`flex items-center gap-1.5 ${isActive('/')}`}><Home size={18}/> Home</Link>
          <Link to="/dashboard" className={`flex items-center gap-1.5 ${isActive('/dashboard')} `}><Package size={18}/> My Orders</Link>
          <Link to="/support" className={`flex items-center gap-1.5 ${isActive('/support')}`}><MessageSquare size={18}/> Support</Link>
        </div>
      </div>
    </nav>
  );
}