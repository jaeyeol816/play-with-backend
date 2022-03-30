import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { isNotLoggedIn, verifyToken } from './middlewares';
import { DelUser, User } from '../entities';
import { authController } from './controllers/auth';

const router = express.Router();


router.post('/login', isNotLoggedIn, authController.post_login);

router.post('/join', isNotLoggedIn, authController.post_join);

router.get('/logout', verifyToken, authController.get_logout);

router.delete('/disable', verifyToken, authController.delete_disable);


export default router;