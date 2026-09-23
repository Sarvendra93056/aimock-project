# InterviewAI — AI-Powered Mock Interview Platform 🚀

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-black.svg)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-orange.svg)](https://jwt.io/)

> **InterviewAI** is a production-quality, full-stack web application engineered for B.Tech Computer Science students and aspiring software engineers preparing for technical campus placements and tier-1 tech interviews. It delivers dynamic role-specific question generation, a real-time interview room with Web Speech API dictation and auto-saving, deep multi-rubric AI answer grading, resume-based project deep dives, a full CS question bank, and performance analytics.

---

## 📋 Table of Contents
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Models](#-database-models)
- [REST API Documentation](#-rest-api-documentation)
- [Quick Start & Setup Instructions](#-quick-start--setup-instructions)
- [Environment Variables](#-environment-variables)
- [Default Demo Credentials](#-default-demo-credentials)
- [Resume-Based Interview Engine](#-resume-based-interview-engine)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Deployment Instructions](#-deployment-instructions)

---

## ✨ Key Features

### 1. 🔐 Authentication & Role-Based Access Control
- Secure JWT-based authentication with bcrypt password hashing (10 salt rounds).
- Protected API endpoints and protected React routes.
- Multi-role authorization: **Candidate (`user`)** and **Administrator (`admin`)**.
- Candidate profile management with target role, experience level, college, branch, and graduation year.

### 2. 📊 User Performance Dashboard
- **Telemetry Cards**: Total mock sessions, platform average score, highest score, technical depth, and communication balance.
- **Competency Matrix**: Frequency-ranked strong areas and constructive weaknesses.
- **Recent Sessions Table**: Score badges, completion status, and direct one-click report access.
- **Quick Action Launchpad**: Configure custom mocks, practice questions, or upload resumes.

### 3. 🎯 Customizable Interview Setup
- **Job Roles**: Software Engineer, Java Developer, Frontend Developer, Backend Developer, Full Stack Developer, Data Analyst, or **Custom Roles**.
- **Experience Levels**: Fresher (Campus Candidate), Junior (1-2 yrs), Mid-level (3-5 yrs), Senior (5+ yrs).
- **Round Types**: Technical, HR Round, Behavioral (STAR Method), or Comprehensive Mixed.
- **Difficulty & Duration**: Easy, Medium, Hard with durations from 15 to 60 minutes.

### 4. 🧠 Modular AI Engine & Question Generation
- Pluggable AI service supporting **Google Gemini API** (`gemini-1.5-flash`) and **OpenAI-compatible APIs**.
- **Intelligent Offline Fallback Engine**: Built-in placement-grade evaluation heuristics guarantee that 100% of generation and grading features work out of the box even without an external API key.
- Questions are dynamically generated, randomized, and stored in MongoDB.

### 5. 🎙️ Real-Time Interview Room
- **Focus Mode**: Distraction-free interview interface with live countdown timer and warning colors.
- **Live Voice Dictation**: Candidacy answers can be dictated via the browser's Web Speech API (`webkitSpeechRecognition`) or typed manually.
- **Code Snippet Mode**: Syntax-friendly monospace font and formatting for coding answers.
- **Debounced Auto-Save**: Answers are continuously synced and auto-saved to MongoDB in real time.
- **Interactive Question Stepper**: Jump between questions, flag questions for later review, and inspect answered progress.

### 6. 📝 AI Answer Evaluation & Detailed Reports
- **5-Factor Rubric Grading**: Technical Correctness, Relevance, Completeness, Communication, and Problem Solving.
- **Overall Score**: Dynamic circular SVG progress gauge with placement readiness verdict.
- **Actionable Feedback**: "What you did well" (strengths), "What needs improvement", and "Topics to revise".
- **Side-by-Side Review**: Candidate's submitted answers compared against ideal model answers.
- **Print / PDF Export**: Clean, print-ready reports for interview review.

### 7. 📄 Resume-Based Project Interviews
- Upload PDF resumes via Multer memory buffer and `pdf-parse`.
- Extracts candidate skills, frameworks, databases, and detected portfolio projects.
- AI formulates questions specifically testing candidate architectural decisions (e.g., *"In your React + Node.js E-Commerce project, how did you prevent race conditions during high-volume sales?"*).

### 8. 📚 CS Placement Question Bank
- Filterable repository across **13 core categories**:
  `Java`, `C++`, `JavaScript`, `React`, `Node.js`, `MongoDB`, `SQL`, `DBMS`, `Operating Systems`, `Computer Networks`, `DSA`, `HR`, and `Behavioral`.
- **Instant Practice Mode**: Submit individual practice answers and receive instant AI grading, constructive tips, and revealed model answers.

### 9. 🛡️ Administrator Console
- Platform-wide telemetry (Total candidates, total sessions, platform average score, question count).
- User management table with interview counts and role toggling.
- Full CRUD operations over Question Bank repository.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│             React + Vite Frontend (SPA)                │
│  React Router v6 • Recharts • Lucide • Vanilla CSS    │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / REST (JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│               Express.js REST Gateway                  │
│    JWT Auth Middleware • Error Handler • Multer        │
└──────────────┬────────────────────────────┬────────────┘
               │                            │
               ▼                            ▼
┌───────────────────────────────┐ ┌──────────────────────┐
│       MongoDB Database        │ │  Modular AI Service  │
│  Users • Interviews • Answers │ │  Gemini / OpenAI /   │
│  Questions • Categories • Perf│ │  Placement Fallback  │
└───────────────────────────────┘ └──────────────────────┘
```

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, JavaScript (ES6+), React Router v6, Axios, Recharts, Lucide-React, Canvas-Confetti, Vanilla CSS Tokens |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Multer, pdf-parse, Morgan, Dotenv |
| **Database** | MongoDB, Mongoose 8.x |
| **AI Integration**| Google Gemini API (`gemini-1.5-flash`), OpenAI REST, Rule-based CS Rubric Fallback Engine |
| **Speech API** | HTML5 Web Speech API (`webkitSpeechRecognition`) |

---

## 📁 Project Structure

```
interviewai/
├── package.json               # Root workspace scripts (concurrent execution)
├── README.md                  # Complete placement portfolio documentation
├── server/
│   ├── server.js              # Express application entry point
│   ├── package.json
│   ├── .env                   # Environment secrets
│   ├── config/
│   │   └── db.js              # Mongoose connection
│   ├── models/
│   │   ├── User.js            # User credentials & placement profile
│   │   ├── Interview.js       # Interview session, questions & rubrics
│   │   ├── Question.js        # Question Bank model
│   │   ├── Category.js        # Category model (13 CS categories)
│   │   └── Performance.js     # Time-series analytics records
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── interviewController.js
│   │   ├── resumeController.js
│   │   ├── performanceController.js
│   │   ├── questionController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect & authorize
│   │   ├── uploadMiddleware.js# Multer PDF memory storage
│   │   └── errorMiddleware.js # Centralized error handler
│   ├── services/
│   │   ├── aiService.js       # Gemini / OpenAI / Placement Rubric engine
│   │   └── resumeParser.js    # PDF text extractor & project detector
│   ├── utils/
│   │   └── seeder.js          # Seeds 13 categories, questions & demo users
│   └── test_e2e.js            # Automated E2E verification test suite
└── client/
    ├── vite.config.js         # Vite configuration with /api proxy
    ├── index.html             # Fonts (Outfit & Inter), metadata, favicon
    └── src/
        ├── index.css          # Rich dark slate design system & tokens
        ├── main.jsx           # App bootstrapping
        ├── App.jsx            # Route mappings & context providers
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ToastContext.jsx
        ├── services/
        │   └── api.js         # Axios client with JWT interceptor
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── ScoreGauge.jsx
        │   ├── Modal.jsx
        │   └── ProtectedRoute.jsx
        ├── layouts/
        │   └── DashboardLayout.jsx
        └── pages/
            ├── Landing.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── InterviewSetup.jsx
            ├── InterviewRoom.jsx
            ├── InterviewReport.jsx
            ├── Analytics.jsx
            ├── History.jsx
            ├── ResumeInterview.jsx
            ├── QuestionBank.jsx
            ├── AdminDashboard.jsx
            └── Profile.jsx
```

---

## 🗄️ Database Models

### User Schema
- `name` (String, required)
- `email` (String, unique, lowercase)
- `password` (String, hashed via bcrypt)
- `role` (Enum: `'user'`, `'admin'`)
- `targetRole` (String, default: `'Software Engineer'`)
- `experienceLevel` (Enum: `'Fresher'`, `'Junior'`, `'Mid-level'`, `'Senior'`)
- `college`, `branch`, `graduationYear`, `bio`

### Interview Schema
- `user` (Ref: User)
- `title`, `jobRole`, `experienceLevel`, `interviewType`, `difficulty`
- `totalQuestions`, `durationMinutes`, `timeSpentSeconds`
- `status` (Enum: `'in-progress'`, `'completed'`, `'abandoned'`)
- `questions` (Array: text, category, difficulty, type, hints, projectContext)
- `answers` (Array: userAnswer, savedAt, evaluation metrics, strengths, improvements, idealAnswer)
- `overallScore`, `technicalScore`, `communicationScore`, `problemSolvingScore`
- `strongAreas`, `weakAreas`, `topicsToRevise`, `recommendations`
- `isResumeBased`, `resumeData` (fileName, extractedSkills, extractedProjects)

### Question & Category Schemas
- High-yield placement questions categorized across 13 core domains with model answers and concept tags.

---

## 📡 REST API Documentation

### Authentication & Users
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new student account | Public |
| `POST` | `/api/auth/login` | Authenticate & retrieve JWT | Public |
| `GET` | `/api/auth/me` | Get profile of logged-in user | Private |
| `PUT` | `/api/users/profile` | Update profile details | Private |

### Mock Interviews
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/interviews` | Generate AI interview questions | Private |
| `GET` | `/api/interviews` | List candidate's interview history | Private |
| `GET` | `/api/interviews/:id` | Fetch interview session state | Private |
| `PUT` | `/api/interviews/:id/autosave` | Real-time draft answer autosave | Private |
| `POST` | `/api/interviews/:id/submit` | Submit interview for AI evaluation | Private |
| `GET` | `/api/interviews/:id/report` | Fetch comprehensive graded report | Private |
| `DELETE`| `/api/interviews/:id` | Delete interview session | Private |
| `POST` | `/api/interviews/resume-upload`| Upload PDF resume & generate targeted questions | Private |

### Performance Analytics & Questions
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/performance` | Retrieve multi-metric analytics & radar charts | Private |
| `GET` | `/api/questions` | Filter question bank by category & difficulty | Public |
| `POST` | `/api/questions/practice-evaluate`| Instant AI grading for single practice answer | Private |
| `POST` | `/api/questions` | Add question to bank | Admin |
| `PUT` | `/api/questions/:id` | Update question in bank | Admin |
| `DELETE`| `/api/questions/:id` | Remove question from bank | Admin |

### Administration
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Platform telemetry & role distributions | Admin |
| `GET` | `/api/admin/users` | Candidate list with interview volume | Admin |
| `GET` | `/api/admin/interviews` | Platform-wide interview audit logs | Admin |
| `PUT` | `/api/admin/users/:id/role`| Toggle candidate role (user/admin) | Admin |

---

## 🚀 Quick Start & Setup Instructions

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local instance on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 1. Clone Repository & Install Dependencies
```bash
git clone <repository-url>
cd "ai mock project"

# Install all workspace dependencies
npm run install:all
```

### 2. Configure Environment Variables
Create or verify `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/interviewai
JWT_SECRET=interviewai_super_secret_jwt_key_2026_placement_ready
JWT_EXPIRE=30d

# Optional: Add your Google Gemini or OpenAI API Key
# If omitted, InterviewAI seamlessly uses its built-in CS Placement Engine!
GEMINI_API_KEY=
OPENAI_API_KEY=
```

### 3. Seed Default Database
Populates standard placement questions, 13 categories, demo student account, and admin account:
```bash
npm run seed
```

### 4. Run Both Server & Client Concurrently
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

---

## 🔑 Default Demo Credentials

For rapid testing and campus placement presentations, 1-click autofill buttons are built directly into the Login page:

| Role | Email | Password |
|---|---|---|
| **Placement Student** | `student@interviewai.com` | `studentpassword123` |
| **Platform Admin** | `admin@interviewai.com` | `adminpassword123` |

---

## 📄 Resume-Based Interview Engine

The resume engine uses a multi-stage pipeline:
1. **Extraction**: Accepts any standard PDF resume (`.pdf`), extracting text streams in memory.
2. **Entity Recognition**: Scans for languages (`Java`, `Python`, `JavaScript`, etc.), frameworks (`React`, `Node.js`, `Spring Boot`, etc.), and databases (`MongoDB`, `SQL`, `Redis`).
3. **Project Detection**: Identifies highlighted portfolio projects, tech stacks, and architectures.
4. **Targeted Question Synthesis**: Formulates deep-dive interview prompts specifically challenging the candidate on concurrency, scaling, and database design within their own projects.

---

## 🧪 Testing & Quality Assurance

Run the automated full-stack integration test suite:
```bash
cd server
node test_e2e.js
```

The test validates:
- API health and database connectivity
- JWT issuance, encryption, and password matching
- Performance telemetry aggregation
- Question generation across roles
- Real-time autosave persistence
- AI evaluation across the 5-factor rubric
- Question Bank practice evaluation

---

## 🌐 Deployment Instructions

### Deploying Frontend (Vercel / Netlify)
1. Build the frontend bundle:
   ```bash
   cd client
   npm run build
   ```
2. Set environment variable `VITE_API_BASE_URL` to your production backend URL.
3. Deploy the `client/dist` directory.

### Deploying Backend (Render / Railway / AWS EC2)
1. Deploy `server/` directory as a Node.js web service.
2. Configure environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `GEMINI_API_KEY`).
3. Set start command: `npm start`.

---

## 👨‍🎓 Author & Portfolio Credit

- **Developer**: Sarvendra Vikram Singh
- **Degree**: B.Tech in Computer Science and Engineering
- **Focus**: Distributed Systems, Full-Stack Web Architecture, AI Engineering
- **License**: MIT
