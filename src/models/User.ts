import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser {
  fullName: string;
  email: string;
  password?: string;
  role: 'admin' | 'member';
  designation: string;
  photoURL: string;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member',
  },
  designation: {
    type: String,
    default: 'Team Member',
  },
  photoURL: {
    type: String,
    default: '',
  },
}, { 
  timestamps: true 
});

const User = (mongoose.models.User as Model<IUserDocument>) || mongoose.model<IUserDocument>('User', userSchema);
export { User };
