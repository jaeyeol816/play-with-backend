import express from 'express';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

import { verifyToken, beforeUploadImg } from './middlewares';

import { communityController } from './controllers/community';

const router = express.Router();


AWS.config.update({
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	region: 'ap-northeast-2',
});

//multer함수의 결과로 나오는 upload객체에는 다양한 미들웨어가 들어있음. (라우터에서 upload.single미들웨어 사용시 파일 업로드 후 req.file객체가 생성됨.)
const upload = multer({
	storage: multerS3({
		s3: new AWS.S3(),
		bucket: 'play-with-bucket',
		// acl: 'public-read',
		metadata: function(req, file, cb) {
			cb(null, { 
				post: String((req as any).body.post_id),
				uploader: String((req as any).body.user_id),
				fieldname: file.fieldname,
			});
		},
		key: function(req, file, cb) {
			cb(null, `com-post/${Date.now()}${path.basename(file.originalname)}`);
		},
	}),
	limits: { fileSize: 5 * 1024 * 1024 },
});



router.post('/addpost', verifyToken, communityController.post_addpost);

router.get('/mypost', verifyToken, communityController.get_mypost);

router.get('/show', communityController.get_show);

router.delete('/delete', verifyToken, communityController.delete_delete);

router.get('/post', communityController.get_post);

router.post('/addcomment', verifyToken, communityController.post_addcomment);

router.delete('/comment', verifyToken, communityController.delete_comment);

router.patch('/changepost', verifyToken, communityController.patch_changepost);

router.get('/comment', communityController.get_comment);

router.post('/addimg/:post_id', verifyToken, beforeUploadImg, upload.single('img'), communityController.post_addimg);

router.get('/img', communityController.get_img);


export default router;