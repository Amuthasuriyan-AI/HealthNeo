import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ChatHistory } from '../models/ChatHistory';
import { chatbotService } from '../services/chatbotService';
import { IApiResponse } from '../types';

/**
 * Chatbot Controller
 * Handles AI chatbot conversations
 */
export class ChatbotController {
  /**
   * Start new chat session
   */
  static async startSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
          statusCode: 401,
        });
        return;
      }

      const chatHistory = new ChatHistory({
        userId: req.userId,
        messages: [],
        isActive: true,
      });

      await chatHistory.save();

      const response: IApiResponse = {
        success: true,
        message: 'Chat session started',
        data: {
          sessionId: chatHistory._id,
          messages: [],
        },
        statusCode: 201,
      };

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to start chat session',
        statusCode: 500,
      });
    }
  }

  /**
   * Send message to chatbot
   */
  static async sendMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { message, sessionId } = req.body;

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Message cannot be empty',
          statusCode: 400,
        });
        return;
      }

      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
          statusCode: 401,
        });
        return;
      }

      // Find or create chat session
      let chatHistory = await ChatHistory.findById(sessionId);
      if (!chatHistory) {
        chatHistory = new ChatHistory({
          userId: req.userId,
          messages: [],
          isActive: true,
        });
      }

      // Add user message
      chatHistory.messages.push({
        role: 'user',
        content: message.trim(),
        timestamp: new Date(),
      });

      // Get AI response
      const aiResponse = await chatbotService.chat(
        message,
        chatHistory.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))
      );

      // Add AI response
      chatHistory.messages.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      });

      await chatHistory.save();

      const response: IApiResponse = {
        success: true,
        message: 'Message processed',
        data: {
          sessionId: chatHistory._id,
          userMessage: message,
          aiResponse,
          messages: chatHistory.messages,
        },
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process message',
        statusCode: 500,
      });
    }
  }

  /**
   * Get chat history
   */
  static async getChatHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
          statusCode: 401,
        });
        return;
      }

      const { sessionId } = req.params;

      const chatHistory = await ChatHistory.findById(sessionId);
      if (!chatHistory || chatHistory.userId.toString() !== req.userId) {
        res.status(404).json({
          success: false,
          message: 'Chat session not found',
          statusCode: 404,
        });
        return;
      }

      const response: IApiResponse = {
        success: true,
        message: 'Chat history retrieved',
        data: chatHistory,
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get chat history',
        statusCode: 500,
      });
    }
  }

  /**
   * Get all sessions for user
   */
  static async getAllSessions(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
          statusCode: 401,
        });
        return;
      }

      const sessions = await ChatHistory.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .limit(20);

      const response: IApiResponse = {
        success: true,
        message: 'Sessions retrieved',
        data: sessions,
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get sessions',
        statusCode: 500,
      });
    }
  }

  /**
   * End chat session
   */
  static async endSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;

      const chatHistory = await ChatHistory.findByIdAndUpdate(
        sessionId,
        {
          isActive: false,
          sessionEndTime: new Date(),
        },
        { new: true }
      );

      const response: IApiResponse = {
        success: true,
        message: 'Chat session ended',
        data: chatHistory,
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to end session',
        statusCode: 500,
      });
    }
  }
}
