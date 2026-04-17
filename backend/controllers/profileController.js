const Profile = require('../models/Profile');

const getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id }).populate('userId', 'name email role');
    if (!profile) {
      profile = await Profile.create({ userId: req.user._id });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { department, year, bio, skills, interests, achievements, avatar } = req.body;
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { department, year, bio, skills, interests, achievements, avatar },
      { new: true, upsert: true, runValidators: true }
    ).populate('userId', 'name email role');
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).populate('userId', 'name email role');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyProfile, updateProfile, getUserProfile };
