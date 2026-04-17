const Group = require('../models/Group');

const createGroup = async (req, res) => {
  const { groupName, description } = req.body;
  if (!groupName) return res.status(400).json({ message: 'Group name is required' });
  try {
    const group = await Group.create({
      groupName, description, createdBy: req.user._id, members: [req.user._id]
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const joinGroup = async (req, res) => {
  const { groupId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member' });
    }
    group.members.push(req.user._id);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createGroup, getGroups, joinGroup };
