import express from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest, validationSchemas } from '../middleware/validation';

const router = express.Router();

/**
 * Authentication Routes
 */

// POST /api/auth/register - Register new user
router.post(
  '/register',
  validateRequest(validationSchemas.register),
  AuthController.register
);

// POST /api/auth/login - Login user
router.post(
  '/login',
  validateRequest(validationSchemas.login),
  AuthController.login
);

// POST /api/auth/refresh - Refresh token
router.post('/refresh', AuthController.refreshToken);

// GET /api/auth/profile - Get user profile (protected)
router.get('/profile', authMiddleware, AuthController.getProfile);

// PUT /api/auth/profile - Update user profile (protected)
router.put('/profile', authMiddleware, AuthController.updateProfile);

export default router;
