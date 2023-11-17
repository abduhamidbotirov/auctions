import express from "express";
import userRoutes from './User/user.routes.js';
// import postRoutes from './Post/post.routes.js';
// import commentRouter from './Comment/comment.routes.js';
import auctionsRouter from './Auctions/post.routes.js';
import bidRouter from './Bids/post.routes.js';

const router = express.Router();
router.use('/test', () => { });
router.use('/auction', auctionsRouter);
router.use('/bid', bidRouter);
router.use('/user', userRoutes);
// router.use('/post', postRoutes);
// router.use('/comment', commentRouter);
export default router