# SkillBridge - Database Schema Specification

This document details the complete database schema for the SkillBridge platform. It covers relational definitions (PostgreSQL / Cloud SQL) and NoSQL document representations (Firebase Firestore), including primary keys, foreign key constraints, indexes, check validations, and data lifecycle policies.

---

## 1. Entity-Relationship Overview (ERD)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 CORE ENTITY RELATIONSHIPS                              │
└────────────────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐         1:N         ┌───────────────────┐
    │ institutions │────────────────────<│ student_profiles  │
    └──────┬───────┘                     └─────────┬─────────┘
           │                                       │
           │ 1:N                                   │ 1:N
           ▼                                       ▼
    ┌──────────────────────┐             ┌───────────────────┐
    │  curriculum_gaps     │             │  student_skills   │>──┐
    └──────────────────────┘             └─────────┬─────────┘   │ N:1
           │                                       │             ▼
           │ M:N                                   │ 1:N  ┌─────────────────┐
           ▼                                       ▼      │  skills_master  │
    ┌──────────────────────┐             ┌───────────────┐└─────────────────┘
    │  drive_requests      │             │daily_questions│
    └──────┬───────────────┘             └───────────────┘
           │
           │ N:1                                   │ 1:N
           ▼                                       ▼
    ┌──────────────┐         1:N         ┌───────────────────┐
    │  companies   │────────────────────<│ student_projects  │
    └──────┬───────┘                     └─────────┬─────────┘
           │                                       │ 1:1
           │ 1:N                                   ▼
           ▼                             ┌───────────────────┐
    ┌──────────────┐                     │   ast_audits      │
    │  jobs_drives │                     └───────────────────┘
    └──────┬───────┘                               │
           │                                       │
           │ 1:N                                   │ 1:N
           ▼                                       ▼
    ┌────────────────────────────────────────────────────────┐
    │                  student_applications                  │
    └──────────────────────────┬─────────────────────────────┘
                               │
                               │ 1:N
                               ▼
    ┌────────────────────────────────────────────────────────┐
    │               company_improvement_paths                │
    └────────────────────────────────────────────────────────┘
```

---

## 2. Table & Collection Definitions

### 2.1 Users & Authentication (`users`)
Stores core credentials, role designations, and account status for all four roles.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique user identifier (e.g. `usr_01`). |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | Registered institutional or corporate email address. |
| `password_hash`| `VARCHAR(255)` | `NOT NULL` | Argon2id or bcrypt password hash. |
| `role` | `VARCHAR(20)` | `NOT NULL` | Role: `'student'`, `'company'`, `'institution'`, `'admin'`. |
| `full_name` | `VARCHAR(128)` | `NOT NULL` | Display name of the user. |
| `avatar_url` | `TEXT` | `NULLABLE` | Profile picture or corporate logo CDN link. |
| `is_verified` | `BOOLEAN` | `DEFAULT FALSE` | Email & identity verification status. |
| `status` | `VARCHAR(20)` | `DEFAULT 'active'` | Account state: `'active'`, `'suspended'`, `'pending_approval'`. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Record creation timestamp. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Last update timestamp. |

- **Indexes**:
  - `idx_users_email` ON (`email`)
  - `idx_users_role` ON (`role`)

---

### 2.2 Institutions / Universities (`institutions`)
Maintains higher-education institution accreditation, TPO coordinators, and department affiliations.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique college ID (e.g. `univ-01`). |
| `name` | `VARCHAR(255)` | `NOT NULL` | Official college name (e.g. `Apex Institute of Technology`). |
| `code` | `VARCHAR(32)` | `UNIQUE, NOT NULL` | University code / AISHE accreditation identifier. |
| `location` | `VARCHAR(128)` | `NOT NULL` | Campus city & state. |
| `tpo_name` | `VARCHAR(128)` | `NOT NULL` | Head Training & Placement Officer name. |
| `tpo_email` | `VARCHAR(255)` | `NOT NULL` | Official TPO email address. |
| `tpo_phone` | `VARCHAR(32)` | `NULLABLE` | Placement cell direct contact number. |
| `is_approved` | `BOOLEAN` | `DEFAULT FALSE` | Platform Admin verification approval flag. |
| `placement_rate`| `NUMERIC(5,2)` | `DEFAULT 0.00` | Current placement completion percentage (0.00 - 100.00). |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Registration timestamp. |

- **Indexes**:
  - `idx_institutions_code` ON (`code`)
  - `idx_institutions_approved` ON (`is_approved`)

---

### 2.3 Student Profiles (`student_profiles`)
Contains academic information, GPA, branch, portfolio links, and holistic readiness ratings.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | References `users(id)` ON DELETE CASCADE. |
| `institution_id`| `VARCHAR(64)` | `REFERENCES institutions(id)` | Affiliated college. |
| `roll_number` | `VARCHAR(64)` | `NOT NULL` | College roll / enrollment number. |
| `branch` | `VARCHAR(64)` | `NOT NULL` | Academic branch (e.g. `Computer Science & Engineering`). |
| `year` | `VARCHAR(16)` | `NOT NULL` | Academic year: `'1st Year'`, `'2nd Year'`, `'3rd Year'`, `'Final Year'`. |
| `cgpa` | `NUMERIC(4,2)` | `CHECK (cgpa >= 0 AND cgpa <= 10.0)` | Current cumulative grade point average. |
| `readiness_score`| `INTEGER` | `DEFAULT 0` | Calculated placement readiness percentage (0 - 100). |
| `github_url` | `TEXT` | `NULLABLE` | Verified GitHub developer profile link. |
| `linkedin_url`| `TEXT` | `NULLABLE` | LinkedIn professional profile link. |
| `resume_url` | `TEXT` | `NULLABLE` | Uploaded ATS-analyzed resume file link. |
| `integrity_status`| `VARCHAR(20)` | `DEFAULT 'Verified'` | State: `'Verified'`, `'Under Review'`, `'Flagged'`. |

- **Indexes**:
  - `idx_students_institution` ON (`institution_id`)
  - `idx_students_branch_cgpa` ON (`branch`, `cgpa`)
  - `idx_students_integrity` ON (`integrity_status`)

---

### 2.4 Skills Master Catalog (`skills_master`)
Standardized industry taxonomy of competencies, checkpoint modules, and benchmark criteria.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Standard skill key (e.g. `sk_react`, `sk_docker`). |
| `name` | `VARCHAR(128)` | `UNIQUE, NOT NULL` | Canonical name (e.g. `Docker`, `React.js`). |
| `category` | `VARCHAR(32)` | `NOT NULL` | `'Frontend'`, `'Backend'`, `'Database'`, `'Core CS'`, `'DevOps'`, `'AI / Data'`, `'Soft Skills'`. |
| `description` | `TEXT` | `NULLABLE` | Overview of technical expectations. |
| `industry_demand`| `INTEGER` | `CHECK (demand >= 0 AND demand <= 100)` | Current market recruitment demand index. |

---

### 2.5 Student Skills (`student_skills`)
Tracks individual student proficiencies, proof-of-work status, and verification milestones.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique student skill record ID. |
| `student_id` | `VARCHAR(64)` | `REFERENCES student_profiles(id) CASCADE` | Student reference. |
| `skill_id` | `VARCHAR(64)` | `REFERENCES skills_master(id)` | Canonical skill reference. |
| `proficiency` | `INTEGER` | `CHECK (proficiency >= 0 AND proficiency <= 100)` | Proficiency level score. |
| `level` | `VARCHAR(20)` | `NOT NULL` | `'Beginner'`, `'Intermediate'`, `'Advanced'`, `'Expert'`. |
| `status` | `VARCHAR(20)` | `NOT NULL` | `'verified'`, `'self-claimed'`, `'unverified'`. |
| `verified_method`| `VARCHAR(32)`| `NULLABLE` | `'AI Logic Q&A Defense'`, `'AST Code Audit'`, `'Quiz Assessment'`. |
| `assessment_score`| `INTEGER` | `NULLABLE` | Score achieved in technical evaluation (0 - 100). |
| `verified_date`| `TIMESTAMPTZ` | `NULLABLE` | Timestamp of verification. |

- **Indexes**:
  - `idx_student_skills_lookup` ON (`student_id`, `skill_id`)
  - `idx_student_skills_status` ON (`status`)

---

### 2.6 Daily Quizzes & Streak Engine (`daily_quizzes` & `quiz_attempts`)

#### `daily_quiz_questions`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Question unique ID. |
| `skill_name` | `VARCHAR(64)` | `NOT NULL` | Relevant skill tag. |
| `portion_learned`| `VARCHAR(128)`| `NOT NULL` | Core conceptual portion addressed. |
| `question` | `TEXT` | `NOT NULL` | Technical multiple-choice problem statement. |
| `options` | `JSONB` | `NOT NULL` | Array of 4 answer options: `["A", "B", "C", "D"]`. |
| `correct_index`| `INTEGER` | `CHECK (correct_index BETWEEN 0 AND 3)` | 0-based index of correct option. |
| `explanation` | `TEXT` | `NOT NULL` | Detailed conceptual walkthrough. |
| `difficulty` | `VARCHAR(20)` | `NOT NULL` | `'Beginner'`, `'Intermediate'`, `'Advanced'`. |

#### `student_quiz_attempts`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique attempt ID. |
| `student_id` | `VARCHAR(64)` | `REFERENCES student_profiles(id) CASCADE` | Student reference. |
| `date` | `DATE` | `NOT NULL` | Daily quiz calendar date (YYYY-MM-DD). |
| `score` | `INTEGER` | `CHECK (score BETWEEN 0 AND 100)` | Percentage achieved. |
| `correct_count`| `INTEGER` | `NOT NULL` | Number of correct answers (e.g. 3/3). |
| `total_count` | `INTEGER` | `DEFAULT 3` | Total questions in attempt. |
| `passed` | `BOOLEAN` | `NOT NULL` | True if passed minimum threshold (>= 66%). |
| `is_retest` | `BOOLEAN` | `DEFAULT FALSE` | Flag for same-day retest attempt. |
| `user_answers` | `JSONB` | `NOT NULL` | Array of indices chosen by student. |

---

### 2.7 Proof-of-Work Projects & AST Audits (`student_projects`)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Project identifier. |
| `student_id` | `VARCHAR(64)` | `REFERENCES student_profiles(id) CASCADE` | Owner student reference. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Project name. |
| `description` | `TEXT` | `NOT NULL` | Technical scope & problem statement. |
| `tech_stack` | `TEXT[]` | `NOT NULL` | List of languages and frameworks used. |
| `repo_url` | `TEXT` | `NOT NULL` | Public GitHub / GitLab repository link. |
| `live_url` | `TEXT` | `NULLABLE` | Live demo deployment link. |
| `originality_score`| `INTEGER` | `CHECK (originality_score BETWEEN 0 AND 100)` | AST code plagiarism & originality rating. |
| `logic_defense_score`| `INTEGER`| `CHECK (logic_defense_score BETWEEN 0 AND 100)` | Interactive AI logic Q&A defense score. |
| `status` | `VARCHAR(20)` | `DEFAULT 'pending'` | `'passed'`, `'pending'`, `'flagged'`. |
| `flag_reason` | `TEXT` | `NULLABLE` | Explanatory note if repository flagged. |
| `ast_analysis_summary`| `TEXT` | `NULLABLE` | Gemini AI architectural structural breakdown. |
| `verified_date`| `TIMESTAMPTZ` | `NULLABLE` | Timestamp when defense was verified. |

- **Indexes**:
  - `idx_projects_student` ON (`student_id`)
  - `idx_projects_status` ON (`status`)
  - `idx_projects_originality` ON (`originality_score`)

---

### 2.8 Companies & Corporate Profiles (`companies`)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique company identifier. |
| `name` | `VARCHAR(255)` | `NOT NULL` | Registered enterprise name. |
| `logo_url` | `TEXT` | `NULLABLE` | Corporate emblem CDN link. |
| `industry` | `VARCHAR(128)` | `NOT NULL` | Primary sector (e.g. `Cloud & Enterprise Software`). |
| `website` | `TEXT` | `NULLABLE` | Corporate website URL. |
| `description` | `TEXT` | `NULLABLE` | Enterprise recruitment bio. |
| `headquarters` | `VARCHAR(128)` | `NULLABLE` | City & Country. |
| `is_verified` | `BOOLEAN` | `DEFAULT FALSE` | Admin vetting confirmation. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Registration timestamp. |

---

### 2.9 Jobs & Internships (`internships_jobs`)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique opportunity identifier (e.g. `job-google-sde`). |
| `company_id` | `VARCHAR(64)` | `REFERENCES companies(id) CASCADE` | Offering company. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Job role title (e.g. `Software Engineer Intern`). |
| `type` | `VARCHAR(32)` | `NOT NULL` | `'Full-time'`, `'Internship'`, `'Contract'`. |
| `campus_type` | `VARCHAR(32)` | `DEFAULT 'on_campus'` | `'on_campus'` or `'off_campus'`. |
| `target_institution_id`| `VARCHAR(64)`| `REFERENCES institutions(id) NULLABLE` | Mapped university if dedicated on-campus drive. |
| `location` | `VARCHAR(128)` | `NOT NULL` | Location (e.g. `Bengaluru (Hybrid)`). |
| `stipend_package`| `VARCHAR(64)`| `NOT NULL` | Compensation (e.g. `₹1,25,000 / month` or `₹24.5 LPA`). |
| `description` | `TEXT` | `NOT NULL` | Job description & role responsibilities. |
| `min_cgpa` | `NUMERIC(4,2)` | `DEFAULT 0.00` | Minimum academic CGPA cutoff. |
| `eligible_branches`| `TEXT[]` | `NOT NULL` | Allowed branches (e.g. `["CSE", "IT"]`). |
| `required_skills`| `TEXT[]` | `NOT NULL` | Mandatory core competencies (e.g. `["Go", "DSA"]`). |
| `preferred_skills`| `TEXT[]` | `NOT NULL` | Project-optional differentiator skills (e.g. `["Docker"]`). |
| `deadline` | `DATE` | `NOT NULL` | Application closure date. |
| `tpo_approval_status`| `VARCHAR(20)`| `DEFAULT 'approved'` | `'approved'`, `'pending'`, `'rejected'`. |
| `applicants_count`| `INTEGER` | `DEFAULT 0` | Real-time candidate counter. |

- **Indexes**:
  - `idx_jobs_company` ON (`company_id`)
  - `idx_jobs_target_institution` ON (`target_institution_id`)
  - `idx_jobs_deadline` ON (`deadline`)

---

### 2.10 Student Applications (`student_applications`)
The central transaction pipeline linking student applications to corporate drives.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique application tracking ID. |
| `student_id` | `VARCHAR(64)` | `REFERENCES student_profiles(id) CASCADE` | Applying student. |
| `job_id` | `VARCHAR(64)` | `REFERENCES internships_jobs(id) CASCADE` | Target job posting. |
| `match_score` | `INTEGER` | `CHECK (match_score BETWEEN 0 AND 100)` | Real-time skill & project match rating. |
| `status` | `VARCHAR(32)` | `DEFAULT 'applied'` | Pipeline status: `'applied'`, `'under_evaluation'`, `'shortlisted'`, `'interview_scheduled'`, `'selected'`, `'rejected'`. |
| `package_offered`| `VARCHAR(64)`| `NULLABLE` | Final compensation offered upon selection. |
| `offered_role` | `VARCHAR(128)` | `NULLABLE` | Actual designation offered. |
| `posting_location`| `VARCHAR(128)`| `NULLABLE` | Work city. |
| `joining_date` | `DATE` | `NULLABLE` | Scheduled onboarding date. |
| `is_transmitted_to_tpo`| `BOOLEAN`| `DEFAULT TRUE` | Real-time visibility flag for university placement cell. |
| `applied_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Submission timestamp. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Last status transition timestamp. |

- **Unique Constraint**: `UNIQUE (student_id, job_id)` (A student can only apply once to a given job drive).
- **Indexes**:
  - `idx_applications_student` ON (`student_id`)
  - `idx_applications_job` ON (`job_id`)
  - `idx_applications_status` ON (`status`)

---

### 2.11 Company Improvement Paths (`company_improvement_paths`)
Personalized roadmaps generated when a student targets a specific company and role.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique path ID (e.g. `path-google-sde`). |
| `student_id` | `VARCHAR(64)` | `REFERENCES student_profiles(id) CASCADE` | Student learner. |
| `company_name`| `VARCHAR(128)` | `NOT NULL` | Target enterprise. |
| `target_role` | `VARCHAR(128)` | `NOT NULL` | Specific position (e.g. `Data Engineer`). |
| `status` | `VARCHAR(20)` | `DEFAULT 'active'` | `'active'`, `'completed'`. |
| `diagnosis` | `JSONB` | `NOT NULL` | Problem summary, proof-of-work status, missing skills count. |
| `skills_learned`| `JSONB` | `NOT NULL` | Prerequisites already mastered by student. |
| `skills_missing`| `JSONB` | `NOT NULL` | Mandatory gaps & targeted differentiator skills with hours and resources. |
| `suggested_projects`| `JSONB` | `NOT NULL` | Targeted proof-of-work project suggestions with tech stack and defense topics. |
| `action_checklist`| `JSONB` | `NOT NULL` | Step-by-step interactive tasks (`Skill`, `Project`, `Defense`, `Apply`). |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Initialization date. |

- **Unique Constraint**: `UNIQUE (student_id, company_name, target_role)` (Allows multiple role roadmaps per company, but exactly 1 per specific role).

---

### 2.12 Campus Drive Requests & College Approach (`drive_requests`)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Drive request ID. |
| `company_id` | `VARCHAR(64)` | `REFERENCES companies(id) CASCADE` | Target or requesting company. |
| `institution_id`| `VARCHAR(64)` | `REFERENCES institutions(id) CASCADE` | College placement cell. |
| `initiated_by`| `VARCHAR(20)` | `NOT NULL` | `'institution'` (invite) or `'company'` (slot request). |
| `target_roles` | `TEXT[]` | `NOT NULL` | Roles proposed for placement. |
| `proposed_dates`| `DATE[]` | `NOT NULL` | Suggested interview calendar dates. |
| `min_cgpa` | `NUMERIC(4,2)` | `DEFAULT 7.0` | Minimum eligibility cutoff. |
| `status` | `VARCHAR(20)` | `DEFAULT 'pending'` | `'pending'`, `'approved'`, `'rejected'`, `'rescheduled'`. |
| `tpo_remarks` | `TEXT` | `NULLABLE` | Coordinator notes. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Record creation timestamp. |

---

### 2.13 Corporate Feedback on Colleges & Skills (`feedback_skills`)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique feedback record ID. |
| `company_id` | `VARCHAR(64)` | `REFERENCES companies(id) CASCADE` | Reviewing corporate partner. |
| `institution_id`| `VARCHAR(64)` | `REFERENCES institutions(id) CASCADE` | Target college. |
| `skill_name` | `VARCHAR(64)` | `NOT NULL` | Assessed technical skill (e.g. `Docker`, `System Design`). |
| `status` | `VARCHAR(32)` | `NOT NULL` | `'Needs Improvement'`, `'Moderate'`, `'Strong'`. |
| `average_score`| `INTEGER` | `CHECK (score BETWEEN 0 AND 100)` | Average score of tested college candidates. |
| `feedback_note`| `TEXT` | `NOT NULL` | Specific feedback notes from senior interviewers. |
| `action_recommended`| `TEXT` | `NULLABLE` | Recommended lab / elective curriculum addition. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Submission timestamp. |

---

### 2.14 Session Telemetry & Integrity Tracking (`session_tracking`)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Session trace identifier. |
| `user_id` | `VARCHAR(64)` | `REFERENCES users(id) CASCADE` | User logged in. |
| `role` | `VARCHAR(20)` | `NOT NULL` | Role active during session. |
| `ip_address` | `INET` | `NOT NULL` | Client IP address. |
| `user_agent` | `TEXT` | `NOT NULL` | Browser fingerprint and operating system. |
| `location` | `VARCHAR(128)` | `NULLABLE` | Geo-located city/country. |
| `login_time` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Login initiation timestamp. |
| `last_active` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Heartbeat timestamp. |
| `is_flagged` | `BOOLEAN` | `DEFAULT FALSE` | Flagged if concurrent login anomaly or proxy detected. |

---

## 3. Data Integrity Constraints & Cascade Policies

1. **Cascade Deletion**: When a user account is purged, all associated records in `student_profiles`, `student_skills`, `student_projects`, and `student_applications` are deleted using `ON DELETE CASCADE`.
2. **Score Range Boundaries**: All competency, originality, match, and quiz scores are bounded by SQL check constraints (`CHECK (score >= 0 AND score <= 100)`).
3. **Application Immutability**: Once an application transitions to `'selected'` or `'rejected'`, its historical evaluation data cannot be overwritten by student profile changes.
4. **Audit Immutability**: `session_tracking` and `ast_audits` records are append-only.
