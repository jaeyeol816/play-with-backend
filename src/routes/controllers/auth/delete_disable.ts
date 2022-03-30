import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User, DelUser } from '../../../entities';

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		//추가해야 할 것: 유저를 delete할 경우 게시글을 어떻게 처리해야 할까 (게시글의 user_id를 null로 하는게 좋을듯. 이때 cascade대신 무엇을 사용해야할까)

		//사용자가 입력하여 body로 보낸 비밀번호가 토큰의 사람의 비밀번호와 같은지 체크
		const insideTokenId = (req as any).decoded.id;
		const user = await User.findOne(insideTokenId) as User;
		const result = await bcrypt.compare(req.body.password, user.password);
		if (!result) {
			return res.status(403).json({
				code: 403,
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
		res.status(200).json({
			code: 200,
			message: "deleting account success!",
		});
	}
	catch (err) {
		console.error(err);
		return res.status(408).json({
			code: 408,
			message: "server error",
		})
	}
};