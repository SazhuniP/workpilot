import { Request, Response } from 'express';
import { Project } from '../models/Project';

export const getProjects = async (req: any, res: Response) => {
  try {
    const projects = await Project.find({
      members: req.user.id
    }).sort({ updatedAt: -1 });
    
    res.status(200).json({ status: 'success', data: { projects } });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const createProject = async (req: any, res: Response) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      ownerId: req.user.id,
      members: [req.user.id],
    });
    
    res.status(201).json({ status: 'success', data: { project } });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const deleteProject = async (req: any, res: Response) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.id
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or you do not have permission' });
    }
    
    res.status(204).json({ status: 'success', data: null });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
