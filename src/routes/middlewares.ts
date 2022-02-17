import { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import { User } from '../entities';


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
// export const isLoggedIn: RequestHandler = async (req, res, next) => {
//   // // src/passport/jwtStrategy.ts와 연결됨
//   // passport.authenticate('jwt', { session: false }, (authError, user, info) => {
//   //   if (authError || !user) {
//   //     res.status(403).json({
//   //       code: 403,
//   //       message: 'jwt token error',
//   //     })
//   //   }
//   //   req.user = user;
//   //   next();
//   // })(req, res, next);

// 	//passport 안쓰고 해보았다
// 	try {
// 		(req as any).decoded = jwt.verify(req.headers.authorization as string, process.env.JWT_SECRET as string);
// 		const inputId = (req as any).decoded.id;
// 		const exUser = await User.findOne({ where: { id: inputId } });
// 		if (exUser) {
// 			req.user = exUser;
// 			next();
// 		}
// 		else {
// 			res.status(403).json({
// 				code: 403,
// 				message: "jwt token error-- At IsLoggedIn",
// 			});
// 		}
// 	}
// 	catch (err) {
// 		console.error(err);
// 		next(err);
// 	}
// }


//단순히 요청으로 JWT토큰이 들어왔는지만 확인 (수정 필요할듯?)
export const isNotLoggedIn: RequestHandler = (req, res, next) => {
  // if (req.headers.authorization) {		//헤더에 Aurthorization이 있다
	// 	//isLoggedIn과 마찬가지로 passport.authenticate수행. 하지만 반대로 로그인된 상태면 400번대 리턴
	// 	passport.authenticate('jwt', { session: false }, (authError, user, info) => {
	// 		console.log(user);
	// 		if (user) {		//로그인된 상태라면
	// 			res.status(405).json({
	// 				code: 405,
	// 				message: 'you might be logged-in status',
	// 			});
	// 		}
	// 	})(req, res, next);
  // }
	// else {}	//헤더에 Authorization이 없다 -> 무조건 로그인 된 상태 아님
  // next();

	//passport 안쓰고 해보았다
	if (req.headers.authorization) {
		try {
			const decoded = jwt.verify(req.headers.authorization as string, process.env.JWT_SECRET as string);
			res.status(405).json({
				code: 405,
				message: 'You might be logged-in status',
			})
		}
		catch (err) {
			console.log("test2");
			next();
		}
	}
	else {
		next();
	}
}