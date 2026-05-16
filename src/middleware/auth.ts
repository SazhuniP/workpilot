import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // If no token, we still allow but as a generic guest if routes require req.user
  if (!token) {
    req.user = { id: 'guest_id', role: 'member' };
    return next();
  }

  try {
    // Just decode without strict verification to allow any token in this no-auth mode
    const decoded = jwt.decode(token);
    req.user = decoded || { id: 'guest_id', role: 'member' };
    next();
  } catch (err) {
    req.user = { id: 'guest_id', role: 'member' };
    next();
  }
};
