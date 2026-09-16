import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Award, 
  Users, 
  Sparkles, 
  TrendingUp,
  Briefcase,
  Clock,
  LayoutGrid
} from 'lucide-react';
import { StudentProfile } from '../types';
import { getSkillGaps } from '../services/studentCareerService';
import { igotService, IGotCourse } from '../services/igotApi';

interface SkillGapAnalysisViewProps {
  student: StudentProfile | null;
  onNavigateTab: (tab: string) => void;
  onBookMentor?: (topic: string) => void;
}

export const SkillGapAnalysisView: React.FC<SkillGapAnalysisViewProps> = ({
  student,
  onNavigateTab,
}) => {
  const [skillGaps] = useState(getSkillGaps());
  const [igotCourses, setIgotCourses] = useState<IGotCourse[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(student?.targetRole || 'Full-Stack Software Engineer');

  useEffect(() => {
    const fetchIgotData = async () => {
      try {
        const courses = await igotService.fetchRecommendations(selectedRole);
        setIgotCourses(courses);
      } catch (err) {
        console.error('Failed to fetch iGOT recommendations', err);
      }
    };
    fetchIgotData();
  }, [selectedRole]);

  const criticalGaps = skillGaps.filter(s => s.gapStatus === 'Critical Gap');
  const moderateGaps = skillGaps.filter(s => s.gapStatus === 'Moderate Gap');
  const strengthSkills = skillGaps.filter(s => s.gapStatus !== 'Critical Gap' && s.gapStatus !== 'Moderate Gap');

  return (
    <div id="skill-gap-analysis-page" className="space-y-6">
      {/* Header Banner - Kept existing professional dark-blue style */}
      <div className="bg-[#12162E] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 border border-[#7C5CFC]/30 text-[#8B7CF8] text-xs font-semibold mb-3">
              <BarChart2 className="w-3.5 h-3.5" />
              iGOT GOVERNMENT LEARNING PATH
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Personalized Skill Gap Analysis
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Align your professional growth with iGOT curated government learning modules. Track skill proficiency and bridge gaps with authorized, verified courses.
            </p>
          </div>

          <div className="bg-[#0B0F2A] border border-white/10 rounded-xl p-4 shrink-0 min-w-[240px]">
            <label className="text-xs text-white/50 block font-medium mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#8B7CF8]" />
              Professional Profile / Service:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-[#12162E] border border-white/15 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#7C5CFC]"
            >
              <option value="Full-Stack Software Engineer">Full-Stack Software Engineer</option>
              <option value="Cloud Backend & DevOps Engineer">Cloud Backend & DevOps</option>
              <option value="AI / Machine Learning Engineer">AI / ML Engineer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommended iGOT Learning Path */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00D9FF]" />
            Recommended iGOT Learning Path
          </h3>
          <button className="text-xs text-[#8B7CF8] font-semibold hover:underline">
            View All Recommended Courses
          </button>
        </div>

        {/* Categories */}
        {[
          { title: 'Critical Skill Gaps', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/5', data: criticalGaps },
          { title: 'Moderate Skill Gaps', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/5', data: moderateGaps },
          { title: 'Skills to Strengthen', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', data: strengthSkills },
        ].map((section, idx) => (
          <div key={idx} className={`border ${section.border} ${section.bg} rounded-2xl p-6`}>
            <h4 className={`font-bold mb-4 flex items-center gap-2 ${section.color}`}>
              {idx === 0 ? '🔴' : idx === 1 ? '🟠' : '🟢'}
              {section.title} ({section.data.length})
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.data.map(gap => {
                // Find matching iGOT course if available
                const iGotCourse = igotCourses.find(c => c.category === gap.category || c.title.toLowerCase().includes(gap.skill.toLowerCase()));

                return (
                  <div key={gap.skill} className="bg-[#12162E] border border-white/10 rounded-2xl p-5 hover:border-[#7C5CFC]/30 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h4 className="text-base font-bold text-white">{gap.skill}</h4>
                          <p className="text-xs text-white/50">{gap.category.toUpperCase()} | GAP LEVEL: {gap.currentScore}%</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-white/40 block">Progress</span>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1">
                            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${gap.currentScore}%` }} />
                          </div>
                        </div>
                      </div>

                      {iGotCourse ? (
                        <div className="bg-[#0B0F2A] border border-white/5 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-start gap-2">
                            <BookOpen className="w-4 h-4 text-[#8B7CF8] shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-white text-xs">{iGotCourse.title}</p>
                              <p className="text-[10px] text-white/50">{iGotCourse.provider} • {iGotCourse.duration}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-white/40 italic p-3">No iGOT course currently mapped.</p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 mt-3 flex justify-between items-center">
                      <span className="text-[10px] text-white/50 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {iGotCourse?.duration || 'TBD'}
                      </span>
                      <button className="px-3 py-1.5 rounded-lg bg-[#7C5CFC]/20 hover:bg-[#7C5CFC]/30 text-[#8B7CF8] font-semibold text-xs transition-all">
                        {iGotCourse ? 'Start Learning' : 'Explore iGOT'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};