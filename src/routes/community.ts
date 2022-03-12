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
		comPost.subject = req.body.subject;
		comPost.views = 0;
		const resultComPost = await comPost.save();

		return res.status(221).json({
			code: 221,
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
			skip: 5 * (req.body.page_num - 1),
		});

		let isEmpty: boolean;
		(posts.length == 0) ? isEmpty = true : isEmpty = false;

		return res.status(222).json({
			code: 222,
			isEmpty: isEmpty,
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


router.get('/show', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const subject_num = req.body.subject_num;
		let posts : ComPost[];
		if (subject_num == 0) {		//모든 종목 보기
			posts = await ComPost.find({
				order: { created_at: 'DESC' },
				take: 10,
				skip: 10 * (req.body.page_num - 1),
			});
		}
		else {		
			posts = await ComPost.find({
				where: { subject: subject_num },
				order: { created_at: 'DESC' },
				take: 10,
				skip: 10 * (req.body.page_num - 1),
			});	
		}
		
		let isEmpty: boolean;
		(posts.length == 0) ? isEmpty = true : isEmpty = false;

		res.status(223).json({
			code: 223,
			isEmpty: isEmpty,
			posts: posts,
		});
	}
	catch (err) {
		console.error(err);
		res.status(424).json
	}
})

export default router;