import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { profileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { FiEdit2, FiCheck, FiX, FiAward, FiHeart, FiCode } from 'react-icons/fi';

const Tag = ({ children, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-50 text-primary-700 border border-primary-100',
    secondary: 'bg-secondary-50 text-secondary-700 border border-secondary-100',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200'
  };
  return (
    <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm ${colors[color]}`}>
      {children}
    </span>
  );
};

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    department: '', year: '', bio: '',
    skills: '', interests: '', achievements: ''
  });

  useEffect(() => {
    profileAPI.getMe()
      .then(res => {
        const p = res.data;
        setProfile(p);
        setForm({
          department: p.department || '',
          year: p.year || '',
          bio: p.bio || '',
          skills: (p.skills || []).join(', '),
          interests: (p.interests || []).join(', '),
          achievements: (p.achievements || []).join(', ')
        });
      })
      .catch(() => toast.error('Failed to load profile'));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const split = (str) => str.split(',').map(s => s.trim()).filter(Boolean);
    try {
      const res = await profileAPI.update({
        department: form.department,
        year: form.year,
        bio: form.bio,
        skills: split(form.skills),
        interests: split(form.interests),
        achievements: split(form.achievements)
      });
      setProfile(res.data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">My Profile</h1>
          <p className="text-slate-500">Manage your personal information and student portfolio</p>
        </div>
        {!editing && (
          <Button variant="primary" onClick={() => setEditing(true)} className="sm:w-auto w-full">
            <FiEdit2 className="mr-2" /> Edit Profile
          </Button>
        )}
      </div>

      {!editing ? (
        <Card className="overflow-hidden">
          {/* Header banner */}
          <div className="h-32 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 relative">
            <div className="absolute inset-0 bg-white/10 opacity-50 backdrop-blur-sm"></div>
          </div>

          <div className="px-6 sm:px-10 pb-10">
            {/* Avatar */}
            <div className="-mt-16 mb-4 flex justify-between items-end">
              <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg relative rounded-3xl">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-primary-700 font-bold text-5xl">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-800 mb-1">{user?.name}</h2>
              <p className="text-slate-500 font-medium">{user?.email}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <Tag color="slate">{user?.role?.toUpperCase()}</Tag>
              {profile.department && <Tag color="primary">{profile.department}</Tag>}
              {profile.year && <Tag color="secondary">{profile.year}</Tag>}
            </div>

            {profile.bio && (
              <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">About Me</h3>
                <p className="text-slate-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            <div className="space-y-8">
              {[
                { label: 'Skills', items: profile.skills, color: 'primary', icon: FiCode },
                { label: 'Interests', items: profile.interests, color: 'secondary', icon: FiHeart },
                { label: 'Achievements', items: profile.achievements, color: 'slate', icon: FiAward }
              ].map(section => section.items?.length > 0 && (
                <div key={section.label}>
                  <div className="flex items-center gap-2 mb-3">
                    <section.icon className="text-slate-400" />
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">{section.label}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {section.items.map((item, i) => (
                      <Tag key={i} color={section.color}>{item}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {!profile.department && !profile.bio && !profile.skills?.length && (
              <div className="text-center py-12 px-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 mt-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl">
                  👻
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">It's pretty empty here</h3>
                <p className="text-slate-500 mb-4">Complete your profile to connect better with your peers.</p>
                <Button variant="outline" onClick={() => setEditing(true)}>
                  Complete Profile
                </Button>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-6 sm:p-10">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Department"
                value={form.department}
                onChange={set('department')}
                placeholder="e.g. Computer Science"
              />
              <Input
                label="Year"
                value={form.year}
                onChange={set('year')}
                placeholder="e.g. 3rd Year"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-1.5 ml-1">Bio</label>
              <textarea
                value={form.bio}
                onChange={set('bio')}
                rows={4}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm resize-none"
                placeholder="Tell your peers about yourself..."
              />
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-100">
              <h3 className="font-semibold text-slate-800">Tags & Badges</h3>
              {[
                { label: 'Skills', key: 'skills', placeholder: 'React, Python, Machine Learning' },
                { label: 'Interests', key: 'interests', placeholder: 'AI Research, Open Source, Music' },
                { label: 'Achievements', key: 'achievements', placeholder: "Dean's List, Best Paper Award" }
              ].map(f => (
                <div key={f.key}>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">{f.label}</label>
                    <span className="text-xs text-slate-400">Comma separated</span>
                  </div>
                  <input
                    value={form[f.key]}
                    onChange={set(f.key)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-100">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : (
                  <span className="flex items-center gap-2"><FiCheck /> Save Changes</span>
                )}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                <FiX className="mr-2" /> Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
