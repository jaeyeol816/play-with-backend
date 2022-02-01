import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { verifyToken } from './middlewares';
import { User } from '../entities';

const router = express.Router();

router.get('/test', verifyToken, (req: Request, res: Response) => {
  res.status(201).json((req as any).decoded);
});




export default router;