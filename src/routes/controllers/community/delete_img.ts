import { RequestHandler } from "express";
import AWS from 'aws-sdk';

import  { User, ComPost } from '../../../entities';

AWS.config.update({
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	region: process.env.S3_REGION,
});

export const delete_img: RequestHandler = async (req, res, next) => {
	try {
		const userId: number = (req as any).decoded.id;
		const img_str: string = req.body.img_str;
		let comPost = await ComPost.findOne({ 
			where: { image: img_str },
			relations: ["user"],
		});
		if (!comPost) {
			return res.status(409).json({
				code: 409,
				message: "doesn't exist!"
			});
		}
		if (comPost.user.id != userId) {
			return res.status(410).json({
				code: 410,
				message: "cannot delete other's image",
			});
		}
		const s3 = new AWS.S3();
		s3.deleteObject({
			Bucket: process.env.S3_BUCKET_NAME as string,
			Key: img_str,
		}, (err, data) => {
			if (err) {
				console.error(err);
				return res.status(458).json({
					code: 458,
					message: "error while deleting image (S3)",
				});
			}
		});
		comPost.image = "";
		const result = await comPost.save();
		return res.status(200).json({
			code: 200,
			com_post: result,
		});
	}
	catch (err) {
		console.error(err);
		res.json(408).json({
			code: 408,
			message: "server error",
		});
	}
}