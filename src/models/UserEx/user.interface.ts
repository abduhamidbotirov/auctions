import mongoose, { Document, Model } from "mongoose";
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: "user" | "super_admin" | "product_admin";
    boughtPost: mongoose.Types.ObjectId[];
    likedPost: mongoose.Types.ObjectId[];
    savedStore: mongoose.Types.ObjectId[];
    stores: mongoose.Types.ObjectId[];
    viewedPosts: mongoose.Types.ObjectId[];
}
export interface IUserModel extends Model<IUser> { }