import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  user_id: string;
  title: string;
  author: string;
  total_pages?: number;
  isbn?: string;
  description?: string;
  genre?: string;
  cover_url?: string;
  created_at: Date;
  updated_at: Date;
}

const BookSchema: Schema = new Schema({
  user_id: { type: String, required: true },
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

export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
