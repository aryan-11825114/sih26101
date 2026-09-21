import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  GraduationCap, 
  Users, 
  Building2, 
  Briefcase,
  ArrowRight,
  Lock,
  Mail,
  User,
  ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';
import { Register } from './Register';
import { CollegeItem, COLLEGES_DATA } from '../data/colleges';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { 
    name: string; 
    role: UserRole; 
    email: string;
    college?: CollegeItem | null;
  }) => void;
  initialMode?: 'login' | 'register' | 'switchRole';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'switchRole'>(initialMode);
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('adarsh.pratap@mjpru.ac.in');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Adarsh Pratap Singh');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // If in register mode, render the dedicated 3-pathway Register component
  if (mode === 'register') {
    return (
      <Register
        isOpen={isOpen}
        onClose={onClose}
        initialRole={role}
        onRegisterSuccess={(userData) => {
          onLoginSuccess({
            name: userData.name,
            role: userData.role,
            email: userData.email,
            college: userData.college
          });
          onClose();
        }}
      />
    );
  }

  const saveProfileToStorage = (profileData: {
    name: string;
    rollNo?: string;
    email: string;
    department: string;
    college: string;
    year: string;
    role: UserRole;
  }) => {
    const fullProfile = {
      name: profileData.name,
      rollNo: profileData.rollNo || (profileData.role === 'student' ? '22001015001' : 'FAC-00102'),
      email: profileData.email,
      department: profileData.department,
      college: profileData.college,
      year: profileData.year,
      role: profileData.role,
      location: 'Bareilly, Uttar Pradesh, India',
      photo: localStorage.getItem('profilePhoto') || null
    };

    localStorage.setItem('userProfile', JSON.stringify(fullProfile));
    localStorage.setItem('userName', profileData.name);
    localStorage.setItem('role', profileData.role);
    localStorage.setItem('userRole', profileData.role === 'mentor' ? 'Mentor' : profileData.role === 'hod' ? 'HOD' : 'student');
    localStorage.setItem('roleLocked', 'true');
    localStorage.setItem('userEmail', profileData.email);
    localStorage.setItem('userCourse', profileData.department);
    localStorage.setItem('userCollege', profileData.college);
    localStorage.setItem('userYear', profileData.year);
  };

  const handleQuickRoleSwitch = (
    selectedRole: UserRole, 
    demoName: string, 
    demoEmail: string,
    demoRollNo: string,
    demoDept: string,
    demoCollege: string,
    demoYear: string
  ) => {
    saveProfileToStorage({
      name: demoName,
      rollNo: demoRollNo,
      email: demoEmail,
      department: demoDept,
      college: demoCollege,
      year: demoYear,
      role: selectedRole
    });

    const collegeObj = COLLEGES_DATA.find(c => c.name === demoCollege) || COLLEGES_DATA[0];

    onLoginSuccess({
      name: demoName,
      role: selectedRole,
      email: demoEmail,
      college: collegeObj
    });
    onClose();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let defaultDept = 'Computer Science & Information Technology';
      let defaultCollege = 'Mahatma Jyotiba Phule Rohilkhand University, Bareilly';
      let defaultYear = '2025-29';

      if (role === 'mentor') {
        defaultDept = 'Enterprise Systems Architecture';
        defaultCollege = 'TCS Innovation Labs';
        defaultYear = 'Senior Architect';
      } else if (role === 'hod') {
        defaultDept = 'Computer Science & Information Technology';
        defaultCollege = 'Mahatma Jyotiba Phule Rohilkhand University, Bareilly';
        defaultYear = 'Department Head';
      }

      saveProfileToStorage({
        name: fullName,
        email,
        department: defaultDept,
        college: defaultCollege,
        year: defaultYear,
        role
      });

      const collegeObj = COLLEGES_DATA.find(c => c.name === defaultCollege) || COLLEGES_DATA[0];

      onLoginSuccess({
        name: fullName,
        role: role as UserRole,
        email,
        college: collegeObj
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 select-none">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-lg bg-[#0B0F2A] border border-white/[0.08] rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] overflow-hidden p-6 sm:p-7 z-10 animate-fade-in font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-base mb-2.5">
            L
          </div>
          <h2 className="text-lg font-extrabold text-white">Ladder</h2>
          <p className="text-xs text-white/40 mt-0.5">Dynamic Authentication & Academic OS</p>
        </div>

        {/* 1-Click Role Switcher Presets */}
        <div className="mb-5 p-3 rounded-xl bg-[#151A32] border border-white/[0.06]">
          <p className="text-[10.5px] font-bold text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Instant Pathway Presets</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickRoleSwitch(
                'student',
                'Adarsh Pratap Singh',
                'adarsh.pratap@mjpru.ac.in',
                '22001015001',
                'Computer Science & Information Technology',
                'Mahatma Jyotiba Phule Rohilkhand University, Bareilly',
                '2025-29'
              )}
              className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#7C5CFC]/40 text-left transition-all group cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-cyan-400 mb-1" />
              <p className="text-[11px] font-bold text-white leading-tight">Student</p>
              <p className="text-[9.5px] text-white/40 truncate">CSIT · Bareilly</p>
            </button>

            <button
              onClick={() => handleQuickRoleSwitch(
                'mentor',
                'Amit Verma',
                'amit.verma@tcs.com',
                'EMP-90412',
                'Enterprise Systems Architecture',
                'TCS Innovation Labs',
                'Senior Architect'
              )}
              className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#7C5CFC]/40 text-left transition-all group cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-400 mb-1" />
              <p className="text-[11px] font-bold text-white leading-tight">Mentor</p>
              <p className="text-[9.5px] text-white/40 truncate">TCS Architect</p>
            </button>

            <button
              onClick={() => handleQuickRoleSwitch(
                'hod',
                'Dr. Arvind K. Sharma',
                'hod.csit@mjpru.ac.in',
                'FAC-00102',
                'Computer Science & Information Technology',
                'Mahatma Jyotiba Phule Rohilkhand University, Bareilly',
                'Department Head'
              )}
              className="p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#7C5CFC]/40 text-left transition-all group cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-amber-400 mb-1" />
              <p className="text-[11px] font-bold text-white leading-tight">HOD / Faculty</p>
              <p className="text-[9.5px] text-white/40 truncate">MJPRU CSIT</p>
            </button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex border-b border-white/[0.06] mb-4">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 ${
              mode === 'login'
                ? 'border-[#7C5CFC] text-[#C4B5FD]'
                : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 ${
              mode === 'register'
                ? 'border-[#7C5CFC] text-[#C4B5FD]'
                : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            Register Pathway (3 Roles)
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-3">
          {/* Role selector tabs */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 mb-1">Select Role</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['student', 'mentor', 'hod', 'company'] as UserRole[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                    role === r
                      ? 'bg-[#7C5CFC] border-[#7C5CFC] text-white'
                      : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white'
                  }`}
                >
                  {r === 'student' ? 'Student' : r === 'mentor' ? 'Mentor' : r === 'hod' ? 'HOD' : 'Recruiter'}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Adarsh Pratap Singh"
                className="w-full bg-[#1A1F3D] border border-white/[0.08] focus:border-[#7C5CFC] text-white text-xs rounded-xl pl-8 pr-3 py-2 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 mb-1">Official Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adarsh.pratap@mjpru.ac.in"
                className="w-full bg-[#1A1F3D] border border-white/[0.08] focus:border-[#7C5CFC] text-white text-xs rounded-xl pl-8 pr-3 py-2 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1A1F3D] border border-white/[0.08] focus:border-[#7C5CFC] text-white text-xs rounded-xl pl-8 pr-3 py-2 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In & Launch Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
