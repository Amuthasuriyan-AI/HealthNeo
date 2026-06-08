import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Input Validation Middleware
 * Validates request data using Joi schemas
 */
export const validateRequest =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: messages,
        statusCode: 400,
      });
      return;
    }

    req.body = value;
    next();
  };

/**
 * Validation Schemas
 */
export const validationSchemas = {
  // User Registration
  register: Joi.object({
    fullName: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    role: Joi.string()
      .valid('patient', 'doctor')
      .default('patient'),
    phone: Joi.string().pattern(/^\d{10}$/),
  }),

  // User Login
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Appointment Booking
  createAppointment: Joi.object({
    doctorId: Joi.string().required(),
    appointmentDate: Joi.date().required(),
    startTime: Joi.string()
      .pattern(/^\d{2}:\d{2}$/)
      .required(),
    endTime: Joi.string()
      .pattern(/^\d{2}:\d{2}$/)
      .required(),
    reason: Joi.string().required(),
  }),

  // Chat Message
  chatMessage: Joi.object({
    message: Joi.string().required().max(5000),
    sessionId: Joi.string(),
  }),

  // Medicine Search
  medicineSearch: Joi.object({
    query: Joi.string().required(),
    limit: Joi.number().default(10),
    skip: Joi.number().default(0),
  }),

  // Health Record
  createHealthRecord: Joi.object({
    recordType: Joi.string()
      .valid('vital', 'lab', 'imaging', 'other')
      .required(),
    recordDate: Joi.date().required(),
    data: Joi.object(),
    notes: Joi.string(),
  }),
};
