import express from 'express';

import { verifyToken, beforeUploadImg } from './middlewares';
import { communityController } from './controllers/community';

const router = express.Router();

router.post('/addpost', verifyToken, communityController.post_addpost);

router.get('/mypost', verifyToken, communityController.get_mypost);

router.get('/show', communityController.get_show);

router.delete('/delete', verifyToken, communityController.delete_delete);

router.get('/post', communityController.get_post);

router.post('/addcomment', verifyToken, communityController.post_addcomment);

router.delete('/comment', verifyToken, communityController.delete_comment);

router.patch('/changepost', verifyToken, communityController.patch_changepost);

router.get('/comment', communityController.get_comment);

router.post('/addimg/:post_id', verifyToken, beforeUploadImg, communityController.post_addimg);

router.get('/img', beforeUploadImg, communityController.get_img);

router.delete('/img', verifyToken, communityController.delete_img);

export default router;