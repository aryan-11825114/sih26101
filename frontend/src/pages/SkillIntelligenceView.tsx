import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  BookOpenText,
  Code,
  Layers,
  Award,
  Search,
  Check,
  Zap,
  BarChart3
} from 'lucide-react';
import { SkillItem } from '../types';
import { INITIAL_SKILLS, calculateOverallSkillScore, calculateTechnicalSkillScore, calculateSoftSkillScore } from '../data/portalData';
import { igotService, IGotCourse } from '../services/igotApi';
import { getStudentSkills } from '../services/studentCareerService';

interface SkillIntelligenceProps {
  onNavigateToGigs?: () => void;
  onNavigateToAssessment?: () => void;
  onNavigateToLearning?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const SkillIntelligenceView: React.FC<SkillIntelligenceProps> = ({ 
  onNavigateToGigs,
  onNavigateToAssessment,
  onNavigateToLearning,
  onNavigateTab
}) => {
  const [skills, setSkills] = useState<SkillItem[]>(() => {
    try {
      const stored = getStudentSkills();
      if (stored && stored.length > 0) {
        return stored.map((s, idx) => ({
          id: s.id || `sk-${idx}`,
          name: s.name,
          category: (s.category === 'soft' ? 'soft' : 'technical') as 'technical' | 'soft' | 'aptitude',
          level: s.currentLevel || 3,
          maxLevel: 5,
          score: s.score || 75,
          requiredLevel: s.requiredLevel || 4,
          verified: s.verified !== false,
          assessmentsCompleted: s.assessmentsCompleted || 2,
          gigsCompleted: s.gigsCompleted || 1,
          trend: 'up' as const
        }));
      }
    } catch {
      // fallback
    }
    return INITIAL_SKILLS;
  });

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'technical' | 'soft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [igotCourses, setIgotCourses] = useState<IGotCourse[]>([]);
  const [student, setStudent] = useState<any>(null);

  const overall = calculateOverallSkillScore(skills);
  const tech = calculateTechnicalSkillScore(skills);
  const soft = calculateSoftSkillScore(skills);

  useEffect(() => {
    async function loadData() {
        try {
            const res = await fetch('/api/student');
            const studentData = await res.json();
            setStudent(studentData);
            
            if (studentData?.targetRole) {
              const courses = await igotService.fetchRecommendations(studentData.targetRole);
              setIgotCourses(courses);
            }
        } catch (e) {
            console.error("Failed to load data", e);
        }
    }
    loadData();
  }, []);

  const handleNavAssessment = () => {
    if (onNavigateToAssessment) onNavigateToAssessment();
    else if (onNavigateTab) onNavigateTab('assessment');
  };

  const handleNavLearning = () => {
    if (onNavigateToLearning) onNavigateToLearning();
    else if (onNavigateTab) onNavigateTab('learning');
  };

  const handleNavGigs = () => {
    if (onNavigateToGigs) onNavigateToGigs();
    else if (onNavigateTab) onNavigateTab('gigs');
  };

  const filteredSkills = skills.filter(s => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-white">Skill Intelligence & Benchmark Matrix</h1>
          </div>
          <p className="text-xs text-slate-300">
            Cryptographic skill telemetry benchmarking against <strong>Tier-1 Software Engineer Job Architectures (2026–27)</strong>.
          </p>
        </div>

        <button
          onClick={handleNavAssessment}
          className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all cursor-pointer self-start md:self-auto"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Take Diagnostic Assessment</span>
        </button>
      </div>

      {/* Aggregate Score Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0B1033] border border-[#1E2B68] text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Overall DNA Score</span>
          <span className="text-2xl font-black text-[#A78BFA]">{overall}%</span>
          <div className="w-full bg-[#182352] h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-gradient-to-r from-[#7C5CFC] to-[#6366F1] h-full rounded-full" style={{ width: `${overall}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1033] border border-[#1E2B68] text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Technical Skills</span>
          <span className="text-2xl font-black text-cyan-400">{tech}%</span>
          <div className="w-full bg-[#182352] h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${tech}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1033] border border-[#1E2B68] text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Soft Skills</span>
          <span className="text-2xl font-black text-pink-400">{soft}%</span>
          <div className="w-full bg-[#182352] h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-pink-400 h-full rounded-full" style={{ width: `${soft}%` }} />
          </div>
        </div>
      </div>

      {/* Skills Intelligence - Simplified */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] shadow-xl">
        <h2 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            iGOT Recommended Government Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {igotCourses.map((course) => (
                <div key={course.id} className="p-5 rounded-2xl bg-[#0B1033] border border-[#1C265E] hover:border-[#7C5CFC] transition-all flex flex-col justify-between group shadow-lg">
                    <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#C4B5FD] transition-colors mb-2">{course.title}</p>
                        <p className="text-[11px] text-slate-400 mb-1">{course.provider}</p>
                        <p className="text-[11px] text-emerald-400 font-bold mb-4">{course.category} • {course.duration}</p>
                    </div>
                    <a href="#" className="w-full py-2 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 hover:bg-emerald-500/30 text-center">View Course</a>
                </div>
            ))}
        </div>
      </div>

      {/* iGOT & Quiz Generator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* iGOT Recommendations */}
        <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] shadow-xl">
          <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            iGOT Recommended Courses
          </h2>
          <div className="space-y-3">
             {igotCourses.map((course) => (
                <div key={course.id} className="p-3 rounded-xl bg-[#1A224D] border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-white">{course.title}</p>
                        <p className="text-[10px] text-slate-400">{course.provider} • {course.duration}</p>
                    </div>
                    <a href="#" className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20 hover:bg-emerald-500/30">View Course</a>
                </div>
             ))}
          </div>
        </div>

        {/* AI Quiz Generator */}
        <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] shadow-xl">
          <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            AI Quiz Generator
          </h2>
          <p className="text-xs text-slate-400 mb-4">Upload learning materials to generate assessments instantly.</p>
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-[#1A224D] hover:border-amber-500/50 transition-colors cursor-pointer">
            <button className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <BookOpenText className="w-4 h-4" /> Click to upload documents/videos
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
