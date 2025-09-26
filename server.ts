import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB } from './src/integrations/mongodb/client.ts';
import { mongoDBService } from './src/integrations/mongodb/service.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectMongoDB();

// Routes
// Add book
app.post('/api/books', async (req: express.Request, res: express.Response) => {
  try {
    const bookData = req.body;
    const newBook = await mongoDBService.createBook(bookData);
    res.status(201).json(newBook);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get books by user
app.get('/api/books/:userId', async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const books = await mongoDBService.getBooksByUser(userId);
    res.json(books);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update book
app.put('/api/books/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedBook = await mongoDBService.updateBook(id, updateData);
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete book
app.delete('/api/books/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const deleted = await mongoDBService.deleteBook(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Profile routes (similar structure)
app.post('/api/profiles', async (req: express.Request, res: express.Response) => {
  try {
    const profileData = req.body;
    const newProfile = await mongoDBService.createProfile(profileData);
    res.status(201).json(newProfile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/profiles/:userId', async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const profile = await mongoDBService.getProfileByUser(userId);
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profiles/:userId', async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    const updatedProfile = await mongoDBService.updateProfile(userId, updateData);
    res.json(updatedProfile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Reading progress routes (similar)
app.post('/api/reading-progress', async (req: express.Request, res: express.Response) => {
  try {
    const progressData = req.body;
    const newProgress = await mongoDBService.createReadingProgress(progressData);
    res.status(201).json(newProgress);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reading-progress/:userId', async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const progress = await mongoDBService.getReadingProgressByUser(userId);
    res.json(progress);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/reading-progress/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedProgress = await mongoDBService.updateReadingProgress(id, updateData);
    if (!updatedProgress) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    res.json(updatedProgress);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
