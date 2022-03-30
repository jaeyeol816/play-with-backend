import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { DelUser, User } from '../../../entities';

export default async (req: Request, res: Response, next: NextFunction) => {
  const { email, nickname, password } = req.body;
	if (!email || !nickname || !password) {
		return res.status(406).json({
			code: 406,
			message: "Invalid Input",
		});
	}
  try {
    const exUser1 = await User.findOne({ select: ['id'], where: { email } });  //이미 가입된 이메일인지?
    if (exUser1) {
      return res.status(405).json({
        code: 405,
        message: 'already registered email',
      });
    }
    const exUser2 = await User.findOne({ select: ['id'], where: { nickname }}); //이미 가입된 닉네임인지?
    if (exUser2) {
      return res.status(455).json({
        code: 405,
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
      return res.status(200).json({
        code: 200,
        user: resultUser,
        token: token,
      });
    }
    else {
      return res.status(407).json({
        code: 407,
        message: 'db problem',
      });
    }
    
  }
  catch (err) {
    console.error(err);
    next(err);
  }
}