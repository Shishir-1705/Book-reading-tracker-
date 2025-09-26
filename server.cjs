const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/readwise_litbot')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// JWT Secret - In production, use environment variable
const JWT_SECRET = 'your_jwt_secret_key_here_change_in_production';

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  display_name: { type: String },
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Book Schema
const bookSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  total_pages: { type: Number },
  isbn: { type: String },
  description: { type: String },
  genre: { type: String },
  cover_url: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Book Schema
const Book = mongoose.model('Book', bookSchema);

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, display_name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      display_name
    });
    const savedUser = await user.save();

    // Generate JWT
    const token = jwt.sign(
      { user_id: savedUser._id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        email: savedUser.email,
        display_name: savedUser.display_name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { user_id: user._id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        display_name: user.display_name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/books', authenticateToken, async (req, res) => {
  try {
    const bookData = { ...req.body, user_id: req.user.user_id };
    const book = new Book(bookData);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/books/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.params.userId !== req.user.user_id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const books = await Book.find({ user_id: req.user.user_id }).sort({ created_at: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/books/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (book.user_id.toString() !== req.user.user_id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, { ...req.body, updated_at: new Date() }, { new: true });
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/books/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (book.user_id.toString() !== req.user.user_id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profile Schema
const profileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  avatar_url: { type: String },
  display_name: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Profile = mongoose.model('Profile', profileSchema);

app.post('/api/profiles', authenticateToken, async (req, res) => {
  try {
    const profileData = { ...req.body, user_id: req.user.user_id };
    const profile = new Profile(profileData);
    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/profiles/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.params.userId !== req.user.user_id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const profile = await Profile.findOne({ user_id: req.user.user_id });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reading Progress Schema
const readingProgressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  current_page: { type: Number, default: 0 },
  status: { type: String, enum: ['not_started', 'reading', 'completed', 'on_hold', 'abandoned'], default: 'not_started' },
  rating: { type: Number, min: 0, max: 5 },
  notes: { type: String },
  completed_date: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const ReadingProgress = mongoose.model('ReadingProgress', readingProgressSchema);

app.post('/api/reading-progress', authenticateToken, async (req, res) => {
  try {
    const progressData = { ...req.body, user_id: req.user.user_id };
    const progress = new ReadingProgress(progressData);
    const savedProgress = await progress.save();
    res.status(201).json(savedProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reading-progress/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.params.userId !== req.user.user_id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const progress = await ReadingProgress.find({ user_id: req.user.user_id });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/reading-progress/:id', authenticateToken, async (req, res) => {
  try {
    const progress = await ReadingProgress.findById(req.params.id);
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    if (progress.user_id.toString() !== req.user.user_id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const updatedProgress = await ReadingProgress.findByIdAndUpdate(req.params.id, { ...req.body, updated_at: new Date() }, { new: true });
    res.json(updatedProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profiles/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.params.userId !== req.user.user_id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const updatedProfile = await Profile.findOneAndUpdate(
      { user_id: req.user.user_id },
      { ...req.body, updated_at: new Date() },
      { new: true, upsert: true }
    );
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Chat Endpoint (replicating Supabase Edge Function)
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get the LOVABLE_API_KEY from environment
    const apiKey = process.env.LOVABLE_API_KEY;

    if (!apiKey) {
      console.error("LOVABLE_API_KEY not found in environment, please enable the AI gateway");
      return res.status(500).json({ error: "AI service unavailable" });
    }

    // Call the Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable literature companion and book discussion expert. You help readers discover themes, analyze literary works, discuss authors, and enhance their reading experience. You can discuss plot elements, character development, writing styles, historical context, and recommend similar books. Always be encouraging about reading and provide thoughtful, scholarly insights while keeping the conversation engaging and accessible.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI Gateway error:", await response.text());
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return res.status(429).json({ error: "Rate limit exceeded" });
      }

      return res.status(500).json({ error: "Failed to get AI response" });
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content;

    if (!aiMessage) {
      console.error("No response from AI", data);
      return res.status(500).json({ error: "No response from AI" });
    }

    res.json({ response: aiMessage });
  } catch (error) {
    console.error("Error in AI call:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
