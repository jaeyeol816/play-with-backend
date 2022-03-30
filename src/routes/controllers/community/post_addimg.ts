import { Request, Response, NextFunction } from 'express';
import { User, ComPost, ComComment } from '../../../entities';

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		//업로드 완료된 시점임.
		const postId: number = +req.params.post_id;
		let comPost = await ComPost.findOne(postId);
		if (!comPost) {
			return res.status(409).json({
				code: 409,
				message: "doesn't exist",
			});
		}
		console.log(req.file);		//test code
		comPost.image = (req.file as any).key;
		const result = await comPost.save();
		return res.status(200).json({
			code: 200,
			com_post: result,
		});
	}
	catch (err) {
		console.error(err);
		return res.status(408).json({
			code: 408,
			message: "server error after uploading",
		});
	}
};