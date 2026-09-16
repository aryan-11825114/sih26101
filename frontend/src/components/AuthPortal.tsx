import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, UserCheck, Lock, User, Shield } from 'lucide-react';
import { UserRole, StudentProfile } from '../types';

export interface AuthSuccessPayload {
  role: UserRole;
  token?: string;
  student?: StudentProfile;
}

interface AuthPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (payload: AuthSuccessPayload) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<'learner' | 'administrator'>('learner');
  const [email, setEmail] = useState('adarsh.pratap@mjpru.ac.in');
  const [password, setPassword] = useState('password123');
export const AuthPortal: React.FC<AuthPortalProps> = ({
  isOpen,
  onClose,
  initialRole = 'student',
  initialMode = 'login',
  onAuthSuccess
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [roleTab, setRoleTab] = useState<'Learner' | 'Admin'>(() => {
    if (initialRole === 'company') return 'Admin';
    return 'Learner';
  });

  const [photoPreview, setPhotoPreview] = useState<string>(() => {
    return localStorage.getItem('userPhoto') || localStorage.getItem('profilePhoto') || '';
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string>('Lucknow, Uttar Pradesh, India');

  // --- Student Fields ---
  const [studentName, setStudentName] = useState('Adarsh Pratap Singh');
  const [studentRollNo, setStudentRollNo] = useState('22001015001');
  const [academicYear, setAcademicYear] = useState('2025-29');
  const [studentDept, setStudentDept] = useState(DEPARTMENTS[0]);
  const [studentCollege, setStudentCollege] = useState<CollegeItem>(UNIS[0]);
  const [studentEmail, setStudentEmail] = useState('adarsh.pratap@mjpru.ac.in');
  const [studentPassword, setStudentPassword] = useState('password123');

  // --- APAAR ID & DigiLocker Verification ---
  const [loginMethod, setLoginMethod] = useState<'email' | 'apaar'>('email');
  const [apaarId, setApaarId] = useState('2458-9102-3341');
  const [isApaarVerified, setIsApaarVerified] = useState(false);
  const [isVerifyingApaar, setIsVerifyingApaar] = useState(false);

  const handleVerifyApaar = () => {
    if (!apaarId || apaarId.trim().length < 10) {
      alert('Please enter a valid 12-digit APAAR ID.');
      return;
    }
    setIsVerifyingApaar(true);
    setTimeout(() => {
      setIsVerifyingApaar(false);
      setIsApaarVerified(true);
      alert('APAAR ID verified successfully via DigiLocker / ABC Registry!');
    }, 1200);
  };

  // --- Mentor Fields ---
  const [mentorName, setMentorName] = useState('Amit Verma');
  const [mentorEmail, setMentorEmail] = useState('amit.verma@tcs.com');
  const [mentorPassword, setMentorPassword] = useState('password123');
  const [mentorCompanyPreset, setMentorCompanyPreset] = useState(MENTOR_COMPANIES_DATA[0]);
  const [customCompany, setCustomCompany] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([
    'Full Stack',
    'AI/ML',
    'Cloud & DevOps'
  ]);
  const [newTagInput, setNewTagInput] = useState('');

  // --- HOD Fields ---
  const [hodName, setHodName] = useState('Dr. Arvind K. Sharma');
  const [hodEmail, setHodEmail] = useState('hod.csit@mjpru.ac.in');
  const [hodPassword, setHodPassword] = useState('password123');
  const [hodCollege, setHodCollege] = useState<CollegeItem>(UNIS[0]);
  const [hodDept, setHodDept] = useState(DEPARTMENTS[0]);

  // --- Recruiter Fields ---
  const [recruiterName, setRecruiterName] = useState('Priya Sharma');
  const [recruiterCompany, setRecruiterCompany] = useState('Google Cloud India');
  const [recruiterEmail, setRecruiterEmail] = useState('priya.sharma@google.com');
  const [recruiterPassword, setRecruiterPassword] = useState('password123');

  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode);
      if (initialRole === 'company') setRoleTab('Admin');
      else setRoleTab('Learner');
      
      const storedPhoto = localStorage.getItem('userPhoto') || localStorage.getItem('profilePhoto') || '';
      setPhotoPreview(storedPhoto);
    }
  }, [isOpen, initialMode, initialRole]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role: UserRole = activeTab === 'learner' ? 'student' : 'hod';
    onAuthSuccess({
      role,
      token: 'mock_jwt_token_sih26101',
      student: {
        id: 1,
        name: activeTab === 'learner' ? 'Adarsh Pratap Singh' : 'Dr. Administrator',
        email,
        targetRole: activeTab === 'learner' ? 'AI & Official Statistics Systems Architect' : 'System Administrator / HOD',
        careerReadiness: 96,
        avatar: '',
        skills: ['Python', 'SQL', 'React', 'Official Statistics']
      }
    });
    onClose();
    setIsSubmitting(true);

    try {
      const locData = await getCurrentLocation();

      let form: any = {};
      let targetUserRole: UserRole = 'student';

      if (roleTab === 'Learner') {
        form = {
          name: studentName.trim() || 'Adarsh Pratap Singh',
          email: studentEmail.trim() || 'adarsh.pratap@mjpru.ac.in',
          uni: studentCollege.name,
          dept: studentDept,
          roll: studentRollNo.trim() || '22001015001',
          year: academicYear
        };
        targetUserRole = 'student';
      } else {
        form = {
          name: recruiterName.trim() || 'Priya Sharma',
          email: recruiterEmail.trim() || 'priya.sharma@google.com',
          company: recruiterCompany.trim() || 'Google Cloud India',
          uni: 'Corporate Enterprise',
          dept: 'Recruitment',
          year: 'N/A'
        };
        targetUserRole = 'company';
      }

      // Exact pathway logic requested:
      let profile: any = {
        name: form.name,
        email: form.email,
        college: form.uni,
        department: form.dept,
        photo: photoPreview || localStorage.getItem('userPhoto') || localStorage.getItem('profilePhoto') || '',
        location: locData.location,
        lat: locData.lat,
        lng: locData.lng,
        role: targetUserRole,
        year: form.year
      };

      if (roleTab === 'Learner') {
        profile.rollNo = form.roll;
        profile.type = 'Learner';
      } else if (roleTab === 'Admin') {
        profile.company = form.company;
        profile.type = `Admin - ${form.company}`;
        delete profile.rollNo;
      }

      // Persist exact records to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('userRole', roleTab === 'Learner' ? 'student' : 'company');
      localStorage.setItem('role', targetUserRole);
      localStorage.setItem('userPhoto', profile.photo);
      localStorage.setItem('profilePhoto', profile.photo);
      localStorage.setItem('userLocation', locData.location);
      localStorage.setItem('userName', profile.name);
      localStorage.setItem('userEmail', profile.email);
      
      if (profile.rollNo) {
        localStorage.setItem('userRollNo', profile.rollNo);
      } else {
        localStorage.removeItem('userRollNo');
      }
      
      if (profile.department) localStorage.setItem('userCourse', profile.department);
      if (profile.college) localStorage.setItem('userCollege', profile.college);
      if (profile.year) localStorage.setItem('userYear', profile.year);
      if (profile.company) localStorage.setItem('userCompany', profile.company);

      const payload: AuthSuccessPayload = {
        name: profile.name,
        role: targetUserRole,
        email: profile.email,
        department: profile.department,
        college: roleTab === 'Learner' ? studentCollege : null,
        batch: profile.year,
        rollNo: profile.rollNo,
        company: profile.company,
        expertise: roleTab === 'Mentor' ? selectedExpertise : undefined,
        photo: profile.photo,
        location: profile.location,
        mode: authMode
      };

      onAuthSuccess(payload);
    } catch (err) {
      console.error('Auth submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0B132B] border border-[#1E2964] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Project ID: sih26101 - Smart India Hackathon
          </div>
          <h2 className="text-xl font-black text-white">Ladder Secure Authentication</h2>
          <p className="text-xs text-slate-400">Select your portal access mode below.</p>
        </div>

        {/* Tab Form */}
        <div className="grid grid-cols-2 gap-2 bg-[#070B1E] p-1.5 rounded-xl border border-[#1E2964]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('learner');
              setEmail('adarsh.pratap@mjpru.ac.in');
            }}
            className={`py-2 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'learner'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Learner
          </button>
          
          <button
            type="button"
            onClick={() => {
              setActiveTab('administrator');
              setEmail('admin.mjpru@gov.in');
            }}
            className={`py-2 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'administrator'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Administrator
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {activeTab === 'learner' ? 'Learner Email Address' : 'Administrator Email Address'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0F172A] border border-[#1E2964] rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
        {/* Dual Switchers: 1. Mode Toggle [Sign In] [Register] + 2. Role Tabs [Student][Mentor][HOD][Recruiter] */}
        <div className="px-6 pt-4 pb-2 space-y-3 bg-[#0E1538]/50">
          {/* Mode Toggle [Sign In] [Register Student / User] */}
          <div className="flex items-center p-1 bg-[#1A1F3D] rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register Learner / User
            </button>
          </div>

          {/* Role Tabs [Learner] [Admin] - Learner Default */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#1A1F3D]/80 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setRoleTab('Learner')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                roleTab === 'Learner'
                  ? 'bg-[#7C5CFC]/30 text-white border border-[#7C5CFC]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Learner</span>
            </button>

            <button
              type="button"
              onClick={() => setRoleTab('Admin')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                roleTab === 'Admin'
                  ? 'bg-[#7C5CFC]/30 text-white border border-[#7C5CFC]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password / Access Token</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0F172A] border border-[#1E2964] rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer mt-2"
          >
            <span>Login as {activeTab === 'learner' ? 'Learner' : 'Administrator'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {/* 1. LEARNER PATHWAY */}
          {roleTab === 'Learner' && (
            <>
              {authMode === 'register' ? (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="e.g. Adarsh Pratap Singh"
                          className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Roll / Student ID
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={studentRollNo}
                          onChange={(e) => setStudentRollNo(e.target.value)}
                          placeholder="e.g. 22001015001"
                          className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* APAAR ID & DigiLocker Verification */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>APAAR ID / ABC Registry Verification</span>
                      </div>
                      <span className="text-[10px] text-emerald-300/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">DigiLocker Linked</span>
                    </div>
                    <div className="relative flex gap-2">
                      <div className="relative flex-1">
                        <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={apaarId}
                          onChange={(e) => setApaarId(e.target.value)}
                          placeholder="Enter 12-Digit APAAR ID"
                          className="w-full bg-[#1A1F3D] border border-white/10 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyApaar}
                        disabled={isVerifyingApaar || isApaarVerified}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          isApaarVerified 
                            ? 'bg-emerald-500 text-white cursor-default' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        }`}
                      >
                        {isVerifyingApaar ? 'Verifying...' : isApaarVerified ? '✓ Verified' : 'Verify ID'}
                      </button>
                    </div>
                    {isApaarVerified && (
                      <div className="text-[11px] text-emerald-300 flex items-center gap-1.5 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>APAAR ID successfully verified & bound to academic profile.</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Academic Batch
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <select
                          value={academicYear}
                          onChange={(e) => setAcademicYear(e.target.value)}
                          className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none cursor-pointer"
                        >
                          <option value="2023-27">2023-27 (4th Year / Senior)</option>
                          <option value="2024-28">2024-28 (3rd Year)</option>
                          <option value="2025-29">2025-29 (2nd Year)</option>
                          <option value="2026-30">2026-30 (1st Year / Fresher)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Department / Branch
                      </label>
                      <select
                        value={studentDept}
                        onChange={(e) => setStudentDept(e.target.value)}
                        className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                      >
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* University Searchable Dropdown with Original Logos */}
                  <UniversityDropdown
                    selectedCollege={studentCollege}
                    onSelect={(col) => setStudentCollege(col)}
                    label="University Affiliation"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        University / Official Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          placeholder="adarsh.pratap@mjpru.ac.in"
                          className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Student Login Mode */
                <div className="space-y-3.5">
                  {/* Login Method Toggle: Email vs APAAR ID */}
                  <div className="flex items-center p-1 bg-[#1A1F3D] rounded-xl border border-white/10 mb-2">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('email')}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        loginMethod === 'email' ? 'bg-[#7C5CFC] text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Email & Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('apaar')}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        loginMethod === 'apaar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      APAAR ID (DigiLocker)
                    </button>
                  </div>

                  {loginMethod === 'apaar' ? (
                    <div className="space-y-3 p-4 rounded-2xl bg-emerald-950/25 border border-emerald-500/30">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Automated Permanent Academic Account Registry (APAAR / ABC)</span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          12-Digit APAAR ID / Academic ID
                        </label>
                        <div className="relative flex gap-2">
                          <div className="relative flex-1">
                            <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={apaarId}
                              onChange={(e) => setApaarId(e.target.value)}
                              placeholder="e.g. 2458-9102-3341"
                              className="w-full bg-[#1A1F3D] border border-white/10 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleVerifyApaar}
                            disabled={isVerifyingApaar || isApaarVerified}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                              isApaarVerified 
                                ? 'bg-emerald-500 text-white cursor-default' 
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                            }`}
                          >
                            {isVerifyingApaar ? 'Verifying...' : isApaarVerified ? '✓ Verified' : 'Verify'}
                          </button>
                        </div>
                      </div>
                      {isApaarVerified && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>APAAR ID Confirmed. Academic records & university profile linked.</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Official University Email / Username
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            placeholder="adarsh.pratap@mjpru.ac.in"
                            className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <UniversityDropdown
                    selectedCollege={studentCollege}
                    onSelect={(col) => setStudentCollege(col)}
                    label="Associated University"
                  />

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Roll Number Verification
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={studentRollNo}
                        onChange={(e) => setStudentRollNo(e.target.value)}
                        placeholder="22001015001"
                        className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 2. ADMIN PATHWAY */}
          {roleTab === 'Admin' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Admin Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={recruiterEmail}
                      onChange={(e) => setRecruiterEmail(e.target.value)}
                      placeholder="priya.sharma@company.com"
                      className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={recruiterPassword}
                      onChange={(e) => setRecruiterPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Organization / Company Name
                </label>
                <input
                  type="text"
                  required
                  value={recruiterCompany}
                  onChange={(e) => setRecruiterCompany(e.target.value)}
                  placeholder="e.g. Tech Corp"
                  className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit CTA Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4CE8] text-white font-bold text-xs tracking-wide transition-all shadow-lg shadow-[#7C5CFC]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Syncing GPS & Profile...</span>
                </>
              ) : (
                <>
                  <span>
                    {authMode === 'register'
                      ? roleTab === 'Learner'
                        ? 'Register & Sync Profile ->'
                        : 'Register as Admin'
                      : roleTab === 'Learner'
                      ? 'Sign In to Learner OS'
                      : 'Sign In to Admin Portal'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
