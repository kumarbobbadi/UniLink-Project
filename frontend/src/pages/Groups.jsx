import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { groupsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { FiUsers, FiPlus, FiX } from 'react-icons/fi';

export default function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ groupName: '', description: '' });

  const fetchGroups = () => groupsAPI.getAll().then(r => setGroups(r.data)).catch(() => {});

  useEffect(() => { fetchGroups(); }, []);

  const createGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await groupsAPI.create(form);
      toast.success('Group created!');
      setForm({ groupName: '', description: '' });
      setShowForm(false);
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    } finally { setLoading(false); }
  };

  const joinGroup = async (groupId) => {
    try {
      await groupsAPI.join({ groupId });
      toast.success('Joined successfully!');
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join');
    }
  };

  const isMember = (group) => group.members?.some(m => m._id === user?.id);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Study Groups</h1>
          <p className="text-slate-500">Find your tribe and collaborate easily</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'secondary' : 'primary'}>
          {showForm ? (
            <span className="flex items-center gap-2"><FiX /> Cancel</span>
          ) : (
            <span className="flex items-center gap-2"><FiPlus /> New Group</span>
          )}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 sm:p-8 mb-8 border-l-4 border-l-primary-500">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Create a Study Group</h2>
          <form onSubmit={createGroup} className="space-y-5">
            <Input
              label="Group Name"
              value={form.groupName}
              onChange={e => setForm(f => ({ ...f, groupName: e.target.value }))}
              placeholder="e.g. Advanced AI Research"
              required
            />
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-1.5 ml-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm resize-none"
                rows={3}
                placeholder="What is this group about?"
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Creating...' : 'Create Group'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {groups.length === 0 ? (
        <Card className="text-center py-20 px-6 bg-slate-50 border-dashed">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary-500">
            <FiUsers size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No groups yet</h3>
          <p className="text-slate-500 mb-6">Create the first study group and start collaborating!</p>
          <Button onClick={() => setShowForm(true)}>Create Group</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map(group => (
            <Card key={group._id} className="p-6 flex flex-col h-full hover:border-primary-200" hover={true}>
              <div className="flex justify-between items-start mb-4 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-800 leading-tight">{group.groupName}</h3>
                    {isMember(group) && (
                      <span className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full font-semibold border border-primary-100 flex-shrink-0">
                        Joined
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-400 flex items-center gap-1.5 mb-3">
                    <span>By {group.createdBy?.name}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center text-primary-600 font-bold text-lg shadow-sm flex-shrink-0">
                  {group.groupName?.[0]?.toUpperCase()}
                </div>
              </div>
              
              {group.description && (
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">{group.description}</p>
              )}
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {group.members?.slice(0, 4).map((m, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs text-slate-600 font-bold shadow-sm"
                        title={m.name}
                      >
                        {m.name?.[0]?.toUpperCase()}
                      </div>
                    ))}
                    {group.members?.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-500 font-bold shadow-sm">
                        +{group.members.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-500 ml-1">
                    {group.members?.length} member{group.members?.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {!isMember(group) && (
                  <Button onClick={() => joinGroup(group._id)} variant="outline" className="!py-1.5 !px-4 !text-sm">
                    Join
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
