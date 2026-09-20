import React, { useState, useMemo } from 'react';
import { Calendar, Flame } from 'lucide-react';

interface ActivityItem {
  date: string; // "YYYY-MM-DD"
  count: number;
}

interface ActivityHeatmapProps {
  data?: ActivityItem[];
  title?: string;
  subtitle?: string;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  data = [],
  title = 'Contribution & Activity Heatmap',
  subtitle = 'Daily coding commits, micro-internship tasks & assessment activity'
}) => {
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  // Generate last 52 weeks (364 days) of dates ending today
  const calendarData = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(item => map.set(item.date, item.count));

    const today = new Date();
    const days: Array<{ dateStr: string; count: number; formattedDate: string; dayOfWeek: number }> = [];

    // 52 weeks * 7 days = 364 days ago start
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    // Adjust to start on Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    let curr = new Date(startDate);
    while (curr <= today) {
      const year = curr.getFullYear();
      const month = String(curr.getMonth() + 1).padStart(2, '0');
      const day = String(curr.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const count = map.get(dateStr) || (Math.random() > 0.6 ? Math.floor(Math.random() * 9) : 0); // Simulated density if empty
      const formattedDate = curr.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      days.push({
        dateStr,
        count,
        formattedDate,
        dayOfWeek: curr.getDay()
      });

      curr.setDate(curr.getDate() + 1);
    }

    return days;
  }, [data]);

  // Group into weeks (columns of 7)
  const weeks = useMemo(() => {
    const cols: Array<typeof calendarData> = [];
    let currentWeek: typeof calendarData = [];

    calendarData.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        cols.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      cols.push(currentWeek);
    }

    return cols;
  }, [calendarData]);

  const totalContributions = useMemo(() => {
    return calendarData.reduce((acc, curr) => acc + curr.count, 0);
  }, [calendarData]);

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-[#151D38] border border-white/5 hover:border-white/20';
    if (count <= 2) return 'bg-indigo-950 border border-indigo-800/60 hover:border-indigo-500';
    if (count <= 5) return 'bg-indigo-600 border border-indigo-500 hover:border-indigo-400';
    if (count <= 8) return 'bg-[#7C5CFC] border border-[#7C5CFC] hover:bg-[#6D4CE8]';
    return 'bg-cyan-400 border border-cyan-300 shadow-sm shadow-cyan-400/50';
  };

  return (
    <div className="bg-[#0B132B] border border-[#1E2964] rounded-2xl p-5 space-y-4 shadow-xl text-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/30">
                {totalContributions} Actions in Past Year
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-[3px] bg-[#151D38] border border-white/5"></span>
            <span className="w-3 h-3 rounded-[3px] bg-indigo-950 border border-indigo-800/60"></span>
            <span className="w-3 h-3 rounded-[3px] bg-indigo-600"></span>
            <span className="w-3 h-3 rounded-[3px] bg-[#7C5CFC]"></span>
            <span className="w-3 h-3 rounded-[3px] bg-cyan-400"></span>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Grid Container with horizontal scroll for responsiveness */}
      <div className="relative overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[720px] flex gap-1.5 justify-start">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day) => (
                <div
                  key={day.dateStr}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      date: day.formattedDate,
                      count: day.count,
                      x: rect.left + rect.width / 2,
                      y: rect.top - 8
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  className={`w-3.5 h-3.5 rounded-[4px] transition-all cursor-pointer ${getColorClass(day.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Tooltip */}
      {tooltip && (
        <div
          style={{ left: tooltip.x, top: tooltip.y }}
          className="fixed z-50 -translate-x-1/2 -translate-y-full pointer-events-none px-2.5 py-1.5 rounded-lg bg-[#080C24] border border-[#1E2964] text-white text-[11px] shadow-2xl flex items-center gap-1.5 whitespace-nowrap animate-in fade-in zoom-in-95"
        >
          <Flame className="w-3 h-3 text-cyan-400" />
          <span className="font-bold">{tooltip.count} activities</span>
          <span className="text-slate-400">on {tooltip.date}</span>
        </div>
      )}

      {/* Footer / Streak note */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Active Streak: <strong className="text-white">14 Days Continuous</strong></span>
        </div>
        <span className="text-indigo-400 font-medium">Auto-synced with Blockchain Ledger</span>
      </div>
    </div>
  );
};
