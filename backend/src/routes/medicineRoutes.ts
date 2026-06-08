import express from 'express';
import { MedicineController } from '../controllers/medicineController';
import { optionalAuthMiddleware } from '../middleware/auth';
import { validateRequest, validationSchemas } from '../middleware/validation';

const router = express.Router();

/**
 * Medicine Routes
 */

// GET /api/medicines/search - Search medicines
router.get(
  '/search',
  optionalAuthMiddleware,
  MedicineController.searchMedicines
);

// GET /api/medicines - Get all medicines
router.get('/', optionalAuthMiddleware, MedicineController.getAllMedicines);

// GET /api/medicines/type/:type - Get medicines by type
router.get(
  '/type/:type',
  optionalAuthMiddleware,
  MedicineController.getMedicinesByType
);

// GET /api/medicines/:medicineId - Get medicine details
router.get(
  '/:medicineId',
  optionalAuthMiddleware,
  MedicineController.getMedicineDetails
);

export default router;
