import mongoose, { Document, Schema } from 'mongoose';
import { IDoctor } from '../types';

/**
 * Doctor Schema and Model
 * Extends User model with doctor-specific information
 */
const DoctorSchema = new Schema<IDoctor & Document>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: String,
    role: {
      type: String,
      enum: ['doctor'],
      default: 'doctor',
    },
    profileImage: String,
    dateOfBirth: Date,
    gender: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    isVerified: Boolean,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    // Doctor-specific fields
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
    },
    experience: {
      type: Number,
      required: true,
      min: [0, 'Experience cannot be negative'],
    },
    consultationFee: {
      type: Number,
      required: true,
      min: [0, 'Consultation fee cannot be negative'],
    },
    availableSlots: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    bio: String,
    education: [String],
  },
  {
    timestamps: true,
  }
);

DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ rating: -1 });

export const Doctor = mongoose.model<IDoctor & Document>(
  'Doctor',
  DoctorSchema
);
