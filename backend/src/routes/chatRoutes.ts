import express from 'express';
import { ChatbotController } from '../controllers/chatbotController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest, validationSchemas } from '../middleware/validation';

const router = express.Router();

/**
 * Chatbot Routes
 */

// POST /api/chat/start - Start new chat session (protected)
router.post('/start', authMiddleware, ChatbotController.startSession);

// POST /api/chat/send - Send message to chatbot (protected)
router.post(
  '/send',
  authMiddleware,
  validateRequest(validationSchemas.chatMessage),
  ChatbotController.sendMessage
);

// GET /api/chat/history/:sessionId - Get chat history (protected)
router.get(
  '/history/:sessionId',
  authMiddleware,
  ChatbotController.getChatHistory
);

// GET /api/chat/sessions - Get all sessions (protected)
router.get('/sessions', authMiddleware, ChatbotController.getAllSessions);

// POST /api/chat/end/:sessionId - End chat session (protected)
router.post(
  '/end/:sessionId',
  authMiddleware,
  ChatbotController.endSession
);

export default router;
