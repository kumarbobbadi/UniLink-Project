const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables for local development
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/connections', require('./routes/connectionRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'UniLink API running' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Start server immediately regardless of MongoDB connection state
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB Atlas/Local
if (!process.env.MONGO_URI) {
  console.error("CRITICAL ERROR: MONGO_URI is not defined.");
} else {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
      console.error('MongoDB connection error details:');
      console.error('Message:', err.message);
      // Provide a helpful hint
      if (err.message.includes('bad auth')) {
        console.error('Hint: Check your database username and password in the connection string.');
      }
      // Ensure we don't exit the process here so the server stays alive!
    });
}
