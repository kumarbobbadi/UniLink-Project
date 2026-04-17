import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, FiUser, FiUsers, FiCalendar, FiLink, FiShield 
} from 'react-icons/fi';

const NAV_ITEMS = [
  { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/profile',   icon: FiUser, label: 'Profile' },
  { to: '/connections', icon: FiLink, label: 'Connections' },
  { to: '/groups',    icon: FiUsers, label: 'Groups' },
  { to: '/events',    icon: FiCalendar, label: 'Events' }
];

export default function Sidebar({ isOpen, closeSidebar }) {
  const { isAdmin } = useAuth();
  const items = isAdmin ? [...NAV_ITEMS, { to: '/admin', icon: FiShield, label: 'Admin' }] : NAV_ITEMS;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 lg:hidden" 
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Menu
          </p>
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                    : 'text-slate-600 hover:text-primary-500 hover:bg-slate-50'
                }`
              }
            >
              <item.icon size={20} className={({ isActive }) => isActive ? 'text-primary-500' : ''} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        {/* Footer info in sidebar */}
        <div className="p-6 border-t border-slate-100">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-4 rounded-xl border border-primary-100">
            <h4 className="text-sm font-semibold text-primary-900 mb-1">Need help?</h4>
            <p className="text-xs text-primary-600 mb-3">Check our docs or contact support.</p>
            <a href="#" className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline">
              Visit Help Center &rarr;
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
