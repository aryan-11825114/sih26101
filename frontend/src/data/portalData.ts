import { 
  SkillItem, 
  AssessmentCategory, 
  AssessmentResult, 
  SkillGapItem, 
  JobOpportunity, 
  ApplicationItem, 
  LearningCourse, 
  ProjectItem, 
  CertificationItem, 
  AchievementItem, 
  MentorSession,
  StudentProfile 
} from '../types';

export const INITIAL_SKILLS: SkillItem[] = [
  {
    id: 'sk_communication',
    name: 'Technical Communication',
    category: 'soft',
    subCategory: 'Professional Skills',
    level: 4,
    maxLevel: 5,
    score: 79,
    requiredLevel: 4,
    verified: true,
    assessmentScore: 80,
    lastAssessed: 'Aug 2026',
    trend: 'up'
  },
  {
    id: 'sk_problem_solving',
    name: 'Analytical Problem Solving',
    category: 'soft',
    subCategory: 'Cognitive',
    level: 5,
    maxLevel: 5,
    score: 90,
    requiredLevel: 4,
    verified: true,
    assessmentScore: 92,
    lastAssessed: 'Aug 2026',
    trend: 'up'
  },
  {
    id: 'sk_teamwork',
    name: 'Agile Team Collaboration',
    category: 'soft',
    subCategory: 'Collaboration',
    level: 4,
    maxLevel: 5,
    score: 82,
    requiredLevel: 4,
    verified: false,
    assessmentScore: 84,
    lastAssessed: 'Jul 2026',
    trend: 'stable'
  },
  {
    id: 'sk_time_mgmt',
    name: 'Time & Sprint Management',
    category: 'soft',
    subCategory: 'Execution',
    level: 3,
    maxLevel: 5,
    score: 72,
    requiredLevel: 4,
    verified: false,
    assessmentScore: 70,
    lastAssessed: 'Jun 2026',
    trend: 'up'
  }
];

export const INITIAL_ASSESSMENTS: AssessmentCategory[] = [
  {
    id: 'as_dsa',
    title: 'Data Structures & Algorithms Diagnostic',
    type: 'technical',
    subCategory: 'Problem Solving',
    description: 'Evaluate time complexity, dynamic programming, tree traversals, and optimal graph searches.',
    iconName: 'Binary',
    questionCount: 5,
    durationMinutes: 15,
    difficulty: 'Intermediate',
    passingScore: 70,
    questions: [
      {
        id: 'dsa_q1',
        category: 'DSA',
        question: 'What is the average and worst-case time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black)?',
        options: [
          'Average: O(1), Worst: O(N)',
          'Average: O(log N), Worst: O(log N)',
          'Average: O(log N), Worst: O(N)',
          'Average: O(N log N), Worst: O(N^2)'
        ],
        correctIndex: 1,
        explanation: 'Because AVL and Red-Black trees self-balance upon insertion/deletion, the height is guaranteed to remain O(log N), keeping lookup in O(log N) worst case.',
        difficulty: 'Intermediate'
      },
      {
        id: 'dsa_q2',
        category: 'DSA',
        question: 'Which algorithmic paradigm does Floyd-Warshall for all-pairs shortest paths utilize?',
        options: [
          'Greedy Algorithm',
          'Divide and Conquer',
          'Dynamic Programming',
          'Backtracking with Branch & Bound'
        ],
        correctIndex: 2,
        explanation: 'Floyd-Warshall computes shortest paths between all pairs using dynamic programming via the recurrence dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).',
        difficulty: 'Intermediate'
      },
      {
        id: 'dsa_q3',
        category: 'DSA',
        question: 'In JavaScript / Node.js, what is the amortized complexity of array.push() vs array.unshift()?',
        options: [
          'push is O(1) amortized; unshift is O(N) because elements are shifted.',
          'Both are O(1) amortized.',
          'push is O(N); unshift is O(1).',
          'Both are O(N) due to memory reallocation.'
        ],
        correctIndex: 0,
        explanation: 'Appending to the end of a dynamic array has O(1) amortized cost. Prepending (unshift) requires shifting all existing indices by 1, taking O(N) operations.',
        difficulty: 'Beginner'
      },
      {
        id: 'dsa_q4',
        category: 'DSA',
        question: 'Which data structure is optimal for implementing a Least Recently Used (LRU) Cache with O(1) get and put operations?',
        options: [
          'Binary Heap + Array',
          'Doubly Linked List + Hash Map',
          'Singly Linked List + Binary Search Tree',
          'Two Stacks + Queue'
        ],
        correctIndex: 1,
        explanation: 'The Hash Map provides O(1) key lookup to the node, and the Doubly Linked List enables O(1) removal and re-insertion at the head of the cache.',
        difficulty: 'Advanced'
      },
      {
        id: 'dsa_q5',
        category: 'DSA',
        question: 'When finding cycle detection in a directed graph, which algorithm is most appropriate?',
        options: [
          'Kruskal Algorithm',
          'DFS with 3-color state tracking (White, Gray, Black)',
          'Dijkstra Shortest Path',
          'Binary Search on Adjacency Matrix'
        ],
        correctIndex: 1,
        explanation: 'DFS with color state (White: unvisited, Gray: currently on recursion stack, Black: finished) reliably detects back-edges which represent cycles in directed graphs.',
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    id: 'as_db',
    title: 'Database Systems & PostgreSQL Mastery',
    type: 'technical',
    subCategory: 'Database Systems',
    description: 'Test knowledge of indexes, connection pooling, ACID transaction isolation, and query optimization.',
    iconName: 'Database',
    questionCount: 5,
    durationMinutes: 12,
    difficulty: 'Intermediate',
    passingScore: 75,
    questions: [
      {
        id: 'db_q1',
        category: 'Database',
        question: 'Why should large production B-Tree indexes in PostgreSQL be created using CREATE INDEX CONCURRENTLY?',
        codeSnippet: 'CREATE INDEX CONCURRENTLY idx_users_email ON users(email);',
        options: [
          'It runs 10x faster than standard CREATE INDEX.',
          'It prevents acquiring an exclusive table write lock (ShareLock), keeping production reads and writes unblocked.',
          'It automatically compresses table disk space by 50%.',
          'It enables automated replication across secondary read replicas.'
        ],
        correctIndex: 1,
        explanation: 'Standard CREATE INDEX locks the table against writes (INSERT, UPDATE, DELETE). The CONCURRENTLY flag builds the index in multiple passes without blocking ongoing write traffic.',
        difficulty: 'Intermediate'
      },
      {
        id: 'db_q2',
        category: 'Database',
        question: 'Which PostgreSQL transaction isolation level prevents both Non-Repeatable Reads AND Phantom Reads?',
        options: [
          'Read Uncommitted',
          'Read Committed',
          'Repeatable Read (in PostgreSQL MVCC) / Serializable',
          'None of the above'
        ],
        correctIndex: 2,
        explanation: 'PostgreSQL implements Repeatable Read using snapshot isolation which avoids phantom reads. Serializable provides full serializability anomaly prevention.',
        difficulty: 'Advanced'
      },
      {
        id: 'db_q3',
        category: 'Database',
        question: 'What is the primary risk of not configuring a connection pooler like PgBouncer or mysql2 Pool in microservices?',
        options: [
          'High memory consumption and backend process exhaustion due to fork-per-connection overhead.',
          'Database indexes get corrupted automatically.',
          'SQL queries lose ACID guarantees.',
          'Foreign key constraints get bypassed.'
        ],
        correctIndex: 0,
        explanation: 'Each raw backend connection consumes dedicated process memory (typically 5-10MB in PostgreSQL). Without pooling, burst traffic can crash the DB via process/RAM starvation.',
        difficulty: 'Intermediate'
      },
      {
        id: 'db_q4',
        category: 'Database',
        question: 'When optimizing a slow query with EXPLAIN ANALYZE, what does "Seq Scan" on a 5M-row table indicate?',
        options: [
          'The query is using hardware acceleration.',
          'The query planner read the entire table row-by-row because no usable index matched the WHERE filter.',
          'The query executed inside CPU L1 cache.',
          'The table is correctly indexed for binary search.'
        ],
        correctIndex: 1,
        explanation: 'Sequential Scan (Seq Scan) means the database must read all disk pages. Adding an appropriate composite or B-tree index converts this to an Index Scan or Bitmap Heap Scan.',
        difficulty: 'Beginner'
      },
      {
        id: 'db_q5',
        category: 'Database',
        question: 'What is the difference between a Clustered Index and Non-Clustered Index?',
        options: [
          'Clustered indexes dictate the physical sorting order of data rows on disk; non-clustered index stores pointers to rows.',
          'Clustered indexes only work on strings; non-clustered only work on integers.',
          'A table can have 10 clustered indexes but only 1 non-clustered index.',
          'Clustered indexes cannot be used for range queries.'
        ],
        correctIndex: 0,
        explanation: 'Because data rows can only be sorted physically in one order on disk, each table can only have one clustered index (often primary key).',
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    id: 'as_cloud',
    title: 'Cloud Architecture & AWS Foundations',
    type: 'technical',
    subCategory: 'Cloud & DevOps',
    description: 'Assess serverless computing, S3 security policies, VPC networking, and containerized deployments.',
    iconName: 'Cloud',
    questionCount: 4,
    durationMinutes: 10,
    difficulty: 'Intermediate',
    passingScore: 70,
    questions: [
      {
        id: 'cld_q1',
        category: 'Cloud',
        question: 'How do you ensure an AWS Lambda function in a private VPC subnet can access both an RDS database and public external APIs?',
        options: [
          'Attach an IAM Administrator role to Lambda.',
          'Attach the Lambda to private subnets with routes to a NAT Gateway in a public subnet having an Internet Gateway.',
          'Open security group inbound port 0.0.0.0/0 on Lambda.',
          'Lambdas in VPC cannot access external APIs under any circumstances.'
        ],
        correctIndex: 1,
        explanation: 'VPC-enabled Lambdas do not have public IPs. Outbound internet traffic must route through a NAT Gateway located in a public subnet with an attached Internet Gateway.',
        difficulty: 'Advanced'
      },
      {
        id: 'cld_q2',
        category: 'Cloud',
        question: 'Which AWS storage class offers millisecond retrieval latency with 99.999999999% (11 9s) durability for active files?',
        options: [
          'Amazon S3 Standard',
          'Amazon S3 Glacier Flexible',
          'Amazon EBS Cold HDD (sc1)',
          'Amazon S3 Deep Archive'
        ],
        correctIndex: 0,
        explanation: 'S3 Standard provides high-throughput, low-latency access across multiple availability zones with 11 9s data durability.',
        difficulty: 'Beginner'
      },
      {
        id: 'cld_q3',
        category: 'Cloud',
        question: 'What is the purpose of an Application Load Balancer (ALB) Path-Based Routing rule in microservices?',
        options: [
          'To encrypt local disk partitions.',
          'To direct traffic to different Target Groups (e.g. /api/users to UserService, /api/orders to OrderService).',
          'To compile TypeScript code on the fly.',
          'To automatically renew SSL certificates.'
        ],
        correctIndex: 1,
        explanation: 'ALB Layer 7 routing evaluates URL paths and headers to route client requests directly to target microservice containers or EC2 auto-scaling groups.',
        difficulty: 'Intermediate'
      },
      {
        id: 'cld_q4',
        category: 'Cloud',
        question: 'In Docker, why is multi-stage building recommended for Node.js and React production images?',
        options: [
          'It compiles the code twice for double redundancy.',
          'It eliminates devDependencies and compiler toolchains from the final image, drastically reducing image size and attack surface.',
          'It allows running Docker without root permissions.',
          'It converts JavaScript into WebAssembly automatically.'
        ],
        correctIndex: 1,
        explanation: 'Multi-stage builds leave behind node_modules dev dependencies, TypeScript compilers, and build caches, producing ultra-lightweight and secure runtime images (e.g., 50MB instead of 800MB).',
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    id: 'as_soft_comm',
    title: 'Technical Communication & Workplace Collaboration',
    type: 'soft',
    subCategory: 'Professional Skills',
    description: 'Evaluate technical documentation, cross-functional sprint communication, and conflict resolution.',
    iconName: 'MessageSquare',
    questionCount: 4,
    durationMinutes: 8,
    difficulty: 'Beginner',
    passingScore: 75,
    questions: [
      {
        id: 'comm_q1',
        category: 'Communication',
        question: 'When submitting a complex Pull Request (PR) affecting critical database schema, what is the best practice?',
        options: [
          'Merge directly to main and notify the team if an issue occurs.',
          'Provide a clear description with problem context, architectural approach, migration plan, rollback strategy, and test evidence.',
          'Send a 1-sentence Slack message asking "Please review my PR".',
          'Post the raw 2,000 line git diff on Discord.'
        ],
        correctIndex: 1,
        explanation: 'High-performing engineering teams communicate change intent clearly with rollback strategies and verification proofs, minimizing deployment risk.',
        difficulty: 'Beginner'
      },
      {
        id: 'comm_q2',
        category: 'Communication',
        question: 'A critical production bug is traced to code you wrote yesterday. What is the most effective professional response?',
        options: [
          'Blame the QA team for not catching it during regression testing.',
          'Silently push a commit and pretend nothing happened.',
          'Acknowledge the incident immediately, coordinate with the on-call engineer to mitigate user impact, investigate the root cause, and write a blameless post-mortem.',
          'Turn off notifications until your shift starts.'
        ],
        correctIndex: 2,
        explanation: 'Blameless post-mortems and rapid ownership build immense trust across engineering organizations and prevent repeat failures.',
        difficulty: 'Beginner'
      },
      {
        id: 'comm_q3',
        category: 'Communication',
        question: 'How should an engineer communicate technical debt to non-technical business product managers?',
        options: [
          'Use heavy jargon like "monadic morphisms" to intimidate them.',
          'Frame technical debt in terms of business impact: feature delivery velocity, system downtime risk, and customer latency.',
          'Refuse to build new features until everything is rewritten.',
          'Ignore tech debt entirely.'
        ],
        correctIndex: 1,
        explanation: 'Translating technical debt into business outcomes (risk, speed, maintenance cost) creates shared alignment and resource allocation.',
        difficulty: 'Intermediate'
      },
      {
        id: 'comm_q4',
        category: 'Communication',
        question: 'During a sprint retrospective, a team member consistently misses deadlines. How should this be addressed?',
        options: [
          'Publicly shame them in the general channel.',
          'Have a constructive, private 1-on-1 to understand blockers (unclear requirements, dependencies) and collaboratively adjust estimations.',
          'Assign all their tasks to someone else without speaking to them.',
          'Ignore it because delivery is solely the manager problem.'
        ],
        correctIndex: 1,
        explanation: 'Empathy-driven 1-on-1s identify systemic root causes (underestimated scope, external blockers) without eroding team psychological safety.',
        difficulty: 'Beginner'
      }
    ]
  }
];

export const INITIAL_SKILL_GAPS: SkillGapItem[] = [
  {
    skill: 'AWS & Cloud Architecture',
    category: 'technical',
    currentLevel: 2,
    requiredLevel: 4,
    currentScore: 52,
    requiredScore: 80,
    gapStatus: 'Critical Gap',
    impactOnPlacement: 'High',
    recommendedCourses: [
      { title: 'AWS Cloud Practitioner & Serverless Microservices', provider: 'Ladder Hub', duration: '6 hrs' },
      { title: 'Docker & Kubernetes for Distributed Backend', provider: 'Cloud Native Foundation', duration: '8 hrs' }
    ],
    recommendedCertifications: ['AWS Certified Solutions Architect Associate', 'CKAD (Kubernetes Developer)'],
    recommendedMentorTopic: 'AWS VPC Networking, IAM Security, & Serverless Best Practices',
    recommendedProject: 'Deploy a multi-tier containerized app on AWS ECS with auto-scaling and ALB'
  },
  {
    skill: 'Data Structures & Algorithms',
    category: 'technical',
    currentLevel: 3,
    requiredLevel: 5,
    currentScore: 68,
    requiredScore: 88,
    gapStatus: 'Moderate Gap',
    impactOnPlacement: 'High',
    recommendedCourses: [
      { title: 'Advanced Graph Theory & Dynamic Programming', provider: 'Ladder Algorithms Lab', duration: '10 hrs' }
    ],
    recommendedCertifications: ['HackerRank Problem Solving (Gold)', 'LeetCode 300+ Solved Badge'],
    recommendedMentorTopic: 'Mock Technical Interview: Tree Traversals & Optimal Graph Searches',
    recommendedProject: 'Implement an in-memory high-throughput LRU Cache with concurrency locks'
  },
  {
    skill: 'System Design & High Availability',
    category: 'technical',
    currentLevel: 2,
    requiredLevel: 4,
    currentScore: 58,
    requiredScore: 78,
    gapStatus: 'Moderate Gap',
    impactOnPlacement: 'High',
    recommendedCourses: [
      { title: 'Distributed Systems: Rate Limiting & Message Queues', provider: 'Ladder System Labs', duration: '7 hrs' }
    ],
    recommendedCertifications: ['Ladder Distributed Systems Certificate'],
    recommendedMentorTopic: 'Architecting 100k RPS Rate Limiter with Redis & RabbitMQ',
    recommendedProject: 'Build an event-driven notification engine with Kafka and Node.js'
  },
  {
    skill: 'React.js & TypeScript',
    category: 'technical',
    currentLevel: 3,
    requiredLevel: 4,
    currentScore: 74,
    requiredScore: 82,
    gapStatus: 'Minor Gap',
    impactOnPlacement: 'Medium',
    recommendedCourses: [
      { title: 'React 18 Concurrent Features & Custom Hook Design', provider: 'Frontend Masters', duration: '5 hrs' }
    ],
    recommendedCertifications: ['Meta Certified Front-End Developer'],
    recommendedMentorTopic: 'State Management Optimization: Zustand vs Context vs Signals',
    recommendedProject: 'Build a virtualized real-time analytics dashboard with React and WebSockets'
  },
  {
    skill: 'Time & Sprint Management',
    category: 'soft',
    currentLevel: 3,
    requiredLevel: 4,
    currentScore: 72,
    requiredScore: 80,
    gapStatus: 'Minor Gap',
    impactOnPlacement: 'Medium',
    recommendedCourses: [
      { title: 'Agile Scrum Master & Jira Sprint Estimation', provider: 'Scrum Alliance', duration: '3 hrs' }
    ],
    recommendedCertifications: ['Certified ScrumMaster (CSM)'],
    recommendedMentorTopic: 'Estimation Best Practices & Overcoming Scope Creep',
    recommendedProject: 'Lead a 2-week sprint for a student open-source initiative'
  }
];

export const INITIAL_JOBS: JobOpportunity[] = [
  {
    id: 'job_tcs_digital',
    company: 'Tata Consultancy Services',
    title: 'Digital Systems Engineer (Tier-1 Placement)',
    location: 'Noida / Gurgaon, India',
    workMode: 'Hybrid',
    opportunityType: 'Full-Time',
    stipendOrSalary: '₹9.0 – ₹11.5 LPA',
    requiredSkills: ['Python', 'PostgreSQL & SQL', 'Node.js & Express', 'Data Structures & Algorithms'],
    preferredSkills: ['AWS & Cloud Architecture', 'Docker & Microservices'],
    eligibility: 'B.Tech / MCA (Batch 2025-29), Min 65% aggregate, Zero active backlogs',
    applicationDeadline: 'Sep 30, 2026',
    description: 'Join the TCS Enterprise Cloud Innovation Unit building high-throughput banking systems and enterprise APIs for global Fortune 500 financial clients.',
    responsibilities: [
      'Architect robust REST and gRPC backend microservices in Node.js and Python.',
      'Optimize complex PostgreSQL database queries and connection pooling.',
      'Participate in agile sprint ceremonies and lead technical design reviews.'
    ],
    openingsCount: 45,
    postedDate: 'Aug 24, 2026',
    featured: true
  },
  {
    id: 'job_infosys_fullstack',
    company: 'Infosys Springboard Partner',
    title: 'Full Stack Software Engineer Intern & PPO',
    location: 'Bengaluru / Remote, India',
    workMode: 'Remote',
    opportunityType: 'Internship',
    duration: '6 Months (Pre-Placement Offer)',
    stipendOrSalary: '₹40,000 / mo + ₹12 LPA PPO',
    requiredSkills: ['React.js & TypeScript', 'Node.js & Express', 'PostgreSQL & SQL'],
    preferredSkills: ['AWS & Cloud Architecture', 'System Design & High Availability'],
    eligibility: 'CSIT / IT / ECE with minimum Level 3 Ladder Passport Verified Rating',
    applicationDeadline: 'Oct 15, 2026',
    description: 'Build modern customer-facing web applications and distributed state engines with enterprise micro-frontends.',
    responsibilities: [
      'Develop scalable UI components in React and TypeScript.',
      'Design clean OpenAPI 3.0 backend endpoints with JWT authentication.',
      'Collaborate with industry mentors on code quality and unit test coverage.'
    ],
    openingsCount: 30,
    postedDate: 'Aug 26, 2026',
    featured: true
  },
  {
    id: 'job_cloudsphere_backend',
    company: 'CloudSphere Systems',
    title: 'Backend Microservices Associate',
    location: 'Hyderabad, India',
    workMode: 'Hybrid',
    opportunityType: 'Full-Time',
    stipendOrSalary: '₹14.0 – ₹18.0 LPA',
    requiredSkills: ['Python', 'Docker & Microservices', 'PostgreSQL & SQL', 'AWS & Cloud Architecture'],
    preferredSkills: ['System Design & High Availability', 'Data Structures & Algorithms'],
    eligibility: 'Demonstrated proof-of-work in containerized deployments or verified Micro-Gig score > 75%',
    applicationDeadline: 'Oct 05, 2026',
    description: 'Work directly on distributed cloud infrastructure orchestration tools handling over 2M requests/sec.',
    responsibilities: [
      'Build containerized Go/Node.js microservices with Docker and Kubernetes.',
      'Implement resilient caching with Redis and message brokers with Kafka.',
      'Monitor distributed tracing using OpenTelemetry and Prometheus.'
    ],
    openingsCount: 12,
    postedDate: 'Aug 28, 2026',
    featured: false
  },
  {
    id: 'job_razorpay_intern',
    company: 'Razorpay Financial Tech',
    title: 'Fintech Backend & Security Engineering Intern',
    location: 'Bengaluru, India',
    workMode: 'On-site',
    opportunityType: 'Internship',
    duration: '6 Months',
    stipendOrSalary: '₹55,000 / mo + ₹22 LPA PPO',
    requiredSkills: ['Python', 'Data Structures & Algorithms', 'PostgreSQL & SQL'],
    preferredSkills: ['System Design & High Availability', 'Docker & Microservices'],
    eligibility: 'Top 10% in Ladder DSA diagnostic assessment and zero disciplinary remarks',
    applicationDeadline: 'Sep 20, 2026',
    description: 'Engineering the next generation of seamless payment rails, fraud prevention engines, and settlement gateways.',
    responsibilities: [
      'Write ultra-reliable financial transaction handlers with idempotent execution.',
      'Implement zero-trust API security and JWT token blacklisting with Redis.',
      'Audit high-traffic SQL indexes for sub-10ms query execution.'
    ],
    openingsCount: 8,
    postedDate: 'Aug 29, 2026',
    featured: true
  },
  {
    id: 'job_wipro_cloud',
    company: 'Wipro Digital Next',
    title: 'Cloud DevOps Associate',
    location: 'Pune / Chennai, India',
    workMode: 'Hybrid',
    opportunityType: 'Full-Time',
    stipendOrSalary: '₹8.5 – ₹10.5 LPA',
    requiredSkills: ['AWS & Cloud Architecture', 'Docker & Microservices', 'Python'],
    preferredSkills: ['PostgreSQL & SQL'],
    eligibility: 'B.Tech CSIT (2025-29) with verified AWS or Linux foundational badge',
    applicationDeadline: 'Nov 01, 2026',
    description: 'Automate enterprise CI/CD pipelines, Terraform infrastructure-as-code, and cloud governance monitoring.',
    responsibilities: [
      'Design GitHub Actions workflows for automated linting and security scanning.',
      'Provision AWS VPC, EC2, and S3 resources via Terraform.',
      'Manage Kubernetes Helm charts and service meshes.'
    ],
    openingsCount: 20,
    postedDate: 'Aug 20, 2026',
    featured: false
  }
];

export const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'app_1',
    opportunityId: 'job_infosys_fullstack',
    opportunityTitle: 'Full Stack Software Engineer Intern & PPO',
    opportunityType: 'Internship',
    company: 'Infosys Springboard Partner',
    location: 'Bengaluru / Remote',
    workMode: 'Remote',
    stipendOrSalary: '₹40,000 / mo + ₹12 LPA PPO',
    status: 'Shortlisted',
    appliedDate: 'Aug 18, 2026',
    lastUpdated: 'Aug 27, 2026',
    deadline: 'Oct 15, 2026',
    matchScore: 88,
    timeline: [
      { status: 'Applied', date: 'Aug 18, 2026', note: 'Application submitted with verified Experience Passport records.', completed: true },
      { status: 'Under Review', date: 'Aug 22, 2026', note: 'Profile reviewed by Technical Recruiting Lead.', completed: true },
      { status: 'Shortlisted', date: 'Aug 27, 2026', note: 'Selected for Technical Screening round. HackerRank link scheduled.', completed: true },
      { status: 'Interview', date: 'Sep 05, 2026', note: '45-minute live coding with Senior Tech Lead.', completed: false },
      { status: 'Selected', date: 'Pending', note: 'Offer rollout & PPO contract onboarding.', completed: false }
    ],
    notes: 'Prepare React performance optimization and PostgreSQL query indexing topics.'
  },
  {
    id: 'app_2',
    opportunityId: 'job_tcs_digital',
    opportunityTitle: 'Digital Systems Engineer (Tier-1 Placement)',
    opportunityType: 'Job',
    company: 'Tata Consultancy Services',
    location: 'Noida / Gurgaon',
    workMode: 'Hybrid',
    stipendOrSalary: '₹9.0 – ₹11.5 LPA',
    status: 'Under Review',
    appliedDate: 'Aug 24, 2026',
    lastUpdated: 'Aug 25, 2026',
    deadline: 'Sep 30, 2026',
    matchScore: 92,
    timeline: [
      { status: 'Applied', date: 'Aug 24, 2026', note: 'Application submitted via University Placement Cell portal.', completed: true },
      { status: 'Under Review', date: 'Aug 25, 2026', note: 'Resume parsed and verified against academic CGPA criteria.', completed: true },
      { status: 'Shortlisted', date: 'Upcoming', note: 'TCS National Qualifier Test (NQT) slot assignment.', completed: false },
      { status: 'Interview', date: 'Pending', note: 'Technical & Managerial Discussion.', completed: false },
      { status: 'Selected', date: 'Pending', note: 'Digital Cadre Offer Letter.', completed: false }
    ],
    notes: 'Review Core CS fundamentals: OS paging, ACID properties, and DSA trees.'
  },
  {
    id: 'app_3',
    opportunityId: 'gig_express_auth',
    opportunityTitle: 'Zero-Leak JWT Token Blacklist Micro-Gig',
    opportunityType: 'Micro-Gig',
    company: 'CloudSphere Systems',
    location: 'Remote',
    workMode: 'Remote',
    stipendOrSalary: '₹2,500 Stipend',
    status: 'Selected',
    appliedDate: 'Aug 10, 2026',
    lastUpdated: 'Aug 14, 2026',
    deadline: 'Aug 15, 2026',
    matchScore: 95,
    timeline: [
      { status: 'Applied', date: 'Aug 10, 2026', note: 'Bidded on micro-task with proposed architecture diagram.', completed: true },
      { status: 'Under Review', date: 'Aug 11, 2026', note: 'Client reviewed sandbox code samples.', completed: true },
      { status: 'Shortlisted', date: 'Aug 12, 2026', note: 'Invited to submit PR.', completed: true },
      { status: 'Selected', date: 'Aug 14, 2026', note: 'Task verified 100%! Stipend released to wallet & Passport record minted.', completed: true }
    ],
    notes: 'Cryptographic proof hash stored in Experience Passport.'
  }
];

export const INITIAL_COURSES: LearningCourse[] = [
  {
    id: 'crs_aws_arch',
    title: 'AWS Cloud Practitioner & Serverless Architecture',
    provider: 'Ladder Cloud Academy',
    category: 'Cloud & DevOps',
    skillsCovered: ['AWS & Cloud Architecture', 'Docker & Microservices', 'Serverless'],
    level: 'Intermediate',
    duration: '6 Hours (12 Modules)',
    modulesCount: 12,
    completedModules: 4,
    progressPercent: 33,
    status: 'In Progress',
    targetSkillGap: 'AWS & Cloud Architecture',
    recommendationReason: 'Your Cloud proficiency (L2) is currently below industry tier-1 requirement (L4).',
    rating: 4.9,
    enrolledDate: 'Aug 20, 2026'
  },
  {
    id: 'crs_dsa_graphs',
    title: 'Mastering Advanced Graphs, Trees, & Dynamic Programming',
    provider: 'Ladder Algorithms Lab',
    category: 'Problem Solving',
    skillsCovered: ['Data Structures & Algorithms', 'Analytical Problem Solving'],
    level: 'Advanced',
    duration: '10 Hours (18 Modules)',
    modulesCount: 18,
    completedModules: 11,
    progressPercent: 61,
    status: 'In Progress',
    targetSkillGap: 'Data Structures & Algorithms',
    recommendationReason: 'Targeted to boost placement readiness score from 68% to 90% for FAANG/Tier-1 screening.',
    rating: 4.95,
    enrolledDate: 'Aug 15, 2026'
  },
  {
    id: 'crs_sys_design',
    title: 'Distributed Systems & High-Availability Architecture',
    provider: 'Enterprise System Labs',
    category: 'Architecture',
    skillsCovered: ['System Design & High Availability', 'Docker & Microservices'],
    level: 'Intermediate',
    duration: '8 Hours (14 Modules)',
    modulesCount: 14,
    completedModules: 0,
    progressPercent: 0,
    status: 'Not Started',
    targetSkillGap: 'System Design & High Availability',
    recommendationReason: 'Crucial for passing Razorpay & CloudSphere Systems architectural interview rounds.',
    rating: 4.85
  },
  {
    id: 'crs_postgres_perf',
    title: 'PostgreSQL Deep Dive: Query Optimization & Indexing',
    provider: 'Database Guild',
    category: 'Database Systems',
    skillsCovered: ['PostgreSQL & SQL', 'Performance Tuning'],
    level: 'Advanced',
    duration: '5 Hours (8 Modules)',
    modulesCount: 8,
    completedModules: 8,
    progressPercent: 100,
    status: 'Completed',
    recommendationReason: 'Completed with distinction. Minted into Digital Experience Passport.',
    rating: 4.92,
    enrolledDate: 'Jul 10, 2026'
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'prj_1',
    title: 'Distributed Rate Limiter & Token Bucket Gateway',
    type: 'Live Industry Challenge',
    company: 'CloudSphere Systems',
    industry: 'Cloud Infrastructure',
    description: 'Design and deploy a distributed rate limiting microservice in Node.js and Redis capable of handling 50,000 requests per minute with sliding window counters.',
    requiredSkills: ['Node.js & Express', 'System Design & High Availability', 'Docker & Microservices'],
    duration: '2 Weeks',
    teamSize: '1-3 Members',
    deadline: 'Sep 25, 2026',
    status: 'Open',
    bountyOrReward: '₹15,000 Bounty + Direct Interview',
    milestones: [
      { title: 'System Architecture Diagram & Redis schema design', completed: false },
      { title: 'Sliding Window Counter algorithm implementation', completed: false },
      { title: 'Docker Compose cluster testing under Apache Bench load', completed: false },
      { title: 'Final PR submission & live demo with sponsor engineers', completed: false }
    ]
  },
  {
    id: 'prj_2',
    title: 'Zero-Knowledge Credential Verifier for Campus Placements',
    type: 'Academic',
    description: 'Cryptographic student verification portal using SHA256 hashes and digital signatures to audit student resume claims against college transcript records.',
    requiredSkills: ['Python', 'PostgreSQL & SQL', 'React.js & TypeScript'],
    duration: '4 Weeks',
    teamSize: 'Individual',
    status: 'In Progress',
    githubRepo: 'https://github.com/adarshpratap/zk-credentials-vault',
    milestones: [
      { title: 'PostgreSQL Relational Schema & Row-Level Security', completed: true },
      { title: 'REST API with Express & JWT Auth', completed: true },
      { title: 'React Tailwind Dashboard with QR Code generator', completed: false }
    ]
  },
  {
    id: 'prj_3',
    title: 'High-Throughput E-Commerce SQL Database Architecture',
    type: 'Personal',
    description: 'Optimized PostgreSQL database supporting partitioned tables, composite indexing, and connection pooling for 10M synthetic order records.',
    requiredSkills: ['PostgreSQL & SQL', 'Python'],
    duration: '1 Week',
    teamSize: 'Individual',
    status: 'Completed',
    githubRepo: 'https://github.com/adarshpratap/sql-pool-optimizer',
    liveDemoUrl: 'https://pg-optimizer-demo.internal',
    milestones: [
      { title: 'Table partitioning by transaction timestamp', completed: true },
      { title: 'B-Tree & GIN full-text index creation', completed: true },
      { title: 'Benchmark report showing 92% latency reduction', completed: true }
    ]
  }
];

export const INITIAL_CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'cert_1',
    name: 'PostgreSQL Query Optimization & Database Architecture',
    issuer: 'Ladder Industry Ledger',
    issueDate: 'Aug 2026',
    credentialId: 'SB-PG-98234-ADARSH',
    credentialUrl: 'https://verify.skillbridge.ai/cert/SB-PG-98234',
    status: 'Verified',
    skillsVerified: ['PostgreSQL & SQL', 'Index Tuning', 'ACID Isolation'],
    badgeColor: 'emerald'
  },
  {
    id: 'cert_2',
    name: 'Python for Enterprise Backend Engineering',
    issuer: 'HackerRank Gold Certified',
    issueDate: 'Jul 2026',
    credentialId: 'HR-PY-GOLD-84291',
    credentialUrl: 'https://hackerrank.com/certificates/84291',
    status: 'Verified',
    skillsVerified: ['Python', 'Object-Oriented Design', 'AsyncIO'],
    badgeColor: 'indigo'
  },
  {
    id: 'cert_3',
    name: 'AWS Certified Cloud Practitioner (CLF-C02)',
    issuer: 'Amazon Web Services',
    issueDate: 'Pending Verification',
    credentialId: 'AWS-VERIF-IN-PROGRESS',
    status: 'Pending Verification',
    skillsVerified: ['AWS & Cloud Architecture', 'IAM Security', 'S3 & EC2'],
    badgeColor: 'amber'
  }
];

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach_1',
    title: '1st Place Winner - State Level Inter-College Hackathon',
    organization: 'UP Technical University Innovation Council',
    date: 'Jun 2026',
    category: 'Hackathon',
    description: 'Built an AI-driven disaster relief logistics dispatcher using Node.js and real-time mapping.',
    awardRank: '1st / 120 Teams',
    status: 'Verified'
  },
  {
    id: 'ach_2',
    title: 'Top 5% LeetCode Global Weekly Contest',
    organization: 'LeetCode Community',
    date: 'Jul 2026',
    category: 'Competition',
    description: 'Solved 4/4 algorithmic problems within 42 minutes involving segment trees and 2D dynamic programming.',
    awardRank: 'Top 5%',
    status: 'Verified'
  }
];

export const INITIAL_MENTOR_SESSIONS: MentorSession[] = [
  {
    id: 'sess_1',
    mentorId: 1,
    mentorName: 'Amit Verma',
    mentorCompany: 'Tata Consultancy Services',
    mentorRole: 'Senior Principal Architect',
    topic: 'PostgreSQL Indexing & High-Traffic Architecture Review',
    date: 'Aug 24, 2026',
    timeSlot: '4:00 PM – 4:15 PM',
    status: 'Completed',
    feedback: 'Strong grasp of B-Tree indexing and EXPLAIN ANALYZE interpretation. Advised candidate to deepen AWS VPC subnet architecture knowledge for Tier-1 placements.',
    rating: 5
  },
  {
    id: 'sess_2',
    mentorId: 2,
    mentorName: 'Priya Sharma',
    mentorCompany: 'Infosys Springboard',
    mentorRole: 'Lead Cloud Architect',
    topic: 'Mock Technical Interview: Microservices & Docker Best Practices',
    date: 'Sep 02, 2026',
    timeSlot: '6:30 PM – 6:45 PM',
    status: 'Confirmed',
    meetLink: 'https://meet.skillbridge.ai/capsule-priya-sharma-02sep'
  }
];

// Helper calculations
export function calculateOverallSkillScore(skills: SkillItem[]): number {
  if (!skills.length) return 78;
  const total = skills.reduce((acc, s) => acc + s.score, 0);
  return Math.round(total / skills.length);
}

export function calculateTechnicalSkillScore(skills: SkillItem[]): number {
  const tech = skills.filter(s => s.category === 'technical');
  if (!tech.length) return 81;
  const total = tech.reduce((acc, s) => acc + s.score, 0);
  return Math.round(total / tech.length);
}

export function calculateSoftSkillScore(skills: SkillItem[]): number {
  const soft = skills.filter(s => s.category === 'soft');
  if (!soft.length) return 79;
  const total = soft.reduce((acc, s) => acc + s.score, 0);
  return Math.round(total / soft.length);
}

export function calculateIndustryReadiness(skills: SkillItem[]): number {
  if (!skills.length) return 74;
  let matches = 0;
  skills.forEach(s => {
    if (s.level >= s.requiredLevel) {
      matches += 1;
    } else {
      matches += s.level / s.requiredLevel;
    }
  });
  return Math.min(100, Math.round((matches / skills.length) * 100));
}

// Deterministic matching between student skills and job opportunity
export function calculateJobMatch(job: JobOpportunity, skills: SkillItem[]): {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  isEligible: boolean;
} {
  const studentSkillNames = new Set(skills.map(s => s.name.toLowerCase()));
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  job.requiredSkills.forEach(req => {
    const isMatched = Array.from(studentSkillNames).some(sk => 
      sk.includes(req.toLowerCase()) || req.toLowerCase().includes(sk)
    );
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const baseMatch = job.requiredSkills.length > 0
    ? (matchedSkills.length / job.requiredSkills.length) * 85
    : 80;

  // bonus for preferred skills
  let bonus = 0;
  if (job.preferredSkills) {
    job.preferredSkills.forEach(pref => {
      if (Array.from(studentSkillNames).some(sk => sk.includes(pref.toLowerCase()) || pref.toLowerCase().includes(sk))) {
        bonus += 5;
      }
    });
  }

  const matchScore = Math.min(98, Math.round(baseMatch + bonus));
  const isEligible = matchedSkills.length >= Math.ceil(job.requiredSkills.length * 0.6);

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    isEligible
  };
}
