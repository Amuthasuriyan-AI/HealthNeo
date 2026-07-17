import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { PasswordUtils, JWTUtils, ValidationUtils } from '../utils';
import { AppError, IApiResponse } from '../types';

/**
 * Authentication Controller
 * Handles user registration, login, and authentication
 */
export class AuthController {
  /**
   * Register new user
   */
  static async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { fullName, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User already exists',
          statusCode: 400,
        });
        return;
      }

      // Hash password
      const hashedPassword = await PasswordUtils.hash(password);

      // Create user
      const user = new User({
        fullName,
        email,
        password: hashedPassword,
        role: role || 'patient',
      });

      await user.save();

      // Generate tokens
      const token = JWTUtils.generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      const refreshToken = JWTUtils.generateRefreshToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      const response: IApiResponse = {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
          },
          token,
          refreshToken,
        },
        statusCode: 201,
      };

      res.status(201).json(response);
    } catch (_error) {
      const err = _error as Error;
      res.status(500).json({
        success: false,
        message: err.message || 'Registration failed',
        statusCode: 500,
      });
    }
  }

  /**
   * Login user
   */
  static async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          statusCode: 401,
        });
        return;
      }

      // Verify password
      const isPasswordValid = await PasswordUtils.compare(
        password,
        user.password
      );
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          statusCode: 401,
        });
        return;
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const token = JWTUtils.generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      const refreshToken = JWTUtils.generateRefreshToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      const response: IApiResponse = {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
          },
          token,
          refreshToken,
        },
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (_error) {
      const err = _error as Error;
      res.status(500).json({
        success: false,
        message: err.message || 'Login failed',
        statusCode: 500,
      });
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
          statusCode: 401,
        });
        return;
      }

      const user = await User.findById(req.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
          statusCode: 404,
        });
        return;
      }

      const response: IApiResponse = {
        success: true,
        message: 'Profile retrieved successfully',
        data: user,
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (_error) {
      const err = _error as Error;
      res.status(500).json({
        success: false,
        message: err.message || 'Failed to get profile',
        statusCode: 500,
      });
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
          statusCode: 401,
        });
        return;
      }

      const { fullName, phone, dateOfBirth, gender, address, city, state, zipCode } =
        req.body;

      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          fullName,
          phone,
          dateOfBirth,
          gender,
          address,
          city,
          state,
          zipCode,
        },
        { new: true, runValidators: true }
      );

      const response: IApiResponse = {
        success: true,
        message: 'Profile updated successfully',
        data: user,
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (_error) {
      const err = _error as Error;
      res.status(500).json({
        success: false,
        message: err.message || 'Failed to update profile',
        statusCode: 500,
      });
    }
  }

  /**
   * Refresh token
   */
  static async refreshToken(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
          statusCode: 400,
        });
        return;
      }

      const decoded = JWTUtils.verifyToken(refreshToken, true);
      
      const newToken = JWTUtils.generateToken({
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      });

      const response: IApiResponse = {
        success: true,
        message: 'Token refreshed successfully',
        data: { token: newToken },
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (_error) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        statusCode: 401,
      });
    }
  }
}
