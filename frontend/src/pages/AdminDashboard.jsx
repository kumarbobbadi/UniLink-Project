import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { FiUsers, FiCalendar, FiTrash2, FiCheck, FiShield } from 'react-icons/fi';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [tab, setTab] = useState('users');

  const fetchData = async () => {
    try {
      const [u, e] = await Promise.all([adminAPI.getUsers(), adminAPI.getPendingEvents()]);
      setUsers(u.data);
      setPendingEvents(e.data);
    } catch { toast.error('Failed to load admin data'); }
  };

  useEffect(() => { fetchData(); }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted');
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const approveEvent = async (eventId) => {
    try {
      await adminAPI.approveEvent({ eventId });
      toast.success('Event approved!');
      fetchData();
    } catch { toast.error('Failed to approve'); }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1 flex items-center gap-2">
          <FiShield className="text-primary-500" /> Admin Dashboard
        </h1>
        <p className="text-slate-500">Manage users, events, and platform settings</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-px">
        {[
          { key: 'users', label: `Users (${users.length})`, icon: FiUsers },
          { key: 'events', label: `Pending Events (${pendingEvents.length})`, icon: FiCalendar }
        ].map(t => (
          <button 
            key={t.key} 
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all relative ${
              tab === t.key 
                ? 'text-primary-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl'
            }`}
          >
            <t.icon />
            {t.label}
            {tab === t.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 shadow-[0_-2px_10px_rgba(99,102,241,0.5)]"></div>
            )}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0 shadow-sm border border-white">
                          {u.name[0].toUpperCase()}
                        </div>
                        <span className="text-slate-800 font-semibold">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium text-sm">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                        u.role === 'admin' 
                          ? 'bg-secondary-50 text-secondary-600 border-secondary-200' 
                          : 'bg-primary-50 text-primary-600 border-primary-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-medium text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u.role !== 'admin' && (
                        <button onClick={() => deleteUser(u._id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                          title="Delete User"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="text-center py-12">
              <FiUsers className="mx-auto text-4xl text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No users found.</p>
            </div>
          )}
        </Card>
      )}

      {tab === 'events' && (
        <div className="space-y-4">
          {pendingEvents.length === 0 ? (
            <Card className="text-center py-20 px-6 bg-slate-50 border-dashed">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-green-500 text-3xl">
                <FiCheck />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">All caught up!</h3>
              <p className="text-slate-500">No pending events to approve at the moment.</p>
            </Card>
          ) : (
            pendingEvents.map(event => (
              <Card key={event._id} className="p-6 flex flex-col sm:flex-row items-start justify-between gap-6 border-l-4 border-l-secondary-500">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{event.eventName}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500 font-medium mb-3">
                    <span className="bg-slate-50 px-2.5 py-1 rounded-lg">📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span className="bg-slate-50 px-2.5 py-1 rounded-lg">📍 {event.location}</span>
                  </div>
                  {event.description && <p className="text-slate-600 text-sm mb-4 leading-relaxed">{event.description}</p>}
                  <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-[10px]">
                      {event.createdBy?.name?.[0]?.toUpperCase()}
                    </div>
                    Submitted by: {event.createdBy?.name} <span className="font-normal text-slate-400">({event.createdBy?.email})</span>
                  </p>
                </div>
                <Button onClick={() => approveEvent(event._id)} variant="secondary" className="w-full sm:w-auto flex-shrink-0">
                  <FiCheck className="mr-2" /> Approve Event
                </Button>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
