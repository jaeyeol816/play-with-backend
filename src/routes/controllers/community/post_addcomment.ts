import express, { Request, Response, NextFunction } from 'express';
import { User, ComPost, ComComment } from '../../../entities';

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId: number = (req as any).decoded.id;
		const postId: number = req.body.post_id;
		const post = await ComPost.findOne({
			relations: ["com_comments"],
			where: { id: postId }
		});
		if (!post) {
			return res.status(409).json({
				code: 409,
				message: "post doesn't exist",
			});
		}
		const user = await User.findOne({
			relations: ["com_comments"],
			where: { id: userId },
		});
		if (!user) {
			return res.status(459).json({
				code: 459,
				message: "user doesn't exist",
			});
		}
		let comment = new ComComment();
		comment.text = req.body.text;
		comment.com_post = post;
		comment.user = user;

		if (req.body.parent_comment_id) {		//reply하는 댓글일 경우
			const parentComment = await ComComment.findOne({
				relations: ["replies"],
				where: { id: req.body.parent_comment_id },
			});
			if (parentComment) {
				if ((parentComment as ComComment).replies) {		//이미 reply하고 있는 댓글이 있는경우 -> 부모댓글이 이미 대댓글인경우
					return res.status(410).json({
						code: 410,
						message: "cannot add reply on already replying comment",
					});
				}
			}
			else {
				return res.status(469).json({
					code: 469,
					message: "parent comment doesn't exist"
				});
			}
			comment.replies = parentComment;
		}

		const result = await comment.save();
		return res.status(200).json({
			code: 200,
			message: "success",
			com_comment: result,
		});
	}
	catch (err) {
		console.error(err);
		return res.status(408).json({
			code: 408,
			message: "server error"
		});
	}
};