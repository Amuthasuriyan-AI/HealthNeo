/**
 * Frontend Types and Interfaces
 */

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'admin';
  profileImage?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  medicalHistory?: string[];
  allergies?: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface Doctor {
  _id: string;
  fullName: string;
  email: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  availableSlots: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  rating: number;
  totalRatings: number;
  bio: string;
  profileImage?: string;
}

export interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  doctorDetails?: Doctor;
  appointmentDate: string;
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
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  _id: string;
  userId: string;
  messages: ChatMessage[];
  sessionStartTime: string;
  sessionEndTime?: string;
  topic?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Medicine {
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
}

export interface HealthRecord {
  _id: string;
  userId: string;
  recordType: 'vital' | 'lab' | 'imaging' | 'other';
  recordDate: string;
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
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  statusCode: number;
}

export interface PaginationMeta {
  total: number;
  skip: number;
  limit: number;
}
