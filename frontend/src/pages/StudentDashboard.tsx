import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  CheckCircle,
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  Code,
  Dna,
  Award,
  Zap,
  BookOpen,
  FileText,
  FileCheck2,
  AlertTriangle,
  Target,
  BarChart3,
  Bot
} from 'lucide-react';
import { StudentProfile, PassportRecord } from '../types';
import { SkillTwinAndQuests } from '../components/SkillTwinAndQuests';
import { RecommendedCourseCard } from '../components/RecommendedCourseCard';
import { 
  getStudentSkills, 
  getSkillGaps, 
  calculateReadinessMetrics
} from '../services/studentCareerService';

interface StudentDashboardProps {
  student: StudentProfile | null;
  passport: PassportRecord[];
  onNavigate: (tab: string) => void;
  onOpenProfile: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  passport,
  onNavigate,
  onOpenProfile
}) => {
  const [skills, setSkills] = useState(() => getStudentSkills());
  const [skillGaps, setSkillGaps] = useState(() => getSkillGaps());
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [filter, setFilter] = useState('Recommended');

  useEffect(() => {
    setSkills(getStudentSkills());
    setSkillGaps(getSkillGaps());
    
    // Fetch dynamic recommendations
    if (student?.targetRole) {
        fetch(`/api/ai/igot/recommendations?profession=${encodeURIComponent(student.targetRole)}`)
            .then(res => res.json())
            .then(data => setRecommendations(data.recommendations));
    }
  }, [student]);

  const readiness = React.useMemo(() => calculateReadinessMetrics(skills), [skills]);
  const overallScore = readiness.overallSkillScore;
  const techScore = readiness.technicalScore;
  const softScore = readiness.softScore;
  const industryReadiness = readiness.industryReadiness;

  const strongSkills = skills.filter(s => s.level >= 4);
  const skillsToImprove = skillGaps.filter(s => s.gapStatus !== 'Mastered').slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* 1. HERO BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#121A46] via-[#10173F] to-[#0A0F2E] border border-[#1E2B68] relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">


            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Welcome back, {student?.name?.split(' ')[0] || 'Adarsh'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Targeting <strong className="text-white">{student?.targetRole || 'Full-Stack Software Engineer'}</strong> at Tier-1 enterprise partners. Your verified telemetry is on track for top-percentile recruitment.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={() => onNavigate('learning')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#00D9FF] hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>lore Learning Tracks & Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('assessment')}
                className="px-4 py-2 rounded-xl bg-[#141D4E] hover:bg-[#1D296C] border border-[#243378] text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>Take Skill Assessment</span>
              </button>

              <button
                onClick={() => onNavigate('advisor')}
                className="px-3.5 py-2 rounded-xl bg-[#0E1538] hover:bg-[#18214D] border border-[#1E2964] text-[#C4B5FD] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>AI Career Advisor</span>
              </button>
            </div>
          </div>

          {/* READINESS GAUGES */}
          <div className="grid grid-cols-2 gap-3.5 w-full lg:w-auto lg:min-w-[280px] min-w-0">
            <div className="p-4 rounded-xl bg-[#0B1033] border border-[#1E2B68] text-center flex flex-col justify-center shadow-md">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Industry Readiness</span>
              <div className="text-3xl font-black text-emerald-400 my-1">{industryReadiness}%</div>
              <div className="w-full bg-[#182352] h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${industryReadiness}%` }}></div>
              </div>
              <span className="text-[9.5px] text-emerald-300/80 font-medium mt-1">Tier-1 Qualified</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1033] border border-[#1E2B68] text-center flex flex-col justify-center shadow-md">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Skill DNA</span>
              <div className="text-3xl font-black text-[#A78BFA] my-1">{overallScore}%</div>
              <div className="w-full bg-[#182352] h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#7C5CFC] to-[#6366F1] h-full rounded-full transition-all duration-500" style={{ width: `${overallScore}%` }}></div>
              </div>
              <span className="text-[9.5px] text-purple-300/80 font-medium mt-1">{skills.length} Verified Competencies</span>
            </div>
          </div>
        </div>
      </div>

      <SkillTwinAndQuests />

      {/* 2. SKILL READINESS OVERVIEW & SKILL GAP SUMMARY (GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. SKILL READINESS OVERVIEW */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0B1033] border border-[#1C265E] flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7C5CFC]/20 text-[#A78BFA] flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Skill Readiness Overview</h2>
                  <p className="text-[11px] text-slate-400">Diagnostic benchmark against industry standards</p>
                </div>
              </div>
            </div>

            {/* Score Metric Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#0E1538] border border-[#1E2964]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Technical Skills</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-cyan-400">{techScore}%</span>
                  <span className="text-[10px] text-emerald-400 font-bold">+4% this month</span>
                </div>
                <div className="w-full bg-[#182352] h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${techScore}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0E1538] border border-[#1E2964]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Soft Skills & Leadership</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-pink-400">{softScore}%</span>
                  <span className="text-[10px] text-slate-400 font-medium">Proficient</span>
                </div>
                <div className="w-full bg-[#182352] h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-pink-400 h-full rounded-full" style={{ width: `${softScore}%` }}></div>
                </div>
              </div>
            </div>

            {/* Assessment Completion Status */}
            <div className="p-3.5 rounded-xl bg-[#0E1538] border border-[#1E2964] mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                  Diagnostic Assessments
                </span>
                <span className="text-emerald-400 font-bold">3 of 4 Completed</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1">✓ DSA & Algorithmic Thinking</span>
                  <span className="text-slate-400 font-mono">94%</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1">✓ Database Systems & SQL</span>
                  <span className="text-slate-400 font-mono">88%</span>
                </div>
                <div className="flex items-center justify-between text-amber-300">
                  <span className="flex items-center gap-1">⏳ AWS & Cloud Architecture</span>
                  <span className="text-amber-400 font-semibold">Ready to Take</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('skills')}
            className="w-full py-2.5 rounded-xl bg-[#141D4E] hover:bg-[#1D296C] border border-[#243378] text-[#C4B5FD] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>View Full Skill Telemetry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* B. SKILL GAP SUMMARY */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0B1033] border border-[#1C265E] flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Skill Gap Summary</h2>
                  <p className="text-[11px] text-slate-400">Target Role: {student?.targetRole || 'Full-Stack Software Engineer (Tier-1)'}</p>
                </div>
              </div>

              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                {skillsToImprove.length} Priority Gaps
              </span>
            </div>

            {/* Top Strengths */}
            <div className="mb-3.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Verified Strengths (Ready)
              </span>
              <div className="flex flex-wrap gap-2">
                {strongSkills.slice(0, 3).map(s => (
                  <span key={s.id} className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    {s.name} (L{s.level})
                  </span>
                ))}
              </div>
            </div>

            {/* Gap List */}
            <div className="space-y-2 mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Priority Skills to Improve
              </span>

              {skillsToImprove.map((gap, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#0E1538] border border-[#1E2964] flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white truncate">{gap.skill}</span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                        gap.gapStatus === 'Critical Gap' 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : gap.gapStatus === 'Moderate Gap'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {gap.gapStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Current: <strong className="text-white font-medium">L{gap.currentLevel}</strong> · Required: <strong className="text-indigo-300 font-bold">L{gap.requiredLevel}</strong> · Impact: <strong className="text-amber-300 font-semibold">{gap.impactOnPlacement}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate('learning')}
                    className="px-2.5 py-1.5 rounded-lg bg-[#7C5CFC]/20 hover:bg-[#7C5CFC]/30 text-[#C4B5FD] text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    Bridge Gap
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('skill-gap')}
            className="w-full py-2.5 rounded-xl bg-[#141D4E] hover:bg-[#1D296C] border border-[#243378] text-[#C4B5FD] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>View Full Skill Gap Matrix & Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. TARGET ROLE COMPETENCY ROADMAPS & LEARNING TRACKS */}
      <div className="p-5 rounded-2xl bg-[#0B1033] border border-[#1C265E] shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">iGOT Recommended Courses</h2>
              <p className="text-[11px] text-slate-400">Personalized learning paths mapped to your competency gaps</p>
            </div>
          </div>
          
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1A224D] text-[10px] font-bold text-slate-300 px-3 py-1.5 rounded-lg border border-white/5 outline-none"
          >
            {['Recommended', 'Profession', 'Skill Gap', 'Technical Skills', 'Soft Skills'].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((course: any) => (
                <RecommendedCourseCard 
                    key={course.id}
                    title={course.title}
                    duration={course.duration}
                    difficulty={course.level}
                    onView={() => window.open('#', '_blank')}
                />
            ))}
        </div>
      </div>

      {/* 4. AI RECOMMENDED ACTIONS */}
      <div className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">AI Recommended Next Actions</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Target Gap: AWS Cloud Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div 
            onClick={() => onNavigate('learning')}
            className="p-3 rounded-lg bg-[#141C48] border border-[#232F6E] hover:border-[#7C5CFC] cursor-pointer transition-all flex items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 mt-0.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-[#C4B5FD] transition-colors">Start Cloud Learning Module</p>
              <p className="text-[11px] text-slate-400 mt-0.5">+15 points to readiness score on completion.</p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('skill-gap')}
            className="p-3 rounded-lg bg-[#141C48] border border-[#232F6E] hover:border-[#7C5CFC] cursor-pointer transition-all flex items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-300 mt-0.5">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-[#C4B5FD] transition-colors">Analyze Skill Gaps & Radar</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Benchmarked against Tier-1 SDE hiring rubrics.</p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('resume')}
            className="p-3 rounded-lg bg-[#141C48] border border-[#232F6E] hover:border-[#7C5CFC] cursor-pointer transition-all flex items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-[#C4B5FD] transition-colors">Optimize Resume & Portfolio</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Sync verified telemetry to your ATS-ready resume.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
