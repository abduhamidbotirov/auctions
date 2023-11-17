import { Request, Response } from 'express';
import Auction1 from '../Auctions/auctions.model.js';
import handleError from '../../utils/catchError.js';
import { Comment } from '../Comment/comment.model.js';
import Bid from './bids.model.js';
import { sequelize } from '../../db/localSequelize.js';
interface IPost {
    id: string;
    price: number;
    AuctionId: string;
    userId: string;
}
class PostController {
    public static async createPost(req: Request, res: Response): Promise<void> {
        try {
            const { price, AuctionId }: IPost = req.body;

            await sequelize.transaction(async (t) => {
                // Create a bid
                const biddata: any = await Bid.create({
                    price,
                    auctionId: AuctionId,
                    userId: req.user.id,
                });

                const auction: any = await Auction1.findByPk(AuctionId, {
                    include: [
                        { model: Bid, as: 'lastBid' }
                    ]
                });
                const bidDataId: any = await Bid.findByPk(auction.last_bid);
                if (auction && bidDataId && auction.last_bid != null) {
                    if (biddata.price > auction.lastBid.price) {
                        auction.last_bid = biddata.id;
                        auction.changed('last_bid', true);
                       await auction.save();
                    } else {
                 return   res.json({massage:'you dont buy this auction'})
                 }
                } else {
                    auction.last_bid = biddata.id;
                    auction.changed('last_bid', true);
                    await auction.save();
                }
                // if (auction) {
                //     await auction.addBids(biddata);
                //     if (auction.last_bid != null) {
                //         if (bidDataId.price > auction.last_bid.price) {
                //             auction.last_bid = bidDataId.price;
                //         } else {
                //             throw new Error('you do not buy this auction')
                //         }
                //     } else {
                //         auction.last_bid = biddata.id;
                //     }
                //     auction.changed('last_bid', true);
                //     try {
                //         await auction.save({ transaction: t });
                //     } catch (error) {
                //         console.error('Error updating auction:', error);
                //         throw error;
                //     }
                // } else {
                //     console.log('Auction not found');
                // }
                // const updatedAuctions = await Auction1.findAll();
             return   res.status(201).json(bidDataId);
            });
        } catch (error: any) {
            handleError(res, error);
        }
    }
    // public static async getPosts(req: Request, res: Response): Promise<void> {
    //     try {
    //         const posts = await Bid.findAll({
    //             include: [Bid],
    //         })
    //         res.status(200).json(posts);
    //     } catch (error: any) {
    //         handleError(res, error);
    //     }
    // }
    // public static async getPost(req: Request, res: Response): Promise<void> {
    //     try {
    //         const postId = Number(req.params.id);
    //         const post = await Bid.findByPk(postId);
    //         if (!post) {
    //             res.status(404).json({ message: 'Post tapılmadı' });
    //             return;
    //         }
    //         res.status(200).json(post);
    //     } catch (error: any) {
    //         handleError(res, error);
    //     }
    // }
    // public static async updatePost(req: Request, res: Response): Promise<void> {
    //     try {
    //         const postId = Number(req.params.id);
    //         const postData: IPost = req.body;
    //         const post = await Bid.findByPk(postId);
    //         if (!post) {
    //             res.status(404).json({ message: 'Post tapılmadı' });
    //             return;
    //         }
    //         Object.assign(post, postData); // Yeniləmək üçün obyektin xüsusiyyətlərini əvəz edirik
    //         await post.save();
    //         res.status(200).json(post);
    //     } catch (error: any) {
    //         handleError(res, error);
    //     }
    // }
    // public static async deletePost(req: Request, res: Response): Promise<void> {
    //     try {
    //         const postId = Number(req.params.id);
    //         const post = await Bid.findByPk(postId);
    //         if (!post) {
    //             res.status(404).json({ message: 'Post tapılmadı' });
    //             return;
    //         }
    //         await post.destroy();
    //         res.status(204).send();
    //     } catch (error: any) {
    //         handleError(res, error);
    //     }
    // }
}
export default PostController;
