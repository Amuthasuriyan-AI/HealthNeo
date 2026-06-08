import mongoose, { Document, Schema } from 'mongoose';
import { IHealthRecord } from '../types';

/**
 * Health Record Schema and Model
 * Stores user health records and vitals
 */
const HealthRecordSchema = new Schema<IHealthRecord & Document>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    recordType: {
      type: String,
      enum: ['vital', 'lab', 'imaging', 'other'],
      required: true,
    },
    recordDate: {
      type: Date,
      default: Date.now,
    },
    data: {
      weight: Number, // in kg
      height: Number, // in cm
      bloodPressure: String, // e.g., "120/80"
      heartRate: Number, // in bpm
      temperature: Number, // in celsius
      bmi: Number,
    },
    notes: String,
    attachmentUrl: String,
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
    },
  },
  {
    timestamps: true,
  }
);

HealthRecordSchema.index({ userId: 1, recordDate: -1 });

export const HealthRecord = mongoose.model<IHealthRecord & Document>(
  'HealthRecord',
  HealthRecordSchema
);
