import mongoose, { Document, Schema } from 'mongoose';
import { IAppointment } from '../types';

/**
 * Appointment Schema and Model
 * Manages appointments between patients and doctors
 */
const AppointmentSchema = new Schema<IAppointment & Document>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required'],
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor ID is required'],
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    startTime: {
      type: String,
      required: true,
      match: [/^\d{2}:\d{2}$/, 'Time format must be HH:MM'],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^\d{2}:\d{2}$/, 'Time format must be HH:MM'],
    },
    reason: {
      type: String,
      required: [true, 'Appointment reason is required'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    notes: String,
    prescription: String,
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
    },
  },
  {
    timestamps: true,
  }
);

AppointmentSchema.index({ patientId: 1, appointmentDate: -1 });
AppointmentSchema.index({ doctorId: 1, appointmentDate: -1 });
AppointmentSchema.index({ status: 1 });

export const Appointment = mongoose.model<IAppointment & Document>(
  'Appointment',
  AppointmentSchema
);
