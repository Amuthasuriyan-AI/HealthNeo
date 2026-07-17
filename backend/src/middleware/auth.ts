import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { AppError } from '../types';

/**
 * JWT Payload Interface
 */
export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  email?: string;
}

interface JWTPayload {
  userId: string;
  role: string;
  email: string;
}

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token =
      req.headers.authorization?.split('Bearer ')[1] ||
      (req.cookies as Record<string, unknown>)?.token;

    if (!token) {
      throw new AppError('No authentication token provided', 401);
    }

    const decoded = jwt.verify(token as string, config.jwt.secret) as JWTPayload;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.email = decoded.email;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired',
        statusCode: 401,
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
        statusCode: 401,
      });
    } else {
      res.status(401).json({
        success: false,
        message: error instanceof AppError ? error.message : 'Authentication failed',
        statusCode: 401,
      });
    }
  }
};

/**
 * Role-Based Access Control Middleware
 */
export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
        statusCode: 403,
      });
      return;
    }
    next();
  };
};

/**
 * Optional Authentication Middleware
 * Does not throw error if token is missing, but validates if present
 */
export const optionalAuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token =
      req.headers.authorization?.split('Bearer ')[1] ||
      (req.cookies as Record<string, unknown>)?.token;

    if (token) {
      const decoded = jwt.verify(token as string, config.jwt.secret) as JWTPayload;
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      req.email = decoded.email;
    }

    next();
  } catch (_error) {
    // Continue without authentication
    next();
  }
};
