import express from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest, validationSchemas } from '../middleware/validation';

const router = express.Router();

/**
 * Appointment Routes
 */

// GET /api/appointments/doctors - Get all doctors
router.get('/doctors', AppointmentController.getDoctors);

// GET /api/appointments/doctors/:doctorId - Get doctor details
router.get('/doctors/:doctorId', AppointmentController.getDoctorDetails);

// POST /api/appointments/book - Book appointment (protected)
router.post(
  '/book',
  authMiddleware,
  validateRequest(validationSchemas.createAppointment),
  AppointmentController.bookAppointment
);

// GET /api/appointments - Get user appointments (protected)
router.get('/', authMiddleware, AppointmentController.getUserAppointments);

// POST /api/appointments/:appointmentId/cancel - Cancel appointment (protected)
router.post(
  '/:appointmentId/cancel',
  authMiddleware,
  AppointmentController.cancelAppointment
);

// POST /api/appointments/:appointmentId/rate - Rate appointment (protected)
router.post(
  '/:appointmentId/rate',
  authMiddleware,
  AppointmentController.rateAppointment
);

export default router;
