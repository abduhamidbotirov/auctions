import { Request, Response } from 'express';
import handleError from '../../utils/catchError.js';
import { IUser } from './interface.js';
import { deleteRedisData, getRedisData, setRedisData } from '../../db/redistGlobal.js';
import { JWT } from '../../utils/jwt.js';
import crypto from "crypto";
import { sendConfirmationEmail } from '../../utils/nodemailer.js';
import User from './user.model.js';
import { Post } from '../Post/post.model.js';

interface IUserCreate {
    username: string;
    email: string;
    password: string;
    role: 'super_admin' | 'user' | 'product_admin';
    confirmationCode: number
}
class UserController {
    public static async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, password, role, confirmationCode }: IUserCreate = req.body;

            if (!confirmationCode) {
                const generatedConfirmationCode = await sendConfirmationEmail(email);
                await setRedisData(email, generatedConfirmationCode);

                res.status(201).json({
                    success: true,
                    payload: generatedConfirmationCode,
                    msg: 'Confirmation code sent to the email',
                });
            } else {
                if (confirmationCode !== (await getRedisData(email))) {
                    res.status(400).json({
                        success: false,
                        msg: 'The confirmation code you entered is incorrect. Please try again.',
                    });
                } else {
                    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
                    const user: any = await User.create({
                        username,
                        email,
                        role: role ? role : 'user',
                        password: passwordHash,
                    });

                    let token = JWT.SIGN({ id: user.id });
                    res.status(201).json({
                        success: true,
                        token,
                        data: user,
                    });

                    await deleteRedisData(email);
                }
            }
        } catch (error: any) {
            handleError(res, error);
        }
    }
    public static async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await User.findAll({
                include:Post
            });
            res.status(200).send({
                success: true,
                data: users
            });
        } catch (error: any) {
            handleError(res, error)
        }
    };
    public static async getUserById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id)
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).send(
                {
                    succsess: true,
                    data: user
                }
            );
        } catch (error: any) {
            handleError(res, error)
        }
    };
    public static async getUserByToken(req: Request, res: Response): Promise<void> {
        try {
            let id = req.user.id
            const user = await User.findByPk(id)
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).send(
                {
                    succsess: true,
                    data: user
                }
            );
        } catch (error: any) {
            handleError(res, error)
        }
    };
    public static async updateUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        let { password } = req.body;

        try {
            // Əgər parol göndərilibsə, onu SHA-256 ilə həşləyin
            if (password) {
                const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
                req.body.password = passwordHash;
            }

            // Sequelize-də "update" metodunu işlətdik
            const [rowCount, updatedUsers] = await User.update(req.body, {
                where: { id },
                returning: true,
            });

            if (rowCount === 0) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.status(200).json({
                success: true,
                data: updatedUsers[0],
            });
        } catch (error: any) {
            handleError(res, error);
        }
    };
    public static async updateUserByToken(req: Request, res: Response): Promise<void> {
        let { password } = req.body;
        try {
            let id = req.body.id;

            if (password) {
                const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
                password = passwordHash;
            }

            const [rowCount, [updatedUser]] = await User.update(req.body, {
                where: { id },
                returning: true,
            });

            if (rowCount === 0) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.status(200).json({
                success: true,
                data: updatedUser,
            });
        } catch (error: any) {
            handleError(res, error);
        }
    };
    public static async deleteUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const deletedUser = await User.destroy({ where: { id } });
            if (deletedUser === 0) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(204).send({ success: true, data: [] });
        } catch (error: any) {
            handleError(res, error);
        }
    };
    public static async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        try {
            // Foydalanuvchini email üzrə axtarış
            const user: any = await User.findOne({ where: { email } });
            if (!user) {
                // Foydalanuvchi tapılmadı
                res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
                return;
            }

            // Parolu yoxlamaq
            const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
            if (user.password !== passwordHash) {
                // Yalnış parol
                res.status(401).json({ error: 'Noto\'g\'ri parol' });
                return;
            }

            // Foydalanuvchi üçün yeni JWT (token) yaratmaq
            const token = JWT.SIGN({ id: user.id });

            // Tokeni müştəriyə göndərmək
            res.status(200).send({ success: true, token, data: user });
        } catch (error: any) {
            handleError(res, error);
        }
    };
    public static async forgetPassword(req: Request, res: Response): Promise<void> {
        const { email, password, confirmationCode } = req.body;
        try {
            // Foydalanuvchini email üzrə axtarış
            const user: any = await User.findOne({ where: { email } });

            if (!user) {
                // Foydalanuvchi tapılmadı
                res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
                return;
            }

            if (!confirmationCode) {
                // Təsdiq kodunu yaratmaq və email ilə göndərmək
                const generatedConfirmationCode = await sendConfirmationEmail(email);
                await setRedisData(email, generatedConfirmationCode);
                res.status(200).json({
                    success: true,
                    message: 'Foydalanuvchi məlumatları göndərildi. Təsdiq kodu göndərildi.',
                    confirmationCode: generatedConfirmationCode, // Təsdiq kodunu cavab qaytarır
                });
            } else if (confirmationCode !== (await getRedisData(email))) {
                // Təsdiq kodu düzgün daxil edilməyib
                res.status(400).json({
                    success: false,
                    error: 'Yanlış təsdiq kodu',
                });
            } else {
                // Təsdiq kodu düzgün daxil edilib
                if (password) {
                    // Parolu SHA-256 ilə həşləmək
                    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
                    user.password = passwordHash;

                    // Yenilənmiş parolu saxlamaq
                    await user.save();

                    // Təsdiq kodu ilə saxlanmış məlumatı silmək
                    await deleteRedisData(email);
                    const token = JWT.SIGN({ id: user.id });
                    res.status(200).json({
                        success: true,
                        token,
                        message: 'Parol uğurla yeniləndi',
                    });
                } else {
                    // Təsdiq kodu ilə saxlanmış məlumatı silmək
                    await deleteRedisData(email);
                    res.status(200).json({
                        success: true,
                        message: 'Təsdiq kodu uğurla silindi',
                    });
                }
            }
        } catch (error: any) {
            handleError(res, error);
        }
    };
}

export default UserController;
