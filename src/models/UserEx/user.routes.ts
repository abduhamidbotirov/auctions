import express, { Router } from 'express';
import UserController from './user.contr.js';
import authMiddleware from '../../middleware/auth.js';
import { superAdminMiddleware } from '../../middleware/admins.js';
const userRouter: Router = express.Router();
// Create a new user
userRouter.post('/create', UserController.createUser);
// Sign in
userRouter.post('/login', UserController.login);
// Forget password
userRouter.post('/forgot', UserController.forgetPassword);
// Get all users
userRouter.get('/all', UserController.getAllUsers);
// Get user by Token
userRouter.get('/token', authMiddleware, superAdminMiddleware, UserController.getUserByToken);
// Get user by ID
userRouter.get('/:id', UserController.getUserById);
// Update user by Token
userRouter.put('/token', UserController.updateUserByToken);
// Update user by ID
userRouter.put('/:id', UserController.updateUser);
// Delete user by ID
userRouter.delete('/:id', UserController.deleteUser);
export default userRouter;
