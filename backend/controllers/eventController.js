const Event = require('../models/Event');

const createEvent = async (req, res) => {
  const { eventName, date, location, description } = req.body;
  if (!eventName || !date || !location) return res.status(400).json({ message: 'eventName, date, and location are required' });
  try {
    const event = await Event.create({
      eventName, date, location, description, createdBy: req.user._id,
      approved: req.user.role === 'admin'
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ approved: true })
      .populate('createdBy', 'name email')
      .populate('participants', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.participants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered' });
    }
    event.participants.push(req.user._id);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createEvent, getEvents, registerForEvent };
