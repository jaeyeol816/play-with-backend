import express, { Request, Response, NextFunction } from 'express';
import { User, ComPost, ComComment } from '../../../entities';

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		//일단 해당 게시글이 이 유저가 작성한 글이 맞는지 확인
		const postId: number = req.body.post_id;
		const userId: number = (req as any).decoded.id;
		const post = await ComPost.findOne({
			relations: ["user"],
			where: { id: postId }
		});
		if (!post) {		//해당 게시글이 없는 경우
			return res.status(409).json({
				code: 409,
				message: "doesn't exist",
			});
		}
		else if ((post as ComPost).user.id != userId) {		//해당 게시글의 user_id가 토큰의 유저 id와 다른 경우
			return res.status(410).json({
				code: 410,
				message: "don't have permission to change other's post"
			});
		}
		
		//해당 게시글의 정보를 수정 후 저장
		if (req.body.text_changed && req.body.text) {
			if ((req.body.text as string).length < 5) {		//본문의 길이가 5 미만이면 오류
				return res.status(456).json({
					code: 456,
					message: "text length less than 5"
				});
			}
			else 
				post.text = req.body.text;
		}
		if (req.body.title_changed && req.body.title) {
			if ((req.body.title as string).length < 2) {
				return res.status(406).json({
					code: 406,
					message: "title length less than 2",
				});
			}
			else 
				post.title = req.body.title;
		}
		if (req.body.subject_changed && req.body.subject) {
			post.subject = req.body.subject;
		}
		const result = await post.save();
		
		//리턴
		return res.status(200).json({
			code: 200,
			com_post: result,
			message: "success patching a community post",
		});
	}
	catch (err) {
		console.error(err);
		return res.status(408).json({
			code: 408,
			message: "server error"
		});
	}
}