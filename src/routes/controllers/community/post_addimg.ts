import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

import { User, ComPost, ComComment } from '../../../entities';

AWS.config.update({
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	region: process.env.S3_REGION,
});


//multer함수의 결과로 나오는 upload객체에는 다양한 미들웨어가 들어있음. (라우터에서 upload.single미들웨어 사용시 파일 업로드 후 req.file객체가 생성됨.)
const upload = multer({
	fileFilter: function(_req, file, cb) {
		const fileTypes = /jpeg|jpg|png|gif/;
		// Check ext
		const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
		// Check mime
		const mimetype = fileTypes.test(file.mimetype);
		if (extname && mimetype) 
			return cb(null, true);
		else {
			cb(new Error('not valid'));
		}
	},
	storage: multerS3({
		s3: new AWS.S3(),
		bucket: process.env.S3_BUCKET_NAME as string,
		// acl: 'public-read',
		metadata: function(req, file, cb) {
			cb(null, { 
				fieldname: file.fieldname,
			});
		},
		key: function(req, file, cb) {
			cb(null, `com-post/${Date.now()}${path.basename(file.originalname)}`);
		},
	}),
	limits: { fileSize: 7 * 1024 * 1024 },
});


export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		upload.single('img')(req, res, async (err) => {
			if (err) {
				if (err.message == 'not valid') {
					console.error(err);
					return res.status(406).json({
						code: 406,
						message: "not valid file type(ext)"
					});
				}
				else if (err.message == 'File too large') {
					console.error(err);
					return res.status(456).json({
						code: 456,
						message: "file too large",
					})
				}
				else {
					console.error(err);
					return res.status(468).json({
						code: 468,
						message: "error while uploading (S3)"
					});
				}
			}

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
		});
	}
	catch (err) {
		console.error(err);
		return res.status(478).json({
			code: 478,
			message: "server error after uploading",
		});
	}
}