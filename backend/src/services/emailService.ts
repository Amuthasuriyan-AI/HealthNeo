import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config/config';

/**
 * Email Service
 * Handles sending emails via SMTP
 */
export class EmailService {
  private static transporter: Transporter;

  /**
   * Initialize SMTP transporter
   */
  static initialize(): void {
    this.transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.port === 465,
      auth: {
        user: config.email.smtp.user,
        pass: config.email.smtp.password,
      },
    });
  }

  /**
   * Send verification email
   */
  static async sendVerificationEmail(
    email: string,
    verificationLink: string
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to: email,
        subject: 'Verify Your Email - MediBot AI',
        html: `
          <h2>Email Verification</h2>
          <p>Click the link below to verify your email:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>This link expires in 24 hours.</p>
        `,
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(
    email: string,
    resetLink: string
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to: email,
        subject: 'Password Reset - MediBot AI',
        html: `
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  /**
   * Send appointment confirmation email
   */
  static async sendAppointmentConfirmation(
    email: string,
    doctorName: string,
    appointmentDate: string,
    appointmentTime: string
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to: email,
        subject: 'Appointment Confirmation - MediBot AI',
        html: `
          <h2>Appointment Confirmed</h2>
          <p>Your appointment has been confirmed:</p>
          <ul>
            <li><strong>Doctor:</strong> ${doctorName}</li>
            <li><strong>Date:</strong> ${appointmentDate}</li>
            <li><strong>Time:</strong> ${appointmentTime}</li>
          </ul>
          <p>Please arrive 10 minutes early.</p>
        `,
      });
    } catch (error) {
      console.error('Error sending appointment confirmation:', error);
      throw error;
    }
  }

  /**
   * Send health tip email
   */
  static async sendHealthTip(
    email: string,
    tip: string
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to: email,
        subject: 'Daily Health Tip - MediBot AI',
        html: `
          <h2>Daily Health Tip</h2>
          <p>${tip}</p>
          <p>Stay healthy!</p>
        `,
      });
    } catch (error) {
      console.error('Error sending health tip:', error);
      throw error;
    }
  }
}
