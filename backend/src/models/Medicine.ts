import mongoose, { Document, Schema } from 'mongoose';
import { IMedicine } from '../types';

/**
 * Medicine Schema and Model
 * Stores medicine database information
 */
const MedicineSchema = new Schema<IMedicine & Document>(
  {
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      unique: true,
    },
    genericName: {
      type: String,
      required: true,
    },
    brand: String,
    strength: {
      type: String,
      required: true,
    },
    formulation: {
      type: String,
      enum: ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'other'],
      required: true,
    },
    manufacturer: String,
    dosage: {
      amount: String,
      frequency: String,
      duration: String,
    },
    sideEffects: [String],
    warnings: [String],
    precautions: [String],
    contraindications: [String],
    interactions: [String],
    price: {
      type: Number,
      min: 0,
    },
    description: String,
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

MedicineSchema.index({ name: 'text', genericName: 'text', brand: 'text' });

export const Medicine = mongoose.model<IMedicine & Document>(
  'Medicine',
  MedicineSchema
);
