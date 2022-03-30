import { Request, Response, NextFunction } from 'express';
import { ComPost, DelComPost } from '../../../entities';


export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		//일단 해당 게시글이 이 유저가 작성한 글이 맞는지 확인
		const postId = req.body.post_id;
		const userId = (req as any).decoded.id;
		const post = await ComPost.findOne({
			relations: ["user"],
			where: { id: postId },
		});
		if (!post) {		//해당 게시글이 없는 경우
			return res.status(409).json({
				code: 409,
				message: "doesn't exist"
			});
		}
		else if ((post as ComPost).user.id!= userId) {		//해당 게시글의 user_id가 토큰의 유저 id와 다른 경우
			return res.status(410).json({
				code: 410, 
				message: "don't have permisson to delete other's post"
			});
		}

		//해당 게시글의 데이터를 DelComPost으로 옮긴다.
		let delPost = new DelComPost();
		delPost.original_id = postId;
		delPost.original_user_id = userId;
		delPost.image = (post as ComPost).image;
		delPost.title = (post as ComPost).title;
		delPost.text = (post as ComPost).text;
		delPost.subject = (post as ComPost).subject;
		await delPost.save();

		//ComPost에서 해당 게시글을 삭제한다.
		await ComPost.delete(postId);

		//사용자에게 리턴
		res.status(200).json({
			code: 200,
			message: "deleted post",
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
