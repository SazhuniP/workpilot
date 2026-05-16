import { Request, Response } from 'express';
import { Task } from '../models/Task';

export const getTasks = async (req: any, res: Response) => {
  try {
    const tasks = await Task.find({
      $or: [
        { assigneeId: req.user.id },
        { projectId: { $in: req.query.projectIds } } // Optional: filter by projects if needed
      ]
    }).sort({ updatedAt: -1 });
    
    res.status(200).json({ status: 'success', data: { tasks } });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const createOriginalTask = async (req: any, res: Response) => {
  try {
    const { title, description, projectId, status, priority, assigneeId } = req.body;
    const task = await Task.create({
      title,
      description,
      projectId,
      status: status || 'todo',
      priority: priority || 'medium',
      assigneeId: assigneeId || req.user.id,
    });
    
    res.status(201).json({ status: 'success', data: { task } });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const updateTaskStatus = async (req: any, res: Response) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json({ status: 'success', data: { task } });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
