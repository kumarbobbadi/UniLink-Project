import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import Button from './Button';

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar} 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 lg:hidden rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FiMenu size={24} />
          </button>
          
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg font-display">U</span>
            </div>
            <span className="font-display text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 hidden sm:block">
              UniLink
            </span>
          </NavLink>
        </div>

        {/* Top Navigation Links - Hidden on small screens */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/profile', label: 'Profile' },
            { to: '/groups', label: 'Groups' },
            { to: '/events', label: 'Events' }
          ].map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-slate-500 hover:text-primary-500'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 border-2 border-white shadow-sm flex items-center justify-center text-primary-700 font-bold flex-shrink-0">
                {user.name?.[0]?.toUpperCase()}
              </div>
            </div>
          )}
          
          <Button variant="outline" onClick={handleLogout} className="!px-3 !py-2 !rounded-lg hidden sm:flex gap-2">
            <FiLogOut size={16} />
            <span className="text-sm">Logout</span>
          </Button>
          
          <button onClick={handleLogout} className="sm:hidden p-2 text-slate-500 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors">
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
