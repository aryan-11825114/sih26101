import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Award, 
  Globe, 
  Briefcase,
  Sparkles,
  Edit,
  Code,
  GraduationCap,
  Calendar,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  Lock,
  Layers,
  Palette,
  Terminal,
  Cpu,
  BookOpen,
  ArrowRight,
  Sliders,
  Database,
  Activity
} from 'lucide-react';
import { StudentProfile } from '../types';
import { 
  getStudentSkills, 
  getProjects, 
  getCertifications, 
  calculateReadinessMetrics,
  getCustomPortfolioData,
  CustomPortfolioData
} from '../services/studentCareerService';
import { EditPortfolioModal } from '../components/EditPortfolioModal';

interface ResumePortfolioViewProps {
  student: StudentProfile | null;
  onOpenProfile?: () => void;
  onNavigateTab?: (tab: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ResumePortfolioView: React.FC<ResumePortfolioViewProps> = ({
  student,
  onOpenProfile,
  onNavigateTab,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'print'>('dark');

  // Dynamic portfolio state
  const [customData, setCustomData] = useState<CustomPortfolioData>(() => getCustomPortfolioData());
  const [skills, setSkills] = useState(() => getStudentSkills());
  const [projects, setProjects] = useState(() => getProjects());
  const [certs, setCerts] = useState(() => getCertifications());

  const reloadPortfolioData = () => {
    setCustomData(getCustomPortfolioData());
    setSkills(getStudentSkills());
    setProjects(getProjects());
    setCerts(getCertifications());
  };

  useEffect(() => {
    reloadPortfolioData();

    const handleLocationUpdate = (e: any) => {
      const loc = e?.detail?.location;
      if (loc) {
        setCustomData(prev => ({ ...prev, location: loc }));
      } else {
        reloadPortfolioData();
      }
    };

    window.addEventListener('ladder_location_updated', handleLocationUpdate);
    window.addEventListener('storage', reloadPortfolioData);

    return () => {
      window.removeEventListener('ladder_location_updated', handleLocationUpdate);
      window.removeEventListener('storage', reloadPortfolioData);
    };
  }, []);

  const readiness = calculateReadinessMetrics(skills);

  const handleCopyLink = () => {
    const url = `https://ladder.ai/portfolio/adarsh-architect-2026`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    if (onShowToast) onShowToast('Portfolio link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Architect specific competencies matching requested data precisely
  const col1Skills = [
    { name: 'LLMs & RAG Architect', level: 5, score: 96, category: 'AI & Data Science' },
    { name: 'GIS & Geospatial Analysis', level: 4, score: 89, category: 'AI & Data Science' },
    { name: 'Cloud & Distributed AI Systems', level: 5, score: 94, category: 'AI & Data Science' },
    { name: 'MLOps & CI/CD', level: 3, score: 82, category: 'AI & Data Science' },
  ];

  const col2Skills = [
    { name: 'Official Statistics Frameworks', level: 5, score: 95, category: 'Official Statistics & iGOT' },
    { name: 'iGOT Platform Integration', level: 4, score: 90, category: 'Official Statistics & iGOT' },
    { name: 'SDG Indicators & Metadata', level: 4, score: 88, category: 'Official Statistics & iGOT' },
    { name: 'Interactive Data Visualization', level: 5, score: 93, category: 'Official Statistics & iGOT' },
  ];

  const col4Skills = [
    { name: 'Python (Advanced, ML & Data)', level: 3, score: 85, category: 'Technical & Engineering' },
    { name: 'Statistical Survey Design', level: 4, score: 88, category: 'Technical & Engineering' },
    { name: 'Cybersecurity & Data Privacy', level: 5, score: 92, category: 'Technical & Engineering' },
    { name: 'Strategic Leadership & Change Mgmt', level: 4, score: 86, category: 'Technical & Engineering' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Header Action Bar */}
      <div className="bg-[#0B132B] border border-[#1E2964] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            LADDER ARCHITECT PORTAL • VERIFIED CANDIDATE
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            AI & Official Statistics Systems Architect Profile
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically signed ledger snapshot for official statistics frameworks, iGOT integration, and enterprise AI systems.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Profile
          </button>

          <button
            onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'print' : 'dark')}
            className="px-3.5 py-2 rounded-xl bg-[#0F172A] border border-[#1E2964] hover:border-indigo-500/50 text-slate-300 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            {previewTheme === 'dark' ? 'Dark View' : 'Print Preview'}
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-[#0F172A] border border-[#1E2964] hover:border-indigo-500/50 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
            {copied ? 'Copied!' : 'Share'}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* 3-COLUMN OR MAIN CONTENT + RIGHT UTILITY PANEL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CENTER / MAIN CONTENT PANEL (Col 1-8 or 9) */}
        <div className={`lg:col-span-8 space-y-6 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all font-sans ${
          previewTheme === 'dark'
            ? 'bg-[#0B132B] text-white border border-[#1E2964]'
            : 'bg-white text-gray-900 border border-gray-200'
        }`}>
          
          {/* Top Header Profile Section */}
          <div className={`pb-6 border-b ${previewTheme === 'dark' ? 'border-[#1E2964]' : 'border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Adarsh Pratap Singh
                  </h2>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Candidate
                  </span>
                </div>

                <p className={`text-sm font-extrabold text-indigo-400 tracking-wide`}>
                  AI & Official Statistics Systems Architect
                </p>

                <p className={`text-xs leading-relaxed max-w-2xl ${previewTheme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                  A specialist and technical architect with a track record of building and managing advanced Python-based AI systems, including LLMs, NLP pipelines, and GIS/Statistical platforms for large-scale data systems. Core competency verified: Top 1% globally in algorithmic problem solving and data analysis.
                </p>
              </div>

              {/* Contact & Links Column */}
              <div className={`text-xs space-y-2 sm:text-right shrink-0 ${previewTheme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>adarsh.pratap@mjpru.ac.in</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>+91 98130 42110</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Delhi NCR, India</span>
                </div>

                <div className="flex flex-wrap items-center sm:justify-end gap-2.5 pt-1 font-semibold text-indigo-400">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                    <Code className="w-3 h-3" /> GitHub
                  </a>
                  <a href="https://igot.gov.in" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                    <Globe className="w-3 h-3" /> iGOT Profile
                  </a>
                  <a href="https://nssta.gov.in" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                    <Award className="w-3 h-3" /> NSSTA Cert
                  </a>
                </div>

                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-900/40 text-indigo-300 font-mono font-bold text-[11px] border border-indigo-500/30">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    Readiness: 96% • Top 1% Tier
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SKILLS & COMPETENCIES GRID ("VERIFIED TECHNICAL COMPETENCIES & PROFICIENCY") */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                previewTheme === 'dark' ? 'text-indigo-300' : 'text-gray-700'
              }`}>
                <Cpu className="w-4 h-4 text-indigo-400" />
                VERIFIED TECHNICAL COMPETENCIES & PROFICIENCY
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                Ledger Verified
              </span>
            </div>

            {/* 4-Grid Specification Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Column 1: AI & Data Science - Official Statistics */}
              <div className={`p-4 rounded-xl border space-y-3 ${
                previewTheme === 'dark' ? 'bg-[#0F172A] border-[#1E2964]' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                    AI & Data Science
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">Col 1</span>
                </div>
                <div className="space-y-2.5">
                  {col1Skills.map((sk, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">{sk.name}</span>
                        <span className="text-[10px] font-mono text-indigo-400">Level {sk.level}/5</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" style={{ width: `${sk.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Official Statistics & iGOT */}
              <div className={`p-4 rounded-xl border space-y-3 ${
                previewTheme === 'dark' ? 'bg-[#0F172A] border-[#1E2964]' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                    Official Statistics & iGOT
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Col 2</span>
                </div>
                <div className="space-y-2.5">
                  {col2Skills.map((sk, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">{sk.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400">Level {sk.level}/5</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${sk.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Featured Banner - INTELLIGENT LEARNING PATHWAY (iGOT Karmayogi) */}
              <div className="sm:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-[#0F172A] border border-indigo-500/40 shadow-xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                    INTELLIGENT LEARNING PATHWAY (iGOT Karmayogi)
                  </div>
                  <span className="text-[10px] font-mono text-indigo-300 font-bold">Col 3 Featured</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Recommended Pathway for National Accounts Officer:
                  </h4>
                  <p className="text-xs text-slate-300 mb-3">
                    Curated module sequence aligned with Ministry of Statistics & Programme Implementation (MoSPI) standards.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[
                      'AI-Python for Advanced Analytics',
                      'Official Statistics Methodologies',
                      'Cybersecurity Compliance',
                      'National Accounts and Price Indices (NSSTA)',
                      'Leadership and Ethical Governance'
                    ].map((mod, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-500/30 text-xs font-semibold text-indigo-200 flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        [{mod}]
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-indigo-500/20 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">
                      Next recommended: <strong className="text-cyan-300">[SDG Data Integration and Mapping]</strong>
                    </span>
                    <button 
                      onClick={() => {
                        if (onNavigateTab) onNavigateTab('learning');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Start Module <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 4: Technical & Engineering */}
              <div className="sm:col-span-2 p-4 rounded-xl border space-y-3 bg-[#0F172A] border-[#1E2964]">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                    Technical & Engineering
                  </h4>
                  <span className="text-[10px] font-mono text-purple-400 font-bold">Col 4</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {col4Skills.map((sk, idx) => (
                    <div key={idx} className="space-y-1 p-2 rounded-lg bg-black/20 border border-white/5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">{sk.name}</span>
                        <span className="text-[10px] font-mono text-purple-400">Level {sk.level}/5</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full" style={{ width: `${sk.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* CERTIFICATES & BADGES SECTION */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-indigo-300">
                <Award className="w-4 h-4 text-amber-400" />
                Certificates & Badges
              </h3>
              <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                4 Badges Earned
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'NSSTA Official Statistics Level 5', issuer: 'Ministry of Statistics & PI', id: 'NSSTA-2026-881', date: 'Aug 2026' },
                { name: 'iGOT Karmayogi National Accounts Architect', issuer: 'Govt of India', id: 'IGOT-8921-AI', date: 'Jul 2026' },
                { name: 'Smart India Hackathon Finalist', issuer: 'Ministry of Education & AICTE', id: 'SIH-2026-FN', date: 'Jun 2026' },
                { name: 'Advanced Python & LLM Systems', issuer: 'Ladder Verification Ledger', id: 'LDR-LLM-091', date: 'May 2026' }
              ].map((cert, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#0F172A] border border-[#1E2964] flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{cert.name}</h4>
                      <p className="text-[10px] text-slate-400">{cert.issuer} • <span className="font-mono text-indigo-400">{cert.id}</span></p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 shrink-0 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Footer */}
          <div className="pt-4 border-t border-[#1E2964] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cryptographically Verified via Ladder Ledger • Block #88219 • NSSTA Certified Architect</span>
            </div>
            <span>System Timestamp: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* RIGHT UTILITY PANEL (TASKS & QUICK ACTIONS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* TASKS CARD */}
          <div className="bg-[#0B132B] border border-[#1E2964] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  TASKS
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                4 Pending
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Task 1 */}
              <button
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('quiz-mcqs');
                  if (onShowToast) onShowToast('Opening AI-Generated MCQ Assessment module...', 'info');
                }}
                className="w-full p-3 rounded-xl bg-[#0F172A] hover:bg-[#152238] border border-[#1E2964] hover:border-indigo-500/50 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Request AI-Generated MCQ Assessment
                  </span>
                  <p className="text-[10px] text-slate-400">Test official statistics & LLM proficiency</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
              </button>

              {/* Task 2 */}
              <button
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('skill-gap');
                  if (onShowToast) onShowToast('Navigating to Skill Gap Analysis Report...', 'info');
                }}
                className="w-full p-3 rounded-xl bg-[#0F172A] hover:bg-[#152238] border border-[#1E2964] hover:border-indigo-500/50 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    View Skill Gap Analysis Report
                  </span>
                  <p className="text-[10px] text-slate-400">Compare competency matrix against MoSPI requirements</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
              </button>

              {/* Task 3 */}
              <button
                onClick={() => {
                  if (onShowToast) onShowToast('iGOT & NSSTA Integration Settings synchronized successfully!', 'success');
                }}
                className="w-full p-3 rounded-xl bg-[#0F172A] hover:bg-[#152238] border border-[#1E2964] hover:border-indigo-500/50 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    Integration Settings (iGOT & NSSTA)
                  </span>
                  <p className="text-[10px] text-slate-400">Manage API tokens & credential syncing</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
              </button>

              {/* Task 4 */}
              <button
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('advisor');
                  if (onShowToast) onShowToast('Loading Predictive Skill Requirements Dashboard...', 'info');
                }}
                className="w-full p-3 rounded-xl bg-[#0F172A] hover:bg-[#152238] border border-[#1E2964] hover:border-indigo-500/50 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-purple-400" />
                    Predictive Skill Requirements Dashboard
                  </span>
                  <p className="text-[10px] text-slate-400">AI forecasts for 2026-2027 national data systems</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
              </button>
            </div>
          </div>

          {/* Quick System Telemetry Card */}
          <div className="bg-[#0B132B] border border-[#1E2964] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                System Telemetry
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">iGOT Karmayogi Sync</span>
                <span className="font-mono text-emerald-400 font-bold">Connected</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">NSSTA Validation</span>
                <span className="font-mono text-cyan-400 font-bold">Active Level 5</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Ledger Hash Security</span>
                <span className="font-mono text-indigo-400 font-bold">SHA-256 Valid</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* EDIT PORTFOLIO MODAL */}
      <EditPortfolioModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={reloadPortfolioData}
      />
    </div>
  );
};
