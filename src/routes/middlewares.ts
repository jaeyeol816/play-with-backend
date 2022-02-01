import { info } from 'console';
import { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

//단순한 JWT토큰 유효성 검사
export const verifyToken: RequestHandler = (req, res, next) => {
  try {
    (req as any).decoded = jwt.verify(req.headers.authorization as string, process.env.JWT_SECRET as string);
    return next();
  }
  catch (err) {
    if ((err as any).name == 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: 'token expired!',
      });
    }
    return res.status(401).json({
      code: 401,
      message: 'invalid token!',
    });
  }
}

//요청으로 받은 JWT토큰을 통해 로그인 된 상태인지 판단    
export const isLoggedIn: RequestHandler = (req, res, next) => {
  // src/passport/jwtStrategy.ts와 연결됨
  passport.authenticate('jwt', { session: false }, (authError, user, info) => {
    if (authError || !user) {
      res.status(403).json({
        code: 403,
        message: 'jwt token error',
      })
    }
    req.user = user;
    next();
  });
}

//단순히 요청으로 JWT토큰이 들어왔는지만 확인 (수정 필요할듯?)
export const isNotLoggedIn: RequestHandler = (req, res, next) => {
  if (req.headers.authorization) {
    res.status(405).json({
      code: 405,
      message: 'you might be logged-in status',
    });
  }
  next();
}