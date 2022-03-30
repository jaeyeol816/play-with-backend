import express, { Request, Response, NextFunction } from 'express';
import { User, ComPost } from '../../../entities';

export default async (req: Request, res: Response, next: NextFunction) => {
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

		return res.status(200).json({
			code: 200,
			isEmpty: isEmpty,
			com_posts: posts,
		})
	}
	catch (err) {
		console.error(err);
		res.status(408).json({
			code: 408,
			message: "Error!",
		});
	}
};