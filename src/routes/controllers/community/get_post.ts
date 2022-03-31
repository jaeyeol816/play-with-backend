import { Request, Response, NextFunction } from 'express';
import { User, ComPost } from '../../../entities';

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const postId: number = req.body.post_id;
		let post = await ComPost.findOne({
			relations: ["com_comments"],
			where: { id: postId }
		});
		if (!post) {
			return res.status(409).json({
				code: 409,
				message: "doesn't exist",
			});
		}
		post.views++;
		await post.save();

		//이미지 관련
		//...

		res.status(200).json({
			code: 200,
			com_post: post
		});
	}
	catch (err) {
		console.error(err);
		res.status(408).json({
			code: 408,
			message: "server error",
		});
	}
};