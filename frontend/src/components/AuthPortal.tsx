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
        </form>

      </div>
    </div>
  );
};
