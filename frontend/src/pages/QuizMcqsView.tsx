import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Check, 
  HelpCircle, 
  Trophy, 
  Play, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Target, 
  Code, 
  Cpu, 
  Database, 
  Cloud, 
  Layers, 
  Bot, 
  Lock, 
  Compass, 
  RefreshCw, 
  Search, 
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  FileCode,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentProfile } from '../types';
import { generateAiQuiz, GeneratedQuizTopic, mintPassportRecord } from '../services/api';

interface DynamicTrackBlueprint {
  id: string;
  title: string;
  category: 'technical' | 'dsa' | 'cloud' | 'system-design' | 'ai' | 'security';
  description: string;
  icon: any;
  defaultDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

const TOPIC_TRACKS: DynamicTrackBlueprint[] = [
  {
    id: 'track-react-fullstack',
    title: 'React 19 & Full-Stack Architecture',
    category: 'technical',
    description: 'Server Components, Vite bundling, Express REST APIs, state machines, and SSR hydration.',
    icon: Code,
    defaultDifficulty: 'Intermediate',
    tags: ['React 19', 'Express', 'Vite', 'REST']
  },
  {
    id: 'track-dsa',
    title: 'Data Structures & Algorithmic Patterns',
    category: 'dsa',
    description: 'Time complexities, dynamic programming, graph traversals (Dijkstra, BFS/DFS), and trees.',
    icon: Cpu,
    defaultDifficulty: 'Advanced',
    tags: ['Graphs', 'DP', 'Heaps', 'O(N log N)']
  },
  {
    id: 'track-postgres',
    title: 'PostgreSQL & Database Optimization',
    category: 'technical',
    description: 'B-Tree & GIN indexing, ACID isolation levels, connection pooling, and sharding strategies.',
    icon: Database,
    defaultDifficulty: 'Intermediate',
    tags: ['PostgreSQL', 'Indexing', 'ACID', 'SQL']
  },
  {
    id: 'track-cloud-devops',
    title: 'Cloud Computing, Docker & Kubernetes',
    category: 'cloud',
    description: 'Container lifecycles, K8s Pod scheduling, CI/CD pipelines, and zero-trust cloud infrastructure.',
    icon: Cloud,
    defaultDifficulty: 'Advanced',
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud']
  },
  {
    id: 'track-system-design',
    title: 'System Design & Distributed Scalability',
    category: 'system-design',
    description: 'Microservice orchestration, event-driven streaming (Kafka), idempotency, and caching layers.',
    icon: Layers,
    defaultDifficulty: 'Advanced',
    tags: ['Microservices', 'Kafka', 'Redis', 'CAP Theorem']
  },
  {
    id: 'track-ai-genai',
    title: 'Generative AI & LLM Engineering',
    category: 'ai',
    description: 'Gemini SDK patterns, function calling, RAG pipelines, token economics, and prompt engineering.',
    icon: Bot,
    defaultDifficulty: 'Intermediate',
    tags: ['Gemini 3.8', 'RAG', 'Embeddings', 'GenAI']
  },
  {
    id: 'track-cybersecurity',
    title: 'Authentication & Cloud Security',
    category: 'security',
    description: 'Stateless JWT blacklisting, OAuth2 flows, CSRF protection, and zero-trust security postures.',
    icon: Lock,
    defaultDifficulty: 'Intermediate',
    tags: ['OAuth2', 'JWT', 'Encryption', 'Zero-Trust']
  },
  {
    id: 'track-os-concurrency',
    title: 'Operating Systems & Concurrency',
    category: 'technical',
    description: 'Thread pools, race condition mitigation, mutexes, virtual memory, and process scheduling.',
    icon: Compass,
    defaultDifficulty: 'Advanced',
    tags: ['Threads', 'Mutex', 'Deadlocks', 'Memory']
  }
];

const SAMPLE_NOTES = {
  distributed: `Distributed Consensus & Caching Notes:
- CAP Theorem: A distributed system can provide at most two of Consistency, Availability, and Partition Tolerance.
- Raft Consensus Protocol: Uses Leader Election, Log Replication, and Safety Invariants. Node states: Follower, Candidate, Leader.
- Redis Cache-Aside vs Write-Through: Cache-aside loads data into cache on miss; Write-through updates cache and database synchronously.
- Cache Stampede Mitigation: Use Probabilistic early expiration (XFetch algorithm) or mutual exclusion locks (Redlock) on hot key expiration.
- Idempotency Keys: Client generates UUID sent in headers; server tracks key in atomic transactional store to guarantee exactly-once processing on network retries.`,

  database: `PostgreSQL Indexing & Optimization Notes:
- B-Tree Index: Default index. Best for equality and range queries (<, <=, =, >=, >) on scalar columns.
- GIN (Generalized Inverted Index): Best for composite items containing multiple elements, such as JSONB documents, arrays, and full-text search tsvector.
- BRIN (Block Range Index): Lightweight index that stores summary ranges for sequential, ordered append-heavy tables (e.g. time-series audit logs).
- CREATE INDEX CONCURRENTLY: Prevents table write lock by taking a SHARE UPDATE EXCLUSIVE lock instead of ACCESS EXCLUSIVE.
- EXPLAIN ANALYZE BUFFERS: Executes the query and reports planning time, execution time, and buffer cache hit rates (shared hit vs disk read).`,

  security: `OAuth 2.0 & Stateless JWT Security Notes:
- Authorization Code Flow with PKCE (Proof Key for Code Exchange): Recommended standard for SPAs and mobile apps to prevent authorization code interception.
- JWT Structure: Header (algorithm & token type), Payload (claims like sub, exp, iat), Signature (HMAC/RSA hash).
- JWT Revocation Strategies: Token blacklisting using Redis with TTL matching token expiry, or tracking user token version counters in database.
- Refresh Token Rotation (RTR): Every time a refresh token is used, a new refresh token is issued and the old one is immediately invalidated. If an old token is reused, revoke the entire family to protect against theft.
- Cross-Site Scripting (XSS) vs CSRF: Protect against XSS by sanitizing input and avoiding eval/innerHTML; protect against CSRF using SameSite=Lax/Strict cookies or anti-CSRF synchronizer tokens.`
};

interface UploadedImage {
  name: string;
  mimeType: string;
  data: string; // base64
  previewUrl: string;
}

interface QuizMcqsViewProps {
  student: StudentProfile | null;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const QuizMcqsView: React.FC<QuizMcqsViewProps> = ({ student, onShowToast }) => {
  const [activeQuiz, setActiveQuiz] = useState<GeneratedQuizTopic | null>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [scoreData, setScoreData] = useState<{ correct: number; total: number; percentage: number; xpEarned: number } | null>(null);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [minted, setMinted] = useState<boolean>(false);

  // Dynamic Generation states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingStatus, setGeneratingStatus] = useState<string>('Synthesizing questions with Gemini AI...');
  const [generationMode, setGenerationMode] = useState<'topic' | 'notes' | 'photo'>('topic');

  // Input states
  const [customTopic, setCustomTopic] = useState<string>('');
  const [notesText, setNotesText] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // AI Modal states
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'topic' | 'notes' | 'photo'>('topic');
  const [modalTopic, setModalTopic] = useState<string>('');
  const [modalNotes, setModalNotes] = useState<string>('');
  const [modalImages, setModalImages] = useState<UploadedImage[]>([]);
  const [modalDifficulty, setModalDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [modalCount, setModalCount] = useState<number>(5);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (activeQuiz && !isCompleted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeQuiz, isCompleted, timeLeft]);

  // Handle image file conversions to base64
  const processFiles = (files: FileList | File[], isModal = false) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      onShowToast('Please select valid image files (PNG, JPG, JPEG, WEBP).', 'error');
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const newImg: UploadedImage = {
            name: file.name,
            mimeType: file.type || 'image/jpeg',
            data: result,
            previewUrl: result
          };
          if (isModal) {
            setModalImages(prev => [...prev, newImg].slice(0, 4));
          } else {
            setUploadedImages(prev => [...prev, newImg].slice(0, 4));
          }
          onShowToast(`📷 Attached "${file.name}" for Gemini Vision analysis`, 'info');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, isModal = false) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files, isModal);
    }
  };

  // Request dynamic quiz from Gemini backend
  const handleLaunchDynamicQuiz = async (payload: {
    topic?: string;
    notes?: string;
    images?: { mimeType: string; data: string; name?: string }[];
    diff?: 'Beginner' | 'Intermediate' | 'Advanced';
    count?: number;
    category?: string;
  }) => {
    const diff = payload.diff || selectedDifficulty;
    const count = payload.count || questionCount;
    const cat = payload.category || 'technical';

    setIsGenerating(true);

    const hasPhotos = payload.images && payload.images.length > 0;
    const hasNotes = payload.notes && payload.notes.trim().length > 0;

    let initialStatus = `Consulting Gemini 3.8 Flash for "${payload.topic || 'Assessment'}"...`;
    if (hasPhotos) {
      initialStatus = `Analyzing ${payload.images!.length} photo(s) with Gemini Vision...`;
    } else if (hasNotes) {
      initialStatus = 'Reading & analyzing your custom study notes with Gemini AI...';
    }

    setGeneratingStatus(initialStatus);

    const steps = hasPhotos
      ? [
          'Analyzing handwritten notes, formulas & diagrams with Gemini Vision...',
          'Extracting core engineering principles and architectural schemas...',
          'Synthesizing scenario-based MCQs testing your photo material...',
          'Verifying correct answer keys and technical rationales...'
        ]
      : hasNotes
      ? [
          'Analyzing study notes and extracting key concepts...',
          'Formulating deep comprehension questions testing your notes...',
          'Crafting plausible distractor options and architectural explanations...',
          'Finalizing verified evaluation schema...'
        ]
      : [
          `Consulting Gemini 3.8 Flash for "${payload.topic}"...`,
          'Synthesizing real-world engineering MCQs...',
          'Crafting plausible options & architectural explanations...',
          'Finalizing verified assessment key...'
        ];

    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setGeneratingStatus(steps[stepIdx]);
    }, 650);

    try {
      const result = await generateAiQuiz({
        topic: payload.topic,
        notes: payload.notes,
        images: payload.images,
        difficulty: diff,
        count: count,
        category: cat
      });

      clearInterval(stepInterval);
      setIsGenerating(false);

      if (result && result.quiz && result.quiz.questions && result.quiz.questions.length > 0) {
        startQuizSession(result.quiz);
        onShowToast(`✨ Quiz generated dynamically with Gemini (${result.quiz.questions.length} questions)!`, 'success');
      } else {
        throw new Error('No quiz generated');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsGenerating(false);
      onShowToast(err?.message || 'Could not generate quiz with Gemini. Please try again.', 'error');
    }
  };

  const startQuizSession = (quiz: GeneratedQuizTopic) => {
    setActiveQuiz(quiz);
    setCurrentIdx(0);
    setUserAnswers({});
    setTimeLeft(quiz.durationMinutes * 60);
    setIsCompleted(false);
    setScoreData(null);
    setMinted(false);
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleFinishQuiz = () => {
    if (!activeQuiz) return;
    let correct = 0;
    activeQuiz.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    const total = activeQuiz.questions.length;
    const percentage = Math.round((correct / total) * 100);
    const xpEarned = percentage >= 60 ? activeQuiz.xpReward : Math.round(activeQuiz.xpReward * 0.35);

    setScoreData({ correct, total, percentage, xpEarned });
    setIsCompleted(true);

    if (percentage >= 70) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      onShowToast(`🎉 Assessment Passed! Earned +${xpEarned} XP!`, 'success');
    } else {
      onShowToast(`Assessment finished with ${percentage}%. Check Gemini explanations below to review.`, 'info');
    }
  };

  const handleMintPassport = async () => {
    if (!activeQuiz || !scoreData || scoreData.percentage < 70) return;
    setIsMinting(true);
    try {
      await mintPassportRecord({
        studentId: student?.id || 1,
        title: `AI Verified: ${activeQuiz.title}`,
        company: 'Ladder Skill Intelligence Engine',
        score: scoreData.percentage,
        skillsVerified: [activeQuiz.title, activeQuiz.category, `${activeQuiz.difficulty} Level`]
      });
      setIsMinting(false);
      setMinted(true);
      onShowToast('🛡️ Verified Skill Badge minted to your Experience Passport!', 'success');
    } catch (err) {
      setIsMinting(false);
      onShowToast('Failed to mint credential.', 'error');
    }
  };

  const handleStudioSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (generationMode === 'topic') {
      if (!customTopic.trim()) {
        onShowToast('Please enter a topic or concept.', 'error');
        return;
      }
      handleLaunchDynamicQuiz({
        topic: customTopic.trim(),
        diff: selectedDifficulty,
        count: questionCount,
        category: 'technical'
      });
    } else if (generationMode === 'notes') {
      if (!notesText.trim()) {
        onShowToast('Please paste or write study notes.', 'error');
        return;
      }
      handleLaunchDynamicQuiz({
        topic: customTopic.trim() || 'Custom Study Notes',
        notes: notesText.trim(),
        diff: selectedDifficulty,
        count: questionCount,
        category: 'notes'
      });
    } else if (generationMode === 'photo') {
      if (uploadedImages.length === 0) {
        onShowToast('Please upload at least one photo or diagram of your notes.', 'error');
        return;
      }
      handleLaunchDynamicQuiz({
        topic: customTopic.trim() || 'Visual Notes & Diagrams',
        notes: notesText.trim(),
        images: uploadedImages,
        diff: selectedDifficulty,
        count: questionCount,
        category: 'photo-notes'
      });
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'topic' && !modalTopic.trim()) {
      onShowToast('Please enter a quiz topic.', 'error');
      return;
    }
    if (modalMode === 'notes' && !modalNotes.trim()) {
      onShowToast('Please paste your study notes.', 'error');
      return;
    }
    if (modalMode === 'photo' && modalImages.length === 0) {
      onShowToast('Please upload a photo of your notes.', 'error');
      return;
    }

    setShowAiModal(false);
    handleLaunchDynamicQuiz({
      topic: modalTopic.trim(),
      notes: modalNotes.trim(),
      images: modalImages,
      diff: modalDifficulty,
      count: modalCount,
      category: modalMode === 'photo' ? 'photo-notes' : (modalMode === 'notes' ? 'notes' : 'technical')
    });

    setModalTopic('');
    setModalNotes('');
    setModalImages([]);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Filter track blueprints
  const filteredTracks = TOPIC_TRACKS.filter(track => {
    const matchesCategory = activeCategoryFilter === 'all' || track.category === activeCategoryFilter;
    const matchesSearch = searchFilter === '' || 
      track.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      track.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      track.tags.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#17133B] via-[#2D1254] to-[#0F172A] p-6 sm:p-8 border border-purple-500/20 shadow-xl">
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
          <Trophy className="w-64 h-64 text-purple-300" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            Gemini 3.8 Flash Dynamic Quiz & Vision Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Dynamic AI Assessments from Notes, Photos & Topics
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Generate custom multiple-choice quizzes dynamically on demand using Gemini AI. Upload photos of handwritten notebook pages, paste lecture notes, or synthesize custom technology tracks—never preset questions.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-quiz-from-notes-photos"
              onClick={() => {
                setModalMode('notes');
                setShowAiModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-purple-200" />
              Quiz from Notes & Photos
            </button>
            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Preset Dynamic Synthesis</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Generating Loading Overlay */}
      {isGenerating && (
        <div className="bg-[#0B0F2A] border border-purple-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-purple-600/30 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/30">
              <Bot className="w-10 h-10 animate-bounce" />
            </div>
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
              Gemini 3.8 Flash Multimodal Synthesis
            </div>
            <h3 className="text-xl font-bold text-white">Synthesizing Real-Time Assessment</h3>
            <p className="text-sm text-purple-200/80 animate-pulse font-medium">{generatingStatus}</p>
          </div>
          <div className="w-48 h-1.5 mx-auto bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 animate-pulse w-3/4 rounded-full" />
          </div>
        </div>
      )}

      {/* ACTIVE QUIZ RUNNING SCREEN */}
      {activeQuiz && !isCompleted && !isGenerating && (
        <div className="bg-[#0B0F2A] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Quiz Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">{activeQuiz.category}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                  Gemini Generated
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-semibold">
                  {activeQuiz.difficulty}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">{activeQuiz.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{activeQuiz.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-bold">
                <Clock className="w-4 h-4 animate-spin" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                Exit Quiz
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Question {currentIdx + 1} of {activeQuiz.questions.length}</span>
              <span>{Math.round(((currentIdx + 1) / activeQuiz.questions.length) * 100)}% Completed</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / activeQuiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Map Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {activeQuiz.questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                    isCurrent
                      ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                      : isAnswered
                      ? 'bg-purple-900/50 border border-purple-500/40 text-purple-200'
                      : 'bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Box */}
          {(() => {
            const q = activeQuiz.questions[currentIdx];
            const selectedOpt = userAnswers[q.id];
            return (
              <div className="space-y-6 pt-2">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                  <h3 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
                    {currentIdx + 1}. {q.question}
                  </h3>
                </div>

                <div className="space-y-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#7C5CFC]/20 border-[#7C5CFC] text-white shadow-lg shadow-purple-500/10'
                            : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected ? 'bg-[#7C5CFC] text-white' : 'bg-white/10 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="text-sm sm:text-base leading-relaxed">{opt}</span>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-purple-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                    disabled={currentIdx === 0}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentIdx < activeQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIdx(prev => prev + 1)}
                      className="px-6 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6b4ae2] text-white text-sm font-bold shadow-lg shadow-purple-500/20 flex items-center gap-2"
                    >
                      Next Question
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishQuiz}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                    >
                      Submit Assessment
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* QUIZ COMPLETED RESULTS SCREEN */}
      {activeQuiz && isCompleted && scoreData && !isGenerating && (
        <div className="bg-[#0B0F2A] border border-purple-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            {scoreData.percentage >= 70 ? (
              <Trophy className="w-10 h-10 text-amber-400" />
            ) : (
              <Target className="w-10 h-10 text-purple-400" />
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              Gemini Verified Evaluation
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {scoreData.percentage >= 70 ? 'Congratulations! Assessment Passed 🎉' : 'Assessment Completed'}
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              {activeQuiz.title} ({activeQuiz.difficulty} Difficulty)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-400">Correct Answers</p>
              <p className="text-2xl font-bold text-white mt-1">{scoreData.correct} / {scoreData.total}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-400">Accuracy Score</p>
              <p className={`text-2xl font-bold mt-1 ${scoreData.percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {scoreData.percentage}%
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-400">Skill XP Earned</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">+{scoreData.xpEarned} XP</p>
            </div>
          </div>

          {/* Mint to Passport Banner if passed */}
          {scoreData.percentage >= 70 && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 border border-purple-500/30 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-purple-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Experience Passport Credential</h4>
                  <p className="text-xs text-slate-300">Mint a cryptographically verified Skill DNA certificate to your passport.</p>
                </div>
              </div>
              <button
                onClick={handleMintPassport}
                disabled={isMinting || minted}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  minted
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-[#7C5CFC] hover:bg-[#6b4ae2] text-white shadow-lg shadow-purple-500/25'
                }`}
              >
                {minted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Minted to Passport
                  </>
                ) : isMinting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Minting...
                  </>
                ) : (
                  <>
                    <Award className="w-3.5 h-3.5" /> Mint Credential
                  </>
                )}
              </button>
            </div>
          )}

          {/* Detailed Gemini Answer Review Accordion */}
          <div className="text-left max-w-2xl mx-auto space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Gemini Architectural Explanations
              </h4>
              <span className="text-xs text-slate-400">{activeQuiz.questions.length} Questions Reviewed</span>
            </div>

            {activeQuiz.questions.map((q, idx) => {
              const userAns = userAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{idx + 1}. {q.question}</p>
                    {isCorrect ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-1 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-bold flex items-center gap-1 shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-300">
                      <b className="text-slate-400">Your Selection:</b> {userAns !== undefined ? `${String.fromCharCode(65 + userAns)}: ${q.options[userAns]}` : 'Not Answered'}
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-300">
                        <b className="text-emerald-400">Correct Answer:</b> {String.fromCharCode(65 + q.correctAnswer)}: {q.options[q.correctAnswer]}
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed">
                    <span className="font-semibold text-purple-300">💡 Deep Explanation: </span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Results Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleLaunchDynamicQuiz({
                topic: activeQuiz.title,
                diff: activeQuiz.difficulty,
                count: activeQuiz.questionCount,
                category: activeQuiz.category
              })}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate Fresh Questions with Gemini
            </button>
            <button
              onClick={() => setActiveQuiz(null)}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Explore All Assessment Tools
            </button>
          </div>
        </div>
      )}

      {/* LEARNING MATERIAL STUDIO & TOPIC EXPLORER (WHEN NO ACTIVE QUIZ) */}
      {!activeQuiz && !isGenerating && (
        <div className="space-y-6">
          {/* Main AI Quiz Studio Card */}
          <div className="bg-[#0B0F2A] border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            {/* Header & Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">AI Learning Material & Assessment Studio</h3>
                  <p className="text-xs text-slate-400">Generate targeted quizzes from photos of your notes, typed summaries, or topics</p>
                </div>
              </div>

              {/* Mode Tabs */}
              <div className="inline-flex rounded-xl bg-white/5 p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setGenerationMode('topic')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    generationMode === 'topic'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  Topic / Search
                </button>
                <button
                  type="button"
                  onClick={() => setGenerationMode('notes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    generationMode === 'notes'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Paste Notes
                </button>
                <button
                  type="button"
                  onClick={() => setGenerationMode('photo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    generationMode === 'photo'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Photo / Vision
                </button>
              </div>
            </div>

            {/* Studio Form */}
            <form onSubmit={handleStudioSubmit} className="space-y-4">
              {/* Optional Subject Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subject or Module Title {generationMode !== 'topic' && <span className="text-slate-500 font-normal">(Optional - Gemini can infer from material)</span>}
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder={
                    generationMode === 'topic'
                      ? 'e.g. Apache Kafka Consumer Groups, Redis Caching, React 19...'
                      : generationMode === 'notes'
                      ? 'e.g. Distributed Consensus Lecture 4, Database Normalization...'
                      : 'e.g. Whiteboard Architecture Photo, Handwritten DSA Cheatsheet...'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* MODE 2: TEXT NOTES INPUT */}
              {generationMode === 'notes' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      Paste Your Notes, Study Points, or Lecture Summary
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">Load sample:</span>
                      <button
                        type="button"
                        onClick={() => setNotesText(SAMPLE_NOTES.distributed)}
                        className="text-[11px] text-purple-300 hover:underline"
                      >
                        Distributed
                      </button>
                      <span className="text-slate-600">|</span>
                      <button
                        type="button"
                        onClick={() => setNotesText(SAMPLE_NOTES.database)}
                        className="text-[11px] text-purple-300 hover:underline"
                      >
                        SQL Indexes
                      </button>
                      <span className="text-slate-600">|</span>
                      <button
                        type="button"
                        onClick={() => setNotesText(SAMPLE_NOTES.security)}
                        className="text-[11px] text-purple-300 hover:underline"
                      >
                        OAuth & JWT
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Paste markdown, raw textbook text, lecture transcript, bullet points, or code notes here..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
                  />
                </div>
              )}

              {/* MODE 3: PHOTO / IMAGE VISION UPLOAD */}
              {generationMode === 'photo' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      Upload Photos of Handwritten Notes, Whiteboard, or Diagrams (Gemini Vision)
                    </label>
                    <span className="text-[11px] text-purple-300 font-medium">Up to 4 images</span>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, false)}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-purple-400 bg-purple-500/15'
                        : 'border-white/10 bg-white/5 hover:border-purple-500/40 hover:bg-white/[0.07]'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => e.target.files && processFiles(e.target.files, false)}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <UploadCloud className="w-6 h-6 animate-pulse" />
                      </div>
                      <p className="text-sm font-semibold text-white">
                        Click or drag & drop photos here
                      </p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Supports PNG, JPG, JPEG, WEBP. Photos of handwritten notebooks, lecture slides, whiteboard sketches, or system design diagrams.
                      </p>
                    </div>
                  </div>

                  {/* Uploaded Thumbnails */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-purple-500/30 bg-black/40">
                          <img src={img.previewUrl} alt={img.name} className="w-full h-24 object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedImages(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                              title="Remove photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="p-1 bg-black/70 text-[10px] text-slate-300 truncate text-center">
                            {img.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Optional supplementary text note */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Optional context or specific focus for the photos:
                    </label>
                    <input
                      type="text"
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      placeholder="e.g. Focus on the handwritten circuit equations and Dijkstra trace in slide 2"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* Controls bar: Difficulty, Count & Generate Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">Difficulty:</span>
                    <select
                      value={selectedDifficulty}
                      onChange={(e: any) => setSelectedDifficulty(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#1A1F3D] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 font-medium"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">Questions:</span>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="px-3 py-2 rounded-xl bg-[#1A1F3D] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 font-medium"
                    >
                      <option value={3}>3 MCQs</option>
                      <option value={5}>5 MCQs</option>
                      <option value={10}>10 MCQs</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#6366F1] hover:from-[#6D4AE8] hover:to-[#4F46E5] text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all ml-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Assessment with Gemini</span>
                </button>
              </div>

              {/* Quick suggestion pills for topic mode */}
              {generationMode === 'topic' && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-400 font-medium">Quick Synthesize:</span>
                  {[
                    'Next.js 15 App Router',
                    'PostgreSQL B-Tree Indexing',
                    'Docker Multi-Stage Builds',
                    'Kafka Consumer Groups',
                    'JWT Zero-Trust Revocation',
                    'Gemini SDK Function Calling'
                  ].map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setCustomTopic(sug);
                        handleLaunchDynamicQuiz({
                          topic: sug,
                          diff: selectedDifficulty,
                          count: questionCount,
                          category: 'technical'
                        });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 text-slate-300 hover:text-purple-200 text-xs transition-colors"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Dynamic Assessment Track Catalog */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  Dynamic Curriculum Tracks (Gemini AI Powered)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Clicking any track synthesizes a fresh set of questions using Gemini 3.8 Flash</p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All Tracks' },
                  { id: 'technical', label: 'Full-Stack' },
                  { id: 'dsa', label: 'DSA' },
                  { id: 'cloud', label: 'Cloud & DevOps' },
                  { id: 'system-design', label: 'System Design' },
                  { id: 'ai', label: 'AI & LLMs' },
                  { id: 'security', label: 'Security' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryFilter(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      activeCategoryFilter === cat.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search track bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter tracks by keyword, framework, or concept..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Track Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTracks.map(track => {
                const IconComponent = track.icon;
                return (
                  <div 
                    key={track.id}
                    className="group bg-[#0B0F2A] border border-white/5 hover:border-purple-500/40 rounded-3xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-bold uppercase tracking-wider">
                              {track.category}
                            </span>
                            <span className="text-[10px] ml-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold">
                              {track.defaultDifficulty}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/20">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>Gemini Live</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                          {track.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {track.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {track.tags.map((tag, tIdx) => (
                          <span 
                            key={tIdx}
                            className="px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 text-[11px]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/5">
                        <span className="flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                          5 Dynamic MCQs
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          5 Mins Sprint
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          +250 XP
                        </span>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={() => handleLaunchDynamicQuiz({
                          topic: track.title,
                          diff: track.defaultDifficulty,
                          count: 5,
                          category: track.category
                        })}
                        className="w-full py-3 rounded-xl bg-white/5 hover:bg-[#7C5CFC] text-slate-200 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-transparent group-hover:shadow-lg group-hover:shadow-purple-500/20"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Generate & Start Assessment
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AI CUSTOM QUIZ MODAL (TOPIC / NOTES / PHOTO) */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F2A] border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Learning Material Generator</h3>
                  <p className="text-xs text-slate-400">Powered by Gemini 3.8 Flash Vision</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Modal Mode Selector */}
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setModalMode('topic')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modalMode === 'topic' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Topic
              </button>
              <button
                type="button"
                onClick={() => setModalMode('notes')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modalMode === 'notes' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Text Notes
              </button>
              <button
                type="button"
                onClick={() => setModalMode('photo')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modalMode === 'photo' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Photo / Vision
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {modalMode === 'topic' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Quiz Topic or Concept
                  </label>
                  <input
                    type="text"
                    value={modalTopic}
                    onChange={(e) => setModalTopic(e.target.value)}
                    placeholder="e.g. Distributed Consensus, Redis Stream Caching..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              )}

              {modalMode === 'notes' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Paste Lecture Notes or Study Material
                  </label>
                  <textarea
                    rows={4}
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    placeholder="Paste notes, formula definitions, or textbook concepts..."
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 font-mono"
                    required
                  />
                </div>
              )}

              {modalMode === 'photo' && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Upload Study Photos or Diagrams
                  </label>
                  <div
                    onClick={() => modalFileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 bg-white/5 hover:border-purple-500/40 rounded-2xl p-4 text-center cursor-pointer"
                  >
                    <input
                      type="file"
                      ref={modalFileInputRef}
                      onChange={(e) => e.target.files && processFiles(e.target.files, true)}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <UploadCloud className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                    <p className="text-xs text-white font-medium">Click to select photos of notebook pages/whiteboards</p>
                  </div>

                  {modalImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {modalImages.map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-purple-500/30">
                          <img src={img.previewUrl} alt={img.name} className="w-full h-16 object-cover" />
                          <button
                            type="button"
                            onClick={() => setModalImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-1 bg-red-600/80 rounded text-white text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Difficulty Level
                  </label>
                  <select
                    value={modalDifficulty}
                    onChange={(e: any) => setModalDifficulty(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1A1F3D] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Question Count
                  </label>
                  <select
                    value={modalCount}
                    onChange={(e) => setModalCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1A1F3D] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value={3}>3 MCQs</option>
                    <option value={5}>5 MCQs</option>
                    <option value={10}>10 MCQs</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Synthesize with Gemini
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
