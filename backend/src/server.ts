import express, { Application, Request, Response, NextFunction } from 'express';
import process from 'node:process';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import { config } from './config/config';
import connectDatabase from './config/database';
import { ErrorHandler, notFoundMiddleware } from './middleware/errorHandler';
import { EmailService } from './services/emailService';

// Import routes
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import medicineRoutes from './routes/medicineRoutes';
import healthRoutes from './routes/healthRoutes';

const app: Application = express();

/**
 * Initialize Middleware
 */

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Security middleware
app.use(helmet());
app.use(cors(config.cors));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later',
});
app.use('/api/', limiter);

/**
 * Initialize Services
 */
EmailService.initialize();

/**
 * API Routes
 */
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/chat`, chatRoutes);
app.use(`${config.apiPrefix}/appointments`, appointmentRoutes);
app.use(`${config.apiPrefix}/medicines`, medicineRoutes);
app.use(`${config.apiPrefix}/health`, healthRoutes);

/**
 * Health Check Endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'MediBot AI Backend is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * 404 Not Found Handler
 */
app.use(notFoundMiddleware);

/**
 * Error Handling Middleware
 */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  ErrorHandler.handle(err, _req, res, _next);
});

/**
 * Start Server
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    const server = app.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════╗
║   MediBot AI Backend Server Started     ║
║   Environment: ${config.nodeEnv}${' '.repeat(16 - config.nodeEnv.length)}║
║   Port: ${config.port}${' '.repeat(35 - config.port.toString().length)}║
║   API URL: http://localhost:${config.port}/api${' '.repeat(17 - config.port.toString().length)}║
╚════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = (): void => {
      console.log('\n\nShutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (_error) {
    console.error('Failed to start server:', _error);
    process.exit(1);
  }
};

// Start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
