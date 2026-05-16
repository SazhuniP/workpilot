import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUserDocument } from '../models/User';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, email, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      // If user exists, we just treat it as a "login" in this no-auth mode
      const token = signToken(user._id.toString());
      return res.status(200).json({
        status: 'success',
        token,
        data: { user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } },
      });
    }

    // Create user without real password security
    user = await User.create({
      fullName,
      email,
      password: 'no-password-needed',
      role: role || 'member',
    });

    const token = signToken(user._id.toString());

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found. Please sign up.' });
    }

    const token = signToken(user._id.toString());

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          designation: user.designation,
          photoURL: user.photoURL,
        },
      },
    });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      status: 'success',
      data: { users },
    });
  } catch (err: any) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
