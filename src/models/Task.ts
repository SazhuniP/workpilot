import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITask {
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId: string;
  dueDate?: Date;
}

export interface ITaskDocument extends ITask, Document {
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITaskDocument>({
  projectId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['todo', 'in-progress', 'review', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  assigneeId: { type: String, required: true },
  dueDate: { type: Date },
}, { timestamps: true });

const Task = (mongoose.models.Task as Model<ITaskDocument>) || mongoose.model<ITaskDocument>('Task', taskSchema);
export { Task };
