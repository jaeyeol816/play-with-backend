import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

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
			res.status(411).json({
				code: 411,
				message: 'You might be logged-in status',
			})
		}
		catch (err) {
			console.error(err);
			next();
		}
	}
	else {
		next();
	}
};