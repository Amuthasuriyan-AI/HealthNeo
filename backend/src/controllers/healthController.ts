import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { HealthRecord } from '../models/HealthRecord';
import { IApiResponse } from '../types';

/**
 * Health Record Controller
 * Handles health records and vitals tracking
 */
export class HealthRecordController {
  /**
   * Create health record
   */
  static async createHealthRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
          statusCode: 401,
        });
        return;
      }

      const { recordType, recordDate, data, notes } = req.body;

      const healthRecord = new HealthRecord({
        userId: req.userId,
        recordType,
        recordDate: recordDate || new Date(),
        data,
        notes,
      });

      await healthRecord.save();

      const response: IApiResponse = {
        success: true,
        message: 'Health record created',
        data: healthRecord,
        statusCode: 201,
      };

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create health record',
        statusCode: 500,
      });
    }
  }

  /**
   * Get user health records
   */
  static async getUserHealthRecords(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
          statusCode: 401,
        });
        return;
      }

      const { recordType, skip = 0, limit = 10 } = req.query;

      let query: any = { userId: req.userId };
      if (recordType) {
        query.recordType = recordType;
      }

      const records = await HealthRecord.find(query)
        .skip(Number(skip))
        .limit(Number(limit))
        .sort({ recordDate: -1 });

      const total = await HealthRecord.countDocuments(query);

      const response: IApiResponse = {
        success: true,
        message: 'Health records retrieved',
        data: {
          records,
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
        message: error instanceof Error ? error.message : 'Failed to get health records',
        statusCode: 500,
      });
    }
  }

  /**
   * Get latest vitals
   */
  static async getLatestVitals(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
          statusCode: 401,
        });
        return;
      }

      const vitals = await HealthRecord.findOne({
        userId: req.userId,
        recordType: 'vital',
      }).sort({ recordDate: -1 });

      const response: IApiResponse = {
        success: true,
        message: 'Latest vitals retrieved',
        data: vitals,
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get vitals',
        statusCode: 500,
      });
    }
  }

  /**
   * Calculate BMI
   */
  static async calculateBMI(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
          statusCode: 401,
        });
        return;
      }

      const { weight, height } = req.body; // weight in kg, height in cm

      if (!weight || !height) {
        res.status(400).json({
          success: false,
          message: 'Weight and height are required',
          statusCode: 400,
        });
        return;
      }

      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);

      let category = '';
      if (bmi < 18.5) {
        category = 'Underweight';
      } else if (bmi < 25) {
        category = 'Normal weight';
      } else if (bmi < 30) {
        category = 'Overweight';
      } else {
        category = 'Obese';
      }

      // Save BMI record
      const healthRecord = new HealthRecord({
        userId: req.userId,
        recordType: 'vital',
        data: {
          weight,
          height,
          bmi: parseFloat(bmi.toFixed(2)),
        },
      });

      await healthRecord.save();

      const response: IApiResponse = {
        success: true,
        message: 'BMI calculated',
        data: {
          bmi: parseFloat(bmi.toFixed(2)),
          category,
          weight,
          height,
        },
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to calculate BMI',
        statusCode: 500,
      });
    }
  }
}
