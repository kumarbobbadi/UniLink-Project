import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { connectionsAPI, adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { FiSearch, FiCheck, FiUserPlus, FiUsers, FiClock } from 'react-icons/fi';

function UserCard({ name, email, action, actionLabel, actionStyle = 'primary', badge }) {
  const styles = {
    primary: 'primary',
    success: 'secondary',
    ghost: 'outline'
  };
  
  return (
    <Card className="flex items-center justify-between px-5 py-4 border-l-4 border-l-transparent hover:border-l-primary-500 transition-all hover:bg-slate-50" hover={false}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-primary-700 font-bold text-lg shadow-sm flex-shrink-0">
          {name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-slate-800 font-semibold mb-0.5">{name}</p>
          <p className="text-slate-500 text-xs font-medium">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {badge && (
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${badge.style}`}>
            {badge.icon} {badge.label}
          </span>
        )}
        {action && (
          <Button
            onClick={action}
            variant={styles[actionStyle]}
            className="!py-1.5 text-sm"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function Connections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const refresh = () => connectionsAPI.getAll().then(r => setConnections(r.data)).catch(() => {});

  useEffect(() => {
    refresh();
    adminAPI.getUsers().then(r => setAllUsers(r.data)).catch(() => {});
  }, []);

  const getConnectionStatus = (userId) => {
    const conn = connections.find(c =>
      (c.senderId?._id === userId && c.receiverId?._id === user?.id) ||
      (c.receiverId?._id === userId && c.senderId?._id === user?.id) ||
      (c.senderId?._id === user?.id && c.receiverId?._id === userId) ||
      (c.receiverId?._id === user?.id && c.senderId?._id === userId)
    );
    return conn || null;
  };

  const sendRequest = async (receiverId) => {
    setLoading(true);
    try {
      await connectionsAPI.send({ receiverId });
      toast.success('Connection request sent!');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally { setLoading(false); }
  };

  const acceptRequest = async (connectionId) => {
    try {
      await connectionsAPI.accept({ connectionId });
      toast.success('Connection accepted!');
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    }
  };

  const pending = connections.filter(c => c.status === 'pending' && c.receiverId?._id === user?.id);
  const accepted = connections.filter(c => c.status === 'accepted');

  const filteredUsers = allUsers.filter(u =>
    u._id !== user?.id &&
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Network Connections</h1>
        <p className="text-slate-500">Expand your university network and connect with peers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Search & Find */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FiSearch className="text-primary-500" /> Find Students
            </h2>
            <Input
              icon={FiSearch}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="mb-4"
            />
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredUsers.map(u => {
                const conn = getConnectionStatus(u._id);
                const isSent = conn?.senderId?._id === user?.id && conn?.status === 'pending';
                const isAccepted = conn?.status === 'accepted';
                
                let actionLabel = <><FiUserPlus className="mr-1 inline" /> Connect</>;
                if (isAccepted) actionLabel = "Connected";
                if (isSent) actionLabel = <><FiClock className="mr-1 inline" /> Requested</>;

                return (
                  <UserCard
                    key={u._id}
                    name={u.name}
                    email={u.email}
                    actionLabel={actionLabel}
                    actionStyle={isAccepted ? 'ghost' : isSent ? 'ghost' : 'primary'}
                    action={isAccepted || isSent ? null : () => sendRequest(u._id)}
                  />
                );
              })}
              {filteredUsers.length === 0 && (
                <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <FiUsers className="mx-auto text-3xl text-slate-300 mb-2" />
                  <p>No students found matching your search.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Status & Connections */}
        <div className="space-y-8">
          {/* Pending requests */}
          {pending.length > 0 && (
            <Card className="p-5 border-t-4 border-t-secondary-500">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                <span>Pending Requests</span>
                <span className="bg-secondary-100 text-secondary-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{pending.length}</span>
              </h2>
              <div className="space-y-3">
                {pending.map(c => (
                  <UserCard
                    key={c._id}
                    name={c.senderId?.name}
                    email={c.senderId?.email}
                    actionLabel="Accept"
                    actionStyle="success"
                    action={() => acceptRequest(c._id)}
                  />
                ))}
              </div>
            </Card>
          )}

          {/* My connections */}
          <Card className="p-5">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              <span>My Network</span>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full">{accepted.length}</span>
            </h2>
            {accepted.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm">You haven't added any connections yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {accepted.map(c => {
                  const other = c.senderId?._id === user?.id ? c.receiverId : c.senderId;
                  return (
                    <UserCard
                      key={c._id}
                      name={other?.name}
                      email={other?.email}
                      badge={{ 
                        label: 'Connected', 
                        icon: <FiCheck />, 
                        style: 'bg-green-50 text-green-600 border border-green-200' 
                      }}
                    />
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
