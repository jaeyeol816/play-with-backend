import { RequestHandler } from 'express';
import AWS from 'aws-sdk';

import { User, ComPost } from '../../entities';

AWS.config.update({
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	region: process.env.S3_REGION,
});

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
		if (comPost.user.id != userId) {
			return res.status(410).json({
				code: 410,
				message: "user is not owner of the post",
			});
		}
		//해당 게시글에 이미 이미지가 있다면 삭제하기
		if (comPost.image && comPost.image != "") {
			const temp: string = comPost.image;
			// AWS.config.update({
			// 	accessKeyId: process.env.S3_ACCESS_KEY_ID,
			// 	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
			// 	region: 'ap-northeast-2',
			// });
			const s3 = new AWS.S3();
			s3.deleteObject({
				Bucket: process.env.S3_BUCKET_NAME as string,
				Key: temp,
			}, (err, data) => {
				if (err) {
					console.error(err);
					return res.status(458).json({
						code: 458,
						message: "error while deleting existing image",
					});
				}
			});
			comPost.image = "";
			await comPost.save();
		}
		next();
	}
	catch (err) {
		console.error(err);
		res.status(408).json({
			code: 408,
			message: "server error on beforeUploadImg middleware",
		});
	}
};