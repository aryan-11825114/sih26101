import React from 'react';

interface Props {
  title: string;
  duration: string;
  difficulty: string;
  onView: () => void;
}

export const RecommendedCourseCard: React.FC<Props> = ({ title, duration, difficulty, onView }) => {
  return (
    <div className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964] hover:border-[#7C5CFC] transition-all flex flex-col justify-between group shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">iGOT</span>
            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">{difficulty}</span>
        </div>
        <h3 className="text-xs font-bold text-white mb-1.5">{title}</h3>
      </div>
      <div className="pt-3 mt-3 border-t border-[#18214D] flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono text-[11px]">{duration}</span>
        <button onClick={onView} className="text-[#A78BFA] font-bold text-[10px] hover:underline cursor-pointer">
          View on iGOT →
        </button>
      </div>
    </div>
  );
};
