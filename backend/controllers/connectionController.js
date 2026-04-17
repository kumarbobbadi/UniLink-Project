const Connection = require('../models/Connection');
const User = require('../models/User');

const sendConnection = async (req, res) => {
  const { receiverId } = req.body;
  if (!receiverId) return res.status(400).json({ message: 'receiverId is required' });
  if (receiverId === req.user._id.toString()) return res.status(400).json({ message: 'Cannot connect with yourself' });

  try {
    const exists = await Connection.findOne({
      $or: [
        { senderId: req.user._id, receiverId },
        { senderId: receiverId, receiverId: req.user._id }
      ]
    });
    if (exists) return res.status(400).json({ message: 'Connection already exists' });

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: 'User not found' });

    const connection = await Connection.create({ senderId: req.user._id, receiverId });
    res.status(201).json(connection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const acceptConnection = async (req, res) => {
  const { connectionId } = req.body;
  try {
    const connection = await Connection.findById(connectionId);
    if (!connection) return res.status(404).json({ message: 'Connection not found' });
    if (connection.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    connection.status = 'accepted';
    await connection.save();
    res.json(connection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
    })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email');
    res.json(connections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendConnection, acceptConnection, getConnections };
