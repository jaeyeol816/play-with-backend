import { Request, Response, NextFunction } from 'express';
import AWS from 'aws-sdk';

import { User, ComPost } from '../../../entities';


AWS.config.update({
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	region: process.env.S3_REGION,
});


function myGetS3Object(s3: AWS.S3, key: string) {
	return new Promise((resolve, reject) => {
		s3.getObject({
			Bucket: process.env.S3_BUCKET_NAME as string,
			Key: key,
		}, (err, data) => {
			if (err) 
				resolve(err);
			else 
				resolve(data.Body);
		})
	});
}

export default async (req: Request, res: Response, next: NextFunction) => {
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
		
		let imgResults: any[] = [];
		let whoHaveImg: number[] = [];

		if (!isEmpty) {
			//이미지 관련
			//지금까지 도출된 posts에 있는 모든 post 각각에 대해 멀티스레드로 각각 이미지를 S3에서 가져와 각각 클라이언트에게 쏴준다.
			AWS.config.update({
				accessKeyId: process.env.S3_ACCESS_KEY_ID,
				secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
				region: process.env.S3_REGION,
			});
			const s3 = new AWS.S3();
			
			let promises: Promise<any>[] = [];
			
			for (let p of posts) {
				if (p.image != null && p.image != "") {
					promises.push(myGetS3Object(s3, p.image));
					whoHaveImg.push(p.id);
				}
			}
			
			Promise.all(promises)
				.then((bodys) => {
					for (let b of bodys) {
						if (b.statusCode) 
							imgResults.push(null);
						else
							imgResults.push(b);
					}
				})
				.then(() => {
					res.status(200).json({
						code: 200,
						isEmpty: isEmpty,
						com_posts: posts,
						who_have_img: whoHaveImg,
						images: imgResults,
					});
				});
		}
		else {
			return res.status(200).json({
				code: 200,
				isEmpty: isEmpty,
				com_posts: posts,
				who_have_img: whoHaveImg,
				images: imgResults,
			});
		}
	}
	catch (err) {
		console.error(err);
		res.status(408).json({
			code: 408,
			message: "server error"
		});
	}
};