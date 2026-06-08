/**
 * User Types and Interfaces
 */
export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'admin';
  profileImage?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  medicalHistory?: string[];
  allergies?: string[];
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Doctor Types and Interfaces
 */
export interface IDoctor extends IUser {
  specialization: string;
  licenseNumber: string;
  experience: number;
  consultationFee: number;
  availableSlots: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  rating: number;
  totalRatings: number;
  bio: string;
  education: string[];
}

/**
 * Appointment Types and Interfaces
 */
export interface IAppointment {
  _id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  prescription?: string;
  feedback?: {
    rating: number;
    comment: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat History Types and Interfaces
 */
export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChatHistory {
  _id: string;
  userId: string;
  messages: IMessage[];
  sessionStartTime: Date;
  sessionEndTime?: Date;
  topic?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Medicine Types and Interfaces
 */
export interface IMedicine {
  _id: string;
  name: string;
  genericName: string;
  brand: string;
  strength: string;
  formulation: string;
  manufacturer: string;
  dosage: {
    amount: string;
    frequency: string;
    duration: string;
  };
  sideEffects: string[];
  warnings: string[];
  precautions: string[];
  contraindications: string[];
  interactions: string[];
  price: number;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Health Record Types and Interfaces
 */
export interface IHealthRecord {
  _id: string;
  userId: string;
  recordType: 'vital' | 'lab' | 'imaging' | 'other';
  recordDate: Date;
  data: {
    weight?: number;
    height?: number;
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    bmi?: number;
    [key: string]: any;
  };
  notes?: string;
  attachmentUrl?: string;
  doctorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Notification Types and Interfaces
 */
export interface INotification {
  _id: string;
  userId: string;
  type: 'appointment' | 'message' | 'health-tip' | 'reminder' | 'alert';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * API Response Types
 */
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

/**
 * JWT Payload Types
 */
export interface IJWTPayload {
  userId: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Error Types
 */
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
