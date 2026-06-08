# ⚡ Quick Start Guide - MediBot AI

Get MediBot AI running in 5 minutes!

## Prerequisites
- Node.js 16+
- MongoDB (or use MongoDB Atlas)
- OpenAI API Key
- Basic terminal knowledge

## Option 1: Local Development (Fastest)

### 1. Clone & Setup (1 min)
```bash
git clone https://github.com/Amuthasuriyan-AI/HealthNeo.git
cd HealthNeo
cp .env.example .env
```

### 2. Configure (1 min)
```bash
# Edit .env with your OpenAI API key
nano .env

# Change this line:
# OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. Install Backend (1 min)
```bash
cd backend
npm install
npm run build
```

### 4. Install Frontend (1 min)
```bash
cd frontend
npm install
```

### 5. Run (1 min)

**Terminal 1:**
```bash
# Start MongoDB (if local)
mongod
```

**Terminal 2:**
```bash
cd backend
npm run dev
# Backend at http://localhost:5000
```

**Terminal 3:**
```bash
cd frontend
npm run dev
# Frontend at http://localhost:3000
```

**Done!** Open http://localhost:3000 in your browser.

---

## Option 2: Docker Deployment (Easier)

### Prerequisites
- Docker
- Docker Compose

### One Command to Run Everything

```bash
# Configure environment
cp .env.example .env
nano .env  # Add your OpenAI API key

# Start all services
docker-compose up -d

# Done! Access at http://localhost:3000
```

### View Logs
```bash
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down
```

---

## Default Test Credentials

Once running, create an account:

1. Go to http://localhost:3000/register
2. Create new account
3. Login with your credentials

**Test as Doctor:**
- Select "Doctor" role during registration
- Access doctor-specific features

**Test as Patient:**
- Select "Patient" role during registration
- Book appointments with doctors

---

## Features to Try

### 1. **AI Chatbot** 💬
- Navigate to "AI Healthcare Assistant"
- Ask health-related questions
- Get AI-powered responses

### 2. **Book Appointments** 📅
- Go to "Book Appointments"
- Select a doctor
- Choose date and time
- Confirm booking

### 3. **Medicine Search** 💊
- Search for medicines
- View dosage and side effects
- Get drug information

### 4. **Health Dashboard** ❤️
- Calculate your BMI
- Track health vitals
- View health records

---

## Environment Variables Quick Reference

### Must Configure
```env
OPENAI_API_KEY=sk-your-api-key-here
```

### Optional but Recommended
```env
# For email notifications
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# For production
JWT_SECRET=your-secure-secret-key
```

---

## Troubleshooting

### Can't access frontend?
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process using port 3000
kill -9 <PID>
```

### Can't access backend?
```bash
# Check backend status
curl http://localhost:5000/health

# If fails, restart backend
# Terminal 2: Ctrl+C then npm run dev
```

### MongoDB Connection Error?
```bash
# Check MongoDB is running
mongosh

# If not installed, install MongoDB Community Edition
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb
```

### OpenAI API Error?
```bash
# Check API key is correct
echo $OPENAI_API_KEY

# Verify at https://platform.openai.com/account/billing/overview
# Ensure you have credits remaining
```

---

## Next Steps

### Learn More
- Read full [README.md](README.md)
- Check [API Documentation](README.md#-api-documentation)
- Review [Architecture](README.md#-project-architecture)

### Production Deployment
- See [DEPLOYMENT.md](DEPLOYMENT.md)
- Configure SSL certificates
- Set up monitoring

### Customize
- Modify UI colors in `tailwind.config.js`
- Add custom components in `src/components/`
- Extend API in `backend/src/routes/`

---

## Important: Medical Disclaimer ⚠️

**This AI assistant provides informational support only and does not replace professional medical advice, diagnosis, or treatment.**

Always consult with a licensed healthcare provider for medical concerns.

---

## Need Help?

- 📖 Check [README.md](README.md)
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 Report issues on GitHub
- 📧 Email: support@medibot-ai.com

---

**Happy coding! 🚀💻**
