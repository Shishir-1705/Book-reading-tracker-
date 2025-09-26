import mongoose, { Schema, Document } from 'mongoose';

export interface IReadingProgress extends Document {
  book_id: string;
  user_id: string;
  status: string;
  current_page?: number;
  started_date?: Date;
  completed_date?: Date;
  notes?: string;
  rating?: number;
  created_at: Date;
  updated_at: Date;
}

const ReadingProgressSchema: Schema = new Schema({
  book_id: { type: String, required: true },
  user_id: { type: String, required: true },
  status: { type: String, required: true },
  current_page: { type: Number },
  started_date: { type: Date },
  completed_date: { type: Date },
  notes: { type: String },
  rating: { type: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.models.ReadingProgress || mongoose.model<IReadingProgress>('ReadingProgress', ReadingProgressSchema);
