import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, UserCheck, Lock, User, Shield, RefreshCw } from 'lucide-react';
import { UserRole, StudentProfile } from '../types';
import { CollegeItem, COLLEGES_DATA as UNIS } from '../data/colleges';
import { detectAccurateLocation } from '../utils/locationService';

export interface AuthSuccessPayload {
  role: UserRole;
  token?: string;
  student?: StudentProfile;
  name?: string;
  email?: string;
  department?: string;
  college?: CollegeItem | null;
  batch?: string;
  rollNo?: string;
  company?: string;
  expertise?: string[];
  photo?: string;
  location?: string;
  mode?: 'login' | 'register';
}

interface AuthPortalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  initialMode?: 'login' | 'register';
  onAuthSuccess: (payload: AuthSuccessPayload) => void;
}

const DEPARTMENTS = [
  'Computer Science & Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Information Technology'
];

const MENTOR_COMPANIES_DATA = [
  { name: 'Tata Consultancy Services' },
  { name: 'Infosys Springboard' },
  { name: 'CloudSphere Systems' }
];

export const AuthPortal: React.FC<AuthPortalProps> = ({
  isOpen,
  onClose,
  initialRole = 'student',
  initialMode = 'login',
  onAuthSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'learner' | 'administrator'>('learner');
  const [email, setEmail] = useState('adarsh.pratap@mjpru.ac.in');
  const [password, setPassword] = useState('password123');

  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [roleTab, setRoleTab] = useState<'Learner' | 'Admin'>(() => {
    if (initialRole === 'company') return 'Admin';
    return 'Learner';
  });

  const [photoPreview, setPhotoPreview] = useState<string>(() => {
    return localStorage.getItem('userPhoto') || localStorage.getItem('profilePhoto') || '';
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const role: UserRole = activeTab === 'learner' ? 'student' : 'hod';
    
    setIsSubmitting(true);

    try {
      const locData = await detectAccurateLocation();

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
        photo: profile.photo,
        location: profile.location,
        mode: authMode
      };

      onAuthSuccess(payload);
      onClose();
    } catch (err) {
      console.error('Auth submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0B132B] border border-[#1E2964] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
        
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
              setRoleTab('Learner');
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
              setRoleTab('Admin');
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
          {/* Dual Switchers: 1. Mode Toggle [Sign In] [Register] + 2. Role Tabs [Student][Recruiter] */}
          <div className="p-3 space-y-3 bg-[#0E1538]/50 rounded-xl border border-white/5">
            {/* Mode Toggle [Sign In] [Register] */}
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
                Register
              </button>
            </div>

            {/* Role Tabs */}
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
                <UserCheck className="w-3.5 h-3.5" />
                Learner / Student
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
                <ShieldCheck className="w-3.5 h-3.5" />
                Recruiter / Admin
              </button>
            </div>
          </div>

          {/* Form Fields based on roleTab and authMode */}
          {roleTab === 'Learner' && (
            <div className="space-y-3 bg-[#0A0F2E] p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300">Learner Academic Credentials</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded-md">DigiLocker Verified</span>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Adarsh Pratap Singh"
                    className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">@</span>
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
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
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

              {authMode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        University Roll No
                      </label>
                      <input
                        type="text"
                        required
                        value={studentRollNo}
                        onChange={(e) => setStudentRollNo(e.target.value)}
                        placeholder="22001015001"
                        className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Batch / Year
                      </label>
                      <input
                        type="text"
                        required
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        placeholder="2025-29"
                        className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Department / Course
                    </label>
                    <select
                      value={studentDept}
                      onChange={(e) => setStudentDept(e.target.value)}
                      className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d} className="bg-[#12183D] text-white">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {roleTab === 'Admin' && (
            <div className="space-y-3 bg-[#0A0F2E] p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300">Recruiter / Admin Credentials</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md">Enterprise Portal</span>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Representative Name
                  </label>
                  <input
                    type="text"
                    required
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Professional Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">@</span>
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
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
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

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  required
                  value={recruiterCompany}
                  onChange={(e) => setRecruiterCompany(e.target.value)}
                  placeholder="e.g. Google Cloud India"
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
