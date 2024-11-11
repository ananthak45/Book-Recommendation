const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loginapp', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema, 'users');

// MongoDB schemas for saved and liked books
const savedSchema = new mongoose.Schema({
  username: String,
  book: Object
});

const likedSchema = new mongoose.Schema({
  username: String,
  book: Object
});

const Saved = mongoose.model('Saved', savedSchema);
const Liked = mongoose.model('Liked', likedSchema);

// Recommendation Schema
const recommendationSchema = new mongoose.Schema({
  email: String,
  bookname: String,
  author: String,
  comment: String,
  stars: Number,
  googleLink: String,
  amazonLink: String,
  otherLink: String
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

// Login route with three attempt limit
let loginAttempts = {}; // Track login attempts per username

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!loginAttempts[username]) loginAttempts[username] = 0;

  try {
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username },
        { phone: username }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      loginAttempts[username] += 1;

      if (loginAttempts[username] >= 3) {
        return res.status(403).json({ message: 'Login failed three times. Register?' });
      }

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset attempts after successful login
    loginAttempts[username] = 0;
    res.json({ username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Registration route
app.post('/api/register', async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ username: newUser.username });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save book to MongoDB
app.post('/api/saveBook', async (req, res) => {
  const { username, book } = req.body;
  try {
    const existingSave = await Saved.findOne({ username, 'book.id': book.id });
    if (existingSave) {
      return res.status(400).json({ message: 'Book already saved!' });
    }
    await Saved.create({ username, book });
    console.log("Book saved");
    res.status(200).json({ message: 'Book saved!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving book', error });
  }
});

// Unsave book from MongoDB
app.delete('/api/unsaveBook', async (req, res) => {
  const { username, book } = req.body;
  try {
    await Saved.findOneAndDelete({ username, 'book.id': book.id });
    console.log("Book unsaved");
    res.status(200).json({ message: 'Book unsaved!' });
  } catch (error) {
    res.status(500).json({ message: 'Error unsaving book', error });
  }
});

// Like book in MongoDB
app.post('/api/likeBook', async (req, res) => {
  const { username, book } = req.body;
  try {
    const existingLike = await Liked.findOne({ username, 'book.id': book.id });
    if (existingLike) {
      return res.status(400).json({ message: 'Book already liked!' });
    }
    await Liked.create({ username, book });
    console.log("Book liked");
    res.status(200).json({ message: 'Book liked!' });
  } catch (error) {
    res.status(500).json({ message: 'Error liking book', error });
  }
});

// Unlike book from MongoDB
app.delete('/api/unlikeBook', async (req, res) => {
  const { username, book } = req.body;
  try {
    await Liked.findOneAndDelete({ username, 'book.id': book.id });
    console.log("Book unliked");
    res.status(200).json({ message: 'Book unliked!' });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking book', error });
  }
});

// Fetch saved books
app.get('/api/getSavedBooks/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const savedBooks = await Saved.find({ username });
    res.json({ books: savedBooks.map(item => item.book) });
  } catch (error) {
    console.error('Error fetching saved books:', error);
    res.status(500).json({ message: 'Error fetching saved books' });
  }
});

// Fetch liked books
app.get('/api/getLikedBooks/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const likedBooks = await Liked.find({ username });
    res.json({ books: likedBooks.map(item => item.book) });
  } catch (error) {
    console.error('Error fetching liked books:', error);
    res.status(500).json({ message: 'Error fetching liked books' });
  }
});

// POST route to add a recommendation
app.post('/recommend', async (req, res) => {
  const { email, bookname, author, comment, stars, googleLink, amazonLink, otherLink } = req.body;
  try {
    const recommendation = new Recommendation({ email, bookname, author, comment, stars, googleLink, amazonLink, otherLink });
    await recommendation.save();
    res.status(201).json({ message: 'Recommendation added successfully' });
  } catch (error) {
    console.error('Error inserting recommendation:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET route to fetch all recommendations
app.get('/recommendations', async (req, res) => {
  try {
    const recommendations = await Recommendation.find();
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET route to search recommendations
app.get('/recommendations/search', async (req, res) => {
  const { bookname, genre, author } = req.query;
  const searchQuery = {};
  if (bookname) searchQuery.bookname = { $regex: bookname, $options: 'i' };
  if (genre) searchQuery.genre = { $regex: genre, $options: 'i' };
  if (author) searchQuery.author = { $regex: author, $options: 'i' };

  try {
    const results = await Recommendation.find(searchQuery);
    res.json(results);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
