import express, { Request, Response } from "express";
import UserModel from "./user.model.js";
import { IUser } from "./user.interface";
import handleError from "../../utils/catchError.js";
import { JWT } from "../../utils/jwt.js";
import { sendConfirmationEmail } from "../../utils/nodemailer.js";
import {
  deleteRedisData,
  getRedisData,
  setRedisData,
} from "../../db/redistGlobal.js";
import crypto from "crypto";
class UserController {
  // Create a new user
  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      let { username, email, password, role, confirmationCode } = req.body;
      if (!confirmationCode) {
        const generatedConfirmationCode = await sendConfirmationEmail(email);
        await setRedisData(email, generatedConfirmationCode);
        res.send({
          success: true,
          payload: generatedConfirmationCode,
          msg: "Confirmation code sent to the email ",
        });
      } else {
        if (confirmationCode !== (await getRedisData(email))) {
          res.status(400).send({
            success: false,
            msg: "The confirmation code you entered is incorrect. Please try again.",
          });
        } else {
          const passwordHash = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");
          const user: IUser = new UserModel({
            username,
            email,
            role: role ? role : "user",
            password: passwordHash,
          });
          const newUser = await user.save();
          let token = JWT.SIGN({ id: newUser._id });
          res.status(201).send({
            success: true,
            token,
            data: newUser,
          });
          await deleteRedisData(email);
        }
      }
    } catch (error: any) {
      handleError(res, error);
    }
  };
  // Get all users
  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await UserModel.find();
      res.status(200).send({
        success: true,
        data: users,
      });
    } catch (error: any) {
      handleError(res, error);
    }
  };
  // Get user by ID
  public getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const user = await UserModel.findById(id).populate(
        "boughtPost likedPost"
      );
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).send({
        succsess: true,
        data: user,
      });
    } catch (error: any) {
      handleError(res, error);
    }
  };
  public getUserByToken = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      console.log(req.user.role);
      let token = req.headers.token as string;
      let { id } = JWT.VERIFY(token);
      const user = await UserModel.findById(id).populate(
        "boughtPost likedPost"
      );
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).send({
        succsess: true,
        data: user,
      });
    } catch (error: any) {
      handleError(res, error);
    }
  };
  // Update user by ID
  public updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    let { password } = req.body;
    try {
      // Parolni SHA-256 bilan heshlash
      if (password) {
        const passwordHash = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");
        req.body.password = passwordHash;
      }
      const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).send({
        success: true,
        data: updatedUser,
      });
    } catch (error: any) {
      handleError(res, error);
    }
  };
  public updateUserByToken = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    let { password } = req.body;
    try {
      let token = req.headers.token as string;
      let { id } = JWT.VERIFY(token);
      // Parolni SHA-256 bilan heshlash
      if (password) {
        const passwordHash = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");
        password = passwordHash;
      }
      const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).send({
        success: true,
        data: updatedUser,
      });
    } catch (error: any) {
      handleError(res, error);
    }
  };
  // Delete user by ID
  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const deletedUser = await UserModel.findByIdAndDelete(id);
      if (!deletedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(204).send({ success: true, data: [] });
    } catch (error: any) {
      handleError(res, error);
    }
  };
  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
      // Foydalanuvchini email orqali qidirish
      const user = await UserModel.findOne({ email });
      if (!user) {
        // Foydalanuvchi topilmagan
        res.status(404).json({ error: "Foydalanuvchi topilmadi" });
        return;
      }
      // Parolni tekshirish
      const passwordHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
      if (user.password !== passwordHash) {
        // Noto'g'ri parol
        res.status(401).json({ error: "Noto'g'ri parol" });
        return;
      }

      // Foydalanuvchi uchun yangi JWT (token) yaratish
      const token = JWT.SIGN({ id: user._id });

      // Tokenni klientga jo'natish
      res.status(200).send({ succsess: true, token, data: user });
    } catch (error: any) {
      handleError(res, error);
    }
  };
  public forgetPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email, password, confirmationCode } = req.body;
    try {
      // Foydalanuvchi email orqali qidirish
      const user = await UserModel.findOne({ email });

      if (!user) {
        // Foydalanuvchi topilmagan
        res.status(404).json({ error: "Foydalanuvchi topilmadi" });
        return;
      }

      if (!confirmationCode) {
        // Tasdiqlash kodi yaratish va email orqali yuborish
        const generatedConfirmationCode = await sendConfirmationEmail(email);
        await setRedisData(email, generatedConfirmationCode);
        res.status(200).json({
          success: true,
          message:
            "Foydalanuvchi ma'lumotlari yuborildi. Tasdiqlash kodi yuborildi",
          confirmationCode: generatedConfirmationCode, // Tasdiqlash kodi javob qaytariladi
        });
      } else if (confirmationCode !== (await getRedisData(email))) {
        // Tasdiqlash kodi noto'g'ri kiritilgan
        res.status(400).json({
          success: false,
          error: "Noto'g'ri tasdiqlash kodi",
        });
      } else {
        // Tasdiqlash kodi to'g'ri kiritilgan
        if (password) {
          // Parolni SHA-256 heshlash
          const passwordHash = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");
          user.password = passwordHash;

          // Yangilangan parolni saqlash
          await user.save();

          // Tasdiqlash kodi bilan saqlangan ma'lumotni o'chirish
          await deleteRedisData(email);
          const token = JWT.SIGN({ id: user._id });
          res.status(200).json({
            success: true,
            token,
            message: "Parol muvaffaqiyatli yangilandi",
          });
        } else {
          // Tasdiqlash kodi bilan saqlangan ma'lumotni o'chirish
          await deleteRedisData(email);
          res.status(200).json({
            success: true,
            message: "Tasdiqlash kodi muvaffaqiyatli o'chirildi",
          });
        }
      }
    } catch (error: any) {
      handleError(res, error);
    }
  };
}
export default new UserController();
