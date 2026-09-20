import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

interface LearningHoursTrackerProps {
  onClick?: () => void;
  totalHours?: string;
}

export const LearningHoursTracker: React.FC<LearningHoursTrackerProps> = ({
  onClick,
  totalHours = '28.5 Hrs'
}) => {
  return (
    <div 
      onClick={onClick}
      className="p-3 rounded-xl bg-[#1A1F3D]/60 hover:bg-[#1A1F3D] border border-white/5 hover:border-[#7C5CFC]/40 transition-all flex items-center justify-between cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-white">Learning Hours Tracker</div>
          <div className="text-[10px] text-white/50">Total time spent learning & active sessions</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-500/30">
          {totalHours}
        </span>
        <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white" />
      </div>
    </div>
  );
};
