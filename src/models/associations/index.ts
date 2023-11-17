// // // models/index.ts
import User from '../User/user.model.js'; //
import { Post } from '../Post/post.model.js';
import { Comment } from '../Comment/comment.model.js';


// User.hasOne(Post);
// Post.hasOne(Comment)
// Comment.belongsTo(User, {foreignKey:"userId"});
// Comment.hasOne(User)
// User.sync({ alter: true })
// Post.sync({ alter: true })
// Comment.sync({ alter: true })   
import Auction from "../Auctions/auctions.model.js";
import Bid from "../Bids/bids.model.js";
// Auction.hasMany(Bid, { as: 'bids' });
// Bid.hasOne(Auction, { foreignKey: 'lastBidId', as: 'last_bid' });

// Bid.belongsTo(Auction, { foreignKey: 'auctionId' });
// Bid.belongsTo(User, { foreignKey: 'userId' });

Auction.hasMany(Bid, { foreignKey: 'auctionId', as: 'bids' });
Auction.belongsTo(Bid, { foreignKey: 'last_bid', as: 'lastBid' });

Bid.belongsTo(Auction, { foreignKey: 'auctionId' });
Bid.belongsTo(User, { foreignKey: 'userId' });


!(async () => {
    await User.sync({ alter: true });
    await Auction.sync({ alter: true })
    await Bid.sync({ alter: true })
})()

// Bid.belongsTo(Auction, { foreignKey: 'auctionId' })
// Auction.hasMany(Bid, { foreignKey: 'bids' });
// Auction.hasOne(Bid, { foreignKey: 'last_bid' });

// Bid.belongsTo(Auction,{ foreignKey:"auctionId"})

// User.hasMany(Auction)
// User.hasMany(Bid)
// Auction.belongsTo(User, { foreignKey: "userId" })
// Bid.belongsTo(User, { foreignKey: "userId" });
// Auction.sync({ alter: true });
// Bid.sync({ alter: true });




// User.hasMany(Post, {
//     foreignKey: {
//         name: 'userId',
//         allowNull: false
//     }
// });

// Post.belongsTo(User, {
//     foreignKey: {
//         name: 'userId',
//         allowNull: false
//     }
// });

// // export { User, Post };
