import { Request, Response, NextFunction } from 'express';
import { User, ComPost, ComComment, DelComComment } from '../../../entities';

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const commentId = req.body.comment_id;
		const userId = (req as any).decoded.id;
		const comment = await ComComment.findOne({
			relations: ["user", "com_post", "replies"],
			where: { id: commentId },
		});
		if (!comment) {		//해당 댓글이 없는 경우
			return res.status(409).json({
				code: 409,
				message: "doesn't exist",
			});
		}
		else if ((comment as ComComment).user.id != userId) {		//해당 댓글의 user_id가 토큰의 유저id와 다른 경우
			return res.status(410).json({
				code: 410,
				message: "don't have permission to delete other's comment"
			});
		}

		//해당 댓글의 데이터를 DelComComment으로 옮긴다.
		let delComment = new DelComComment();
		delComment.original_id = commentId;
		delComment.original_user_id = userId;
		delComment.original_post_id = comment.com_post.id;
		delComment.text = comment.text;
		delComment.image = comment.image;
		if (comment.replies) {
			delComment.replies_comment_id = comment.replies.id;
		}
		await delComment.save();

		//ComComment에서 해당 댓글 삭제
		await ComComment.delete(commentId);

		//사용자에게 리턴
		return res.status(200).json({
			code: 200,
			message: "deleted comment",
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