import { connectMongoDB } from './client';
import Book, { IBook } from './models/Book';
import Profile, { IProfile } from './models/Profile';
import ReadingProgress, { IReadingProgress } from './models/ReadingProgress';

export class MongoDBService {
  private static instance: MongoDBService;

  private constructor() {}

  static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  async connect() {
    await connectMongoDB();
  }

  // Books operations
  async createBook(bookData: Partial<IBook>): Promise<IBook> {
    await this.connect();
    const book = new Book(bookData);
    return await book.save();
  }

  async getBooksByUser(userId: string): Promise<IBook[]> {
    await this.connect();
    return await Book.find({ user_id: userId }).sort({ created_at: -1 }).exec();
  }

  async updateBook(bookId: string, updateData: Partial<IBook>): Promise<IBook | null> {
    await this.connect();
    return await Book.findByIdAndUpdate(bookId, { ...updateData, updated_at: new Date() }, { new: true }).exec();
  }

  async deleteBook(bookId: string): Promise<boolean> {
    await this.connect();
    const result = await Book.findByIdAndDelete(bookId).exec();
    return !!result;
  }

  // Profiles operations
  async createProfile(profileData: Partial<IProfile>): Promise<IProfile> {
    await this.connect();
    const profile = new Profile(profileData);
    return await profile.save();
  }

  async getProfileByUser(userId: string): Promise<IProfile | null> {
    await this.connect();
    return await Profile.findOne({ user_id: userId }).exec();
  }

  async updateProfile(userId: string, updateData: Partial<IProfile>): Promise<IProfile | null> {
    await this.connect();
    return await Profile.findOneAndUpdate(
      { user_id: userId },
      { ...updateData, updated_at: new Date() },
      { new: true, upsert: true }
    ).exec();
  }

  // Reading Progress operations
  async createReadingProgress(progressData: Partial<IReadingProgress>): Promise<IReadingProgress> {
    await this.connect();
    const progress = new ReadingProgress(progressData);
    return await progress.save();
  }

  async getReadingProgressByUser(userId: string): Promise<IReadingProgress[]> {
    await this.connect();
    return await ReadingProgress.find({ user_id: userId }).exec();
  }

  async updateReadingProgress(progressId: string, updateData: Partial<IReadingProgress>): Promise<IReadingProgress | null> {
    await this.connect();
    return await ReadingProgress.findByIdAndUpdate(progressId, { ...updateData, updated_at: new Date() }, { new: true }).exec();
  }
}

export const mongoDBService = MongoDBService.getInstance();
