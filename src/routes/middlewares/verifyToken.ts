import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    (req as any).decoded = jwt.verify(req.headers.authorization as string, process.env.JWT_SECRET as string);
    return next();
  }
  catch (err) {
    if ((err as any).name == 'TokenExpiredError') {
      return res.status(402).json({
        code: 402,
        message: 'token expired!',
      });
    }
    return res.status(401).json({
      code: 401,
      message: 'invalid token!',
    });
  }
};