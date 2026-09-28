# SkillBridge - Cross-Entity Connectivity & Data Flow Architecture (कनेक्शन एवं डेटा प्रवाह)

इस दस्तावेज़ में **Student (छात्र)**, **TPO / Institution (कॉलेज/विश्वविद्यालय)**, **Company / Recruiter (कंपनी)** और **Platform Admin (प्रशासक)** के बीच संपूर्ण कनेक्टिविटी, डेटा शेयरिंग, कौन सा डेटा किस स्क्रीन/ऑप्शन से कहाँ ट्रांसफर होता है, और एडमिन इन तीनों से कैसे डेटा लेता है, इसका संपूर्ण तकनीकी एवं व्यावहारिक विवरण दिया गया है।

---

## 1. महा-वास्तुकला एवं कनेक्टिविटी मानचित्र (System Master Architecture)

```
                       ┌──────────────────────────────────────┐
                       │         PLATFORM ADMIN              │
                       │   (Governance, Audits, Fraud Risk)   │
                       └──────────────────┬───────────────────┘
                                          │
                  ┌───────────────────────┼───────────────────────┐
                  │ Harvests Telemetry &  │ Approves Accreditation│ Moderates Postings &
                  │ Integrity Audits      │ & Curriculum Health   │ Verifies Corporate ID
                  ▼                       ▼                       ▼
      ┌───────────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐
      │        STUDENT        │◄─────>│    INSTITUTION / TPO  │◄─────>│        COMPANY        │
      │   (Evidence Portfolio)│       │  (Placement & Health) │       │   (Recruiting Engine) │
      └───────────┬───────────┘       └───────────────────────┘       └───────────┬───────────┘
                  │                                                               │
                  └──────────────────────── Applications & Dossiers ──────────────┘
                                            Offers & Custom Roadmaps
```

---

## 2. STUDENT (छात्र) की कनेक्टिविटी एवं डेटा प्रवाह

### 2.1 Student ───► TPO / Institution (कॉलेज)

छात्र से कॉलेज TPO की तरफ निम्नलिखित डेटा रियल-टाइम में स्थानांतरित होता है:

| क्या डेटा ट्रांसफर होता है? (Data Transferred) | छात्र के किस ऑप्शन/स्क्रीन से जाता है? | कॉलेज TPO के किस ऑप्शन/स्क्रीन में दिखता है? | डेटा की मात्रा व प्रारूप (Payload & Format) |
| :--- | :--- | :--- | :--- |
| **अकादमिक प्रोफाइल एवं CGPA** | `StudentProfileSettings` (`profile-settings`) | `StudentReadinessView` (`students`) | JSON Object: Roll No, Branch, CGPA, Current Year, Contact, Completeness %. |
| **सत्यापित स्किल्स (Verified Skills & Scores)** | `MySkillsView` (`skills`) | `CollegeSkillsManagementView` (`skills`) एवं `StudentReadinessView` | Array of Skills: Skill name, category, proficiency (0-100), verified status, verification method (Quiz/AST). |
| **प्रोजेक्ट कोड ओरिजिनैलिटी व AI डिफेंस स्कोर** | `ProjectsView` (`projects`) | `ProjectIntegrityView` (`project-integrity`) | AST Code Analysis: Originality Score (0-100), AI Logic Q&A Defense score, repo URL, flagged status (`passed`/`flagged`). |
| **डेली क्विज स्ट्रीक व कंसिस्टेंसी डेटा** | `DailyQuestionsView` (`daily-questions`) | `InstitutionOverview` (`overview`) में Batch Readiness Score | Streak Count, today's score, pass/fail status, monthly consistency rating. |
| **स्किल गैप रिक्वेस्ट (पाठ्यक्रम में नया विषय जोड़ने की मांग)** | `MySkillsView` (`skills`) -> Request Skill | `CollegeRequestsView` (`requests`) | Request Object: Skill Name, Category, Student Reason, Timestamp, Status (`pending`). |
| **ऑन-कैंपस जॉब एप्लीकेशन सबमिशन** | `InternshipsView` (`internships`) -> Apply | `AppliedSelectedView` (`applied-selected`) | Application Object: Student ID, Job ID, Company Name, Applied Date, Match Score. |

---

### 2.2 TPO / Institution ───► Student (छात्र)

कॉलेज TPO से छात्र की तरफ निम्नलिखित डेटा स्थानांतरित होता है:

| क्या डेटा ट्रांसफर होता है? (Data Transferred) | कॉलेज के किस ऑप्शन से जनरेट होता है? | छात्र के किस ऑप्शन/स्क्रीन में प्राप्त होता है? | डेटा की मात्रा व प्रारूप (Payload & Format) |
| :--- | :--- | :--- | :--- |
| **करिकुलम गैप एवं इंडस्ट्री रिकमेंडेशन्स** | `CurriculumGapsView` (`curriculum-gaps`) | `SkillGapView` (`skill-gap`) | Gap Notice: Market required skills not currently taught in department, recommended electives. |
| **कॉलेज द्वारा सुझाई गई "Close the Gap" लर्निंग** | `CollegeSkillsManagementView` (`skills`) | `ImprovementPathView` (`improvement-path`) | Course Recommendations: Module name, syllabus checkpoints, mentor contacts, recommended resources. |
| **ऑन-कैंपस ड्राइव शेड्यूलिंग एवं अनुमतियाँ** | `CompanyEngagementView` (`companies`) | `InternshipsView` (`internships`) | Drive Notice: Visiting company, drive dates, minimum CGPA cutoff, eligible branches. |
| **स्किल रिक्वेस्ट पर TPO का निर्णय** | `CollegeRequestsView` (`requests`) -> Approve/Reject | `MySkillsView` एवं `TopRoleBar` Notifications | Status Update: `approved` / `rejected` along with TPO Coordinator remarks. |
| **प्रोजेक्ट फ्लैग नोटिस व चेतावनी** | `ProjectIntegrityView` (`project-integrity`) | `ProjectsView` (`projects`) | Alert Object: Originality warning, plagiarism flag reason, re-submission requirement. |

---

### 2.3 Student ───► Company (कंपनी / रिक्रूटर)

छात्र से कंपनी की तरफ नौकरी/इंटर्नशिप के दौरान निम्नलिखित डेटा स्थानांतरित होता है:

| क्या डेटा ट्रांसफर होता है? (Data Transferred) | छात्र के किस ऑप्शन से जाता है? | कंपनी के किस ऑप्शन/स्क्रीन में दिखता है? | डेटा की मात्रा व प्रारूप (Payload & Format) |
| :--- | :--- | :--- | :--- |
| **एविडेंस-बेस्ड कैंडिडेट डॉसियर (Candidate Dossier)** | `InternshipsView` (`internships`) -> Click "Apply Now" | `CompanyAppliedView` (`applied`) -> `CandidateDetailModal` | Full Portfolio: Resume PDF, verified skill list with badges, GitHub repo, live deployment link, CGPA. |
| **AST कोड ओरिजिनैलिटी व लॉजिक डिफेंस स्कोर** | `ProjectsView` (`projects`) | `CompanyAppliedView` (Candidate Card Badges) | Audit Metrics: Code originality % (plagiarism check), AI logic Q&A defense score, verified timestamp. |
| **टारगेटेड डिफरेंशिएटर स्किल्स (Preferred Skills)** | `SkillGapView` (`skill-gap`) -> Click to Add to Path | `CompanyAppliedView` (Match Score Calculation) | Bonus Skill Match: Highlights candidate's extra differentiators matching company's bonus criteria. |

---

### 2.4 Company (कंपनी) ───► Student (छात्र)

कंपनी से छात्र की तरफ निम्नलिखित डेटा आता है:

| क्या डेटा ट्रांसफर होता है? (Data Transferred) | कंपनी के किस ऑप्शन से जनरेट होता है? | छात्र के किस ऑप्शन/स्क्रीन में प्राप्त होता है? | डेटा की मात्रा व प्रारूप (Payload & Format) |
| :--- | :--- | :--- | :--- |
| **जॉब व इंटर्नशिप पोस्टिंग्स (Role Criteria)** | `PostJobView` (`post-job`) | `InternshipsView` (`internships`) | Job Posting: Role title, stipend/package, required skills, bonus skills, deadline, eligibility rules. |
| **एप्लीकेशन स्टेटस का रियल-टाइम प्रोग्रेशन** | `CompanyAppliedView` -> Change Status | `InternshipsView` (Applied Tab) एवं Notifications | Status Transition: `Applied` -> `Under Evaluation` -> `Shortlisted` -> `Interview Scheduled` -> `Selected` / `Rejected`. |
| **फाइनल ऑफर डिटेल्स (Offer Letter)** | `CompanyAppliedView` -> Select Candidate | `StudentDashboard` एवं `InternshipsView` | Offer Payload: CTC / Offered Package (e.g. `₹28.5 LPA`), Offered Role, Work Location, Joining Date. |
| **कंपनी-स्पेसिफिक इम्प्रूवमेंट पाथवे** | `jobsStore.ts` & `improvementPathStore.ts` | `ImprovementPathView` (`improvement-path`) | Targeted Roadmap: When a candidate has gaps for a job, generates exact learning modules and project proofs. |

---

## 3. TPO / INSTITUTION (कॉलेज) की कनेक्टिविटी एवं डेटा प्रवाह

### 3.1 TPO / Institution ───► Company (कंपनी)

कॉलेज TPO से रिक्रूटर/कंपनी की तरफ निम्नलिखित डेटा जाता है:

| क्या डेटा ट्रांसफर होता है? (Data Transferred) | कॉलेज के किस ऑप्शन से जाता है? | कंपनी के किस ऑप्शन/स्क्रीन में दिखता है? | डेटा की मात्रा व प्रारूप (Payload & Format) |
| :--- | :--- | :--- | :--- |
| **कैंपस प्लेसमेंट ड्राइव आमंत्रण (Drive Invitation)** | `CompanyEngagementView` (`companies`) -> Invite | `CompanyRequestsView` (`requests`) | Drive Request: Proposed drive dates, expected eligible student batch size, branch distributions, TPO contact. |
| **सत्यापित कैंडिडेट बैच सूची (Pre-screened Batch)** | `StudentReadinessView` (`students`) -> Export / Share | `CompanyAppliedView` (`applied`) | Candidate Roster: Filtered list of students who passed AST project defense and meet minimum CGPA cutoff. |
| **कॉलेज अप्रोच प्रपोजल (College Approach Request)** | `CompanyEngagementView` -> Approach Company | `CompanyRequestsView` (`requests`) | Partnership Proposal: Accreditation score, placement history, infrastructure details for on-campus drives. |

---

### 3.2 Company ───► TPO / Institution (कॉलेज)

कंपनी से कॉलेज TPO की तरफ निम्नलिखित डेटा प्राप्त होता है:

| क्या डेटा ट्रांसफर होता है? (Data Transferred) | कंपनी के किस ऑप्शन से भेजा जाता है? | कॉलेज TPO के किस ऑप्शन/स्क्रीन में दिखता है? | डेटा की मात्रा व प्रारूप (Payload & Format) |
| :--- | :--- | :--- | :--- |
| **ड्राइव स्लॉट स्वीकृति व शेड्यूलिंग (Drive Confirmation)** | `CompanyRequestsView` (`requests`) -> Accept | `CompanyEngagementView` (`companies`) & Dashboard | Confirmation: Approved campus visit dates, recruitment stages (OA, Technical, HR), venue requirements. |
| **रिक्रूटर फीडबैक एवं स्किल रेटिंग्स (Batch Skill Ratings)**| `CompanyFeedbackView` (`feedback`) | `CollegeFeedbackView` (`feedback`) | Feedback Object: Ratings on core skills (e.g., Docker: 48%, DSA: 88%), identified student weaknesses, curriculum advice. |
| **सिलेक्टेड छात्रों की सूची एवं पैकेज (Final Selections)** | `CompanyAppliedView` (`applied`) -> Select | `AppliedSelectedView` (`applied-selected`) | Placement Record: Student name, roll number, package offered (LPA), offered designation, joining date. |

---

## 4. COMPANY (कंपनी / रिक्रूटर) की कनेक्टिविटी एवं डेटा प्रवाह

### 4.1 Company ───► Student & TPO (एक साथ शेयर होने वाला डेटा)

जब कंपनी `CompanyAppliedView` में किसी छात्र को **Shortlist** या **Select (Offer)** करती है:
1. **छात्र को जाता है**: छात्र के डैशबोर्ड और नोटिफिकेशन बार में लाइव बधाई अलर्ट आता है, तथा ऑफर पैकेज व जॉइनिंग डेट दिखती है।
2. **कॉलेज TPO को जाता है**: कॉलेज के `AppliedSelectedView` में वह छात्र तुरंत "Selected" श्रेणी में शिफ्ट हो जाता है, कॉलेज का कुल प्लेसमेंट % बढ़ जाता है और एवरेज पैकेज अपडेट हो जाता है।
3. **डेटा कंसिस्टेंसी**: `studentApplicationsStore.ts` के माध्यम से सिंगल सोर्स ऑफ ट्रुथ रहता है।

---

## 5. PLATFORM ADMIN (प्रशासक) तीनों से डेटा कैसे लेता है?

Platform Admin के पास सर्वोच्च निगरानी (Omniscient Governance & Auditing) अधिकार होते हैं। एडमिन तीनों पक्षों (छात्र, कॉलेज, कंपनी) से रियल-टाइम टेलीमेट्री और ऑडिट डेटा ग्रहण करता है:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ADMIN CENTRAL COMMAND CENTER                       │
│                                                                             │
│   ┌────────────────────────┐  ┌──────────────────────┐  ┌────────────────┐  │
│   │  FROM STUDENTS         │  │  FROM COLLEGES (TPO) │  │  FROM COMPANIES│  │
│   │  - Fraud Plagiarism AST│  │  - Accreditation     │  │  - Job Verific.│  │
│   │  - Fake Certificates   │  │  - Placement Truth   │  │  - Ghost Postings││
│   │  - Rapid Quiz Farming  │  │  - Curriculum Gaps   │  │  - Offer Legit.│  │
│   └───────────┬────────────┘  └──────────┬───────────┘  └────────┬───────┘  │
│               │                          │                       │          │
│               └──────────────────────────┼───────────────────────┘          │
│                                          ▼                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   Admin Views:                                                      │   │
│   │   • AdminDashboard         • AdminFraudRiskView  • AdminStudents    │   │
│   │   • AdminUniversitiesView  • AdminCompaniesView  • AdminLoginTrack  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.1 Admin ◄─── Student डेटा अधिग्रहण

| क्या डेटा लेता है? (Data Harvested) | छात्र से कहाँ से उठता है? | एडमिन के किस ऑप्शन में दिखता है? | एडमिन का एक्शन / नियंत्रण (Admin Action) |
| :--- | :--- | :--- | :--- |
| **संदिग्ध कोड व साहित्यिक चोरी (Plagiarized AST Code)** | `projectsStore.ts` (AST score < 50%) | `AdminFraudRiskView` (`risk-alerts`) एवं `AdminStudentsView` (`suspicious-profiles`) | एडमिन प्रोजेक्ट को "Flagged" कर सकता है और छात्र का प्रोफाइल ब्लॉक कर सकता है। |
| **जाली प्रमाण पत्र (Fake/Unverified Certificates)** | `certificateStore.ts` | `AdminStudentsView` (`resume-issues`) | AI वेरिफिकेशन फेल होने पर एडमिन सर्टिफिकेट रिवोक कर सकता है। |
| **असामान्य क्विज वेग (Speed Farming Anomaly)** | `dailyQuizStore.ts` (3 सवाल < 4 सेकंड) | `AdminStudentsView` (`skill-verification`) | क्विज फार्मिंग करने वाले छात्रों का स्ट्रीक रीसेट कर सकता है। |
| **ग्लोबल स्टूडेंट डायरेक्टरी** | सभी छात्र डेटाबेस से | `AdminStudentsView` (`all-students`) | कॉलेज-वाइज, ब्रांच-वाइज छात्रों का समग्र डेटा विश्लेषण व सर्च। |

---

### 5.2 Admin ◄─── Institution / TPO डेटा अधिग्रहण

| क्या डेटा लेता है? (Data Harvested) | कॉलेज TPO से कहाँ से उठता है? | एडमिन के किस ऑप्शन में दिखता है? | एडमिन का एक्शन / नियंत्रण (Admin Action) |
| :--- | :--- | :--- | :--- |
| **कॉलेज मान्यता एवं पंजीकरण आवेदन** | `institutions` DB & `approvalStore.ts` | `AdminUniversitiesView` (`university-approval`) | कॉलेज के AISHE कोड व TPO क्रेडेंशियल की जाँच कर कॉलेज को अधिकृत (Approve) करता है। |
| **वास्तविक प्लेसमेंट सत्यता (Placement Authenticity)**| `AppliedSelectedView` records | `AdminUniversitiesView` (`all-universities`) | कॉलेज द्वारा क्लेम किए गए प्लेसमेंट दावों का छात्रों के असली ऑफर लेटर से मिलान। |
| **ब्रांच-वाइज स्किल गैप स्वास्थ्य** | `curriculum_gaps` डेटा | `AdminUniversitiesView` (`skill-gap-overview`) | कौन सा विश्वविद्यालय सिलेबस को इंडस्ट्री के अनुकूल अपडेट नहीं कर रहा, उसकी रिपोर्टिंग। |

---

### 5.3 Admin ◄─── Company डेटा अधिग्रहण

| क्या डेटा लेता है? (Data Harvested) | कंपनी से कहाँ से उठता है? | एडमिन के किस ऑप्शन में दिखता है? | एडमिन का एक्शन / नियंत्रण (Admin Action) |
| :--- | :--- | :--- | :--- |
| **कंपनी सत्यापन एवं कॉर्पोरेट वैधता** | `companies` DB & `approvalStore.ts` | `AdminCompaniesView` (`all-companies`) | कंपनी के डोमेन और GSTIN/CIN की जाँच कर 'Verified' मुहर लगाता है। |
| **फर्जी / घोस्ट जॉब पोस्टिंग मॉडरेशन** | `jobsStore.ts` | `AdminCompaniesView` (`internships-jobs`) | बिना वास्तविक भर्ती के डेटा कलेक्ट करने वाली फर्जी पोस्टिंग्स को डिलीट करना। |
| **हायरिंग रेट व ऑफर कंप्लायंस** | `studentApplicationsStore.ts` | `AdminCompaniesView` (`applications-overview`) | कंपनी द्वारा दिए गए ऑफर्स और छात्रों की वास्तविक जॉइनिंग का अनुपात जाँचना। |

---

### 5.4 Admin Central Telemetry: रियल-टाइम लॉगिन व सत्र ट्रैकिंग (`AdminLoginTrackingView`)

`sessionTrackingStore.ts` के माध्यम से एडमिन के पास तीनों भूमिकाओं (Student, TPO, Company) का लाइव नेटवर्क डेटा आता है:
1. **IP Address & Geo-Location**: किस शहर या नेटवर्क से लॉगिन किया जा रहा है।
2. **Device & Browser Fingerprint**: ऑपरेटिंग सिस्टम और ब्राउज़र की प्रामाणिकता।
3. **Concurrent Anomaly Detection**: यदि एक ही छात्र या रिक्रूटर दो अलग-अलग शहरों से एक साथ लॉगिन करता है, तो एडमिन स्क्रीन पर `Suspicious Proxy / Multiple Sessions Detected` का लाल अलर्ट आ जाता है।

---

## 6. सारांश तालिका (Summary Matrix)

| घटक | Student से क्या लेता है? | TPO से क्या लेता है? | Company से क्या लेता है? | Admin से क्या लेता है? |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | N/A (Self Data) | करिकुलम गैप, क्लोज-द-गैप गाइडेंस, ड्राइव नोटिस | जॉब्स, इंटरव्यू अपडेट्स, ऑफर लेटर्स, रोडमैप्स | प्लेटफॉर्म गाइडलाइंस व वेरिफिकेशन बैज |
| **TPO** | प्रोफाइल्स, सत्यापित स्किल्स, प्रोजेक्ट ऑडिट्स, ड्राइव एप्लीकेशन्स | N/A (Self Data) | कैंपस ड्राइव रिक्वेस्ट, स्लॉट बुकिंग, बैच फीडबैक, सिलेक्शन्स | यूनिवर्सिटी अप्रूवल व एक्रेडिटेशन ऑथराइजेशन |
| **Company** | वेरिफाइड कैंडिडेट डॉसियर, AST कोड स्कोर्स, एप्लीकेशन्स | ड्राइव इनविटेशन्स, प्री-वेरिफाइड बैचेस, इंफ्रा स्लॉट्स | N/A (Self Data) | कंपनी वेरिफिकेशन व पोस्टिंग अप्रूवल |
| **Admin** | फ्रॉड रिस्क, प्लेगिएरिज्म अलर्ट्स, सेशन लॉग्स | प्लेसमेंट ऑडिट्स, एक्रेडिटेशन डेटा, स्किल गैप्स | जॉब पोस्टिंग मॉडरेशन, ऑफर रिपोर्ट, कंपनी क्रेडेंशियल्स | N/A (Ultimate Authority) |
