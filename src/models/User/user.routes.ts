// user.routes.ts
import { Router } from 'express';
import userContr from './user.controller.js';
import {authMiddleware} from '../../middleware/auth.js';
import { superAdminMiddleware } from '../../middleware/admins.js';

const router = Router();

router.post('/create', userContr.createUser);

router.post('/login', userContr.login);
// Forget password
router.post('/forgot', userContr.forgetPassword);
// Get all users
router.get('/all', userContr.getAllUsers);
// Get user by Token
router.get('/token', authMiddleware, superAdminMiddleware, userContr.getUserByToken);
// Get user by ID
router.get('/:id', userContr.getUserById);
// Update user by Token
router.put('/token', authMiddleware, userContr.updateUserByToken);
// Update user by ID 
router.put('/:id', authMiddleware, userContr.updateUser);
// Delete user by ID
router.delete('/:id', authMiddleware, userContr.deleteUser);

export default router;
