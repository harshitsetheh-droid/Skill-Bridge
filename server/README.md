# TalentBridge Backend

Full REST API backend for the TalentBridge campus recruitment platform, built with Express, Prisma, PostgreSQL, JWT auth, and Google Gemini AI.

## Tech Stack
- **Express** - REST API framework
- **Prisma ORM** - Database layer
- **PostgreSQL** - Relational database
- **JWT** - Authentication & sessions
- **bcryptjs** - Password hashing
- **Google Gemini** - AI features (AST analysis, resume parsing, quiz generation)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/talentbridge"
JWT_SECRET="your-secret-key"
GEMINI_API_KEY="your-gemini-key"
```

### 3. Setup database
```bash
npm run db:push   # Creates all tables
npm run db:seed   # Seeds demo data
```

### 4. Start servers
```bash
npm run dev:all   # Frontend (3000) + Backend (3001)
```
Or separately:
```bash
npm run dev       # Frontend only
npm run server    # Backend only
```

## Demo Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | harshitseth.eh@gmail.com | 123456 |

Database by default starts empty (no sample data). Only the admin user is created during seeding.

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register (student/company/institution)
- `POST /api/auth/login` - Login
- `GET /api/auth/session` - Validate session (records telemetry)
- `GET /api/auth/me` - Current user

### Students
- `GET /api/students` - List all students (admin/institution)
- `GET /api/students/:id/profile` - Student profile
- `PUT /api/students/:id/profile` - Update profile
- `GET /api/students/:id/skills` - Student skills
- `POST /api/students/:id/skills` - Add skill
- `POST /api/students/:id/skills/request` - Request skill to TPO
- `GET /api/students/:id/projects` - Student projects
- `GET /api/students/:id/applications` - Student applications

### Projects & AI Verification
- `POST /api/projects` - Create project
- `POST /api/projects/:id/analyze-code` - Gemini AST plagiarism analysis
- `POST /api/projects/:id/submit-defense` - Gemini AI logic Q&A defense
- `GET /api/projects/flagged` - Flagged projects (institution/admin)

### Jobs
- `GET /api/jobs` - List jobs with filters
- `POST /api/jobs` - Create job (company)
- `PATCH /api/jobs/:id/tpo-status` - TPO approve/reject

### Applications
- `POST /api/applications/apply` - Student applies (auto match score)
- `GET /api/applications` - List applications
- `PATCH /api/applications/:id/status` - Company updates status
- `GET /api/applications/company/:companyId` - Company's applicants
- `GET /api/applications/institution/:institutionId` - TPO's applicants

### Company
- `GET/PUT /api/company/profile` - Company profile
- `POST /api/company/feedback` - Submit skill feedback to college
- `GET /api/company/feedback/:institutionId` - Get feedback
- `GET /api/company/analytics/:companyId` - Hiring analytics

### Institution / TPO
- `GET /api/tpo/overview` - Executive summary
- `POST /api/tpo/drive-requests/invite` - Invite company
- `GET /api/tpo/drive-requests` - List drive requests
- `GET /api/tpo/skill-requests` - Student skill requests
- `GET /api/tpo/curriculum-gaps` - Curriculum gap analysis
- `GET /api/tpo/placed-students` - Placed student records

### Admin
- `GET /api/admin/dashboard` - Platform metrics
- `GET /api/admin/students` - All students
- `GET /api/admin/institutions` - All institutions
- `GET /api/admin/companies` - All companies
- `GET /api/admin/approvals` - Approval queue
- `PATCH /api/admin/approvals/:id` - Approve/reject
- `GET /api/admin/sessions` - Session telemetry
- `GET /api/admin/fraud-alerts` - Fraud alerts

### AI Services
- `POST /api/ai/analyze-code` - AST originality scan
- `POST /api/ai/defense-questions` - Generate Q&A
- `POST /api/ai/evaluate-defense` - Evaluate answers
- `POST /api/ai/parse-resume` - ATS resume parsing
- `POST /api/ai/skill-questions` - Quiz generation

## Project Structure
```
server/
├── index.js              # Express entry
├── seed.js               # Demo data seeder
├── prisma/
│   └── schema.prisma     # Database schema
├── middleware/
│   └── auth.js           # JWT + role guards
├── routes/               # REST endpoint handlers
│   ├── auth.js
│   ├── students.js
│   ├── projects.js
│   ├── jobs.js
│   ├── applications.js
│   ├── company.js
│   ├── institution.js
│   ├── admin.js
│   └── ai.js
└── services/
    └── gemini.js         # Google Gemini AI integration
```
