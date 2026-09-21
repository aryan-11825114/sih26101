import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Compass, 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  Award, 
  Users, 
  CheckCircle2,
  Bot,
  User,
  Zap,
  TrendingUp
} from 'lucide-react';
import { StudentProfile } from '../types';

interface AICareerAdvisorViewProps {
  student?: StudentProfile | null;
  onNavigate?: (tab: string) => void;
  onNavigateTab?: (tab: string) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    tab: string;
  };
}

export const AICareerAdvisorView: React.FC<AICareerAdvisorViewProps> = ({ 
  student, 
  onNavigate, 
  onNavigateTab 
}) => {
  const navigate = onNavigate || onNavigateTab;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${student?.name || 'Adarsh'}! I am your AI Career Advisor. Based on your verified Skill Twin DNA (Python L5, PostgreSQL L4, React L3), you are currently at 74% Industry Readiness for Full Stack Software Engineer roles. How can I help guide your placement roadmap today?`,
      timestamp: 'Just now',
      suggestedAction: {
        label: 'View Skill Gap Summary',
        tab: 'skill-gap'
      }
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predefinedPrompts = [
    "What priority skills should I learn next?",
    "Am I eligible for TCS Digital & Infosys?",
    "Generate 30-day placement preparation roadmap",
    "How do I boost my AWS & Cloud Architecture score?"
  ];

  const handleSendPrompt = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);
    setError(null);

    try {
        console.log('Sending request to AI advisor:', text);
        const response = await fetch('/api/ai/helpdesk/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, history: messages })
        });

        const data = await response.json();
        console.log('Received response from AI advisor:', data);

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to get a response');
        }

        const aiMsg: Message = {
            id: `ai_${Date.now()}`,
            sender: 'ai',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
        console.error('AICareerAdvisorView error:', err);
        setError(err.message || 'An unexpected error occurred');
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-extrabold text-white">AI Career Advisor & Strategic Copilot</h1>
          </div>
          <p className="text-xs text-slate-300">
            Real-time personalized placement guidance, skill roadmap planning, and hiring analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl">
            ⚡ Model: Gemini 2.5 Pro Career Engine
          </span>
        </div>
      </div>

      {/* Suggested Fast Query Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {predefinedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(p)}
            className="px-3 py-1.5 rounded-xl bg-[#0B1033] border border-[#1C265E] hover:border-[#7C5CFC] hover:bg-[#141C48] text-slate-300 text-xs font-medium shrink-0 transition-all cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Panel */}
      <div className="p-6 rounded-2xl bg-[#0B1033] border border-[#1C265E] space-y-4 shadow-xl min-h-[420px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 text-xs text-center">
              Error: {error}
            </div>
          )}
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-[#7C5CFC]/20 text-[#A78BFA] border border-[#7C5CFC]/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  isAI 
                    ? 'bg-[#0E1538] border border-[#1E2964] text-slate-200' 
                    : 'bg-[#7C5CFC] text-white'
                }`}>
                  <p className="whitespace-pre-line font-medium">{msg.text}</p>
                  
                  {msg.suggestedAction && navigate && (
                    <div className="pt-2 border-t border-white/10">
                      <button
                        onClick={() => navigate(msg.suggestedAction!.tab)}
                        className="px-3 py-1.5 rounded-lg bg-[#141C48] hover:bg-[#1D296C] text-[#C4B5FD] text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{msg.suggestedAction.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <span className="text-[9px] text-slate-400 block text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-purple-400 italic">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing Ladder Career DNA...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputPrompt);
          }}
          className="flex items-center gap-2 pt-4 border-t border-[#182352]"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask about placement eligibility, interview roadmaps, skill priorities..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#070B1E] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#7C5CFC]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
