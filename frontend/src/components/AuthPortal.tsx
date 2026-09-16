import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
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
  const [email, setEmail] = useState('adarsh.pratap@mjpru.ac.in');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('student');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthSuccess({
      role,
      token: 'mock_jwt_token_sih26101',
      student: {
        id: 1,
        name: 'Adarsh Pratap Singh',
        email,
        targetRole: 'AI & Official Statistics Systems Architect',
        careerReadiness: 96,
        avatar: '',
        skills: ['Python', 'SQL', 'React', 'Official Statistics']
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0B132B] border border-[#1E2964] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Ladder Secure Authentication Portal
          </div>
          <h2 className="text-xl font-black text-white">Project ID: sih26101 - Smart India Hackathon</h2>
          <p className="text-xs text-slate-400">Sign in to access your iGOT verified student portfolio & AI Advisor.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Select Portal Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-[#0F172A] border border-[#1E2964] rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="student">Student / Candidate (Adarsh Pratap Singh)</option>
              <option value="hod">Faculty / HOD Portal</option>
              <option value="mentor">Industry Mentor Portal</option>
              <option value="recruiter">Recruiter / Enterprise Portal</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0F172A] border border-[#1E2964] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password / Token</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0F172A] border border-[#1E2964] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer"
          >
            <span>Authenticate & Launch Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
