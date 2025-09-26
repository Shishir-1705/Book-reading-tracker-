import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  user_id: string;
  avatar_url?: string;
  display_name?: string;
  created_at: Date;
  updated_at: Date;
}

const ProfileSchema: Schema = new Schema({
  user_id: { type: String, required: true, unique: true },
  avatar_url: { type: String },
  display_name: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
