import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { verifyToken } from './middlewares';
import { User, ComPost, ComComment } from '../entities';


const router = express.Router();

router.post('/add', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
	try {
		//토큰으로부터 작성자의 id를 얻는다.
		const writerId = (req as any).decoded.id;

		//만약 본문의 길이가 5 미만이면 오류 반환.
		if ((req.body.text as string).length < 5) {
			return res.status(420).json({
				code: 420,
				message: 'text length less than 5',
			});
		}

		//만약 제목의 길이가 2 미만이면 오류 반환
		if ((req.body.title as string).length < 2) {
			return res.status(421).json({
				code: 421,
				message: 'title length less than 2',
			});
		}
		//데이터베이스에 저장
		const user = await User.findOne(writerId);	//작성자ID에 해당하는 User객체 가져오기.(ComPost엔티티는 User엔티티와 관계되어있으므로)
		const comPost = new ComPost();	//새 투플 생성
		comPost.user = user;
		comPost.title = req.body.title;
		comPost.text = req.body.text;
		comPost.views = 0;
		const resultComPost = await comPost.save();

		return res.json({
			code: 204,
			com_post: resultComPost,
			message: "success adding a community post",
		});
	}
	catch (err) {
		console.error(err);
		res.status(422).json({
			code: 422,
			message: "server error",
		})
	}
});

router.get('/mypost', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const writerId = (req as any).decoded.id;

		const posts = await ComPost.find({
			where: { user: { id: writerId } },
			order: { created_at: 'DESC'},
			take: 5,
			skip: 5 * (req.body.num - 1),
		});

		return res.json({
			code: 205,
			posts: posts,
		})
	}
	catch (err) {
		console.error(err);
		res.status(423).json({
			code: 423,
			message: "Error!",
		});
	}
});

export default router;