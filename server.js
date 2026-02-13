const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// For local testing on your EliteBook
mongoose.connect('mongodb://localhost:27017/residence_db')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const PollSchema = new mongoose.Schema({
  question: String,
  opt1: String,
  opt2: String,
  v1: { type: Number, default: 0 },
  v2: { type: Number, default: 0 }
});

const Poll = mongoose.model('Poll', PollSchema);

app.get('/api/polls', async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

app.post('/api/vote', async (req, res) => {
  const { id, option } = req.body;
  const update = option === 1 ? { $inc: { v1: 1 } } : { $inc: { v2: 1 } };
  await Poll.findByIdAndUpdate(id, update);
  res.json({ success: true });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));