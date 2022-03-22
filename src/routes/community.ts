import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { verifyToken } from './middlewares';
import { User, ComPost, ComComment, DelComPost, DelComComment } from '../entities';


const router = express.Router();

router.post('/addpost', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
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
			com_posts: posts,
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
			com_posts: posts,
		});
	}
	catch (err) {
		console.error(err);
		res.status(424).json({
			code: 424,
			message: "server error"
		})
	}
});


router.delete('/delete', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
	try {
		//일단 해당 게시글이 이 유저가 작성한 글이 맞는지 확인
		const postId = req.body.post_id;
		const userId = (req as any).decoded.id;
		const post = await ComPost.findOne({
			relations: ["user"],
			where: { id: postId },
		});
		if (!post) {		//해당 게시글이 없는 경우
			return res.status(425).json({
				code: 425,
				message: "doesn't exist"
			});
		}
		else if ((post as ComPost).user.id!= userId) {		//해당 게시글의 user_id가 토큰의 유저 id와 다른 경우
			return res.status(426).json({
				code: 426, 
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
		res.status(224).json({
			code: 224,
			message: "deleted post",
		});
	}
	catch (err) {
		console.error(err);
		res.status(427).json({
			code: 427,
			message: "server error",
		});
	}
});


router.get('/post', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const postId: number = req.body.post_id;
		let post = await ComPost.findOne({
			relations: ["com_comments"],
			where: { id: postId }
		});
		if (!post) {
			return res.status(428).json({
				code: 428,
				message: "doesn't exist",
			});
		}
		post.views++;
		await post.save();
		res.status(225).json({
			code: 225,
			com_post: post
		});
	}
	catch (err) {
		console.error(err);
		res.status(429).json({
			code: 429,
			message: "server error",
		});
	}
});


router.post('/addcomment', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId: number = (req as any).decoded.id;
		const postId: number = req.body.post_id;
		const post = await ComPost.findOne({
			relations: ["com_comments"],
			where: { id: postId }
		});
		if (!post) {
			return res.status(428).json({
				code: 428,
				message: "post doesn't exist",
			});
		}
		const user = await User.findOne({
			relations: ["com_comments"],
			where: { id: userId },
		});
		if (!user) {
			return res.status(430).json({
				code: 430,
				message: "user doesn't exist",
			});
		}
		let comment = new ComComment();
		comment.text = req.body.text;
		comment.com_post = post;
		comment.user = user;
		const result = await comment.save();
		return res.status(226).json({
			code: 226,
			message: "success",
			com_comment: result,
		});
	}
	catch (err) {
		return res.status(431).json({
			code: 431,
			message: "server error"
		});
	}
});


router.delete('/comment', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const commentId = req.body.comment_id;
		const userId = (req as any).decoded.id;
		const comment = await ComComment.findOne({
			relations: ["user", "com_post"],
			where: { id: commentId },
		});
		if (!comment) {		//해당 댓글이 없는 경우
			return res.status(432).json({
				code: 432,
				message: "doesn't exist",
			});
		}
		else if ((comment as ComComment).user.id != userId) {		//해당 댓글의 user_id가 토큰의 유저id와 다른 경우
			return res.status(433).json({
				code: 433,
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
		await delComment.save();

		//ComComment에서 해당 댓글 삭제
		await ComComment.delete(commentId);

		//사용자에게 리턴
		return res.status(227).json({
			code: 227,
			message: "deleted comment",
		});
	}
	catch (err) {
		console.error(err);
		return res.status(434).json({
			code: 434,
			message: "server error"
		});
	}
});


router.patch('/changepost', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
	try {
		//일단 해당 게시글이 이 유저가 작성한 글이 맞는지 확인
		const postId: number = req.body.post_id;
		const userId: number = (req as any).decoded.id;
		const post = await ComPost.findOne({
			relations: ["user"],
			where: { id: postId }
		});
		if (!post) {		//해당 게시글이 없는 경우
			return res.status(435).json({
				code: 435,
				message: "doesn't exist",
			});
		}
		else if ((post as ComPost).user.id != userId) {		//해당 게시글의 user_id가 토큰의 유저 id와 다른 경우
			return res.status(436).json({
				code: 436,
				message: "don't have permission to change other's post"
			});
		}
		
		//해당 게시글의 정보를 수정 후 저장
		if (req.body.text_changed && req.body.text) {
			if ((req.body.text as string).length < 5) {		//본문의 길이가 5 미만이면 오류
				return res.status(420).json({
					code: 420,
					message: "text length less than 5"
				});
			}
			else 
				post.text = req.body.text;
		}
		if (req.body.title_changed && req.body.title) {
			if ((req.body.title as string).length < 2) {
				return res.status(421).json({
					code: 421,
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
		return res.status(228).json({
			code: 228,
			com_post: result,
			message: "success patching a community post",
		});
	}
	catch (err) {
		console.error(err);
		return res.status(437).json({
			code: 437,
			message: "server error"
		});
	}
});


export default router;