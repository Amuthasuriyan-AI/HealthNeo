# 🏥 MediBot AI - Healthcare AI Chatbot

A comprehensive Healthcare AI Chatbot web application that provides intelligent healthcare assistance with AI-powered conversations, symptom checking, medicine information, and appointment management.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Docker Deployment](#docker-deployment)
- [Project Architecture](#project-architecture)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 1. **User Authentication**
- User registration with role selection (Patient/Doctor)
- Secure login with JWT authentication
- Password hashing with bcrypt
- Token refresh mechanism
- Profile management and updates

### 2. **AI Healthcare Chatbot**
- Real-time conversations powered by OpenAI GPT-3.5-turbo
- Context-aware chat memory
- Symptom analysis assistance
- Medical question answering
- Chat history storage
- **Medical Disclaimer**: "This AI assistant provides informational support only and does not replace professional medical advice, diagnosis, or treatment."

### 3. **Symptom Checker**
- Input symptoms for analysis
- AI-powered condition prediction
- Risk assessment
- Suggested next steps
- Doctor consultation recommendations

### 4. **Medicine Information Database**
- Search comprehensive medicine database
- Detailed medicine information:
  - Dosage details
  - Side effects
  - Warnings and precautions
  - Drug interactions
  - Price information
- Text search functionality

### 5. **Appointment Management**
- Browse available doctors
- Filter by specialization
- Book appointments with time slots
- View appointment history
- Cancel appointments
- Rate and review appointments
- Email confirmations

### 6. **Health Dashboard**
- BMI Calculator with category classification
- Track health vitals (weight, height, BP, heart rate)
- Maintain health records
- View health history
- Health statistics

### 7. **Security Features**
- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (RBAC)
- Input validation with Joi
- Rate limiting
- CORS protection
- Helmet.js for HTTP headers security
- Secure API endpoints

## 📁 Project Structure

```
HealthNeo/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.ts                 # Configuration management
│   │   │   └── database.ts               # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.ts                   # User schema
│   │   │   ├── Doctor.ts                 # Doctor schema
│   │   │   ├── Appointment.ts            # Appointment schema
│   │   │   ├── ChatHistory.ts            # Chat history schema
│   │   │   ├── Medicine.ts               # Medicine schema
│   │   │   ├── HealthRecord.ts           # Health record schema
│   │   │   └── Notification.ts           # Notification schema
│   │   ├── routes/
│   │   │   ├── authRoutes.ts             # Authentication endpoints
│   │   │   ├── chatRoutes.ts             # Chatbot endpoints
│   │   │   ├── appointmentRoutes.ts      # Appointment endpoints
│   │   │   ├── medicineRoutes.ts         # Medicine endpoints
│   │   │   └── healthRoutes.ts           # Health endpoints
│   │   ├── controllers/
│   │   │   ├── authController.ts         # Auth logic
│   │   │   ├── chatbotController.ts      # Chatbot logic
│   │   │   ├── appointmentController.ts  # Appointment logic
│   │   │   ├── medicineController.ts     # Medicine logic
│   │   │   └── healthController.ts       # Health logic
│   │   ├── middleware/
│   │   │   ├── auth.ts                   # JWT verification & RBAC
│   │   │   ├── errorHandler.ts           # Error handling
│   │   │   └── validation.ts             # Input validation
│   │   ├── services/
│   │   │   ├── emailService.ts           # Email notifications
│   │   │   └── chatbotService.ts         # OpenAI integration
│   │   ├── utils/
│   │   │   └── index.ts                  # Utility functions
│   │   ├── types/
│   │   │   └── index.ts                  # TypeScript interfaces
│   │   └── server.ts                     # Express app setup
│   ├── package.json
│   ├── tsconfig.json
│   └── .eslintrc.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UI.tsx                    # Reusable UI components
│   │   │   └── ProtectedRoute.tsx        # Route protection
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx             # Login page
│   │   │   ├── RegisterPage.tsx          # Registration page
│   │   │   ├── DashboardPage.tsx         # Main dashboard
│   │   │   ├── ChatbotPage.tsx           # Chatbot interface
│   │   │   ├── AppointmentsPage.tsx      # Appointments management
│   │   │   ├── MedicinePage.tsx          # Medicine search
│   │   │   └── HealthDashboardPage.tsx   # Health tracking
│   │   ├── services/
│   │   │   └── api.ts                    # API client
│   │   ├── context/
│   │   │   └── store.ts                  # Zustand stores
│   │   ├── hooks/
│   │   │   └── index.ts                  # Custom React hooks
│   │   ├── types/
│   │   │   └── index.ts                  # TypeScript types
│   │   ├── styles/
│   │   │   └── index.css                 # Global styles
│   │   ├── App.tsx                       # Main app component
│   │   └── main.tsx                      # React entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── .eslintrc.json
├── docker/
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Validation**: Joi
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State**: Zustand
- **HTTP**: Axios
- **Icons**: React Icons
- **UI Components**: Custom + React components

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Version Control**: Git

## 📦 Prerequisites

- Node.js v16 or higher
- npm v8 or higher
- MongoDB (local or Atlas)
- OpenAI API Key
- Docker & Docker Compose (for containerization)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Amuthasuriyan-AI/HealthNeo.git
cd HealthNeo
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Build TypeScript
npm run build
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Step 4: Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/medibot-ai

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM=noreply@medibot-ai.com

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Local Development

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
Backend runs at: `http://localhost:5000`

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:3000`

#### Terminal 3 - MongoDB (if local):
```bash
mongod
```

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "role": "patient"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

### Chatbot Endpoints

#### Start Chat Session
```http
POST /api/chat/start
Authorization: Bearer {token}
```

#### Send Message
```http
POST /api/chat/send
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "I have a headache",
  "sessionId": "optional-session-id"
}
```

#### Get Chat History
```http
GET /api/chat/history/{sessionId}
Authorization: Bearer {token}
```

### Appointment Endpoints

#### Get Doctors
```http
GET /api/appointments/doctors?specialization=Cardiology&skip=0&limit=10
Authorization: Bearer {token}
```

#### Book Appointment
```http
POST /api/appointments/book
Authorization: Bearer {token}
Content-Type: application/json

{
  "doctorId": "doctor-id",
  "appointmentDate": "2024-12-25",
  "startTime": "10:00",
  "reason": "General checkup"
}
```

### Medicine Endpoints

#### Search Medicines
```http
GET /api/medicines/search?query=aspirin&limit=10
Authorization: Bearer {token}
```

#### Get Medicine Details
```http
GET /api/medicines/{medicineId}
Authorization: Bearer {token}
```

### Health Endpoints

#### Create Health Record
```http
POST /api/health/records
Authorization: Bearer {token}
Content-Type: application/json

{
  "recordType": "vital",
  "recordDate": "2024-01-15",
  "data": {
    "weight": 75,
    "height": 180,
    "bloodPressure": "120/80"
  }
}
```

#### Calculate BMI
```http
POST /api/health/bmi
Authorization: Bearer {token}
Content-Type: application/json

{
  "weight": 75,
  "height": 180
}
```

## 🐳 Docker Deployment

### Build and Run with Docker Compose

```bash
# Set environment variables
export JWT_SECRET=your_secret_key
export OPENAI_API_KEY=your_openai_key

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- MongoDB: `localhost:27017`

### Manual Docker Build

**Backend:**
```bash
docker build -f docker/Dockerfile.backend -t medibot-backend .
docker run -p 5000:5000 --env-file .env medibot-backend
```

**Frontend:**
```bash
docker build -f docker/Dockerfile.frontend -t medibot-frontend .
docker run -p 3000:3000 medibot-frontend
```

## 🏗 Project Architecture

### Authentication Flow
1. User registers/logs in
2. Credentials validated against database
3. JWT token generated and returned
4. Token stored in localStorage
5. Subsequent requests include token in Authorization header
6. Backend verifies token and extracts user info
7. Token refresh mechanism handles expiration

### Chatbot Flow
1. User initiates chat session
2. Messages sent to backend API
3. Backend calls OpenAI API
4. Response returned to frontend
5. Chat history stored in MongoDB
6. Medical disclaimer displayed

### Appointment Flow
1. User browses doctors
2. Selects doctor and time slot
3. Appointment created in database
4. Confirmation email sent
5. User can view, rate, or cancel

## 💾 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  password: String (hashed),
  role: "patient" | "doctor" | "admin",
  profileImage: String,
  phone: String,
  dateOfBirth: Date,
  gender: "male" | "female" | "other",
  address: String,
  city: String,
  state: String,
  zipCode: String,
  medicalHistory: [String],
  allergies: [String],
  isVerified: Boolean,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Doctor Collection
```javascript
{
  // ... extends User
  specialization: String,
  licenseNumber: String (unique),
  experience: Number,
  consultationFee: Number,
  availableSlots: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  rating: Number (0-5),
  totalRatings: Number,
  bio: String,
  education: [String]
}
```

### Appointment Collection
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: User),
  doctorId: ObjectId (ref: Doctor),
  appointmentDate: Date,
  startTime: String,
  endTime: String,
  reason: String,
  status: "scheduled" | "completed" | "cancelled" | "no-show",
  notes: String,
  prescription: String,
  feedback: {
    rating: Number,
    comment: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### ChatHistory Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  messages: [{
    role: "user" | "assistant",
    content: String,
    timestamp: Date
  }],
  sessionStartTime: Date,
  sessionEndTime: Date,
  topic: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Medicine Collection
```javascript
{
  _id: ObjectId,
  name: String (unique),
  genericName: String,
  brand: String,
  strength: String,
  formulation: "tablet" | "capsule" | "syrup" | "injection" | "cream",
  manufacturer: String,
  dosage: {
    amount: String,
    frequency: String,
    duration: String
  },
  sideEffects: [String],
  warnings: [String],
  precautions: [String],
  contraindications: [String],
  interactions: [String],
  price: Number,
  description: String,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing with bcryptjs
- Token refresh mechanism

### 2. API Security
- Rate limiting to prevent DDoS
- CORS configuration
- Helmet.js for secure HTTP headers
- Input validation with Joi
- SQL injection prevention

### 3. Data Security
- Encrypted password storage
- Secure token management
- Sensitive data not exposed in responses
- HTTPS recommended for production

### 4. Error Handling
- Centralized error handler
- No stack trace exposure
- User-friendly error messages
- Logging for debugging

## 🚨 Important Medical Disclaimer

**This AI assistant provides informational support only and does not replace professional medical advice, diagnosis, or treatment.**

- Always consult with a licensed healthcare provider for medical concerns
- In case of emergency, call your local emergency services immediately
- The application is designed to provide general health information only
- Do not use for self-diagnosis or self-treatment

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
```
Solution: Ensure MongoDB is running
- Local: mongod
- Atlas: Check connection string in .env
```

**2. OpenAI API Error**
```
Solution: Verify OpenAI API key
- Check key validity
- Verify sufficient credits
- Check API rate limits
```

**3. CORS Error**
```
Solution: Update CORS_ORIGIN in .env
- Ensure frontend URL matches CORS_ORIGIN
- Check backend is running
```

**4. Token Expired**
```
Solution: Use refresh token mechanism
- Frontend automatically handles token refresh
- If issue persists, re-login required
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see LICENSE file for details.

## 👨‍💻 Author

**MediBot AI Team**
- Healthcare Domain Expert
- AI Engineer
- Full-Stack Developer

## 🤝 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Email: support@medibot-ai.com

## 🔗 Useful Links

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [Docker Documentation](https://docs.docker.com/)

---

**Made with ❤️ for Healthcare**