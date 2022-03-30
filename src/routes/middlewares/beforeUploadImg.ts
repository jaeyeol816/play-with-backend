import { RequestHandler } from 'express';
import { User, ComPost } from '../../entities';

export const beforeUploadImg: RequestHandler = async (req, res, next) => {
	try {
		const userId: number = (req as any).decoded.id;
		const comPostId: number = +req.params.post_id;
	
		const comPost = await ComPost.findOne({
			relations: ["user"],
			where: { id: comPostId},
		});
		if (!comPost) {
			return res.status(409).json({
				code: 409,
				message: "Post Doesn't exist",
			});
		}
		if ((comPost as ComPost).user.id != userId) {
			return res.status(410).json({
				code: 410,
				message: "user is not owner of the post",
			});
		}
		req.body.post_id = comPostId;
		req.body.user_id = userId;
		next();
	}
	catch (err) {
		console.error(err);
		res.status(408).json({
			code: 408,
			message: "error on beforeUploadImg middleware",
		})
	}
};