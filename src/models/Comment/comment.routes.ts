// post.routes.ts
import { Router } from 'express';
import postContr from './comment.controller.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();

router.post('/create',authMiddleware, postContr.createPost);
router.get('/all', postContr.getPosts);
router.get('/all/:id', postContr.getPost);
router.put('/update/:id', postContr.updatePost);
router.delete('/delete/:id', postContr.updatePost);

export default router;
