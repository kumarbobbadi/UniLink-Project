import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      login(res.data.token, res.data.user);
      toast.success('Welcome to UniLink! 🎉');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.msg
        || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex selection:bg-primary-200">
      {/* Left graphic panel */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-primary-600 to-secondary-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <span className="text-primary-600 font-bold text-xl font-display">U</span>
            </div>
            <h1 className="font-display text-4xl text-white font-bold">UniLink</h1>
          </div>
          <p className="text-primary-100 mt-4 text-lg">Your campus universe, connected.</p>
        </div>
        
        <div className="space-y-8 relative z-10">
          {[
            { title: 'Connect with Peers', text: 'Build meaningful connections across departments.' },
            { title: 'Campus Events', text: 'Never miss out on what is happening around you.' },
            { title: 'Join Groups', text: 'Find your tribe and collaborate easily.' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col">
              <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-primary-100 opacity-90">{item.text}</p>
            </div>
          ))}
        </div>
        
        <div className="relative z-10">
           <p className="text-primary-200 text-sm">© {new Date().getFullYear()} UniLink Platform. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 my-8">
          <div className="lg:hidden text-center mb-8 flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-md mb-3">
              <span className="text-white font-bold text-2xl font-display">U</span>
            </div>
            <h1 className="font-display text-3xl text-slate-800 font-bold">UniLink</h1>
            <p className="text-slate-500 mt-1">Your campus universe, connected.</p>
          </div>

          <div className="mb-8 hidden lg:block">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
            <p className="text-slate-500">Join the ultimate student network</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              icon={FiUser}
              value={form.name}
              onChange={set('name')}
              placeholder="Your full name"
              required
            />
            
            <Input
              label="Email Address"
              type="email"
              icon={FiMail}
              value={form.email}
              onChange={set('email')}
              placeholder="you@university.edu"
              required
            />
            
            <Input
              label="Password"
              type="password"
              icon={FiLock}
              value={form.password}
              onChange={set('password')}
              placeholder="Min 6 characters"
              required
            />
            
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-1.5 ml-1">Role</label>
              <select
                value={form.role}
                onChange={set('role')}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? 'Creating account...' : (
                <span className="flex items-center gap-2">
                  Create Account <FiArrowRight />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
