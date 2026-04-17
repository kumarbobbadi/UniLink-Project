import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { FiCalendar, FiClock, FiMapPin, FiPlus, FiX, FiCheck } from 'react-icons/fi';

function EventCard({ event, userId, isAdmin, onRegister }) {
  const isRegistered = event.participants?.some(p => p._id === userId);
  const isPast = new Date(event.date) < new Date();

  return (
    <Card className="p-6 transition-all hover:border-primary-200" hover={true}>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h3 className="text-xl font-bold text-slate-800">{event.eventName}</h3>
            {isPast ? (
              <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full border border-slate-200">
                Past Event
              </span>
            ) : (
              <span className="text-xs font-semibold bg-secondary-50 text-secondary-600 px-2.5 py-1 rounded-full border border-secondary-100">
                Upcoming
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium mb-4">
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
              <FiCalendar className="text-primary-500" /> 
              {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
              <FiClock className="text-primary-500" />
              {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
              <FiMapPin className="text-primary-500" />
              {event.location}
            </span>
          </div>
          
          {event.description && (
            <p className="text-slate-600 text-sm leading-relaxed mb-5">{event.description}</p>
          )}
          
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5 text-primary-600 bg-primary-50 px-2 py-1 rounded">
              🎫 {event.participants?.length || 0} registered
            </span>
            {event.createdBy && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>Organized by {event.createdBy.name}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0 w-full sm:w-auto">
          {isRegistered ? (
            <span className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-green-50 text-green-600 border border-green-200 px-5 py-2.5 rounded-xl text-sm font-semibold">
              <FiCheck /> Registered
            </span>
          ) : !isPast ? (
            <Button
              onClick={() => onRegister(event._id)}
              variant="primary"
              className="w-full sm:w-auto"
            >
              Register Now
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export default function Events() {
  const { user, isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ eventName: '', date: '', location: '', description: '' });

  const fetchEvents = () => eventsAPI.getAll().then(r => setEvents(r.data)).catch(() => {});

  useEffect(() => { fetchEvents(); }, []);

  const createEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await eventsAPI.create(form);
      toast.success(isAdmin ? 'Event created!' : 'Event submitted for admin approval!');
      setForm({ eventName: '', date: '', location: '', description: '' });
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const registerForEvent = async (eventId) => {
    try {
      await eventsAPI.register({ eventId });
      toast.success("You're registered! 🎉");
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register');
    }
  };

  const upcoming = events.filter(e => new Date(e.date) >= new Date());
  const past = events.filter(e => new Date(e.date) < new Date());

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Campus Events</h1>
          <p className="text-slate-500">Discover and register for upcoming activities</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'secondary' : 'primary'}>
          {showForm ? (
            <span className="flex items-center gap-2"><FiX /> Cancel</span>
          ) : (
            <span className="flex items-center gap-2"><FiPlus /> {isAdmin ? 'Create Event' : 'Suggest Event'}</span>
          )}
        </Button>
      </div>

      {!isAdmin && (
        <div className="bg-primary-50 border border-primary-100 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
          <span className="text-primary-500 text-xl">💡</span>
          <p className="text-sm font-medium text-primary-700">Events you suggest will be visible to everyone after an admin approves them.</p>
        </div>
      )}

      {showForm && (
        <Card className="p-6 sm:p-8 mb-8 border-t-4 border-t-secondary-500">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FiCalendar className="text-secondary-500" />
            {isAdmin ? 'Create a New Event' : 'Submit Event for Approval'}
          </h2>
          <form onSubmit={createEvent} className="space-y-5">
            <Input
              label="Event Name"
              value={form.eventName}
              onChange={e => setForm(f => ({ ...f, eventName: e.target.value }))}
              placeholder="e.g. Annual Tech Symposium"
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1.5 ml-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm"
                  required
                />
              </div>
              <Input
                label="Location"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Main Auditorium"
                required
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-1.5 ml-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-sm resize-none"
                rows={4}
                placeholder="What is this event about? Who should attend?"
              />
            </div>
            
            <div className="flex justify-end pt-3 text-right">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Submitting...' : isAdmin ? 'Create Event' : 'Submit for Approval'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {upcoming.length === 0 && past.length === 0 ? (
        <Card className="text-center py-20 px-6 bg-slate-50 border-dashed">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-secondary-500 text-3xl">
            📅
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No events scheduled</h3>
          <p className="text-slate-500 mb-6">There are no approved events at the moment.</p>
        </Card>
      ) : (
        <div className="space-y-10">
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary-500"></span>
                Upcoming Events <span className="bg-slate-100 text-slate-500 text-sm px-2.5 py-0.5 rounded-full ml-2">{upcoming.length}</span>
              </h2>
              <div className="space-y-4">
                {upcoming.map(event => (
                  <EventCard key={event._id} event={event} userId={user?.id} isAdmin={isAdmin} onRegister={registerForEvent} />
                ))}
              </div>
            </div>
          )}
          
          {past.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                Past Events
              </h2>
              <div className="space-y-4 opacity-70 cursor-not-allowed">
                {past.map(event => (
                  <EventCard key={event._id} event={event} userId={user?.id} isAdmin={isAdmin} onRegister={() => {}} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
