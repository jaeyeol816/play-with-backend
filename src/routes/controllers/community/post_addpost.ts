import { Request, Response, NextFunction } from 'express';
import { User, ComPost } from '../../../entities';


export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		//토큰으로부터 작성자의 id를 얻는다.
		const writerId = (req as any).decoded.id;

		//만약 본문의 길이가 5 미만이면 오류 반환.
		if ((req.body.text as string).length < 5) {
			return res.status(456).json({
				code: 456,
				message: 'text length less than 5',
			});
		}

		//만약 제목의 길이가 2 미만이면 오류 반환
		if ((req.body.title as string).length < 2) {
			return res.status(406).json({
				code: 406,
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

		return res.status(200).json({
			code: 200,
			com_post: resultComPost,
			message: "success adding a community post",
		});
	}
	catch (err) {
		console.error(err);
		res.status(408).json({
			code: 408,
			message: "server error",
		})
	}
}