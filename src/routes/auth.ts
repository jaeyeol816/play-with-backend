import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { isNotLoggedIn, verifyToken } from './middlewares';
import { DelUser, User } from '../entities';
import { request } from 'http';

const router = express.Router();


router.post('/login', isNotLoggedIn, (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {  //아이디, 비번 불일치 또는 비번 존재하지 않음.
      return res.status(402).json({
        code: 402,
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
      return res.status(202).json({code: 202, user, token});
    }
  })(req, res, next);
});


router.post('/join', isNotLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  const { email, nickname, password } = req.body;
	if (!email || !nickname || !password) {
		return res.status(409).json({
			code: 409,
			message: "Invalid Input",
		});
	}
  try {
    const exUser1 = await User.findOne({ select: ['id'], where: { email } });  //이미 가입된 이메일인지?
    if (exUser1) {
      return res.status(406).json({
        code: 406,
        message: 'already registered email',
      });
    }
    const exUser2 = await User.findOne({ select: ['id'], where: { nickname }}); //이미 가입된 닉네임인지?
    if (exUser2) {
      return res.status(407).json({
        code: 407,
        message: 'email is okay, but already registered nickname',
      });
    }

    const hashedPassword = await bcrypt.hash(password as string, 12);
		const hashedNickname = await bcrypt.hash(nickname, 3);
    
    //데이터베이스에 저장
    const user = new User();
    user.email = email;
    user.nickname = nickname;
    user.password = hashedPassword;
		user.annonymous_nick = hashedNickname;
    const resultUser = await user.save();

    //방금 저장한거 다시 꺼내기. (기본키를 JWT토큰의 id라는 요소로 해서 토큰 생성할 것이기 때문에 기본키 필요)
    // const resultUser = await User.findOne({ where: { nickname } });
    if (resultUser) {
      const token = jwt.sign({
        id: resultUser.id,
        nickname: resultUser.nickname,
        email: resultUser.email,
      }, process.env.JWT_SECRET as string, {
        expiresIn: '365d',
        issuer: 'play-with',
      });
      return res.status(203).json({
        code: 203,
        user: resultUser,
        token: token,
      });
    }
    else {
      return res.status(408).json({
        code: 408,
        message: 'db problem',
      });
    }
    
  }
  catch (err) {
    console.error(err);
    next(err);
  }
});


router.get('/logout', verifyToken, (req: Request, res: Response, next: NextFunction) => {
	res.status(222).json({
		code: 222,
		message: "temp",
	});
});


router.delete('/disable', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
	try {
		//추가해야 할 것: 유저를 delete할 경우 게시글을 어떻게 처리해야 할까 (게시글의 user_id를 null로 하는게 좋을듯. 이때 cascade대신 무엇을 사용해야할까)

		//사용자가 입력하여 body로 보낸 비밀번호가 토큰의 사람의 비밀번호와 같은지 체크
		const insideTokenId = (req as any).decoded.id;
		const user = await User.findOne(insideTokenId) as User;
		const result = await bcrypt.compare(req.body.password, user.password);
		if (!result) {
			return res.status(410).json({
				code: 410,
				message: "password not correct",
			});
		}

		//DelUser의 테이블에 해당 유저 정보 저장
		const delUser = new DelUser();
		delUser.original_id = user.id;
		delUser.nickname = user.nickname;
		delUser.email = user.email;
		delUser.password = user.password;
		delUser.provider = user.provider;
		delUser.point = user.point;
		delUser.gender = user.gender;
		delUser.annonymous_nick = user.annonymous_nick;
		await delUser.save();

		//User의 테이블에서 해당 유저 삭제
		await User.delete(user.id);

		//응답
		res.status(205).json({
			code: 205,
			message: "deleting account success!",
		});
	}
	catch (err) {
		console.error(err);
		return res.status(411).json({
			code: 411,
			message: "server error",
		})
	}
});



export default router;