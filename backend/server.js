const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config();
const db = require("./db");
const auth = require("./auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "skillbridge-secret-key-2026";

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= HEALTH & DB STATUS ================= */
app.get("/api/health", async (req, res) => {
  const dbStatus = await db.checkDatabaseConnection();
  res.json({
    status: "online",
    service: "Ladder AI Backend",
    version: "1.0.0",
    database: {
      ...dbStatus
    }
  });
});

app.get("/api/database/users", async (req, res) => {
  try {
    const pgUsers = await db.query(
      "SELECT id, name, email, role, student_id, mentor_id, company_id, created_at FROM users ORDER BY id ASC"
    );
    return res.json({
      success: true,
      database: "PostgreSQL",
      count: pgUsers.rows.length,
      users: pgUsers.rows
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to read database users", details: err.message });
  }
});

/* =========== AUTHENTICATION ROUTES ========== */
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role = "student", extraInfo } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const cleanEmail = email.toLowerCase().trim();
  const userName = name || cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  try {
    const result = await db.registerUser({ name: userName, email: cleanEmail, password, role, extraInfo });
    return res.status(201).json(result);
  } catch (error) {
    // If user already exists, check if password matches for seamless sign-in
    if (error.message.includes("already exists")) {
      try {
        const loginRes = await db.loginUser({ email: cleanEmail, password });
        return res.json({
          ...loginRes,
          message: "Welcome back! Signed in to your existing account."
        });
      } catch (loginErr) {
        return res.status(400).json({
          error: "An account with this email already exists. Please enter the correct password to sign in.",
          code: "USER_EXISTS"
        });
      }
    }
    return res.status(400).json({ error: error.message, code: "REGISTER_ERROR" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password, autoRegister } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const result = await db.loginUser({ email: cleanEmail, password });
    return res.json(result);
  } catch (error) {
    // If account not found and autoRegister is enabled (or user requested instant access), register them smoothly
    if (error.message.includes("No account found") && autoRegister) {
      try {
        const defaultName = cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        const result = await db.registerUser({
          name: defaultName || "Student Member",
          email: cleanEmail,
          password,
          role: "student"
        });
        return res.status(201).json({
          ...result,
          message: "Account created and logged in successfully."
        });
      } catch (regErr) {
        return res.status(400).json({ error: regErr.message, code: "REGISTER_ERROR" });
      }
    }

    const statusCode = error.message.includes("No account found") || error.message.includes("Invalid email") ? 401 : 400;
    return res.status(statusCode).json({
      error: error.message,
      code: error.message.includes("No account found") ? "USER_NOT_FOUND" : "INVALID_CREDENTIALS"
    });
  }
});

/* ================= OAUTH ROUTES ================= */
app.get("/api/auth/url", auth.handleAuthUrl);
app.get("/api/auth/callback", auth.handleAuthCallback);
app.get("/api/auth/status/:platform", auth.handleAuthStatus);
app.post("/api/auth/disconnect/:platform", auth.handleDisconnect);

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, JWT_SECRET, async (error, decoded) => {
    if (error) {
      return res.status(403).json({ error: "Token invalid or expired" });
    }
    
    try {
      const user = db.getUserById(decoded.userId);
      if (user) {
        return res.json({ user });
      }
      return res.status(404).json({ error: "User not found" });
    } catch (err) {
      return res.status(500).json({ error: "Database error", details: err.message });
    }
  });
});

/* ================= STUDENT ================= */
app.get("/api/student", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, course, batch, target_role, career_readiness, experience_score FROM students ORDER BY id ASC LIMIT 1"
    );
    if (result && result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      return res.json({
        id: row.id,
        name: row.name,
        course: row.course,
        batch: row.batch,
        targetRole: row.target_role,
        careerReadiness: row.career_readiness,
        experienceScore: row.experience_score
      });
    }
  } catch (err) {
    console.warn("DB query notice in /api/student:", err.message);
  }

  res.json({
    id: 1,
    name: "Adarsh Pratap Singh",
    course: "CSIT",
    batch: "2025-29",
    targetRole: "Full Stack Software Engineer",
    careerReadiness: 81,
    experienceScore: 64
  });
});

/* ================= MENTORS ================= */
app.get("/api/mentors", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, role, company, experience_years, availability FROM mentors ORDER BY id ASC"
    );
    if (result && result.rows && result.rows.length > 0) {
      const mapped = result.rows.map((m, idx) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        company: m.company,
        experience: m.experience_years,
        match: 94 - idx * 3,
        availability: m.availability
      }));
      return res.json(mapped);
    }
  } catch (err) {
    console.warn("DB query notice in /api/mentors:", err.message);
  }

  res.json([
    { id: 1, name: "Rohan Mehta", role: "Senior Software Architect", company: "TechNova Labs", experience: 12, match: 94, availability: true },
    { id: 2, name: "Priya Sharma", role: "Engineering Manager", company: "CloudSphere", experience: 10, match: 91, availability: true },
    { id: 3, name: "Arjun Kapoor", role: "AI/ML Lead", company: "DataSphere AI", experience: 14, match: 88, availability: true }
  ]);
});

/* ================= BEST MENTOR ================= */
app.get("/api/mentors/best-match", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, role, company, experience_years, availability FROM mentors ORDER BY experience_years DESC LIMIT 1"
    );
    if (result && result.rows && result.rows.length > 0) {
      const m = result.rows[0];
      return res.json({
        id: m.id,
        name: m.name,
        role: m.role,
        company: m.company,
        experience: m.experience_years,
        match: 94
      });
    }
  } catch (err) {
    console.warn("DB query notice in /api/mentors/best-match:", err.message);
  }

  res.json({
    id: 1,
    name: "Rohan Mehta",
    role: "Senior Software Architect",
    company: "TechNova Labs",
    experience: 12,
    match: 94
  });
});

/* ================= MENTORS ================= */
app.get("/api/mentors", (req, res) => {
  try {
    const mentors = db.getMentors();
    return res.json(mentors);
  } catch (err) {
    console.error("Error in /api/mentors:", err.message);
    res.status(500).json({ error: "Failed to fetch mentors" });
  }
});

app.post("/api/mentors", (req, res) => {
  const { name, role, company, experience_years, experience, availability } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Mentor name is required" });
  }

  try {
    const mentor = db.createMentor({
      name,
      role,
      company,
      experience: experience || experience_years,
      availability
    });
    return res.status(201).json({ success: true, mentor });
  } catch (err) {
    console.error("DB insert error in /api/mentors:", err.message);
    res.status(500).json({ error: "Failed to create mentor", details: err.message });
  }
});

/* ================= GIGS ================= */
app.get("/api/gigs", (req, res) => {
  try {
    const gigs = db.getGigs();
    return res.json(gigs);
  } catch (err) {
    console.error("Error in /api/gigs:", err.message);
    res.status(500).json({ error: "Failed to fetch gigs" });
  }
});

/* ================= POST NEW GIG ================= */
app.post("/api/gigs", (req, res) => {
  const { title, requiredSkill, skill, hours, payment, description, companyId, company } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Gig title is required" });
  }

  try {
    const newGig = db.createGig({
      title,
      requiredSkill: requiredSkill || skill,
      hours,
      payment,
      description,
      company,
      companyId
    });
    return res.status(201).json({
      success: true,
      gig: newGig
    });
  } catch (err) {
    console.error("DB insert error in /api/gigs:", err.message);
    res.status(500).json({ error: "Failed to add gig", details: err.message });
  }
});

/* ================= GET ALL JOBS ================= */
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await db.getJobs();
    res.json(jobs);
  } catch (err) {
    console.error("Error in GET /api/jobs:", err.message);
    res.status(500).json({ error: "Failed to fetch job postings" });
  }
});

/* ================= GET SINGLE JOB ================= */
app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await db.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job posting not found" });
    }
    res.json(job);
  } catch (err) {
    console.error("Error in GET /api/jobs/:id:", err.message);
    res.status(500).json({ error: "Failed to fetch job details" });
  }
});

/* ================= POST NEW JOB ================= */
app.post("/api/jobs", async (req, res) => {
  const { 
    title, 
    company, 
    companyId, 
    location, 
    type, 
    jobType,
    duration, 
    stipend, 
    salary,
    openings, 
    requiredSkills, 
    skills,
    eligibility, 
    description, 
    deadline, 
    status 
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Job title is required" });
  }

  try {
    const newJob = await db.createJob({
      title,
      company: company || "Enterprise Partner",
      companyId: companyId || 1,
      location: location || "Remote",
      type: type || jobType || "Full-Time",
      duration: duration || "6 Months",
      stipend: stipend || salary || "Competitive",
      openings: openings || 1,
      requiredSkills: requiredSkills || skills || ["Engineering"],
      eligibility: eligibility || "All Qualified Students",
      description: description || "Job opening posted by partner recruiter.",
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: status || "Active"
    });

    return res.status(201).json({
      success: true,
      job: newJob,
      message: "Job posting created and saved to database successfully."
    });
  } catch (err) {
    console.error("DB insert error in POST /api/jobs:", err.message);
    res.status(500).json({ error: "Failed to create job posting", details: err.message });
  }
});

/* ================= UPDATE JOB ================= */
app.put("/api/jobs/:id", async (req, res) => {
  try {
    const updated = await db.updateJob(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Job posting not found" });
    }
    return res.json({
      success: true,
      job: updated,
      message: "Job posting updated successfully in database."
    });
  } catch (err) {
    console.error("DB update error in PUT /api/jobs/:id:", err.message);
    res.status(500).json({ error: "Failed to update job posting", details: err.message });
  }
});

/* ================= DELETE JOB ================= */
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const deleted = await db.deleteJob(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Job posting not found" });
    }
    return res.json({
      success: true,
      message: "Job posting removed from database."
    });
  } catch (err) {
    console.error("DB delete error in DELETE /api/jobs/:id:", err.message);
    res.status(500).json({ error: "Failed to delete job posting", details: err.message });
  }
});

/* ================= APPLY GIG ================= */
app.post("/api/gigs/apply", (req, res) => {
  const { studentId, gigId, message, githubRepo } = req.body;

  if (!gigId) {
    return res.status(400).json({
      error: "gigId is required"
    });
  }

  try {
    const application = db.applyForGig({
      studentId: studentId || 1,
      gigId,
      message,
      githubRepo
    });
    return res.status(201).json({
      success: true,
      application,
      message: "Application submitted and recorded in database"
    });
  } catch (err) {
    console.error("DB insert error in /api/gigs/apply:", err.message);
    res.status(500).json({ error: "Failed to apply for gig", details: err.message });
  }
});

/* ================= MENTOR BOOKING ================= */
app.post("/api/mentors/book", (req, res) => {
  const { studentId, mentorId, date, time, topic } = req.body;

  if (!mentorId || !time) {
    return res.status(400).json({
      error: "Complete booking information is required"
    });
  }

  try {
    const booking = db.bookMentorSession({
      studentId: studentId || 1,
      mentorId,
      date,
      time,
      topic
    });
    return res.status(201).json({
      success: true,
      booking,
      message: "15-Minute Capsule booked successfully"
    });
  } catch (err) {
    console.error("DB insert error in /api/mentors/book:", err.message);
    res.status(500).json({ error: "Failed to book mentor session", details: err.message });
  }
});

/* ================= EXPERIENCE PASSPORT ================= */
app.get("/api/passport", (req, res) => {
  try {
    const studentId = req.query.studentId;
    const records = db.getPassportRecords(studentId);
    return res.json(records);
  } catch (err) {
    console.error("Error in /api/passport:", err.message);
    res.status(500).json({ error: "Failed to fetch passport records" });
  }
});

app.post("/api/passport/mint", (req, res) => {
  try {
    const { studentId, title, company, score, skillsVerified } = req.body;
    const record = db.mintPassportRecord({ studentId, title, company, score, skillsVerified });
    return res.status(201).json({ success: true, record });
  } catch (err) {
    console.error("Error in /api/passport/mint:", err.message);
    res.status(500).json({ error: "Failed to mint passport record" });
  }
});

/* ================= GHOST INTERNSHIP TASKS ================= */
app.get("/api/ghost-tasks", (req, res) => {
  try {
    const tasks = db.getGhostTasks();
    return res.json(tasks);
  } catch (err) {
    console.error("Error in /api/ghost-tasks:", err.message);
    res.status(500).json({ error: "Failed to fetch ghost tasks" });
  }
});

/* ================= FACULTY MOUS & SWAPS ================= */
app.get("/api/faculty/mous", (req, res) => {
  try {
    const mous = db.getMouRequests();
    return res.json(mous);
  } catch (err) {
    console.error("Error in /api/faculty/mous:", err.message);
    res.status(500).json({ error: "Failed to fetch MOUs" });
  }
});

app.post("/api/faculty/mous", (req, res) => {
  try {
    const mou = db.createMouRequest(req.body);
    return res.status(201).json({ success: true, mou });
  } catch (err) {
    console.error("Error in /api/faculty/mous POST:", err.message);
    res.status(500).json({ error: "Failed to create MOU" });
  }
});

app.get("/api/faculty/swaps", (req, res) => {
  try {
    const swaps = db.getFacultySwaps();
    return res.json(swaps);
  } catch (err) {
    console.error("Error in /api/faculty/swaps:", err.message);
    res.status(500).json({ error: "Failed to fetch faculty swaps" });
  }
});

app.post("/api/faculty/swaps", (req, res) => {
  try {
    const swap = db.createFacultySwap(req.body);
    return res.status(201).json({ success: true, swap });
  } catch (err) {
    console.error("Error in /api/faculty/swaps POST:", err.message);
    res.status(500).json({ error: "Failed to create faculty swap" });
  }
});

app.get("/api/faqs", (req, res) => {
  try {
    const faqs = db.getFaqs();
    return res.json(faqs);
  } catch (err) {
    console.error("Error in /api/faqs:", err.message);
    res.status(500).json({ error: "Failed to fetch faqs" });
  }
});

/* ================= CAREER ANALYSIS ================= */
app.get("/api/ai/career-analysis", (req, res) => {
  res.json({
    student: "Adarsh Pratap Singh",
    recommendedRole: "Full Stack Software Engineer",
    compatibility: 87,
    placementReadiness: 91,
    strongestSkill: "Git & Collaboration",
    priorityGap: "Backend Architecture",
    recommendation: [
      "Complete backend micro-gig",
      "Attend system design mentor capsule",
      "Deploy authenticated REST API"
    ]
  });
});

/* ================= SKILL GAP ================= */
app.get("/api/ai/skill-gaps", (req, res) => {
  res.json({
    gaps: [
      {
        skill: "Backend Architecture",
        severity: "Critical",
        current: 42,
        required: 92
      },
      {
        skill: "REST API Design",
        severity: "High",
        current: 55,
        required: 86
      },
      {
        skill: "Database Optimization",
        severity: "Medium",
        current: 61,
        required: 88
      },
      {
        skill: "Cloud Deployment",
        severity: "Medium",
        current: 57,
        required: 78
      }
    ]
  });
});

/* ================= CHAT API (GEMINI POWERED) ================= */
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  const ai = getGenAiClient();
  if (!ai) return res.status(500).json({ error: "AI Client not initialized" });

  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));
  const userMessage = messages[messages.length - 1].text;

  const chat = ai.chats.create({
    model: "gemini-3.7-flash",
    config: {
        systemInstruction: "You are an AI Faculty Advisor. Answer concisely, directly, and provide actionable advice for HODs and Faculty.",
        thinkingConfig: { thinkingLevel: 'minimal' }
    },
    history
  });

  console.log('Backend chat request:', userMessage);

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    const stream = await chat.sendMessageStream({ message: userMessage });
    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    res.end();
  } catch (e) {
    console.error("Chat error:", e);
    res.status(500).end();
  }
});

/* ================= AI HELP DESK & ADVISOR (GEMINI POWERED) ================= */
const { GoogleGenAI } = require("@google/genai");

let genAiClient = null;
function getGenAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!genAiClient && apiKey && typeof apiKey === "string" && apiKey.trim().length > 5) {
    try {
      genAiClient = new GoogleGenAI({ 
        apiKey: apiKey.trim(),
        httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
        }
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI client:", e.message);
    }
  }
  return genAiClient;
}

// Fallback intelligent problem-solver engine
function generateLocalHelpdeskResponse(message, category = "general", studentProfile = {}) {
  const lower = (message || "").trim().toLowerCase();
  const studentName = studentProfile.name || "there";

  const greetings = ['hi', 'hii', 'hiiii', 'hello', 'hey', 'heyy', 'hlw', 'hola', 'yo'];
  if (greetings.includes(lower.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ""))) {
    return {
      reply: `Hey ${studentName}! 👋 How's your career sprint going? Ask me any questions about micro-gigs, technical implementations (like JWT blacklisting), or resume tips and I will help you solve them immediately!`,
      suggestions: [
        "Optimize PostgreSQL indexing",
        "Show me zero-trust JWT setup",
        "What micro-gigs are open?"
      ]
    };
  }

  if (lower.includes("jwt") || lower.includes("token") || lower.includes("auth") || lower.includes("blacklist") || lower.includes("redis") || lower.includes("unauthorized") || lower.includes("login")) {
    return {
      reply: `Hey ${studentName}! Blacklisting = logout pe token invalid.

**Redis (Production for 462 users):**
\`\`\`javascript
// On logout - blacklist token
await redis.set(\`bl_\${token}\`, 'true', 'EX', 3600);

// Auth Middleware check
const isBlack = await redis.get(\`bl_\${token}\`);
if (isBlack) return res.status(401).json({ msg: 'Logged out / Token Revoked' });

jwt.verify(token, process.env.JWT_SECRET);
next();
\`\`\`

**In-Memory Set (Local Debugging):**
\`\`\`javascript
const blacklist = new Set();
// On logout
blacklist.add(token);
// Middleware check
if (blacklist.has(token)) return res.status(401).json({ msg: 'Token Revoked' });
\`\`\`

**PostgreSQL Refresh Token Ledger:**
Store active refresh tokens in a \`user_sessions\` table and revoke them upon logout.`,
      suggestions: [
        "How do I securely store tokens in the browser?",
        "Show me an Express JWT authentication middleware snippet",
        "Book a 15-min mentor capsule to review my auth architecture"
      ]
    };
  }

  if (lower.includes("db") || lower.includes("postgres") || lower.includes("sql") || lower.includes("database") || lower.includes("connection") || lower.includes("econnrefused") || lower.includes("index")) {
    return {
      reply: `Hey ${studentName}! Let's optimize your PostgreSQL connection and query performance on Ladder.

**Why needed:** Large cohorts of students running parallel queries can lead to ECONNREFUSED and connection pool timeouts.

**Best practices with direct solution:**
\`\`\`javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 15, // Limit connections
  idleTimeoutMillis: 30000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
\`\`\`

**Composite Indexing for Skill DNA:**
\`\`\`sql
CREATE INDEX idx_cohort_readiness ON students(batch, career_readiness DESC);
\`\`\`
This boosts filtering speeds across the active cohort records.`,
      suggestions: [
        "How do I prevent database connection timeouts?",
        "Show an example pg.Pool setup with SSL",
        "Which micro-gigs give verified database experience?"
      ]
    };
  }

  if (lower.includes("gig") || lower.includes("micro-internship") || lower.includes("task") || lower.includes("stuck") || lower.includes("submission") || lower.includes("payment") || lower.includes("stipend") || lower.includes("money")) {
    return {
      reply: `Hey ${studentName}! I'll guide you through our **Micro-Internships and Gigs** on Ladder.

**Task Deliverables & Expectations:**
- Complete verified tasks with production-grade modular structures.
- Stipends (₹1,500 - ₹5,000) are disbursed directly to your university account within 48 hours of recruiter review.
- Every submission goes through our automated simulation sandbox and must sign a virtual zero-NDA.

**Deliverables Checklist:**
1. Clean commit structure on linked GitHub repositories.
2. Verified unit tests passing locally.
3. Proof-of-work cryptographic SHA-256 logged to your Experience Passport.`,
      suggestions: [
        "What should I include in my gig application message?",
        "How does Experience Passport verification score work?",
        "Explore open high-paying micro-gigs"
      ]
    };
  }

  if (lower.includes("mentor") || lower.includes("capsule") || lower.includes("interview") || lower.includes("meeting") || lower.includes("prepare") || lower.includes("session")) {
    return {
      reply: `Hey ${studentName}! Ready for your 15-Minute Mentor Capsule?

**Our Mentorship Network:**
- Learn directly from elite leaders like **Amit Verma (Senior Architect at TCS)**.
- Capsules are 15-minute ultra-focused sessions designed for deep architecture reviews, PR reviews, and placement referrals.

**Prep Checklist:**
1. Open your repository in a browser tab.
2. Formulate 3 distinct technical or career questions.
3. Link your Experience Passport so the mentor can review your verified credentials.`,
      suggestions: [
        "Give me 5 great questions to ask a Senior Software Architect",
        "How to follow up with a mentor after the call?",
        "Show available mentors this week"
      ]
    };
  }

  if (lower.includes("readiness") || lower.includes("score") || lower.includes("career") || lower.includes("resume") || lower.includes("gap") || lower.includes("roadmap") || lower.includes("dna") || lower.includes("portfolio") || lower.includes("placement")) {
    return {
      reply: `Hey ${studentName}! Let's optimize your Ladder Profile and Career Roadmap.

**Your Career Stats & Metrics:**
- **Skill DNA Score**: 84/100
- **Career Readiness Index**: 81%
- **Experience Gained**: 64 Units
- **Cohort Performance**: Top 8% of the Batch
- **Time Machine Referral Prediction**: 14.5 LPA target base package

**Action Plan to reach 95%+ Placement Readiness:**
1. Connect your Github and LinkedIn accounts on the profile page.
2. Complete 2 verified Micro-Gigs on our board.
3. Request 1-on-1 feedback on your ATS Resume from our industry panel.`,
      suggestions: [
        "What are the top backend skills in demand right now?",
        "How do I prepare for technical coding interviews?",
        "Run another AI Career Twin benchmark"
      ]
    };
  }

  return {
    reply: `Hey ${studentName}! I'm your Bridge Buddy AI Help Desk & Technical Advisor.

Ask me about:
- **Platform Features**: Skill DNA, Career Readiness, Experience Passport, Gigs.
- **Micro-Gigs**: Deliverables, stipends, timeline, NDA.
- **Technical Questions**: Node.js, Express, React, PostgreSQL, JWT blacklisting, Redis.
- **Career Roadmaps**: ATS resume, portfolio tips, and placements.

I am ready to solve any roadblock instantly. No logging, no delays. Ask away!`,
    suggestions: [
      "Optimize Postgres indexing",
      "Show me zero-trust JWT setup",
      "What micro-gigs are open?"
    ]
  };
}

/* ================= POST AI HELPDESK CHAT ================= */
app.post("/api/ai/helpdesk/chat", async (req, res) => {
  const { message, history = [], category = "general", studentProfile = {} } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message text is required" });
  }

  const userQuery = message.trim();
  const studentName = studentProfile.name || "Student";
  const targetRole = studentProfile.targetRole || "Full Stack Software Engineer";
  const readiness = studentProfile.careerReadiness || 81;

  // Attempt Gemini API via @google/genai SDK
  const ai = getGenAiClient();
  if (ai) {
    try {
      const systemInstruction = `You are Bridge Buddy. Rules: 1) Answer in max 70 words 2) Direct code only 3) No intro 4) maxOutputTokens 350, temperature 0.2, topP 0.7, topK 15 5) Stream response with SSE 6) Show badge GEMINI 2.5 FLASH LITE LIVE ⚡ green pulse. For JWT Blacklist give Set code, for PostgreSQL indexing give CREATE INDEX CONCURRENTLY code, for SQL Pool give mysql2 pool 20 limit code. Never show 3 dots for more than 300ms. Start streaming within 400ms.`;

      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        const recent = history.slice(-6);
        for (const msg of recent) {
          if (msg.sender === "user") {
            contents.push({ role: "user", parts: [{ text: msg.text }] });
          } else if (msg.sender === "ai" || msg.sender === "assistant") {
            contents.push({ role: "model", parts: [{ text: msg.text }] });
          }
        }
      }
      contents.push({ role: "user", parts: [{ text: userQuery }] });

      let replyText = null;
      const candidateModels = ["gemini-2.5-flash-lite", "gemini-2.0-flash-lite-preview-02-05", "gemini-1.5-flash-8b", "gemini-2.0-flash"];
      for (const modelName of candidateModels) {
        try {
          if (req.query.stream === 'true') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Transfer-Encoding', 'chunked');

            const responseStream = await ai.models.generateContentStream({
              model: modelName,
              contents,
              config: {
                systemInstruction,
                temperature: 0.2,
                maxOutputTokens: 350,
                topP: 0.7,
                topK: 15,
                safetySettings: []
              }
            });
            for await (const chunk of responseStream) {
              if (chunk && chunk.text) {
                res.write(chunk.text);
              }
            }
            res.end();
            return;
          }

          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              temperature: 0.2,
              maxOutputTokens: 350,
              topP: 0.7,
              topK: 15,
              safetySettings: []
            }
          });

          if (response && response.text) {
            replyText = response.text.trim();
            break;
          }
        } catch (modelErr) {
          console.warn(`Model ${modelName} unavailable (${modelErr?.status || modelErr?.message}), trying next model...`);
        }
      }

      if (replyText) {
        return res.json({
          reply: replyText,
          suggestions: [
            "What is the next step to practice this?",
            "Can you provide a code example for this?",
            "How do I review this with my mentor?"
          ],
          source: "gemini",
          timestamp: new Date().toISOString()
        });
      }
    } catch (geminiErr) {
      console.warn("Gemini Help Desk request failed, using intelligent fallback:", geminiErr.message);
    }
  }

  const localRes = generateLocalHelpdeskResponse(userQuery, category, studentProfile);
  res.json({
    reply: localRes.reply,
    suggestions: localRes.suggestions,
    source: "counselor-engine",
    timestamp: new Date().toISOString()
  });
});

/* ================= GET AI HELPDESK FAQS ================= */
app.get("/api/ai/helpdesk/faq", (req, res) => {
  res.json({
    categories: [
      { id: "all", label: "All Topics", icon: "🌐" },
      { id: "gigs", label: "Micro-Internships", icon: "💼" },
      { id: "technical", label: "Technical & Coding", icon: "💻" },
      { id: "mentorship", label: "Mentor Capsules", icon: "🎓" },
      { id: "career", label: "Career & Readiness", icon: "🚀" }
    ],
    faqs: [
      {
        id: 1,
        category: "gigs",
        question: "How do I get paid and earn verified credit for micro-internships?",
        answer: "When you complete an industry gig, your pull request and deliverable are reviewed by the partner company. Upon approval, payment is credited to your linked payout account and a verified badge is minted directly to your Experience Passport."
      },
      {
        id: 2,
        category: "technical",
        question: "What should I do if my PostgreSQL connection times out or fails?",
        answer: "Verify your connection string syntax, ensure cloud SSL is configured with `{ rejectUnauthorized: false }`, and verify that your IP is whitelisted if using a hosted instance like Cloud SQL or Neon."
      },
      {
        id: 3,
        category: "mentorship",
        question: "How do 15-minute capsule mentorship sessions work?",
        answer: "Capsules are laser-focused 1-on-1 sprint sessions designed for targeted code review, architecture feedback, or placement strategy. Come prepared with 2-3 specific questions and your repository ready for screen sharing."
      },
      {
        id: 4,
        category: "career",
        question: "How is my Career Readiness score calculated?",
        answer: "The AI Career Twin analyzes your verified gig completions (40%), mentorship capsule reviews (25%), technical assessment score (20%), and profile activity (15%) to benchmark your percentile against actual industry hiring bars."
      },
      {
        id: 5,
        category: "technical",
        question: "How do I resolve JWT TokenExpiredError in full-stack apps?",
        answer: "Implement a refresh token flow or re-authenticate the user on 401 responses. Make sure client requests check `localStorage` validity before making API calls."
      }
    ]
  });
});

/* ================= POST CREATE HELPDESK TICKET ================= */
app.post("/api/ai/helpdesk/ticket", async (req, res) => {
  const { title, category, description, priority = "medium", studentId = 1 } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  // Generate initial AI diagnosis
  let aiSummary = "Active diagnostic trace initiated. Complete technical solution flow is available immediately.";
  try {
    const ai = getGenAiClient();
    if (ai) {
      const prompt = `A student opened a support ticket: Title: "${title}", Category: "${category}", Description: "${description}". Provide a brief 2-sentence immediate diagnosis and recommended first step.`;
      for (const modelName of ["gemini-3.7-flash", "gemini-3.6-flash", "gemini-3.5-flash", "gemini-2.0-flash"]) {
        try {
          const aiPromise = ai.models.generateContent({
            model: modelName,
            contents: prompt
          });
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 3000));
          const response = await Promise.race([aiPromise, timeoutPromise]);
          if (response && response.text) {
            aiSummary = response.text.trim();
            break;
          }
        } catch (err) {
          // try next model
        }
      }
    }
  } catch (e) {
    console.warn("AI ticket diagnosis notice:", e.message);
  }

  try {
    const result = await db.query(
      `INSERT INTO helpdesk_tickets (student_id, category, title, description, priority, status, ai_summary)
       VALUES ($1, $2, $3, $4, $5, 'open', $6)
       RETURNING id, student_id, category, title, description, priority, status, ai_summary, created_at`,
      [studentId, category || "general", title, description, priority.toLowerCase(), aiSummary]
    );

    if (result && result.rows && result.rows.length > 0) {
      return res.status(201).json({
        success: true,
        ticket: result.rows[0],
        message: "Ticket created and AI diagnostic generated"
      });
    }
  } catch (err) {
    console.error("DB error creating ticket:", err.message);
  }

  res.status(201).json({
    success: true,
    ticket: {
      id: Date.now(),
      student_id: studentId,
      title,
      category: category || "general",
      description,
      priority: priority.toLowerCase(),
      status: "open",
      ai_summary: aiSummary,
      created_at: new Date().toISOString()
    },
    message: "Ticket created and AI diagnostic generated"
  });
});

/* ================= GET HELPDESK TICKETS ================= */
app.get("/api/ai/helpdesk/tickets", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, student_id, category, title, description, priority, status, ai_summary, created_at FROM helpdesk_tickets ORDER BY id DESC"
    );
    if (result && result.rows) {
      return res.json(result.rows);
    }
  } catch (err) {
    console.warn("DB query notice in /api/ai/helpdesk/tickets:", err.message);
  }
  res.json([]);
});

/* ================= API 404 HANDLER (MUST BE BEFORE STATIC FALLBACK) ================= */
app.use("/api", (req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.originalUrl} not found` });
});

/* ================= STATIC FILES & ROUTING ================= */
const fs = require("fs");
const frontendDist = path.join(__dirname, "../frontend/dist");
const frontendPath = path.join(__dirname, "../frontend");
const staticPath = fs.existsSync(frontendDist) ? frontendDist : frontendPath;

app.use(express.static(staticPath));

app.get("*", (req, res) => {
  if (fs.existsSync(path.join(staticPath, "index.html"))) {
    res.sendFile(path.join(staticPath, "index.html"));
  } else {
    res.sendFile(path.join(frontendPath, "index.html"));
  }
});

/* ================= START SERVER ================= */
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Ladder AI running on http://0.0.0.0:${PORT}`);
  if (process.env.DATABASE_URL) {
    await db.initializeDatabase();
  }
});
