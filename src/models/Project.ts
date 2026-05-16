import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProject {
  name: string;
  description: string;
  ownerId: string;
  members: string[];
  status: 'active' | 'on-hold' | 'completed';
  progress: number;
}

export interface IProjectDocument extends IProject, Document {
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProjectDocument>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  ownerId: { type: String, required: true },
  members: [{ type: String }],
  status: { type: String, enum: ['active', 'on-hold', 'completed'], default: 'active' },
  progress: { type: Number, default: 0 },
}, { timestamps: true });

const Project = (mongoose.models.Project as Model<IProjectDocument>) || mongoose.model<IProjectDocument>('Project', projectSchema);
export { Project };
