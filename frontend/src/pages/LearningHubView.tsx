import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Clock, 
  Award, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  Video, 
  FileCode, 
  Check, 
  Zap, 
  BarChart, 
  Search,
  ExternalLink,
  ShieldCheck,
  Star,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentProfile } from '../types';
import { getLearningCourses, updateCourseProgress, getStudentSkills } from '../services/studentCareerService';
import { igotService, IGotCourse } from '../services/igotApi';

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'lab' | 'reading';
  completed: boolean;
  codeSnippet?: string;
  summary?: string;
}

export interface HubCourse {
  id: string;
  title: string;
  provider: string;
  category: string;
  skillsCovered: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modulesCount: number;
  completedModules: number;
  progressPercent: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  targetSkillGap?: string;
  recommendationReason: string;
  rating: number;
  enrolledDate?: string;
  targetedSkill: string;
  targetSkillLevel: number;
  lessons: CourseLesson[];
}

interface LearningHubViewProps {
  student?: StudentProfile | null;
  onNavigateTab?: (tab: string) => void;
  onSkillUpdated?: (skillName?: string, newLevel?: number) => void;
  onSkillLeveledUp?: (skillName: string, newLevel: number) => void;
  onNavigateToSkills?: () => void;
}

const DEFAULT_COURSE_LESSONS: Record<string, CourseLesson[]> = {
  'course-1': [
    {
      id: 'l1-1',
      title: 'AWS Global Infrastructure & IAM Roles Architecture',
      duration: '45 mins',
      type: 'video',
      completed: true,
      summary: 'Deep dive into AWS Regions, Availability Zones, Edge Locations, and Least-Privilege IAM Policies.'
    },
    {
      id: 'l1-2',
      title: 'VPC Subnetting, Security Groups, and NAT Gateways',
      duration: '55 mins',
      type: 'lab',
      completed: false,
      summary: 'Design a multi-tier VPC with public and private subnets, routing tables, and bastion host jump boxes.',
      codeSnippet: `// Terraform VPC Architecture
resource "aws_vpc" "production" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "skillbridge-prod-vpc" }
}`
    },
    {
      id: 'l1-3',
      title: 'Containerized Microservices on AWS ECS & Fargate',
      duration: '50 mins',
      type: 'lab',
      completed: false,
      summary: 'Deploying Docker containers on serverless AWS Fargate with Application Load Balancer health checks.'
    },
    {
      id: 'l1-4',
      title: 'Serverless Event-Driven Compute with AWS Lambda & SQS',
      duration: '40 mins',
      type: 'video',
      completed: false,
      summary: 'Decoupling distributed microservices with AWS SQS FIFO queues and dead-letter queue recovery handlers.'
    }
  ],
  'course-2': [
    {
      id: 'l2-1',
      title: 'Graph Representation: Adjacency Lists & Topological Sort',
      duration: '40 mins',
      type: 'video',
      completed: true,
      summary: 'Kahn Algorithm for Topological Sort in Directed Acyclic Graphs (DAG) with O(V+E) time complexity.'
    },
    {
      id: 'l2-2',
      title: 'Dijkstra & A* Shortest Path Algorithms with Priority Queues',
      duration: '60 mins',
      type: 'lab',
      completed: true,
      summary: 'Implementing single-source shortest path using binary min-heaps in Python/TypeScript.',
      codeSnippet: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        curr_dist, curr_node = heapq.heappop(pq)
        if curr_dist > distances[curr_node]:
            continue
        for neighbor, weight in graph[curr_node].items():
            distance = curr_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    return distances`
    },
    {
      id: 'l2-3',
      title: 'Dynamic Programming: 2D Grid Paths & Knapsack Variations',
      duration: '65 mins',
      type: 'lab',
      completed: false,
      summary: 'Space optimization from O(N*W) matrix to 1D rolling array for classical 0/1 and unbounded knapsacks.'
    },
    {
      id: 'l2-4',
      title: 'Trie Data Structure for Substring Search & Prefix Matching',
      duration: '45 mins',
      type: 'video',
      completed: false,
      summary: 'Prefix tree implementation with wildcard character matching for autocomplete engines.'
    }
  ],
  'course-3': [
    {
      id: 'l3-1',
      title: 'Asymmetric RSA-256 JWT Token Signing & Public Verification',
      duration: '35 mins',
      type: 'video',
      completed: true,
      summary: 'Building stateless authentication with RS256 keypairs, preventing algorithm switching attacks.'
    },
    {
      id: 'l3-2',
      title: 'Distributed Token Blacklisting & Session Revocation with Redis',
      duration: '45 mins',
      type: 'lab',
      completed: true,
      summary: 'Implementing sub-millisecond token invalidation using Redis TTL keys on logout.',
      codeSnippet: `// Redis Token Blacklist Handler
export async function invalidateToken(jti: string, exp: number) {
  const ttl = Math.max(1, exp - Math.floor(Date.now() / 1000));
  await redis.set(\`blacklist:\${jti}\`, 'revoked', 'EX', ttl);
}`
    },
    {
      id: 'l3-3',
      title: 'Sliding Window Rate Limiting & DoS Protection Middleware',
      duration: '50 mins',
      type: 'lab',
      completed: true,
      summary: 'Express middleware tracking IP buckets and burst rates to prevent credential stuffing.'
    },
    {
      id: 'l3-4',
      title: 'OWASP Top 10 API Security Hardening & Zero-Trust Auditing',
      duration: '40 mins',
      type: 'reading',
      completed: true,
      summary: 'Mitigating BOLA (Broken Object Level Auth) and mass assignment vulnerabilities.'
    }
  ],
  'course-4': [
    {
      id: 'l4-1',
      title: 'React 18 Fiber Architecture, Work Loop, and Time Slicing',
      duration: '40 mins',
      type: 'video',
      completed: true,
      summary: 'Understand concurrent reconciliation, lanes prioritization, and startTransition non-blocking updates.'
    },
    {
      id: 'l4-2',
      title: 'Custom State Virtualization for 50,000+ DOM Nodes',
      duration: '55 mins',
      type: 'lab',
      completed: true,
      summary: 'Building windowing hooks using IntersectionObserver and translateY calculation.'
    },
    {
      id: 'l4-3',
      title: 'Zustand & Redux Toolkit Performance Profiling',
      duration: '45 mins',
      type: 'lab',
      completed: true,
      summary: 'Eliminating zombie child re-renders with shallow selectors and atomic state slices.'
    }
  ],
  'course-5': [
    {
      id: 'l5-1',
      title: 'Structuring Technical Design Docs (RFCs) for Senior Engineers',
      duration: '30 mins',
      type: 'reading',
      completed: true,
      summary: 'Standard RFC template covering Architecture, Tradeoffs, Observability, and Rollback plans.'
    },
    {
      id: 'l5-2',
      title: 'Explaining System Bottlenecks in Architectural Interviews',
      duration: '45 mins',
      type: 'video',
      completed: false,
      summary: 'Live walkthrough of answering "How do you scale to 10M DAU?" without handwaving.'
    },
    {
      id: 'l5-3',
      title: 'Cross-Functional Stakeholder Alignment & Code Reviews',
      duration: '35 mins',
      type: 'reading',
      completed: false,
      summary: 'Constructive code review frameworks that elevate code quality while fostering psychological safety.'
    }
  ]
};

function normalizeHubCourses(): HubCourse[] {
  const baseCourses = getLearningCourses();
  
  return baseCourses.map(c => {
    // Generate robust fallback lessons if not provided
    const fallbackLessons = DEFAULT_COURSE_LESSONS[c.id] || [
      {
        id: `${c.id}-m1`,
        title: `Core Principles of ${c.skillsCovered?.[0] || c.title}`,
        duration: '40 mins',
        type: 'video' as const,
        completed: c.completedModules > 0,
        summary: `Comprehensive overview of fundamentals and best practices for ${c.skillsCovered?.[0] || 'software engineering'}.`
      },
      {
        id: `${c.id}-m2`,
        title: `Interactive Lab & Architecture Patterns`,
        duration: '50 mins',
        type: 'lab' as const,
        completed: c.completedModules > 1,
        summary: `Hands-on guided simulation to build, test, and benchmark production implementations.`
      },
      {
        id: `${c.id}-m3`,
        title: `Industry Deployment & Interview Challenges`,
        duration: '45 mins',
        type: 'lab' as const,
        completed: c.completedModules >= c.modulesCount && c.modulesCount > 0,
        summary: `Real-world scenario problem solving directly aligned with Tier-1 placement hiring standards.`
      }
    ];

    const targetedSkill = c.targetSkillGap || (c.skillsCovered?.[0] || 'Technical Mastery');
    const targetSkillLevel = c.level === 'Advanced' ? 5 : c.level === 'Intermediate' ? 4 : 3;

    return {
      ...c,
      targetedSkill,
      targetSkillLevel,
      lessons: fallbackLessons
    };
  });
}

export const LearningHubView: React.FC<LearningHubViewProps> = ({
  student,
  onNavigateTab,
  onSkillUpdated,
  onSkillLeveledUp,
  onNavigateToSkills
}) => {
  const [courses, setCourses] = useState<HubCourse[]>(() => normalizeHubCourses());
  const [selectedCourse, setSelectedCourse] = useState<HubCourse | null>(null);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const baseCourses = normalizeHubCourses();
      if (student?.targetRole) {
        try {
          const igotCourses = await igotService.fetchRecommendations(student.targetRole);
          const mappedCourses: HubCourse[] = igotCourses.map(c => ({
            id: c.id,
            title: c.title,
            provider: c.provider,
            category: c.category,
            level: c.level === 'Beginner' ? 'Beginner' : c.level === 'Advanced' ? 'Advanced' : 'Intermediate',
            duration: c.duration,
            status: c.status,
            progressPercent: 0,
            completedModules: 0,
            modulesCount: 5,
            skillsCovered: [c.category],
            recommendationReason: 'Recommended by iGOT Karmayogi',
            rating: 5,
            targetedSkill: c.category,
            targetSkillLevel: 4,
            lessons: []
          }));
          setCourses([...baseCourses, ...mappedCourses]);
        } catch (e) {
          console.error("Failed to load iGOT courses", e);
          setCourses(baseCourses);
        }
      } else {
        setCourses(baseCourses);
      }
    }
    loadData();
  }, [student]);

  const handleStartCourse = (course: HubCourse) => {
    setSelectedCourse(course);
    const lessons = course.lessons || [];
    const firstIncomplete = lessons.find(l => !l.completed) || lessons[0] || null;
    setActiveLesson(firstIncomplete);
  };

  const handleToggleLessonComplete = (courseId: string, lessonId: string) => {
    setCourses(prevCourses => {
      const nextCourses = prevCourses.map(c => {
        if (c.id === courseId) {
          const currentLessons = Array.isArray(c.lessons) ? c.lessons : [];
          const updatedLessons = currentLessons.map(l => 
            l.id === lessonId ? { ...l, completed: !l.completed } : l
          );
          
          const completedCount = updatedLessons.filter(l => l.completed).length;
          const totalLessons = updatedLessons.length || 1;
          const newProgress = Math.round((completedCount / totalLessons) * 100);
          const newStatus = newProgress >= 100 ? ('Completed' as const) : newProgress > 0 ? ('In Progress' as const) : ('Not Started' as const);

          // Update backend service persistence
          if (c.provider === 'iGOT Karmayogi') {
            igotService.updateCourseProgress(courseId, newProgress);
          } else {
            updateCourseProgress(courseId, 1);
          }

          // If reached 100% completion
          if (newProgress === 100 && c.progressPercent < 100) {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
            const msg = `🎉 Course Completed! You mastered "${c.title}" and elevated ${c.targetedSkill} to Level ${c.targetSkillLevel}!`;
            setCelebrationMessage(msg);
            setTimeout(() => setCelebrationMessage(null), 6000);

            if (onSkillLeveledUp) {
              onSkillLeveledUp(c.targetedSkill, c.targetSkillLevel);
            }
            if (onSkillUpdated) {
              onSkillUpdated(c.targetedSkill, c.targetSkillLevel);
            }
          }

          return {
            ...c,
            completedModules: completedCount,
            progressPercent: newProgress,
            status: newStatus,
            lessons: updatedLessons
          };
        }
        return c;
      });

      return nextCourses;
    });

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(prev => {
        if (!prev) return null;
        const currentLessons = Array.isArray(prev.lessons) ? prev.lessons : [];
        const updatedLessons = currentLessons.map(l => 
          l.id === lessonId ? { ...l, completed: !l.completed } : l
        );
        const completedCount = updatedLessons.filter(l => l.completed).length;
        const totalLessons = updatedLessons.length || 1;
        const newProgress = Math.round((completedCount / totalLessons) * 100);
        
        return {
          ...prev,
          completedModules: completedCount,
          progressPercent: newProgress,
          lessons: updatedLessons
        };
      });

      setActiveLesson(prev => prev ? { ...prev, completed: !prev.completed } : null);
    }
  };

  const filteredCourses = courses.filter(c => {
    // Category match
    if (filterCategory !== 'all') {
      const cat = (c.category || '').toLowerCase();
      const targetFilter = filterCategory.toLowerCase();
      if (!cat.includes(targetFilter) && !(c.targetSkillGap || '').toLowerCase().includes(targetFilter)) {
        return false;
      }
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (c.title || '').toLowerCase().includes(q);
      const skillMatch = (c.skillsCovered || []).some(s => s.toLowerCase().includes(q));
      const providerMatch = (c.provider || '').toLowerCase().includes(q);
      if (!titleMatch && !skillMatch && !providerMatch) return false;
    }

    return true;
  });

  return (
    <div id="learning-hub-page" className="space-y-6 animate-fade-in select-none">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-white">AICTE & Industry Accredited Learning Hub</h1>
          </div>
          <p className="text-xs text-slate-300">
            Interactive curriculum mapped directly to bridge verified placement skill gaps and upgrade competency levels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('skill-gap')}
              className="px-4 py-2 rounded-xl bg-[#141D4E] hover:bg-[#1D296C] border border-[#243378] text-[#C4B5FD] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>View Gap Matrix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onNavigateToSkills && (
            <button
              onClick={onNavigateToSkills}
              className="px-4 py-2 rounded-xl bg-[#141D4E] hover:bg-[#1D296C] border border-[#243378] text-[#C4B5FD] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Skill Inventory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Milestone Celebration Banner */}
      {celebrationMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-slide-in">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{celebrationMessage}</span>
        </div>
      )}

      {/* 2. ACTIVE COURSE LESSON PLAYER VIEW */}
      {selectedCourse && activeLesson && (
        <div className="p-6 rounded-2xl bg-[#0B1033] border border-[#1E2B68] space-y-6 shadow-2xl animate-fade-in">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#182352]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1.5 rounded-lg bg-[#141C48] text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-sm font-bold text-white">{selectedCourse.title}</h2>
                <p className="text-[11px] text-slate-400">
                  Target Skill: <strong className="text-cyan-300">{selectedCourse.targetedSkill}</strong> (Level {selectedCourse.targetSkillLevel}) · Course Progress: {selectedCourse.progressPercent}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-32 bg-[#182352] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: `${selectedCourse.progressPercent}%` }} />
              </div>
              <span className="text-xs font-bold text-emerald-400">{selectedCourse.progressPercent}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Active Lesson Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-5 rounded-2xl bg-[#070B1E] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeLesson.type === 'video' ? (
                      <Video className="w-4 h-4 text-pink-400" />
                    ) : (
                      <FileCode className="w-4 h-4 text-cyan-400" />
                    )}
                    <h3 className="text-base font-extrabold text-white">{activeLesson.title}</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {activeLesson.duration}
                  </span>
                </div>

                {/* Video / Interactive Simulation Container */}
                <div className="w-full aspect-video rounded-xl bg-[#0E1538] border border-[#1E2964] flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#7C5CFC]/10 to-transparent pointer-events-none" />
                  <div className="w-14 h-14 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center shadow-lg shadow-purple-500/30 cursor-pointer hover:scale-105 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Interactive Video & Lab Simulation</h4>
                    <p className="text-xs text-slate-400 mt-1">High-definition interactive lab on {selectedCourse.targetedSkill}</p>
                  </div>
                </div>

                {/* Lesson Description & Code Sample */}
                <div className="p-4 rounded-xl bg-[#0B1033] border border-[#1E2964] space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Lesson Summary & Takeaways:</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeLesson.summary || `Master key principles, production architectures, and real-world deployment patterns for ${selectedCourse.targetedSkill}.`}
                  </p>
                  
                  {activeLesson.codeSnippet && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <div className="text-[10px] font-mono text-cyan-400 mb-1">Interactive Sandbox Code:</div>
                      <pre className="bg-[#050814] p-3 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto border border-white/5">
                        {activeLesson.codeSnippet}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Mark Complete Button */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleToggleLessonComplete(selectedCourse.id, activeLesson.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      activeLesson.completed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white shadow'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{activeLesson.completed ? 'Lesson Completed ✓' : 'Mark as Completed'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const lessons = selectedCourse.lessons || [];
                      const idx = lessons.findIndex(l => l.id === activeLesson.id);
                      if (idx < lessons.length - 1) {
                        setActiveLesson(lessons[idx + 1]);
                      }
                    }}
                    disabled={(selectedCourse.lessons || []).findIndex(l => l.id === activeLesson.id) === (selectedCourse.lessons || []).length - 1}
                    className="px-4 py-2 rounded-xl bg-[#141C48] disabled:opacity-30 hover:bg-[#1D296C] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Next Lesson</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Lesson Playlist Sidebar */}
            <div className="lg:col-span-4 space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Curriculum Modules</h3>
              <div className="space-y-1.5">
                {(selectedCourse.lessons || []).map((les, idx) => {
                  const isCurrent = les.id === activeLesson.id;
                  return (
                    <div
                      key={les.id}
                      onClick={() => setActiveLesson(les)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs ${
                        isCurrent
                          ? 'bg-[#141C48] border-[#7C5CFC] text-white shadow'
                          : 'bg-[#0E1538] border-[#1E2964] text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                          les.completed ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'
                        }`}>
                          {les.completed ? '✓' : idx + 1}
                        </div>
                        <span className="font-semibold truncate">{les.title}</span>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{les.duration}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. COURSES CATALOG */}
      {!selectedCourse && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="p-4 rounded-xl bg-[#0B1033] border border-[#1C265E] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, skills, or providers..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#070B1E] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#7C5CFC]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterCategory === 'all' ? 'bg-[#7C5CFC] text-white' : 'bg-[#070B1E] text-slate-400 hover:text-white'
                }`}
              >
                All Courses
              </button>
              <button
                onClick={() => setFilterCategory('Cloud')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterCategory === 'Cloud' ? 'bg-[#7C5CFC] text-white' : 'bg-[#070B1E] text-slate-400 hover:text-white'
                }`}
              >
                Cloud (AWS)
              </button>
              <button
                onClick={() => setFilterCategory('DSA')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterCategory === 'DSA' ? 'bg-[#7C5CFC] text-white' : 'bg-[#070B1E] text-slate-400 hover:text-white'
                }`}
              >
                DSA & Algorithms
              </button>
              <button
                onClick={() => setFilterCategory('Security')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterCategory === 'Security' ? 'bg-[#7C5CFC] text-white' : 'bg-[#070B1E] text-slate-400 hover:text-white'
                }`}
              >
                API & Security
              </button>
              <button
                onClick={() => setFilterCategory('Web')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterCategory === 'Web' ? 'bg-[#7C5CFC] text-white' : 'bg-[#070B1E] text-slate-400 hover:text-white'
                }`}
              >
                React & Frontend
              </button>
            </div>
          </div>

          {/* Grid of Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => {
              const lessons = Array.isArray(course.lessons) ? course.lessons : [];
              const completedCount = lessons.filter(l => l.completed).length;
              const totalLessonsCount = lessons.length || course.modulesCount || 1;

              return (
                <div
                  key={course.id}
                  className="p-5 rounded-2xl bg-[#0B1033] border border-[#1C265E] hover:border-[#7C5CFC] transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                        {course.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {course.duration}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-[#C4B5FD] transition-colors mb-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {course.recommendationReason || `Course curriculum verified to elevate ${course.targetedSkill} competency.`}
                    </p>

                    <div className="p-2.5 rounded-xl bg-[#070B1E] border border-white/5 mb-3 text-xs flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Target Skill Boost:</span>
                      <span className="font-bold text-emerald-300">
                        {course.targetedSkill} → L{course.targetSkillLevel}
                      </span>
                    </div>

                    {/* Progress Bar with Safe Array Access */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-400 font-semibold">{completedCount} of {totalLessonsCount} Modules</span>
                        <span className="text-emerald-400 font-bold">{course.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-[#182352] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: `${course.progressPercent}%` }} />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartCourse(course)}
                    className="w-full py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{course.progressPercent > 0 ? 'Continue Learning' : 'Start Course'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningHubView;
