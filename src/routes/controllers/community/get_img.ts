import { Request, Response, NextFunction } from "express";
import AWS from 'aws-sdk';

AWS.config.update({
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	region: 'ap-northeast-2',
});
const s3 = new AWS.S3();

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const img_str = req.body.img_str;
		s3.getObject({
			Bucket: process.env.S3_BUCKET_NAME as string,
			Key: img_str
		}, (err, data) => {
			if (err) {
				console.error(err);
				return res.status(410).json({
					message: "error while s3.getObject",
				});
			}
			res.status(200).send(data.Body);
		});
	}
	catch (err) {
		console.error(err);
		return res.status(408).json({
			code: 408,
			message: "server error",
		})
	}
}