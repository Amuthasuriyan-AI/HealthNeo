import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Medicine } from '../models/Medicine';
import { IApiResponse } from '../types';

/**
 * Medicine Controller
 * Handles medicine information and search
 */
export class MedicineController {
  /**
   * Search medicines
   */
  static async searchMedicines(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { query, skip = 0, limit = 10 } = req.query;

      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Search query is required',
          statusCode: 400,
        });
        return;
      }

      const medicines = await Medicine.find({
        $text: { $search: query },
      })
        .skip(Number(skip))
        .limit(Number(limit));

      const total = await Medicine.countDocuments({
        $text: { $search: query },
      });

      const response: IApiResponse = {
        success: true,
        message: 'Medicines found',
        data: {
          medicines,
          pagination: {
            total,
            skip: Number(skip),
            limit: Number(limit),
          },
        },
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to search medicines',
        statusCode: 500,
      });
    }
  }

  /**
   * Get medicine details
   */
  static async getMedicineDetails(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { medicineId } = req.params;

      const medicine = await Medicine.findById(medicineId);
      if (!medicine) {
        res.status(404).json({
          success: false,
          message: 'Medicine not found',
          statusCode: 404,
        });
        return;
      }

      const response: IApiResponse = {
        success: true,
        message: 'Medicine details retrieved',
        data: medicine,
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get medicine details',
        statusCode: 500,
      });
    }
  }

  /**
   * Get all medicines with pagination
   */
  static async getAllMedicines(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { skip = 0, limit = 10 } = req.query;

      const medicines = await Medicine.find()
        .skip(Number(skip))
        .limit(Number(limit))
        .sort({ name: 1 });

      const total = await Medicine.countDocuments();

      const response: IApiResponse = {
        success: true,
        message: 'Medicines retrieved',
        data: {
          medicines,
          pagination: {
            total,
            skip: Number(skip),
            limit: Number(limit),
          },
        },
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get medicines',
        statusCode: 500,
      });
    }
  }

  /**
   * Get medicines by specialization
   */
  static async getMedicinesByType(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { type, skip = 0, limit = 10 } = req.query;

      const medicines = await Medicine.find({
        formulation: type,
      })
        .skip(Number(skip))
        .limit(Number(limit));

      const total = await Medicine.countDocuments({
        formulation: type,
      });

      const response: IApiResponse = {
        success: true,
        message: 'Medicines retrieved',
        data: {
          medicines,
          pagination: {
            total,
            skip: Number(skip),
            limit: Number(limit),
          },
        },
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get medicines',
        statusCode: 500,
      });
    }
  }
}
