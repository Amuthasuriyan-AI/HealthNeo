import mongoose, { Document, Schema } from 'mongoose';
import { INotification } from '../types';

/**
 * Notification Schema and Model
 * Manages system notifications for users
 */
const NotificationSchema = new Schema<INotification & Document>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: ['appointment', 'message', 'health-tip', 'reminder', 'alert'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: mongoose.Schema.Types.Mixed,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

export const Notification = mongoose.model<INotification & Document>(
  'Notification',
  NotificationSchema
);
