import mongoose, { Document, Schema } from 'mongoose';
import { IChatHistory, IMessage } from '../types';

/**
 * Chat History Schema and Model
 * Stores conversation history between users and the AI chatbot
 */
const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatHistorySchema = new Schema<IChatHistory & Document>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    messages: [MessageSchema],
    sessionStartTime: {
      type: Date,
      default: Date.now,
    },
    sessionEndTime: Date,
    topic: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ChatHistorySchema.index({ userId: 1, sessionStartTime: -1 });
ChatHistorySchema.index({ isActive: 1 });

export const ChatHistory = mongoose.model<IChatHistory & Document>(
  'ChatHistory',
  ChatHistorySchema
);
