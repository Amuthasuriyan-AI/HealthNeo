import express from 'express';
import { HealthRecordController } from '../controllers/healthController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest, validationSchemas } from '../middleware/validation';

const router = express.Router();

/**
 * Health Record Routes
 */

// POST /api/health/records - Create health record (protected)
router.post(
  '/records',
  authMiddleware,
  validateRequest(validationSchemas.createHealthRecord),
  HealthRecordController.createHealthRecord
);

// GET /api/health/records - Get user health records (protected)
router.get(
  '/records',
  authMiddleware,
  HealthRecordController.getUserHealthRecords
);

// GET /api/health/vitals - Get latest vitals (protected)
router.get(
  '/vitals',
  authMiddleware,
  HealthRecordController.getLatestVitals
);

// POST /api/health/bmi - Calculate BMI (protected)
router.post(
  '/bmi',
  authMiddleware,
  HealthRecordController.calculateBMI
);

export default router;
