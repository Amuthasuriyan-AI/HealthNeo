import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Appointment } from '../models/Appointment';
import { Doctor } from '../models/Doctor';
import { IApiResponse } from '../types';
import { EmailService } from '../services/emailService';

/**
 * Appointment Controller
 * Handles appointment booking, cancellation, and management
 */
export class AppointmentController {
  /**
   * Get all doctors
   */
  static async getDoctors(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { specialization, skip = 0, limit = 10 } = req.query;

      let query: any = { isActive: true };
      if (specialization) {
        query.specialization = specialization;
      }

      const doctors = await Doctor.find(query)
        .skip(Number(skip))
        .limit(Number(limit))
        .sort({ rating: -1 });

      const total = await Doctor.countDocuments(query);

      const response: IApiResponse = {
        success: true,
        message: 'Doctors retrieved',
        data: {
          doctors,
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
        message: error instanceof Error ? error.message : 'Failed to get doctors',
        statusCode: 500,
      });
    }
  }

  /**
   * Get doctor details
   */
  static async getDoctorDetails(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { doctorId } = req.params;

      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        res.status(404).json({
          success: false,
          message: 'Doctor not found',
          statusCode: 404,
        });
        return;
      }

      const response: IApiResponse = {
        success: true,
        message: 'Doctor details retrieved',
        data: doctor,
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get doctor details',
        statusCode: 500,
      });
    }
  }

  /**
   * Book appointment
   */
  static async bookAppointment(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
          statusCode: 401,
        });
        return;
      }

      const { doctorId, appointmentDate, startTime, endTime, reason } = req.body;

      // Verify doctor exists
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        res.status(404).json({
          success: false,
          message: 'Doctor not found',
          statusCode: 404,
        });
        return;
      }

      // Check for conflicts
      const existingAppointment = await Appointment.findOne({
        doctorId,
        appointmentDate: new Date(appointmentDate),
        startTime,
        status: { $in: ['scheduled', 'completed'] },
      });

      if (existingAppointment) {
        res.status(400).json({
          success: false,
          message: 'Time slot already booked',
          statusCode: 400,
        });
        return;
      }

      // Create appointment
      const appointment = new Appointment({
        patientId: req.userId,
        doctorId,
        appointmentDate: new Date(appointmentDate),
        startTime,
        endTime,
        reason,
      });

      await appointment.save();

      // Send confirmation email
      try {
        await EmailService.sendAppointmentConfirmation(
          req.email || '',
          doctor.fullName,
          appointmentDate,
          startTime
        );
      } catch (error) {
        console.error('Failed to send email:', error);
      }

      const response: IApiResponse = {
        success: true,
        message: 'Appointment booked successfully',
        data: appointment,
        statusCode: 201,
      };

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to book appointment',
        statusCode: 500,
      });
    }
  }

  /**
   * Get user appointments
   */
  static async getUserAppointments(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
          statusCode: 401,
        });
        return;
      }

      const appointments = await Appointment.find({ patientId: req.userId })
        .populate('doctorId', 'fullName specialization consultationFee')
        .sort({ appointmentDate: -1 });

      const response: IApiResponse = {
        success: true,
        message: 'Appointments retrieved',
        data: appointments,
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get appointments',
        statusCode: 500,
      });
    }
  }

  /**
   * Cancel appointment
   */
  static async cancelAppointment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { appointmentId } = req.params;

      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status: 'cancelled' },
        { new: true }
      );

      if (!appointment) {
        res.status(404).json({
          success: false,
          message: 'Appointment not found',
          statusCode: 404,
        });
        return;
      }

      const response: IApiResponse = {
        success: true,
        message: 'Appointment cancelled',
        data: appointment,
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to cancel appointment',
        statusCode: 500,
      });
    }
  }

  /**
   * Rate appointment
   */
  static async rateAppointment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { appointmentId } = req.params;
      const { rating, comment } = req.body;

      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          feedback: {
            rating: Number(rating),
            comment,
          },
        },
        { new: true }
      );

      if (!appointment) {
        res.status(404).json({
          success: false,
          message: 'Appointment not found',
          statusCode: 404,
        });
        return;
      }

      const response: IApiResponse = {
        success: true,
        message: 'Appointment rated',
        data: appointment,
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to rate appointment',
        statusCode: 500,
      });
    }
  }
}
