import { Request, Response, NextFunction } from 'express';
import { User, ComPost } from '../../../entities';

export default async (req: Request, res: Response, next: NextFunction) => {
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

		res.status(200).json({
			code: 200,
			isEmpty: isEmpty,
			com_posts: posts,
		});
	}
	catch (err) {
		console.error(err);
		res.status(408).json({
			code: 408,
			message: "server error"
		});
	}
};