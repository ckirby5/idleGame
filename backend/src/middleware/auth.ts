import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export interface AuthenticatedRequest extends Request {
  userId: number;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    (req as AuthenticatedRequest).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}