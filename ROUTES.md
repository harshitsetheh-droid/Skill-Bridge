# SkillBridge - System Routes & API Architecture

This document provides a comprehensive specification of all client-side navigation routes, view tabs, API endpoints, backend services, and reactive event-bus channels within the SkillBridge platform.

---

## 1. High-Level Architecture Overview

SkillBridge operates as a high-performance, responsive React application built with TypeScript, Vite, and Tailwind CSS. The application employs a decoupled client-side reactive store pattern with seamless Express backend API proxy readiness.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SKILLBRIDGE CLIENT                              │
│                                                                             │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌────────────┐   │
│   │  Student View │  │  Company View │  │  TPO (College)│  │ Admin View │   │
│   └───────┬───────┘  └───────┬───────┘  └───────┬───────┘  └──────┬─────┘   │
│           │                  │                  │                 │         │
│           ▼                  ▼                  ▼                 ▼         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                 Reactive Store Layer (src/data/*)                   │   │
│   │  - jobsStore              - projectsStore      - skillsStore        │   │
│   │  - studentApplicationsStore - improvementPathStore - feedbackStore    │   │
│   │  - driveRequestsStore     - collegeApproachStore - sessionTracking  │   │
│   └──────────────────────────────────┬──────────────────────────────────┘   │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │ HTTP / REST / Gemini AI
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND & AI API LAYER                            │
│                                                                             │
│   ┌────────────────────────┐  ┌─────────────────────────────────────────┐   │
│   │   REST API Services    │  │       Google Gemini 2.5/Flash AI         │   │
│   │  - Auth & Sessions     │  │  - AST Code Plagiarism & Logic Analysis │   │
│   │  - Jobs & Applications │  │  - Interactive AI Q&A Defense Generator │   │
│   │  - TPO & Company Sync  │  │  - ATS Resume Parsing & Benchmarking    │   │
│   └────────────────────────┘  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Client-Side Navigation & View Matrix

Navigation across the four primary actor roles is controlled by the centralized router in `src/App.tsx` and the persistent `Sidebar.tsx`.

### 2.1 Student Role (`currentRole === 'student'`)

| Tab Key | Component | Path / Deep Link | Description |
| :--- | :--- | :--- | :--- |
| `dashboard` | `StudentDashboard` | `/?role=student&tab=dashboard` | Student home overview: match scores, daily streak, active job alerts, and quick stats. |
| `daily-questions` | `DailyQuestionsView` | `/?role=student&tab=daily-questions` | Daily 3-question skill checkpoint quiz with streak counter, timer, and explanations. |
| `skills` | `MySkillsView` | `/?role=student&tab=skills` | Complete skill inventory with Beginner, Intermediate, and Advanced milestone checkpoints. |
| `skill-gap` / `gaps` | `SkillGapView` | `/?role=student&tab=skill-gap` | Dynamic skill gap analysis comparing student profile vs target job prerequisites & differentiators. |
| `projects` | `ProjectsView` | `/?role=student&tab=projects` | Uploaded proof-of-work projects, AST code audit reports, and AI Q&A logic defenses. |
| `resume` | `ResumeAnalyzerView` | `/?role=student&tab=resume` | PDF/DOCX resume upload, ATS parsing score, keyword extraction, and gap identification. |
| `improvement-path` / `roadmap` | `ImprovementPathView` | `/?role=student&tab=improvement-path&id=:pathId` | Company & role specific customized learning roadmaps, missing skills checklist, and suggested projects. |
| `internships` | `InternshipsView` | `/?role=student&tab=internships` | Browse and filter on-campus & off-campus job postings with real-time match scoring and one-click apply. |
| `companies` | `StudentCompaniesView` | `/?role=student&tab=companies` | Explore campus recruiting companies, past packages (LPA), visiting schedules, and hiring history. |
| `profile-settings` / `profile` | `StudentProfileSettings` | `/?role=student&tab=profile` | Student academic credentials, CGPA, GitHub/LinkedIn links, bio, and account preferences. |

---

### 2.2 Company / Recruiter Role (`currentRole === 'company'`)

| Tab Key | Component | Path / Deep Link | Description |
| :--- | :--- | :--- | :--- |
| `dashboard` | `CompanyDashboard` | `/?role=company&tab=dashboard` | Recruiter control center: active job metrics, candidate pipeline stats, and recent applicants. |
| `profile` | `CompanyProfileView` | `/?role=company&tab=profile` | Corporate profile, branding, industry sector, headquarters, and campus recruitment perks. |
| `post-job` | `PostJobView` | `/?role=company&tab=post-job` | Create new full-time / internship drives: set CGPA cutoffs, required skills, and differentiator bonuses. |
| `applied` / `candidates` | `CompanyAppliedView` | `/?role=company&tab=applied` | Full candidate evaluation pipeline: view AST code scores, schedule interviews, send offer letters. |
| `requests` | `CompanyRequestsView` | `/?role=company&tab=requests` | TPO campus recruitment drive invitations and college slot booking coordination. |
| `feedback` | `CompanyFeedbackView` | `/?role=company&tab=feedback` | Submit structured technical feedback to colleges and rate candidate strengths/weaknesses. |
| `analytics` | `CompanyAnalyticsView` | `/?role=company&tab=analytics` | Hiring velocity, skill conversion rates, offer acceptance ratio, and college performance benchmarks. |
| `settings` | `CompanySettingsView` | `/?role=company&tab=settings` | Recruiter team management, webhook settings, notification preferences, and ATS integrations. |

---

### 2.3 Institution / TPO Role (`currentRole === 'institution'`)

| Tab Key | Component | Path / Deep Link | Description |
| :--- | :--- | :--- | :--- |
| `overview` / `dashboard` | `InstitutionOverview` | `/?role=institution&tab=overview` | College TPO executive summary: placement percentage, department readiness, and visiting companies. |
| `skills` | `CollegeSkillsManagementView`| `/?role=institution&tab=skills` | Institutional curriculum skill catalogue, semester mapping, and laboratory alignment. |
| `curriculum-gaps` | `CurriculumGapsView` | `/?role=institution&tab=curriculum-gaps` | Market demand vs college syllabus comparison matrix by branch (CSE, IT, ECE). |
| `students` | `StudentReadinessView` | `/?role=institution&tab=students` | Student placement readiness roster: filter by CGPA, branch, verified skills, and project audit status. |
| `companies` | `CompanyEngagementView` | `/?role=institution&tab=companies` | Manage corporate relations, invite companies for campus drives, and track visiting history. |
| `applied-selected` | `AppliedSelectedView` | `/?role=institution&tab=applied-selected` | Central placement ledger: real-time list of all students placed, offered CTC, roles, and companies. |
| `requests` | `CollegeRequestsView` | `/?role=institution&tab=requests` | Student curriculum requests and corporate campus visit proposals. |
| `feedback` | `CollegeFeedbackView` | `/?role=institution&tab=feedback` | Recruiter feedback analysis: identified department skill deficits and recommended syllabus tweaks. |
| `project-integrity` / `integrity` | `ProjectIntegrityView` | `/?role=institution&tab=project-integrity` | AI AST code plagiarism monitoring and logic defense flag clearance dashboard. |
| `reports` | `InstitutionReportsView` | `/?role=institution&tab=reports` | Exportable placement records, NIRF compliance statistics, and accreditation reports. |

---

### 2.4 Admin Role (`currentRole === 'admin'`)

| Tab Key | Component | Path / Deep Link | Description |
| :--- | :--- | :--- | :--- |
| `dashboard` | `AdminDashboard` | `/?role=admin&tab=dashboard` | System-wide health monitor: active users, total placements, flagged accounts, and platform metrics. |
| `all-students` | `AdminStudentsView` | `/?role=admin&tab=all-students` | Global student directory with multi-college search, profile verification, and audit logs. |
| `student-verification` | `AdminStudentsView` | `/?role=admin&tab=student-verification` | Identity and academic credential verification queue for student accounts. |
| `suspicious-profiles` | `AdminStudentsView` | `/?role=admin&tab=suspicious-profiles` | Accounts flagged for plagiarized repositories, falsified certificates, or abnormal quiz velocity. |
| `all-universities` | `AdminUniversitiesView` | `/?role=admin&tab=all-universities` | Registered higher education institutions directory, accreditation codes, and TPO contacts. |
| `university-approval` | `AdminUniversitiesView` | `/?role=admin&tab=university-approval` | New college onboarding verification and institutional portal access approval. |
| `all-companies` | `AdminCompaniesView` | `/?role=admin&tab=all-companies` | Verified employer directory, corporate domain validation, and active recruitment drives. |
| `internships-jobs` | `AdminCompaniesView` | `/?role=admin&tab=internships-jobs` | Global job listing moderation (combating fake jobs, fraudulent stipends, or predatory contracts). |
| `session-tracker` | `AdminLoginTrackingView` | `/?role=admin&tab=session-tracker` | Real-time session telemetry: IP tracking, device fingerprinting, concurrent login anomaly detection. |
| `risk-alerts` | `AdminFraudRiskView` | `/?role=admin&tab=risk-alerts` | Centralized fraud alerts feed across students, colleges, and employers. |

---

## 3. REST API Endpoints Specification

Below is the complete REST API contract used by frontend stores and backend endpoints.

### 3.1 Authentication & Session Management

#### `POST /api/auth/login`
- **Description**: Authenticates a user and establishes a signed session.
- **Request Body**:
  ```json
  {
    "email": "harshit@college.edu",
    "password": "SecurePassword123!",
    "role": "student"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "token": "jwt_token_here",
    "user": {
      "id": "usr-92831",
      "name": "Harshit Seth",
      "email": "harshit@college.edu",
      "role": "student",
      "collegeId": "univ-01",
      "branch": "Computer Science & Engineering"
    }
  }
  ```

#### `GET /api/auth/session`
- **Description**: Validates active session and records telemetry metadata.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "session": {
      "id": "sess-8392",
      "userId": "usr-92831",
      "role": "student",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0 ...",
      "lastActive": "2026-09-07T16:40:00Z"
    }
  }
  ```

---

### 3.2 Student & Skill Management APIs

#### `GET /api/students/:id/skills`
- **Description**: Retrieves all verified, self-claimed, and in-progress skills for a student.
- **Response (200 OK)**:
  ```json
  {
    "skills": [
      {
        "id": "sk-01",
        "name": "React.js",
        "category": "Frontend",
        "proficiency": 85,
        "level": "Advanced",
        "status": "verified",
        "verifiedDate": "2026-08-15",
        "assessmentScore": 92
      }
    ]
  }
  ```

#### `POST /api/students/:id/skills/request`
- **Description**: Submits a request to the college TPO for adding or endorsing a new skill.
- **Request Body**:
  ```json
  {
    "skillName": "Rust Systems Programming",
    "category": "Core CS",
    "reason": "Required for upcoming systems internship drive"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "requestId": "req-94812",
    "status": "pending",
    "message": "Skill request transmitted to Department TPO Coordinator"
  }
  ```

---

### 3.3 Proof-of-Work & Project AI Verification APIs

#### `POST /api/projects/analyze-code`
- **Description**: Submits a GitHub repository or source archive for AST code structure analysis and plagiarism auditing using Google Gemini.
- **Request Body**:
  ```json
  {
    "projectId": "proj-101",
    "repoUrl": "https://github.com/student/distributed-cache",
    "techStack": ["TypeScript", "Redis", "Docker"]
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "originalityScore": 94,
    "status": "passed",
    "flagReason": null,
    "methodsAnalyzed": ["LRU Eviction Engine", "Ring Hash Ring Topology", "Concurrent Lock Allocator"],
    "architectureSummary": "Clean modular implementation with genuine algorithmic nuances and custom cache eviction logic.",
    "aiDefenseQuestions": [
      {
        "id": "q1",
        "question": "Why did you select a Doubly Linked List alongside the Hash Map in your LRU eviction mechanism?",
        "expectedConcept": "O(1) node deletion and head splicing"
      }
    ]
  }
  ```

#### `POST /api/projects/:id/submit-defense`
- **Description**: Submits the student's live audio/text answers to the generated logic defense questions.
- **Request Body**:
  ```json
  {
    "answers": [
      { "questionId": "q1", "answer": "The doubly linked list allows O(1) removal of the least recently used node from the tail..." }
    ]
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "passed": true,
    "logicScore": 95,
    "status": "passed",
    "verifiedDate": "2026-09-07"
  }
  ```

---

### 3.4 Jobs & Applications APIs

#### `GET /api/jobs`
- **Description**: Returns all on-campus and off-campus recruitment drives. Supports filtering by college, eligibility, and branch.
- **Query Parameters**: `?campusType=on_campus&targetUniversity=Apex+Institute`
- **Response (200 OK)**:
  ```json
  {
    "jobs": [
      {
        "id": "job-google-sde",
        "title": "Software Engineer Intern",
        "company": "Google",
        "location": "Bengaluru (Hybrid)",
        "type": "Internship",
        "stipend": "₹1,25,000 / month",
        "matchScore": 88,
        "requiredSkills": ["Data Structures", "Go", "Distributed Systems"],
        "preferredSkills": ["Docker", "Kubernetes", "gRPC"],
        "deadline": "2026-09-25",
        "campusType": "on_campus"
      }
    ]
  }
  ```

#### `POST /api/applications/apply`
- **Description**: Submits an evidence-backed application linking verified skills, AST project score, and parsed resume.
- **Request Body**:
  ```json
  {
    "jobId": "job-google-sde",
    "studentId": "std-01",
    "resumeUrl": "https://cdn.talentbridge.io/resumes/std-01.pdf"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "applicationId": "app-84920",
    "status": "applied",
    "matchScore": 88,
    "transmittedToTpo": true,
    "transmittedToCompany": true
  }
  ```

#### `PATCH /api/applications/:id/status`
- **Description**: Company updates the candidate application pipeline status.
- **Request Body**:
  ```json
  {
    "status": "selected",
    "packageOffered": "₹28.5 LPA",
    "offeredRole": "Software Engineer (Backend)",
    "postingLocation": "Hyderabad, Telangana",
    "joiningDate": "2027-01-10"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "applicationId": "app-84920",
    "currentStatus": "selected",
    "tpoNotified": true,
    "studentNotified": true
  }
  ```

---

### 3.5 TPO & Corporate Engagement APIs

#### `POST /api/tpo/drive-requests/invite`
- **Description**: TPO sends a formal invitation to a corporate partner for an on-campus placement drive.
- **Request Body**:
  ```json
  {
    "companyName": "Microsoft",
    "targetRoles": ["Software Engineer", "Cloud Solutions Architect"],
    "proposedDates": ["2026-10-15", "2026-10-16"],
    "expectedBatchSize": 240,
    "tpoCoordinator": "Dr. S. Sharma"
  }
  ```

#### `POST /api/company/feedback`
- **Description**: Recruiter submits batch performance ratings and curriculum feedback to the college.
- **Request Body**:
  ```json
  {
    "companyName": "Atlassian",
    "collegeName": "Apex Institute of Technology",
    "batchYear": "2026",
    "overallRating": 4.5,
    "feedbackText": "Candidates demonstrated strong DSA fundamentals; recommended deeper practical exposure to Kubernetes & gRPC.",
    "skillRatings": [
      { "skill": "Kubernetes", "status": "Needs Improvement", "averageScore": 48 },
      { "skill": "Data Structures", "status": "Strong", "averageScore": 88 }
    ]
  }
  ```

---

## 4. Real-Time Reactive Event Bus (`window.dispatchEvent`)

To achieve instant UI responsiveness across decoupled components without unnecessary prop drilling or network polling, SkillBridge utilizes a standard browser CustomEvent reactive bus:

| Event Name | Dispatch Source | Listeners / Subscribed Views | Trigger Condition |
| :--- | :--- | :--- | :--- |
| `JOBS_UPDATED` | `jobsStore.ts` | `InternshipsView`, `SkillGapView`, `CompanyAppliedView` | Job posted, deadline changed, or new internship imported. |
| `SKILLS_UPDATED` | `skillsStore.ts` | `MySkillsView`, `DailyQuestionsView`, `SkillGapView` | Skill checkpoints checked, quiz passed, or new skill added. |
| `PROJECTS_UPDATED` | `projectsStore.ts`| `ProjectsView`, `ProjectIntegrityView`, `SkillGapView` | Project uploaded, AST code audited, or defense cleared. |
| `APPLICATIONS_UPDATED` | `studentApplicationsStore.ts` | `CompanyAppliedView`, `AppliedSelectedView`, `Dashboard` | Candidate applied, status moved to interview or selected. |
| `IMPROVEMENT_PATHS_UPDATED` | `improvementPathStore.ts` | `ImprovementPathView`, `SkillGapView` | Differentiator skill added, roadmap checkpoint completed, or path deleted. |
| `NOTIFICATIONS_UPDATED` | `notificationStore.ts` | `TopRoleBar`, `StudentDashboard`, `CompanyDashboard` | New offer letter, drive invite received, or fraud alert triggered. |
| `FEEDBACK_SKILLS_UPDATED` | `feedbackSkillsStore.ts` | `CompanyFeedbackView`, `CollegeFeedbackView` | Recruiter submits technical ratings on batch competencies. |
| `APPROACH_UPDATED` | `collegeApproachStore.ts` | `CompanyEngagementView`, `CompanyRequestsView` | College sends campus visit proposal to company. |
| `APPROVALS_UPDATED` | `approvalStore.ts` | `AdminUniversitiesView`, `AdminCompaniesView` | Admin approves college accreditation or verifies company. |
| `SESSION_TRACKING_UPDATED` | `sessionTrackingStore.ts` | `AdminLoginTrackingView` | Real-time user login or logout recorded. |

---

## 5. Security, Headers & Validation Rules

1. **Authorization**: `Authorization: Bearer <jwt_token>` required on all protected endpoints.
2. **CORS & Reverse Proxy**: All external traffic routes through Port `3000`.
3. **Role Guards**:
   - `student`: Can only read/update their own profile, submissions, and view public/college-mapped jobs.
   - `company`: Can only update their own job postings, candidate evaluations, and college drive requests.
   - `institution`: Can access academic data and project integrity reports for their affiliated students only.
   - `admin`: Full oversight, access to audit telemetry, fraud alerts, and approval queues.
