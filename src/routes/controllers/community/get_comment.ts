import express, { Request, Response, NextFunction } from 'express';
import { User, ComPost, ComComment } from '../../../entities';

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const commentId: number = req.body.comment_id;
		const comment = await ComComment.findOne({
			where: { id: commentId },
		});
		if (!comment) {
			return res.status(409).json({
				code: 409,
				message: "doesn't exist",
			});
		}
		return res.status(200).json({
			code: 200,
			com_comment: comment
		});
	}
	catch (err) {
		console.error(err);
		return res.status(408).json({
			code: 408,
			message: "server error",
		});
	}
};