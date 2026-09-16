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

  const overall = calculateOverallSkillScore(skills);
  const tech = calculateTechnicalSkillScore(skills);
  const soft = calculateSoftSkillScore(skills);

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

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0B1033] border border-[#1C265E] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills (e.g. Python, AWS, SQL)..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#070B1E] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#7C5CFC]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all' ? 'bg-[#7C5CFC] text-white' : 'bg-[#070B1E] text-slate-400 hover:text-white'
            }`}
          >
            All ({skills.length})
          </button>
          <button
            onClick={() => setSelectedCategory('technical')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'technical' ? 'bg-[#7C5CFC] text-white' : 'bg-[#070B1E] text-slate-400 hover:text-white'
            }`}
          >
            Technical
          </button>
          <button
            onClick={() => setSelectedCategory('soft')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'soft' ? 'bg-[#7C5CFC] text-white' : 'bg-[#070B1E] text-slate-400 hover:text-white'
            }`}
          >
            Soft Skills
          </button>
        </div>
      </div>

      {/* Skills Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const isMastered = skill.level >= 4;
          return (
            <div 
              key={skill.id} 
              className="p-5 rounded-2xl bg-[#0B1033] border border-[#1C265E] hover:border-[#7C5CFC] transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-black text-white group-hover:text-[#C4B5FD] transition-colors">
                    {skill.name}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    skill.verified 
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}>
                    {skill.verified ? 'Verified Ledger ✓' : 'Self-Reported'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs my-2">
                  <span className="text-slate-400 font-semibold">Proficiency:</span>
                  <span className="text-cyan-300 font-bold">Level {skill.level} of 5 ({skill.score}%)</span>
                </div>

                <div className="w-full bg-[#18214D] h-2 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isMastered ? 'bg-emerald-400' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-4">
                  <span>Assessments: {(skill as any).assessmentsCompleted || 2}</span>
                  <span>Gigs verified: {(skill as any).gigsCompleted || 1}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#182352]">
                <button
                  onClick={handleNavLearning}
                  className="flex-1 py-1.5 rounded-lg bg-[#141C48] hover:bg-[#1D296C] text-slate-200 text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Bridge Gap
                </button>
                <button
                  onClick={handleNavGigs}
                  className="flex-1 py-1.5 rounded-lg bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold shadow transition-all cursor-pointer text-center"
                >
                  Solve Gig
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* iGOT & Quiz Generator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* iGOT Recommendations */}
        <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] shadow-xl">
          <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            iGOT Karmayogi Recommended Courses
          </h2>
          <div className="space-y-3">
             {[
               {title: "AI in Statistical Systems", provider: "iGOT Karmayogi"},
               {title: "Big Data Analytics for Policy", provider: "iGOT Karmayogi"},
               {title: "Digital Public Infrastructure", provider: "iGOT Karmayogi"}
             ].map((course, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#1A224D] border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-white">{course.title}</p>
                        <p className="text-[10px] text-slate-400">{course.provider}</p>
                    </div>
                    <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20 hover:bg-emerald-500/30">Enroll</button>
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
