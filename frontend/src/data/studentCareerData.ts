import { 
  SkillItem, 
  SkillGapItem, 
  JobOpportunity, 
  ApplicationItem, 
  LearningCourse, 
  ProjectItem, 
  CertificationItem, 
  AchievementItem, 
  AssessmentCategory, 
  AssessmentResult,
  MentorSession
} from '../types';

// ==========================================
// 1. STUDENT SKILLS INVENTORY
// ==========================================
export const INITIAL_SKILLS: SkillItem[] = [
  {
    id: 'sk-python',
    name: 'Python',
    category: 'technical',
    subCategory: 'Programming',
    level: 5,
    maxLevel: 5,
    score: 94,
    requiredLevel: 4,
    verified: true,
    assessmentScore: 94,
    lastAssessed: '2026-08-15',
    trend: 'up'
  },
  {
    id: 'sk-postgres',
    name: 'PostgreSQL & Database Optimization',
    category: 'technical',
    subCategory: 'Database',
    level: 4,
    maxLevel: 5,
    score: 86,
    requiredLevel: 4,
    verified: true,
    assessmentScore: 86,
    lastAssessed: '2026-08-18',
    trend: 'stable'
  },
  {
    id: 'sk-react',
    name: 'React 18 & Modern Frontend',
    category: 'technical',
    subCategory: 'Web Development',
    level: 3,
    maxLevel: 5,
    score: 74,
    requiredLevel: 4,
    verified: true,
    assessmentScore: 74,
    lastAssessed: '2026-08-10',
    trend: 'up'
  },
  {
    id: 'sk-git',
    name: 'Git & Version Control Workflow',
    category: 'technical',
    subCategory: 'Computer Science Fundamentals',
    level: 4,
    maxLevel: 5,
    score: 88,
    requiredLevel: 3,
    verified: true,
    assessmentScore: 88,
    lastAssessed: '2026-08-05',
    trend: 'stable'
  },
  {
    id: 'sk-dsa',
    name: 'Data Structures & Algorithms (DSA)',
    category: 'technical',
    subCategory: 'DSA',
    level: 2,
    maxLevel: 5,
    score: 52,
    requiredLevel: 4,
    verified: false,
    assessmentScore: 52,
    lastAssessed: '2026-07-28',
    trend: 'down'
  },
  {
    id: 'sk-aws',
    name: 'AWS Cloud & Distributed Systems',
    category: 'technical',
    subCategory: 'Cloud',
    level: 2,
    maxLevel: 5,
    score: 48,
    requiredLevel: 4,
    verified: false,
    assessmentScore: 48,
    lastAssessed: '2026-08-01',
    trend: 'stable'
  },
  {
    id: 'sk-docker',
    name: 'Docker & Containerization',
    category: 'technical',
    subCategory: 'Cloud',
    level: 3,
    maxLevel: 5,
    score: 68,
    requiredLevel: 4,
    verified: false,
    assessmentScore: 68,
    lastAssessed: '2026-08-12',
    trend: 'up'
  },
  {
    id: 'sk-node',
    name: 'Node.js & Express API Security',
    category: 'technical',
    subCategory: 'Web Development',
    level: 3,
    maxLevel: 5,
    score: 72,
    requiredLevel: 4,
    verified: true,
    assessmentScore: 72,
    lastAssessed: '2026-08-20',
    trend: 'up'
  },
  // Soft skills
  {
    id: 'sk-comm',
    name: 'Technical Communication & Presentation',
    category: 'soft',
    subCategory: 'Communication',
    level: 3,
    maxLevel: 5,
    score: 68,
    requiredLevel: 4,
    verified: true,
    assessmentScore: 68,
    lastAssessed: '2026-08-14',
    trend: 'stable'
  },
  {
    id: 'sk-teamwork',
    name: 'Cross-Functional Team Collaboration',
    category: 'soft',
    subCategory: 'Teamwork',
    level: 4,
    maxLevel: 5,
    score: 84,
    requiredLevel: 4,
    verified: true,
    assessmentScore: 84,
    lastAssessed: '2026-08-16',
    trend: 'up'
  },
  {
    id: 'sk-problemsolving',
    name: 'Problem Solving & Critical Thinking',
    category: 'soft',
    subCategory: 'Problem Solving',
    level: 4,
    maxLevel: 5,
    score: 88,
    requiredLevel: 4,
    verified: true,
    assessmentScore: 88,
    lastAssessed: '2026-08-19',
    trend: 'up'
  },
  {
    id: 'sk-leadership',
    name: 'Engineering Leadership & Ownership',
    category: 'soft',
    subCategory: 'Leadership',
    level: 3,
    maxLevel: 5,
    score: 65,
    requiredLevel: 4,
    verified: false,
    assessmentScore: 65,
    lastAssessed: '2026-08-08',
    trend: 'stable'
  },
  {
    id: 'sk-timemgmt',
    name: 'Sprint Planning & Time Management',
    category: 'soft',
    subCategory: 'Time Management',
    level: 4,
    maxLevel: 5,
    score: 82,
    requiredLevel: 4,
    verified: true,
    assessmentScore: 82,
    lastAssessed: '2026-08-11',
    trend: 'stable'
  }
];

// ==========================================
// 2. SKILL GAP ANALYSIS DATA
// ==========================================
export const INITIAL_SKILL_GAPS: SkillGapItem[] = [
  {
    skill: 'Data Structures & Algorithms (DSA)',
    category: 'technical',
    currentLevel: 2,
    requiredLevel: 4,
    currentScore: 52,
    requiredScore: 85,
    gapStatus: 'Critical Gap',
    impactOnPlacement: 'High',
    recommendedCourses: [
      {
        title: 'Mastering Dynamic Programming & Graph Algorithms',
        provider: 'Ladder Elite Lab',
        duration: '12 Hours'
      },
      {
        title: 'LeetCode Pattern Recognition Sprint',
        provider: 'Industry Mentor Cohort',
        duration: '8 Hours'
      }
    ],
    recommendedCertifications: ['Advanced Algorithmic Problem Solver (Tier-1 Standard)'],
    recommendedMentorTopic: 'Systematic DSA Debugging & Complexity Analysis',
    recommendedProject: 'High-Concurrency In-Memory Trie & Graph Cache'
  },
  {
    skill: 'AWS Cloud & Distributed Systems',
    category: 'technical',
    currentLevel: 2,
    requiredLevel: 4,
    currentScore: 48,
    requiredScore: 80,
    gapStatus: 'Critical Gap',
    impactOnPlacement: 'High',
    recommendedCourses: [
      {
        title: 'AWS Cloud Solutions Architecture Bootcamp',
        provider: 'AWS Academy & Ladder',
        duration: '16 Hours'
      },
      {
        title: 'Zero-Downtime ECS & Serverless Architecture',
        provider: 'CloudSphere Enterprise',
        duration: '6 Hours'
      }
    ],
    recommendedCertifications: ['AWS Certified Solutions Architect – Associate'],
    recommendedMentorTopic: 'Designing Fault-Tolerant AWS Microservices',
    recommendedProject: 'Serverless Event-Driven Notification Pipeline on AWS Lambda'
  },
  {
    skill: 'React 18 & State Virtualization',
    category: 'technical',
    currentLevel: 3,
    requiredLevel: 4,
    currentScore: 74,
    requiredScore: 85,
    gapStatus: 'Moderate Gap',
    impactOnPlacement: 'Medium',
    recommendedCourses: [
      {
        title: 'React Concurrent Mode & High-Performance Data Grids',
        provider: 'Meta OpenSource Curriculum',
        duration: '5 Hours'
      }
    ],
    recommendedCertifications: ['Frontend Architecture Specialization'],
    recommendedMentorTopic: 'Profiling React Render Performance & Memory Leaks',
    recommendedProject: 'Zero-Layout Shift Real-Time Telemetry Dashboard'
  },
  {
    skill: 'Technical Communication & Presentation',
    category: 'soft',
    currentLevel: 3,
    requiredLevel: 4,
    currentScore: 68,
    requiredScore: 82,
    gapStatus: 'Moderate Gap',
    impactOnPlacement: 'High',
    recommendedCourses: [
      {
        title: 'Executive Engineering Presentations & RFC Writing',
        provider: 'Ladder Professional Track',
        duration: '4 Hours'
      }
    ],
    recommendedCertifications: ['Certified Technical Communicator'],
    recommendedMentorTopic: 'System Architecture Design Presentation Defense',
    recommendedProject: 'Author a Production RFC Document for Distributed Cache'
  },
  {
    skill: 'Engineering Leadership & Ownership',
    category: 'soft',
    currentLevel: 3,
    requiredLevel: 4,
    currentScore: 65,
    requiredScore: 78,
    gapStatus: 'Moderate Gap',
    impactOnPlacement: 'Medium',
    recommendedCourses: [
      {
        title: 'Leading Agile Engineering Sprints & PR Reviews',
        provider: 'TCS Enterprise Academy',
        duration: '4 Hours'
      }
    ],
    recommendedCertifications: ['Agile Team Leadership Specialist'],
    recommendedMentorTopic: 'Resolving Technical Debt & Leading Peer Code Reviews',
    recommendedProject: 'Lead a 3-Person Team in Live Industry Challenge'
  },
  {
    skill: 'Python & Backend Optimization',
    category: 'technical',
    currentLevel: 5,
    requiredLevel: 4,
    currentScore: 94,
    requiredScore: 85,
    gapStatus: 'Mastered',
    impactOnPlacement: 'Low',
    recommendedCourses: [],
    recommendedCertifications: ['Verified Python Core Master'],
    recommendedMentorTopic: 'Advanced Cython & AsyncIO Internals',
    recommendedProject: 'Async High-Throughput Event Broker'
  },
  {
    skill: 'PostgreSQL & Database Optimization',
    category: 'technical',
    currentLevel: 4,
    requiredLevel: 4,
    currentScore: 86,
    requiredScore: 85,
    gapStatus: 'Mastered',
    impactOnPlacement: 'Low',
    recommendedCourses: [],
    recommendedCertifications: ['PostgreSQL Performance Tuning Credential'],
    recommendedMentorTopic: 'Composite Indexing & Partitioning at Scale',
    recommendedProject: 'Partitioned Time-Series Audit Log Table'
  },
  {
    skill: 'Git & Version Control Workflow',
    category: 'technical',
    currentLevel: 4,
    requiredLevel: 3,
    currentScore: 88,
    requiredScore: 75,
    gapStatus: 'Mastered',
    impactOnPlacement: 'Low',
    recommendedCourses: [],
    recommendedCertifications: ['Advanced Git & CI/CD Pipelines'],
    recommendedMentorTopic: 'Trunk-Based Development & Semantic Versioning',
    recommendedProject: 'GitHub Actions Automated Matrix Test Workflow'
  }
];

// ==========================================
// 3. JOB & INTERNSHIP OPPORTUNITIES DATA
// ==========================================
export const INITIAL_OPPORTUNITIES: JobOpportunity[] = [
  {
    id: 'opp-1',
    company: 'TechNova Solutions',
    title: 'Frontend Developer Intern',
    location: 'Bengaluru / Remote',
    workMode: 'Remote',
    opportunityType: 'Internship',
    duration: '3 Months',
    stipendOrSalary: '₹35,000 / month',
    requiredSkills: ['React', 'JavaScript', 'Git', 'Node.js'],
    preferredSkills: ['TypeScript', 'Tailwind CSS', 'Next.js'],
    eligibility: 'B.Tech CS/IT (Batch 2025-2029) with min 70% aggregate and React proficiency',
    applicationDeadline: '2026-09-20',
    description: 'Join TechNova’s flagship product team building high-performance financial data visualizations. You will work alongside senior staff engineers optimizing client-side render cycles and implementing zero-latency WebSocket feeds.',
    responsibilities: [
      'Build responsive, accessible user interfaces using React and modern CSS.',
      'Integrate authenticated backend REST & WebSocket APIs.',
      'Write comprehensive unit tests with Vitest and React Testing Library.',
      'Participate in daily Agile scrums and peer pull request reviews.'
    ],
    openingsCount: 4,
    postedDate: '2026-08-25',
    featured: true
  },
  {
    id: 'opp-2',
    company: 'CloudSphere Systems',
    title: 'Cloud Backend Microservices Intern',
    location: 'Hyderabad / Hybrid',
    workMode: 'Hybrid',
    opportunityType: 'Internship',
    duration: '6 Months',
    stipendOrSalary: '₹45,000 / month',
    requiredSkills: ['Python', 'PostgreSQL', 'Docker', 'AWS'],
    preferredSkills: ['Redis', 'Kafka', 'FastAPI'],
    eligibility: 'Pre-final & Final year B.Tech/M.Tech with strong database and backend fundamentals',
    applicationDeadline: '2026-09-25',
    description: 'CloudSphere develops enterprise multi-cloud orchestration software. As a Cloud Backend Intern, you will architect resilient microservices, optimize database queries, and deploy containerized services onto managed Kubernetes clusters.',
    responsibilities: [
      'Develop high-throughput RESTful endpoints using Python & FastAPI.',
      'Optimize PostgreSQL relational schemas and write efficient indexing strategies.',
      'Package microservices into multi-stage Docker containers for AWS deployment.',
      'Implement zero-trust API authentication using JWT tokens and Redis blacklisting.'
    ],
    openingsCount: 6,
    postedDate: '2026-08-24',
    featured: true
  },
  {
    id: 'opp-3',
    company: 'Zeta Fintech Labs',
    title: 'Associate Software Engineer (Full-Stack)',
    location: 'Bengaluru / Hybrid',
    workMode: 'Hybrid',
    opportunityType: 'Full-Time',
    stipendOrSalary: '₹14.5 – ₹18.0 LPA',
    requiredSkills: ['Python', 'React', 'PostgreSQL', 'DSA', 'Git'],
    preferredSkills: ['Distributed Systems', 'System Design', 'Microservices'],
    eligibility: 'Graduating 2026/2027 with minimum 75% Career Readiness and 4+ verified Passport credentials',
    applicationDeadline: '2026-10-15',
    description: 'Zeta builds next-generation banking technology stacks processing billions in daily transaction volumes. Looking for high-caliber engineers capable of writing clean, bulletproof code with deep algorithmic reasoning.',
    responsibilities: [
      'Design, build, and maintain core banking ledger microservices.',
      'Drive end-to-end features from technical design RFC to production deployment.',
      'Collaborate with product managers, QA automation engineers, and cloud DevOps teams.',
      'Maintain 99.99% system reliability through automated telemetry and error tracking.'
    ],
    openingsCount: 10,
    postedDate: '2026-08-26',
    featured: true
  },
  {
    id: 'opp-4',
    company: 'TCS Enterprise Labs',
    title: 'Digital Systems Engineer Trainee',
    location: 'Noida / Pune / Chennai',
    workMode: 'On-site',
    opportunityType: 'Full-Time',
    stipendOrSalary: '₹9.0 – ₹12.5 LPA',
    requiredSkills: ['Python', 'PostgreSQL', 'Git', 'Problem Solving'],
    preferredSkills: ['Spring Boot', 'Cloud Architecture', 'Linux Internals'],
    eligibility: 'B.Tech/BE all computing branches with min 7.0 CGPA and no active backlogs',
    applicationDeadline: '2026-10-30',
    description: 'Premier campus placement role under TCS Digital. Selected candidates undergo intensive 3-month advanced systems architecture immersion followed by high-visibility placement on global client enterprise modernization initiatives.',
    responsibilities: [
      'Develop scalable enterprise software according to ISO and SOC2 compliance standards.',
      'Migrate monolithic legacy architectures to cloud-native microservices.',
      'Participate in automated CI/CD pipeline deployments and regression testing.'
    ],
    openingsCount: 25,
    postedDate: '2026-08-20'
  },
  {
    id: 'opp-5',
    company: 'Razorpay Engineering',
    title: 'Payment Gateway Integration Intern',
    location: 'Bengaluru / Remote',
    workMode: 'Remote',
    opportunityType: 'Internship',
    duration: '4 Months',
    stipendOrSalary: '₹40,000 / month',
    requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'Git'],
    preferredSkills: ['Webhooks', 'Idempotency Keys', 'TypeScript'],
    eligibility: 'Demonstrated experience with API integrations and web security fundamentals',
    applicationDeadline: '2026-09-18',
    description: 'Work directly on merchant checkout SDKs, payment webhooks, and fraud detection algorithms. High pre-placement offer (PPO) conversion rate for top performers.',
    responsibilities: [
      'Implement idempotent payment confirmation endpoints with Redis distributed locking.',
      'Enhance checkout UX widgets with sub-second response times.',
      'Debug cross-browser edge cases across mobile and desktop environments.'
    ],
    openingsCount: 3,
    postedDate: '2026-08-28'
  },
  {
    id: 'opp-6',
    company: 'Infosys NextGen Digital',
    title: 'Specialist Programmer (AI & Cloud)',
    location: 'Mysuru / Bengaluru / Remote',
    workMode: 'Hybrid',
    opportunityType: 'Full-Time',
    stipendOrSalary: '₹11.0 – ₹15.0 LPA',
    requiredSkills: ['Python', 'DSA', 'Docker', 'Problem Solving'],
    preferredSkills: ['PyTorch', 'TensorFlow', 'REST APIs'],
    eligibility: 'Top quartile percentile in algorithmic problem solving and clean coding assessment',
    applicationDeadline: '2026-11-05',
    description: 'Join the specialist elite engineering cohort at Infosys focusing on Generative AI agent pipelines, multi-cloud migrations, and predictive intelligence engines.',
    responsibilities: [
      'Build LLM agent orchestrations with LangChain and vector embeddings.',
      'Implement high-throughput batch inference pipelines on GPU clusters.',
      'Optimize data preprocessing and serialization pipelines.'
    ],
    openingsCount: 15,
    postedDate: '2026-08-22'
  }
];

// ==========================================
// 4. APPLICATION TRACKER INITIAL DATA
// ==========================================
export const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'app-101',
    opportunityId: 'opp-1',
    opportunityTitle: 'Frontend Developer Intern',
    opportunityType: 'Internship',
    company: 'TechNova Solutions',
    location: 'Bengaluru / Remote',
    workMode: 'Remote',
    stipendOrSalary: '₹35,000 / month',
    status: 'Shortlisted',
    appliedDate: '2026-08-22',
    lastUpdated: '2026-08-28',
    deadline: '2026-09-20',
    matchScore: 92,
    notes: 'Resume passed initial ATS screening. Recruiter shortlisted candidate for Round 1 Technical Sprint.',
    timeline: [
      { status: 'Applied', date: '2026-08-22', note: 'Application and Skill DNA submitted successfully', completed: true },
      { status: 'Under Review', date: '2026-08-24', note: 'Profile & Experience Passport reviewed by hiring manager', completed: true },
      { status: 'Shortlisted', date: '2026-08-28', note: 'Selected for live React component build challenge', completed: true },
      { status: 'Interview', date: 'Upcoming (Sep 02)', note: '30-Min Technical Conversation with Senior Staff Engineer', completed: false },
      { status: 'Selected', date: 'Pending', note: 'Final offer letter disbursement', completed: false }
    ]
  },
  {
    id: 'app-102',
    opportunityId: 'opp-2',
    opportunityTitle: 'Cloud Backend Microservices Intern',
    opportunityType: 'Internship',
    company: 'CloudSphere Systems',
    location: 'Hyderabad / Hybrid',
    workMode: 'Hybrid',
    stipendOrSalary: '₹45,000 / month',
    status: 'Under Review',
    appliedDate: '2026-08-27',
    lastUpdated: '2026-08-29',
    deadline: '2026-09-25',
    matchScore: 88,
    notes: 'Application submitted with verified PostgreSQL passport proof-of-work attached.',
    timeline: [
      { status: 'Applied', date: '2026-08-27', note: 'Application received by Talent Acquisition', completed: true },
      { status: 'Under Review', date: '2026-08-29', note: 'Verifying Docker and Python proficiency benchmarks', completed: true },
      { status: 'Shortlisted', date: 'Pending', note: 'Awaiting cohort shortlisting results', completed: false },
      { status: 'Interview', date: 'Pending', note: 'System design and microservice walk-through', completed: false },
      { status: 'Selected', date: 'Pending', note: 'Formal onboarding', completed: false }
    ]
  },
  {
    id: 'app-103',
    opportunityId: 'opp-3',
    opportunityTitle: 'Associate Software Engineer (Full-Stack)',
    opportunityType: 'Job',
    company: 'Zeta Fintech Labs',
    location: 'Bengaluru / Hybrid',
    workMode: 'Hybrid',
    stipendOrSalary: '₹14.5 – ₹18.0 LPA',
    status: 'Applied',
    appliedDate: '2026-08-30',
    lastUpdated: '2026-08-30',
    deadline: '2026-10-15',
    matchScore: 84,
    notes: 'Campus placement drive application registered. Assessment link will be dispatched 48h prior to testing window.',
    timeline: [
      { status: 'Applied', date: '2026-08-30', note: 'Application and Skill DNA profile registered', completed: true },
      { status: 'Under Review', date: 'Pending', note: 'Automated eligibility verification', completed: false },
      { status: 'Shortlisted', date: 'Pending', note: 'Online coding challenge slot allocation', completed: false },
      { status: 'Interview', date: 'Pending', note: 'Technical + HR rounds', completed: false },
      { status: 'Selected', date: 'Pending', note: 'Placement confirmation with university TPO', completed: false }
    ]
  },
  {
    id: 'app-104',
    opportunityId: 'gig-1',
    opportunityTitle: 'JWT Authentication & Redis Blacklisting Micro-Gig',
    opportunityType: 'Micro-Gig',
    company: 'CloudSphere Systems',
    location: 'Remote',
    workMode: 'Remote',
    stipendOrSalary: '₹2,500 (Completed)',
    status: 'Selected',
    appliedDate: '2026-08-10',
    lastUpdated: '2026-08-14',
    deadline: '2026-08-15',
    matchScore: 98,
    notes: 'Pull request approved with 100% test coverage. Stipend cleared and Experience Passport credential minted!',
    timeline: [
      { status: 'Applied', date: '2026-08-10', note: 'Bid placed on Micro-Gig board', completed: true },
      { status: 'Under Review', date: '2026-08-11', note: 'Assigned task sprint repository access', completed: true },
      { status: 'Shortlisted', date: '2026-08-12', note: 'PR submitted with unit tests', completed: true },
      { status: 'Interview', date: '2026-08-13', note: '15-min mentor code review', completed: true },
      { status: 'Selected', date: '2026-08-14', note: 'Approved & Stipend Paid to Student Bank Account', completed: true }
    ]
  }
];

// ==========================================
// 5. LEARNING HUB COURSES DATA
// ==========================================
export const INITIAL_COURSES: LearningCourse[] = [
  {
    id: 'igot-1',
    title: 'Mission Karmayogi: Introduction to Civil Services',
    provider: 'iGOT Karmayogi',
    category: 'Governance',
    skillsCovered: ['Public Service', 'Ethics', 'Governance'],
    level: 'Beginner',
    duration: '4 Hours',
    modulesCount: 4,
    completedModules: 0,
    progressPercent: 0,
    status: 'Not Started',
    targetSkillGap: 'Governance',
    recommendationReason: 'Core foundation for all government officials.',
    rating: 4.9
  },
  {
    id: 'igot-2',
    title: 'Digital Public Infrastructure in India',
    provider: 'iGOT Karmayogi',
    category: 'Technology & Governance',
    skillsCovered: ['Digital India', 'Public Infrastructure', 'Governance'],
    level: 'Intermediate',
    duration: '6 Hours',
    modulesCount: 6,
    completedModules: 0,
    progressPercent: 0,
    status: 'Not Started',
    targetSkillGap: 'Digital Literacy',
    recommendationReason: 'Essential for modernizing administrative processes.',
    rating: 4.8
  },
  {
    id: 'igot-3',
    title: 'Health Systems Strengthening',
    provider: 'iGOT Karmayogi',
    category: 'Health & Welfare',
    skillsCovered: ['Healthcare Management', 'Public Health', 'Governance'],
    level: 'Intermediate',
    duration: '10 Hours',
    modulesCount: 8,
    completedModules: 0,
    progressPercent: 0,
    status: 'Not Started',
    targetSkillGap: 'Healthcare Management',
    recommendationReason: 'Relevant for healthcare-related policy roles.',
    rating: 4.95
  }
];

// ==========================================
// 6. PROJECTS & INDUSTRY CHALLENGES DATA
// ==========================================
export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'High-Concurrency Sharded Key-Value Cache Engine',
    type: 'Live Industry Challenge',
    industry: 'Cloud & Distributed Infrastructure',
    company: 'CloudSphere Systems',
    description: 'Design and implement an in-memory, thread-safe key-value cache engine supporting consistent hashing, TTL eviction, and asynchronous persistence to disk.',
    requiredSkills: ['Python', 'PostgreSQL', 'Docker', 'DSA'],
    duration: '2 Weeks Sprint',
    teamSize: '1 – 2 Students',
    deadline: '2026-09-30',
    status: 'Joined',
    bountyOrReward: '₹15,000 Bounty + Guaranteed Interview Slot',
    githubRepo: 'https://github.com/adarsh-pratap/sharded-cache-engine',
    milestones: [
      { title: 'Consistent Hashing Ring Implementation', completed: true },
      { title: 'LRU/TTL Memory Eviction Policies', completed: true },
      { title: 'Benchmarking 100K Req/sec with wrk', completed: false },
      { title: 'Multi-stage Docker packaging', completed: false }
    ]
  },
  {
    id: 'proj-2',
    title: 'Autonomous University MoU & Curriculum Parser',
    type: 'Academic',
    industry: 'EdTech & AI Governance',
    company: 'Ladder Academic Board',
    description: 'Natural Language Processing pipeline that parses AICTE/UGC syllabus guidelines, extracts skill gaps, and auto-generates corporate MoUs with industry partners.',
    requiredSkills: ['Python', 'React', 'PostgreSQL', 'Git'],
    duration: '1 Month',
    teamSize: '3 Students',
    deadline: '2026-10-15',
    status: 'In Progress',
    bountyOrReward: 'Academic Capstone Grade A+ & SIH Recognition',
    githubRepo: 'https://github.com/adarsh-pratap/skillbridge-mou-engine',
    milestones: [
      { title: 'PDF Syllabus Extractor with OCR', completed: true },
      { title: 'Skill Keyword Taxonomic Mapping', completed: true },
      { title: 'Docx/PDF Auto MoU Generation Pipeline', completed: false }
    ]
  },
  {
    id: 'proj-3',
    title: 'Zero-Leak Distributed JWT Auth Gateway',
    type: 'Personal',
    industry: 'Cybersecurity & Web Architecture',
    description: 'Production-ready reverse proxy and authentication gateway implementing asymmetric RSA-256 JWT validation, Redis token blacklisting, and rate limiting.',
    requiredSkills: ['Node.js', 'Express', 'React', 'Git'],
    duration: '10 Days',
    teamSize: 'Solo',
    status: 'Completed',
    bountyOrReward: 'Verified Experience Passport SHA-256 Minted',
    githubRepo: 'https://github.com/adarsh-pratap/zero-leak-auth-gateway',
    liveDemoUrl: 'https://auth-gateway-demo.skillbridge.internal',
    milestones: [
      { title: 'JWT Sign & Verify Middleware', completed: true },
      { title: 'Redis Cluster Invalidation Endpoint', completed: true },
      { title: 'Full Vitest Automated Test Coverage', completed: true }
    ]
  }
];

// ==========================================
// 7. CERTIFICATIONS & ACHIEVEMENTS DATA
// ==========================================
export const INITIAL_CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'cert-1',
    name: 'Verified Python Core & Backend Architecture',
    issuer: 'Ladder Industry Assessment Engine',
    issueDate: 'August 15, 2026',
    credentialId: 'SB-CERT-2026-PY-9401',
    credentialUrl: 'https://skillbridge.ai/verify/SB-CERT-2026-PY-9401',
    status: 'Verified',
    skillsVerified: ['Python', 'AsyncIO', 'Data Structures', 'REST APIs'],
    badgeColor: 'emerald'
  },
  {
    id: 'cert-2',
    name: 'PostgreSQL Query Optimization & Indexing Specialist',
    issuer: 'Enterprise Database Consortium',
    issueDate: 'August 18, 2026',
    credentialId: 'EDC-PG-8612-VERIFIED',
    credentialUrl: 'https://skillbridge.ai/verify/EDC-PG-8612',
    status: 'Verified',
    skillsVerified: ['PostgreSQL', 'Query Optimization', 'Indexing', 'Transactions'],
    badgeColor: 'indigo'
  },
  {
    id: 'cert-3',
    name: 'AWS Certified Cloud Practitioner (In Progress)',
    issuer: 'Amazon Web Services',
    issueDate: 'Exam Scheduled (Sep 2026)',
    credentialId: 'AWS-CCP-PENDING-2026',
    status: 'Pending Verification',
    skillsVerified: ['AWS', 'Cloud Architecture', 'IAM Security'],
    badgeColor: 'amber'
  }
];

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-1',
    title: 'Smart India Hackathon (SIH 2026) Finalist',
    organization: 'Ministry of Education & AICTE',
    date: 'July 2026',
    category: 'Hackathon',
    awardRank: 'Top 5 National Finalist (Problem)',
    description: 'Architected the unified industry-academia skill matchmaking OS with automated blockchain verified passport credentialing.',
    status: 'Verified'
  },
  {
    id: 'ach-2',
    title: 'Top 8% Batch Skill Benchmark Leaderboard',
    organization: 'MJPRU Department of CSIT',
    date: 'August 2026',
    category: 'Academic',
    awardRank: 'Rank #3 in Cohort of 460 Students',
    description: 'Recognized for highest career velocity and outstanding assessment performance across programming and system design.',
    status: 'Verified'
  }
];

// ==========================================
// 8. MENTOR SESSIONS HISTORY DATA
// ==========================================
export const INITIAL_MENTOR_SESSIONS: MentorSession[] = [
  {
    id: 'sess-1',
    mentorId: 1,
    mentorName: 'Amit Verma',
    mentorCompany: 'TCS Enterprise',
    mentorRole: 'Senior Principal Architect',
    topic: 'PostgreSQL Indexing & High-Concurrency System Design',
    date: '2026-08-25',
    timeSlot: '4:00 PM – 4:15 PM',
    status: 'Completed',
    feedback: 'Excellent grasp of database indexing and execution plans. Focus on dynamic programming and graph algorithms to ace Tier-1 product interviews.',
    rating: 5
  },
  {
    id: 'sess-2',
    mentorId: 2,
    mentorName: 'Priya Sharma',
    mentorCompany: 'Infosys Digital',
    mentorRole: 'Lead Cloud Solutions Architect',
    topic: 'AWS Cloud Architecture Roadmap for Pre-Final Years',
    date: '2026-08-28',
    timeSlot: '11:30 AM – 11:45 AM',
    status: 'Completed',
    feedback: 'Adarsh is well on track. Advised him to package his REST APIs in Docker and complete the AWS Solutions Architect Associate certification.',
    rating: 5
  },
  {
    id: 'sess-3',
    mentorId: 1,
    mentorName: 'Amit Verma',
    mentorCompany: 'TCS Enterprise',
    mentorRole: 'Senior Principal Architect',
    topic: 'Zeta Fintech Pre-Placement Technical Interview Prep',
    date: '2026-09-02',
    timeSlot: '5:00 PM – 5:15 PM',
    status: 'Confirmed',
    meetLink: 'https://meet.skillbridge.ai/capsule-sess-3'
  }
];

// ==========================================
// 9. SKILL ASSESSMENT DATA STRUCTURE
// ==========================================
export const ASSESSMENT_CATEGORIES: AssessmentCategory[] = [
  {
    id: 'cat-prog-python',
    title: 'Python Core & Advanced Programming',
    type: 'technical',
    subCategory: 'Programming',
    description: 'Test your knowledge of memory management, decorators, generators, asynchronous programming with asyncio, and OOP design patterns.',
    iconName: 'Code',
    questionCount: 6,
    durationMinutes: 10,
    difficulty: 'Intermediate',
    passingScore: 70,
    questions: [
      {
        id: 'py-q1',
        category: 'Programming',
        question: 'What is the output of the following Python generator expression and memory behavior?',
        codeSnippet: `def num_gen():
    yield 1
    yield 2
    yield 3

gen = num_gen()
print(list(gen))
print(list(gen))`,
        options: [
          '[1, 2, 3] and [1, 2, 3]',
          '[1, 2, 3] and []',
          '[1, 2, 3] and StopIteration Error',
          'Error on list initialization'
        ],
        correctIndex: 1,
        explanation: 'Generators in Python are one-time iterators. Once consumed by the first list() call, subsequent iterations over the exhausted generator return an empty list.',
        difficulty: 'Intermediate'
      },
      {
        id: 'py-q2',
        category: 'Programming',
        question: 'In Python asyncio, what happens when an unhandled exception occurs inside a Task created with asyncio.create_task()?',
        options: [
          'The entire event loop immediately crashes',
          'The exception is captured inside the Task object and raised only when awaited or when the task is garbage collected without retrieval',
          'The exception is silently discarded with zero logs',
          'Python switches from async to synchronous mode'
        ],
        correctIndex: 1,
        explanation: 'In asyncio, exceptions inside a Task are stored on the task. If never awaited or retrieved with task.exception(), a warning is logged upon GC: "Task exception was never retrieved".',
        difficulty: 'Advanced'
      },
      {
        id: 'py-q3',
        category: 'Programming',
        question: 'Which of the following describes the GIL (Global Interpreter Lock) in CPython?',
        options: [
          'A lock that prevents multiple operating system processes from executing simultaneously',
          'A mutex that allows only one native thread to hold the control of the Python interpreter at any given time',
          'A compiler flag that optimizes vector operations for GPU processing',
          'A mechanism that enforces private member access inside Python classes'
        ],
        correctIndex: 1,
        explanation: 'The CPython Global Interpreter Lock (GIL) is a mutual-exclusion lock preventing multiple threads from executing Python bytecodes at once, making CPU-bound multi-threading execute sequentially unless using multiprocessing.',
        difficulty: 'Intermediate'
      },
      {
        id: 'py-q4',
        category: 'Programming',
        question: 'What is the time complexity of searching for a key in a Python dict with N elements in the average case?',
        options: ['O(N)', 'O(log N)', 'O(1)', 'O(N log N)'],
        correctIndex: 2,
        explanation: 'Python dicts are implemented as open-addressing hash tables with perturbation, giving O(1) average lookup, insertion, and deletion complexity.',
        difficulty: 'Beginner'
      },
      {
        id: 'py-q5',
        category: 'Programming',
        question: 'How do you correctly preserve original function metadata (name, docstring) when writing a custom decorator in Python?',
        codeSnippet: `from functools import wraps

def my_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper`,
        options: [
          'Using @functools.wraps(func) on the inner wrapper function',
          'Manually reassigning wrapper.__doc__ = func.__doc__',
          'Declaring the wrapper as a static method',
          'Decorators automatically preserve metadata in Python 3.12+'
        ],
        correctIndex: 0,
        explanation: '@functools.wraps(func) automatically copies the __name__, __doc__, __module__, and __annotations__ attributes from the decorated function to the wrapper.',
        difficulty: 'Intermediate'
      },
      {
        id: 'py-q6',
        category: 'Programming',
        question: 'Which builtin module provides thread-safe double-ended queues with O(1) appends and pops from both sides?',
        options: ['queue.Queue', 'collections.deque', 'heapq', 'array.array'],
        correctIndex: 1,
        explanation: 'collections.deque provides memory-efficient, O(1) time complexity appends and pops from both the left and right ends.',
        difficulty: 'Beginner'
      }
    ]
  },
  {
    id: 'cat-dsa',
    title: 'Data Structures & Algorithms (DSA)',
    type: 'technical',
    subCategory: 'DSA',
    description: 'Assess complexity analysis, trees, dynamic programming, two pointers, graphs, and search/sort optimization.',
    iconName: 'Binary',
    questionCount: 5,
    durationMinutes: 12,
    difficulty: 'Advanced',
    passingScore: 75,
    questions: [
      {
        id: 'dsa-q1',
        category: 'DSA',
        question: 'What is the optimal time complexity to detect a cycle in a Directed Graph with V vertices and E edges?',
        options: ['O(V * E)', 'O(V + E) using DFS with 3-state coloring (White, Gray, Black)', 'O(V^2)', 'O(E log V)'],
        correctIndex: 1,
        explanation: 'Cycle detection in a directed graph is solvable in O(V + E) time using Depth-First Search with recursion stack tracking (or 3-color states: unvisited, visiting, visited).',
        difficulty: 'Intermediate'
      },
      {
        id: 'dsa-q2',
        category: 'DSA',
        question: 'In the 0/1 Knapsack problem with N items and weight capacity W, what is the space-optimized dynamic programming complexity?',
        options: ['O(N * W) time and O(W) space using 1D array traversed backwards', 'O(2^N) time and O(1) space', 'O(N^2) time and O(N) space', 'O(W log N) time and O(W) space'],
        correctIndex: 0,
        explanation: 'By iterating the weight capacity backwards from W down to item weight w_i, the 0/1 Knapsack DP state can be computed in O(N * W) time and O(W) 1D space.',
        difficulty: 'Advanced'
      },
      {
        id: 'dsa-q3',
        category: 'DSA',
        question: 'Which self-balancing binary search tree guarantees that no path from root to leaf is more than twice as long as any other path?',
        options: ['AVL Tree', 'Red-Black Tree', 'B-Tree', 'Splay Tree'],
        correctIndex: 1,
        explanation: 'Red-Black Trees enforce color invariants (root is black, no two adjacent reds, same black-height) ensuring max height is ≤ 2 * log2(N + 1).',
        difficulty: 'Intermediate'
      },
      {
        id: 'dsa-q4',
        category: 'DSA',
        question: 'What data structure is utilized in Dijkstra’s Shortest Path algorithm to achieve O((V + E) log V) time complexity?',
        options: ['FIFO Queue', 'Stack', 'Min-Priority Queue (Min-Heap)', 'Hash Set'],
        correctIndex: 2,
        explanation: 'Dijkstra’s algorithm using a Min-Heap (Priority Queue) extracts the vertex with minimum distance in O(log V) time, yielding O((V + E) log V) overall complexity.',
        difficulty: 'Intermediate'
      },
      {
        id: 'dsa-q5',
        category: 'DSA',
        question: 'What is the worst-case time complexity of QuickSelect to find the K-th smallest element with Median-of-Medians pivot selection?',
        options: ['O(N^2)', 'O(N log N)', 'O(N)', 'O(log N)'],
        correctIndex: 2,
        explanation: 'With Median-of-Medians deterministic pivot choice, QuickSelect guarantees linear O(N) time complexity even in the worst case.',
        difficulty: 'Advanced'
      }
    ]
  },
  {
    id: 'cat-db-sql',
    title: 'Database Systems & SQL Optimization',
    type: 'technical',
    subCategory: 'Database',
    description: 'Master relational schema design, ACID transactions, B-Tree indexes, composite keys, and query execution plans.',
    iconName: 'Database',
    questionCount: 5,
    durationMinutes: 10,
    difficulty: 'Intermediate',
    passingScore: 70,
    questions: [
      {
        id: 'db-q1',
        category: 'Database',
        question: 'Given an index on (dept_id, salary), which of the following queries CANNOT use this composite B-Tree index efficiently?',
        options: [
          'SELECT * FROM employees WHERE dept_id = 10 AND salary > 50000;',
          'SELECT * FROM employees WHERE dept_id = 10;',
          'SELECT * FROM employees WHERE salary > 50000;',
          'SELECT * FROM employees WHERE dept_id = 10 ORDER BY salary DESC;'
        ],
        correctIndex: 2,
        explanation: 'B-Tree composite indexes follow the Leftmost Prefix Rule. Querying on "salary" alone skips the leading column "dept_id" and results in a full table scan.',
        difficulty: 'Intermediate'
      },
      {
        id: 'db-q2',
        category: 'Database',
        question: 'Which ACID property ensures that once a transaction has committed, its changes will survive crashes and power failures?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctIndex: 3,
        explanation: 'Durability guarantees that the effects of committed transactions are recorded in persistent storage (e.g. via Write-Ahead Logging / WAL) and survive system crashes.',
        difficulty: 'Beginner'
      },
      {
        id: 'db-q3',
        category: 'Database',
        question: 'What is the primary difference between a clustered and non-clustered index in relational databases?',
        options: [
          'Clustered indexes are slower for range queries',
          'A clustered index physically determines the order of data storage on disk; only one clustered index can exist per table',
          'Non-clustered indexes cannot have duplicate values',
          'Clustered indexes are stored exclusively in RAM'
        ],
        correctIndex: 1,
        explanation: 'The clustered index defines the physical order of table rows on disk. Hence, a table can possess only one clustered index (usually the Primary Key).',
        difficulty: 'Intermediate'
      },
      {
        id: 'db-q4',
        category: 'Database',
        question: 'In PostgreSQL, what command generates the query execution plan with actual runtime duration and node timings?',
        options: ['SHOW QUERY PLAN', 'EXPLAIN ANALYZE <sql_query>', 'OPTIMIZE TABLE', 'TRACE QUERY'],
        correctIndex: 1,
        explanation: 'EXPLAIN ANALYZE executes the SQL statement, measures actual execution time, rows returned per node, and memory/buffer hits vs optimizer cost estimates.',
        difficulty: 'Intermediate'
      },
      {
        id: 'db-q5',
        category: 'Database',
        question: 'Which SQL isolation level prevents Phantom Reads by using range locks or snapshot serializability?',
        options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read / Serializable', 'Non-locking mode'],
        correctIndex: 2,
        explanation: 'Serializable (and Repeatable Read in Postgres MVCC) prevents phantom reads where a concurrent transaction inserts new rows matching a range predicate.',
        difficulty: 'Advanced'
      }
    ]
  },
  {
    id: 'cat-web-react',
    title: 'React 18 & Web Architecture',
    type: 'technical',
    subCategory: 'Web Development',
    description: 'Test virtual DOM reconciliation, hooks, dependency arrays, state management, and web security (CORS, CSRF, XSS).',
    iconName: 'Globe',
    questionCount: 5,
    durationMinutes: 10,
    difficulty: 'Intermediate',
    passingScore: 70,
    questions: [
      {
        id: 'web-q1',
        category: 'Web Development',
        question: 'What is the core reason for declaring exhaustive primitive dependencies in the React useEffect dependency array?',
        options: [
          'To force garbage collection of previous states',
          'To prevent stale closures from accessing outdated component state or props across renders',
          'Because React throws a compile-time syntax error otherwise',
          'To execute the effect on every single frame render'
        ],
        correctIndex: 1,
        explanation: 'Missing dependencies create stale closures where the effect callback captures outdated variable values from previous render scopes.',
        difficulty: 'Intermediate'
      },
      {
        id: 'web-q2',
        category: 'Web Development',
        question: 'What HTTP header protects modern web applications from Clickjacking attacks inside unauthorized iframes?',
        options: ['X-Frame-Options: DENY or Content-Security-Policy: frame-ancestors', 'Access-Control-Allow-Origin', 'X-XSS-Protection', 'Strict-Transport-Security'],
        correctIndex: 0,
        explanation: 'X-Frame-Options and Content-Security-Policy (frame-ancestors) dictate whether a browser is permitted to render a webpage inside <frame>, <iframe>, or <object>.',
        difficulty: 'Intermediate'
      },
      {
        id: 'web-q3',
        category: 'Web Development',
        question: 'In React 18, what hook is used to defer non-urgent UI updates to keep the user interface responsive during heavy computations?',
        options: ['useImperativeHandle', 'useDeferredValue / useTransition', 'useLayoutEffect', 'useDebugValue'],
        correctIndex: 1,
        explanation: 'useTransition and useDeferredValue mark state updates as non-blocking transitions, allowing higher-priority user input (like typing or clicks) to interrupt rendering.',
        difficulty: 'Advanced'
      },
      {
        id: 'web-q4',
        category: 'Web Development',
        question: 'What cookie flag prevents client-side JavaScript from reading sensitive authentication session tokens (mitigating XSS theft)?',
        options: ['SameSite=Strict', 'HttpOnly', 'Secure', 'Domain=.domain.com'],
        correctIndex: 1,
        explanation: 'The HttpOnly flag ensures that cookies cannot be accessed through document.cookie by malicious JavaScript, protecting auth tokens against XSS exfiltration.',
        difficulty: 'Beginner'
      },
      {
        id: 'web-q5',
        category: 'Web Development',
        question: 'How does React’s reconciliation algorithm (Fiber) identify which array items have changed, been added, or been removed?',
        options: ['By deep object equality comparison (===)', 'Through the unique, stable "key" prop assigned to each list item', 'By inspecting the DOM node classNames', 'By running binary search on child nodes'],
        correctIndex: 1,
        explanation: 'Stable and unique keys allow React Fiber to match children across renders without unmounting and recreating DOM elements unnecessarily.',
        difficulty: 'Beginner'
      }
    ]
  },
  {
    id: 'cat-soft-comm',
    title: 'Professional Communication & Team Dynamics',
    type: 'soft',
    subCategory: 'Communication',
    description: 'Evaluate engineering collaboration, conflict resolution, technical presentations, and stakeholder communication.',
    iconName: 'MessageSquare',
    questionCount: 5,
    durationMinutes: 8,
    difficulty: 'Intermediate',
    passingScore: 70,
    questions: [
      {
        id: 'soft-q1',
        category: 'Communication',
        question: 'During a peer code review, a teammate leaves a comment rejecting your PR approach. What is the most productive professional response?',
        options: [
          'Merge the code anyway because you are the author',
          'Ask clarifying questions to understand their architectural concerns, evaluate trade-offs objectively, and propose a concise RFC or sync if needed',
          'Complain to the Engineering Director immediately',
          'Refuse to review their future pull requests in retaliation'
        ],
        correctIndex: 1,
        explanation: 'Constructive engineering communication centers on objective trade-off evaluation, clarifying requirements, and respectful technical dialogue.',
        difficulty: 'Beginner'
      },
      {
        id: 'soft-q2',
        category: 'Communication',
        question: 'You notice you will miss a sprint project deadline due to unexpected technical debt in a legacy service. When should you communicate this to your team?',
        options: [
          'At the very last minute during sprint retro',
          'As soon as the risk is identified, providing current status, root cause, estimated delay, and potential mitigation options',
          'Keep working silently through the night and hope no one notices',
          'Blame the previous author of the legacy code publicly'
        ],
        correctIndex: 1,
        explanation: 'Proactive early communication allows teams and managers to re-prioritize deliverables, allocate support, and manage stakeholder expectations safely.',
        difficulty: 'Beginner'
      },
      {
        id: 'soft-q3',
        category: 'Communication',
        question: 'When presenting a complex technical architecture proposal to non-technical business stakeholders, what is the best practice?',
        options: [
          'Focus on business value, user impact, ROI, timelines, and risks while abstracting low-level code implementation details',
          'Read raw SQL queries and C++ compiler flags aloud to show technical depth',
          'Refuse to meet with them because they do not write code',
          'Use heavy developer jargon without contextual analogies'
        ],
        correctIndex: 0,
        explanation: 'Tailoring communication to your audience by framing engineering outcomes in terms of user experience, speed, reliability, and business impact builds alignment.',
        difficulty: 'Intermediate'
      },
      {
        id: 'soft-q4',
        category: 'Teamwork',
        question: 'In an Agile Scrum retrospective, a production outage is analyzed. What mindset defines high-performing engineering cultures?',
        options: [
          'Finding who made the mistake and publicly reprimanding them',
          'Blameless Post-Mortem: focusing on system vulnerabilities, test gaps, automated guardrails, and process improvements',
          'Deleting the incident log so clients do not see it',
          'Banning code deployments forever'
        ],
        correctIndex: 1,
        explanation: 'Blameless post-mortems assume human error is a symptom of system design flaws, focusing on creating automated guardrails to prevent recurrence.',
        difficulty: 'Intermediate'
      },
      {
        id: 'soft-q5',
        category: 'Leadership',
        question: 'A junior engineer joins your squad and is struggling with local environment setup. How should you demonstrate engineering ownership?',
        options: [
          'Tell them to search Google and leave them alone',
          'Pair-program with them for 20 minutes, unblock their Docker environment, and update the repository README documentation to help future onboarding engineers',
          'Write their code for them throughout the entire quarter',
          'Report their slow onboarding speed to the manager'
        ],
        correctIndex: 1,
        explanation: 'Empowering teammates through collaborative pairing while improving foundational documentation creates compounding team velocity.',
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    id: 'cat-aptitude',
    title: 'Aptitude & Quantitative Problem Solving',
    type: 'aptitude',
    subCategory: 'Problem Solving',
    description: 'Assess analytical speed, permutation/probability, data interpretation, and logical pattern deduction.',
    iconName: 'Sparkles',
    questionCount: 4,
    durationMinutes: 8,
    difficulty: 'Intermediate',
    passingScore: 75,
    questions: [
      {
        id: 'apt-q1',
        category: 'Problem Solving',
        question: 'A distributed server cluster can process 1,200 requests per minute with 4 worker nodes. If traffic surges to 4,500 requests per minute, how many total identical worker nodes are needed?',
        options: ['12 nodes', '15 nodes', '16 nodes', '18 nodes'],
        correctIndex: 1,
        explanation: 'Each worker node processes 1200 / 4 = 300 req/min. For 4500 req/min, required nodes = 4500 / 300 = 15 worker nodes.',
        difficulty: 'Beginner'
      },
      {
        id: 'apt-q2',
        category: 'Problem Solving',
        question: 'In a lottery of 50 unique tickets numbered 1 to 50, what is the probability that a randomly drawn ticket is a multiple of either 4 or 6?',
        options: ['16/50 (32%)', '19/50 (38%)', '20/50 (40%)', '24/50 (48%)'],
        correctIndex: 0,
        explanation: 'Multiples of 4 = floor(50/4) = 12. Multiples of 6 = floor(50/6) = 8. Multiples of both (LCM 12) = floor(50/12) = 4. Total = 12 + 8 - 4 = 16 tickets. Probability = 16/50 = 32%.',
        difficulty: 'Intermediate'
      },
      {
        id: 'apt-q3',
        category: 'Problem Solving',
        question: 'If Pipe A fills a data buffer in 6 milliseconds and Pipe B drains it in 8 milliseconds, how long does it take to fill the buffer when both operate simultaneously?',
        options: ['14 ms', '24 ms', '48 ms', '12 ms'],
        correctIndex: 1,
        explanation: 'Net fill rate per ms = (1/6) - (1/8) = (4 - 3)/24 = 1/24. Therefore, it takes 24 milliseconds to fill the buffer.',
        difficulty: 'Intermediate'
      },
      {
        id: 'apt-q4',
        category: 'Problem Solving',
        question: 'Find the next number in the sequence: 3, 7, 15, 31, 63, ?',
        options: ['125', '127', '128', '129'],
        correctIndex: 1,
        explanation: 'Pattern is 2^(n+1) - 1 or (previous * 2) + 1. Next number = (63 * 2) + 1 = 127.',
        difficulty: 'Beginner'
      }
    ]
  }
];

// ==========================================
// 10. ASSESSMENT RESULTS HISTORY
// ==========================================
export const INITIAL_ASSESSMENT_RESULTS: AssessmentResult[] = [
  {
    id: 'res-1',
    assessmentId: 'cat-prog-python',
    assessmentTitle: 'Python Core & Advanced Programming',
    category: 'Technical',
    date: '2026-08-15',
    score: 94,
    totalQuestions: 6,
    correctAnswers: 6,
    incorrectAnswers: 0,
    timeSpentSeconds: 380,
    passed: true,
    answers: []
  },
  {
    id: 'res-2',
    assessmentId: 'cat-db-sql',
    assessmentTitle: 'Database Systems & SQL Optimization',
    category: 'Technical',
    date: '2026-08-18',
    score: 86,
    totalQuestions: 5,
    correctAnswers: 4,
    incorrectAnswers: 1,
    timeSpentSeconds: 420,
    passed: true,
    answers: []
  },
  {
    id: 'res-3',
    assessmentId: 'cat-web-react',
    assessmentTitle: 'React 18 & Web Architecture',
    category: 'Technical',
    date: '2026-08-10',
    score: 74,
    totalQuestions: 5,
    correctAnswers: 4,
    incorrectAnswers: 1,
    timeSpentSeconds: 460,
    passed: true,
    answers: []
  }
];
