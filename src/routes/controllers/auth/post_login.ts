import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

export default (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {  //아이디, 비번 불일치 또는 비번 존재하지 않음.
      return res.status(403).json({
        code: 403,
        message: 'Login Failed',
      })
    }
    else {  //로그인 전략 성공시 -> 토큰을 발급!
      const token = jwt.sign({
        id: user.id,
        nickname: user.nickname,
        email: user.email,
      }, process.env.JWT_SECRET as string, {
        expiresIn: '365d',
        issuer: 'play-with',
      });
      return res.status(200).json({code: 200, user, token});
    }
  })(req, res, next);
};