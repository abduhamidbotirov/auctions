import { Request, Response } from 'express';
import Auction from './auctions.model.js';
import handleError from '../../utils/catchError.js';
import { Comment } from '../Comment/comment.model.js';
import Bid from '../Bids/bids.model.js';
import User from '../User/user.model.js';
interface IPost {
    title: string;
    img: string;
    desc: string;
    start_price: number
    dueto: number;
}
class PostController {
    public static async createPost(req: Request, res: Response): Promise<void> {
        try {
            const {
                title,
                img,
                desc,
                start_price,
                dueto
            }: IPost = req.body;
            const post = await Auction.create({
                title,
                img,
                desc,
                start_price,
                dueto,
                user_id: req.user.id
            });
            res.status(201).json(post);
        } catch (error: any) {
            handleError(res, error);
        }
    }
    public static async getPosts(req: Request, res: Response): Promise<void> {
        try {
            const posts = await Auction.findAll({
                include: [
                    { model: Bid, as: 'bids' },
                    { model: Bid, as: 'lastBid' }
                    // User // Include the associated User model
                ]
                
            })
            res.status(200).json(posts);
        } catch (error: any) {
            handleError(res, error);
        }
    }
    public static async getPost(req: Request, res: Response): Promise<void> {
        try {
            const postId = Number(req.params.id);
            const post = await Auction.findByPk(postId);
            if (!post) {
                res.status(404).json({ message: 'Post tapılmadı' });
                return;
            }
            res.status(200).json(post);
        } catch (error: any) {
            handleError(res, error);
        }
    }
    public static async updatePost(req: Request, res: Response): Promise<void> {
        try {
            const postId = Number(req.params.id);
            const postData: IPost = req.body;
            const post = await Auction.findByPk(postId);
            if (!post) {
                res.status(404).json({ message: 'Post tapılmadı' });
                return;
            }
            Object.assign(post, postData); // Yeniləmək üçün obyektin xüsusiyyətlərini əvəz edirik
            await post.save();
            res.status(200).json(post);
        } catch (error: any) {
            handleError(res, error);
        }
    }
    public static async deletePost(req: Request, res: Response): Promise<void> {
        try {
            const postId = Number(req.params.id);
            const post = await Auction.findByPk(postId);
            if (!post) {
                res.status(404).json({ message: 'Post tapılmadı' });
                return;
            }
            await post.destroy();
            res.status(204).send();
        } catch (error: any) {
            handleError(res, error);
        }
    }
}
export default PostController;
