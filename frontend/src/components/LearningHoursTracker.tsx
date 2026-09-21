import React from 'react';
import { Clock } from 'lucide-react';

export interface LearningHoursTrackerProps {
  totalHours?: string | number;
  subtitle?: string;
  activeSessions?: number;
  onClick?: () => void;
  className?: string;
}

export const LearningHoursTracker: React.FC<LearningHoursTrackerProps> = ({
  totalHours = '24.5 Hrs',
  subtitle = 'Total time spent learning & active sessions',
  onClick,
  className = ''
}) => {
  const formattedHours = typeof totalHours === 'number' ? `${totalHours} Hrs` : totalHours;

  return (
    <div
      id="learning-hours-tracker-card"
      onClick={onClick}
      className={`p-3 rounded-xl bg-[#1A1F3D]/60 hover:bg-[#1A1F3D] border border-white/5 hover:border-[#7C5CFC]/40 transition-all flex items-center justify-between cursor-pointer group ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-white">Learning Hours Tracker</div>
          <div className="text-[10px] text-white/50">{subtitle}</div>
        </div>
      </div>
      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-500/30 shrink-0">
        {formattedHours}
      </span>
    </div>
  );
};

export default LearningHoursTracker;
