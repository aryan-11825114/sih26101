import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Flame, Calendar, Trophy, Zap, ChevronRight, Activity } from 'lucide-react';

/**
 * Activity data item specification
 */
export interface ActivityDay {
  date: string; // ISO date string "YYYY-MM-DD"
  count: number;
  metadata?: {
    type?: string;
    details?: string;
  };
}

export interface ActivityHeatmapProps {
  /**
   * Dynamic activity array: [{ date: "YYYY-MM-DD", count: number }]
   * If omitted, high-craft realistic activity data will be automatically generated.
   */
  data?: ActivityDay[];
  /**
   * Reference end date for the grid (defaults to today)
   */
  endDate?: Date | string;
  /**
   * Total number of weeks to display (default: 52 weeks = 1 full year)
   */
  numWeeks?: number;
  /**
   * Accent color palette
   * - 'emerald': Classic GitHub contribution green
   * - 'purple': Platform theme (Ladder AI violet/indigo)
   * - 'cyan': Tech/cyber cyan
   */
  colorScheme?: 'emerald' | 'purple' | 'cyan';
  /**
   * Optional custom card title
   */
  title?: string;
  /**
   * Optional custom card subtitle
   */
  subtitle?: string;
  /**
   * Toggle statistical banner (Total, Active Days, Streaks)
   */
  showStats?: boolean;
  /**
   * Custom container classes
   */
  className?: string;
  /**
   * Callback fired when a date block is clicked
   */
  onDayClick?: (day: { date: string; count: number; formattedDate: string }) => void;
}

/**
 * Helper function: formats a Date object into "YYYY-MM-DD" string in local time
 */
export function formatToISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Helper function: human-readable date e.g. "Oct 24, 2025"
 */
export function formatDisplayDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Helper function: Generates realistic dummy activity data across past 52 weeks
 * Simulates real coding & learning patterns: weekday productivity peaks, sprint cycles,
 * milestone spikes, and realistic rest days.
 */
export function generateSampleActivityData(endDate: Date = new Date(), weeksCount = 52): ActivityDay[] {
  const result: ActivityDay[] = [];
  const totalDays = weeksCount * 7;
  const current = new Date(endDate);
  current.setHours(0, 0, 0, 0);

  // Generate backwards from endDate
  for (let i = totalDays; i >= 0; i--) {
    const d = new Date(current);
    d.setDate(d.getDate() - i);
    const iso = formatToISODate(d);
    const dayOfWeek = d.getDay(); // 0 = Sun, 6 = Sat

    // Weighted random pattern: higher on Mon-Fri, occasional sprints, occasional rest days
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const rand = Math.random();

    let count = 0;
    if (isWeekend) {
      if (rand > 0.6) {
        count = Math.floor(Math.random() * 5); // 0-4
      }
    } else {
      if (rand > 0.25) {
        if (rand > 0.88) {
          count = Math.floor(Math.random() * 6) + 8; // 8-13 (High)
        } else if (rand > 0.55) {
          count = Math.floor(Math.random() * 4) + 4; // 4-7 (Medium)
        } else {
          count = Math.floor(Math.random() * 3) + 1; // 1-3 (Low)
        }
      }
    }

    // Add a strong active streak in recent weeks
    if (i < 20 && rand > 0.15) {
      count = Math.max(count, Math.floor(Math.random() * 6) + 3);
    }

    if (count > 0) {
      result.push({ date: iso, count });
    }
  }

  return result;
}

/**
 * Activity Heatmap Component
 * 
 * Provides a responsive 52-week activity grid with tooltips, streak statistics,
 * horizontal scrolling, smooth hover interaction, and dynamic zero-filling.
 */
export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  data,
  endDate = new Date(),
  numWeeks = 52,
  colorScheme = 'purple',
  title = 'Learning & Contribution Activity',
  subtitle = 'Daily interactive commits, quizzes, and lab sessions',
  showStats = true,
  className = '',
  onDayClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Parse reference end date
  const resolvedEndDate = useMemo(() => {
    return typeof endDate === 'string' ? new Date(endDate) : endDate;
  }, [endDate]);

  // Use provided data or realistic dummy activity sample
  const resolvedData = useMemo(() => {
    if (data && data.length > 0) {
      return data;
    }
    return generateSampleActivityData(resolvedEndDate, numWeeks);
  }, [data, resolvedEndDate, numWeeks]);

  // Fast O(1) hash map of date string -> activity count
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of resolvedData) {
      map.set(item.date, item.count);
    }
    return map;
  }, [resolvedData]);

  // Tooltip state with fixed viewport coordinates to prevent clipping in scroll containers
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    formattedDate: string;
    x: number;
    y: number;
  } | null>(null);

  const [selectedCell, setSelectedCell] = useState<{
    date: string;
    count: number;
    formattedDate: string;
  } | null>(null);

  /**
   * Helper function: Built-in 0-activity handler.
   * Given any date, safely retrieves its activity count without breaking grid coordinates.
   */
  const getActivityForDate = (dateStr: string): number => {
    return activityMap.get(dateStr) || 0;
  };

  /**
   * Color Level Thresholds:
   * Level 0: 0 activities (gray/blank)
   * Level 1: 1 - 3 activities (low)
   * Level 2: 4 - 7 activities (medium)
   * Level 3: 8+ activities (high)
   */
  const getActivityLevel = (count: number): 0 | 1 | 2 | 3 => {
    if (count <= 0) return 0;
    if (count <= 3) return 1;
    if (count <= 7) return 2;
    return 3;
  };

  /**
   * Theme styling mappings based on chosen colorScheme
   */
  const themeClasses = useMemo(() => {
    switch (colorScheme) {
      case 'emerald':
        return {
          level0: 'bg-white/[0.04] border border-white/[0.03]',
          level1: 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-300',
          level2: 'bg-emerald-600/80 border border-emerald-400/50 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]',
          level3: 'bg-emerald-400 border border-emerald-200 text-slate-950 font-bold shadow-[0_0_12px_rgba(52,211,153,0.6)]',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          accent: 'text-emerald-400',
          hoverOutline: 'hover:ring-2 hover:ring-emerald-400 hover:z-10',
        };
      case 'cyan':
        return {
          level0: 'bg-white/[0.04] border border-white/[0.03]',
          level1: 'bg-cyan-950/80 border border-cyan-500/30 text-cyan-300',
          level2: 'bg-cyan-600/80 border border-cyan-400/50 text-white shadow-[0_0_8px_rgba(6,182,212,0.3)]',
          level3: 'bg-cyan-400 border border-cyan-200 text-slate-950 font-bold shadow-[0_0_12px_rgba(34,211,238,0.6)]',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          accent: 'text-cyan-400',
          hoverOutline: 'hover:ring-2 hover:ring-cyan-400 hover:z-10',
        };
      case 'purple':
      default:
        return {
          level0: 'bg-white/[0.04] border border-white/[0.03]',
          level1: 'bg-purple-950/70 border border-purple-500/30 text-purple-300',
          level2: 'bg-[#7C5CFC]/80 border border-purple-400/50 text-white shadow-[0_0_8px_rgba(124,92,252,0.3)]',
          level3: 'bg-purple-400 border border-purple-200 text-slate-950 font-bold shadow-[0_0_12px_rgba(192,132,252,0.6)]',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          accent: 'text-purple-400',
          hoverOutline: 'hover:ring-2 hover:ring-purple-400 hover:z-10',
        };
    }
  }, [colorScheme]);

  /**
   * Build the 52-week calendar grid:
   * 7 rows (Sunday = 0 to Saturday = 6).
   * 52 columns (weeks).
   * Also calculates where month labels should appear.
   */
  const { weeks, monthLabels, stats } = useMemo(() => {
    const end = new Date(resolvedEndDate);
    end.setHours(23, 59, 59, 999);

    // End on Saturday to round out the last week column
    const endDayOfWeek = end.getDay();
    const gridEnd = new Date(end);
    gridEnd.setDate(end.getDate() + (6 - endDayOfWeek));

    // Calculate grid start date (numWeeks weeks back, starting on Sunday)
    const totalDays = numWeeks * 7;
    const gridStart = new Date(gridEnd);
    gridStart.setDate(gridEnd.getDate() - totalDays + 1);
    gridStart.setHours(0, 0, 0, 0);

    const calculatedWeeks: Array<
      Array<{
        dateStr: string;
        count: number;
        level: 0 | 1 | 2 | 3;
        isFuture: boolean;
      }>
    > = [];

    const months: Array<{ label: string; weekIndex: number }> = [];
    let lastMonth = -1;

    let totalActivities = 0;
    let activeDays = 0;
    let maxCountInDay = 0;
    let bestDayDate = '';

    const currentDateCursor = new Date(gridStart);
    const todayISO = formatToISODate(new Date());

    for (let w = 0; w < numWeeks; w++) {
      const currentWeek: Array<{
        dateStr: string;
        count: number;
        level: 0 | 1 | 2 | 3;
        isFuture: boolean;
      }> = [];

      for (let d = 0; d < 7; d++) {
        const iso = formatToISODate(currentDateCursor);
        const isFuture = iso > todayISO;
        const count = isFuture ? 0 : (activityMap.get(iso) || 0);
        const level = isFuture ? 0 : getActivityLevel(count);

        if (!isFuture && count > 0) {
          totalActivities += count;
          activeDays += 1;
          if (count > maxCountInDay) {
            maxCountInDay = count;
            bestDayDate = iso;
          }
        }

        // Track month label on first Sunday of a month or when month changes
        if (d === 0) {
          const monthIdx = currentDateCursor.getMonth();
          if (monthIdx !== lastMonth) {
            months.push({
              label: currentDateCursor.toLocaleDateString('en-US', { month: 'short' }),
              weekIndex: w,
            });
            lastMonth = monthIdx;
          }
        }

        currentWeek.push({
          dateStr: iso,
          count,
          level,
          isFuture,
        });

        // Step cursor to next day
        currentDateCursor.setDate(currentDateCursor.getDate() + 1);
      }

      calculatedWeeks.push(currentWeek);
    }

    // Calculate current streak & longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let currentStreak = 0;

    // Iterate backwards from today to find current streak
    const checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    let isCurrentStreakBroken = false;
    for (let i = 0; i < 365; i++) {
      const d = new Date(checkDate);
      d.setDate(d.getDate() - i);
      const iso = formatToISODate(d);
      const count = activityMap.get(iso) || 0;

      if (!isCurrentStreakBroken) {
        // Allow streak to continue if today has 0 activities yet, but yesterday was active
        if (i === 0 && count === 0) {
          // Continue to yesterday check
        } else if (count > 0) {
          currentStreak++;
        } else {
          isCurrentStreakBroken = true;
        }
      }

      // Longest streak calculation
      if (count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    return {
      weeks: calculatedWeeks,
      monthLabels: months,
      stats: {
        totalActivities,
        activeDays,
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        bestDay: bestDayDate ? { date: bestDayDate, count: maxCountInDay } : null,
      },
    };
  }, [resolvedEndDate, numWeeks, activityMap]);

  // Auto-scroll to the end (latest weeks) on initial mount so recent activities are visible
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [weeks]);

  // Cell hover handler with viewport-relative tooltip positioning
  const handleCellMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    dateStr: string,
    count: number
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredCell({
      date: dateStr,
      count,
      formattedDate: formatDisplayDate(dateStr),
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const handleCellMouseLeave = () => {
    setHoveredCell(null);
  };

  const handleCellClick = (dateStr: string, count: number) => {
    const payload = {
      date: dateStr,
      count,
      formattedDate: formatDisplayDate(dateStr),
    };
    setSelectedCell(payload);
    if (onDayClick) {
      onDayClick(payload);
    }
  };

  const dayRowLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div
      id="activity-heatmap-card"
      className={`relative rounded-2xl bg-[#0B0F2A] border border-white/10 p-4 sm:p-5 shadow-xl select-none ${className}`}
    >
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#7C5CFC]/20 text-[#A78BFA] flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>{title}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${themeClasses.badge}`}>
                {stats.totalActivities.toLocaleString()} Activities
              </span>
            </div>
            <div className="text-[11px] text-white/50">{subtitle}</div>
          </div>
        </div>

        {/* Quick Streak Badges */}
        {showStats && (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/5 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <div className="text-right">
                <span className="text-[10px] text-white/40 block leading-none">Current</span>
                <span className="text-xs font-bold text-white leading-none">
                  {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/5 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
              <div className="text-right">
                <span className="text-[10px] text-white/40 block leading-none">Longest</span>
                <span className="text-xs font-bold text-white leading-none">
                  {stats.longestStreak} {stats.longestStreak === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Day Quick Details (if clicked) */}
      {selectedCell && (
        <div className="mt-3 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#7C5CFC]" />
            <span className="font-semibold text-white">{selectedCell.formattedDate}</span>
            <span className="text-white/40">—</span>
            <span className="text-purple-300 font-bold">
              {selectedCell.count === 0 ? 'No activity logged' : `${selectedCell.count} ${selectedCell.count === 1 ? 'activity' : 'activities'}`}
            </span>
          </div>
          <button
            onClick={() => setSelectedCell(null)}
            className="text-[10px] text-white/40 hover:text-white cursor-pointer"
          >
            ✕ Clear
          </button>
        </div>
      )}

      {/* Heatmap Grid Section with Smooth Horizontal Scrolling */}
      <div className="mt-4 relative">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-transparent"
        >
          <div className="inline-block min-w-full">
            {/* Month Labels along the top */}
            <div className="flex text-[10px] text-white/40 mb-1.5 pl-7 select-none">
              {weeks.map((_, weekIdx) => {
                const month = monthLabels.find((m) => m.weekIndex === weekIdx);
                return (
                  <div
                    key={`m-${weekIdx}`}
                    style={{ width: '13px', marginRight: '3px' }}
                    className="shrink-0 overflow-visible text-left"
                  >
                    {month ? (
                      <span className="whitespace-nowrap font-medium text-white/70">
                        {month.label}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Grid with 7 Day Rows */}
            <div className="flex">
              {/* Day of week labels on left (Mon, Wed, Fri) */}
              <div className="flex flex-col gap-[3px] pr-2 text-[9px] font-medium text-white/30 select-none shrink-0 justify-between">
                {dayRowLabels.map((label, rowIdx) => (
                  <div key={label} className="h-[12px] flex items-center leading-none">
                    {/* Show alternating day labels for clean readability */}
                    {rowIdx === 1 || rowIdx === 3 || rowIdx === 5 ? (
                      <span>{label}</span>
                    ) : (
                      <span className="opacity-0">·</span>
                    )}
                  </div>
                ))}
              </div>

              {/* 52 Week Columns */}
              <div className="flex gap-[3px]">
                {weeks.map((week, weekIdx) => (
                  <div key={`col-${weekIdx}`} className="flex flex-col gap-[3px] shrink-0">
                    {week.map((day, dayIdx) => {
                      // Determine cell class
                      let levelClass = themeClasses.level0;
                      if (!day.isFuture) {
                        if (day.level === 1) levelClass = themeClasses.level1;
                        if (day.level === 2) levelClass = themeClasses.level2;
                        if (day.level === 3) levelClass = themeClasses.level3;
                      }

                      const isSelected = selectedCell?.date === day.dateStr;

                      return (
                        <div
                          key={day.dateStr || `${weekIdx}-${dayIdx}`}
                          onMouseEnter={(e) =>
                            !day.isFuture && handleCellMouseEnter(e, day.dateStr, day.count)
                          }
                          onMouseLeave={handleCellMouseLeave}
                          onClick={() => !day.isFuture && handleCellClick(day.dateStr, day.count)}
                          className={`w-[12px] h-[12px] rounded-[3px] transition-all cursor-pointer ${levelClass} ${
                            !day.isFuture ? themeClasses.hoverOutline : 'opacity-20 cursor-default'
                          } ${isSelected ? 'ring-2 ring-white scale-110 z-10' : ''}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Activity Legend & Summary stats */}
      <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-white/50">
        <div className="flex items-center gap-3">
          <span className="text-[11px]">Active Days:</span>
          <span className="font-semibold text-white text-[11px]">
            {stats.activeDays} days ({Math.round((stats.activeDays / (numWeeks * 7)) * 100)}% consistency)
          </span>
        </div>

        {/* Legend: Less -> More */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[10px] text-white/40">Less</span>
          <div className="flex items-center gap-1">
            <div className={`w-[11px] h-[11px] rounded-[2px] ${themeClasses.level0}`} title="0 activities" />
            <div className={`w-[11px] h-[11px] rounded-[2px] ${themeClasses.level1}`} title="1-3 activities" />
            <div className={`w-[11px] h-[11px] rounded-[2px] ${themeClasses.level2}`} title="4-7 activities" />
            <div className={`w-[11px] h-[11px] rounded-[2px] ${themeClasses.level3}`} title="8+ activities" />
          </div>
          <span className="text-[10px] text-white/40">More</span>
        </div>
      </div>

      {/* Floating Tooltip (Viewport fixed positioning to prevent clipping) */}
      {hoveredCell && (
        <div
          className="fixed z-70 pointer-events-none -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-slate-900/95 border border-white/20 text-white text-[11px] shadow-2xl backdrop-blur-md whitespace-nowrap transition-all duration-75"
          style={{
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y}px`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white">
              {hoveredCell.count === 0 ? 'No activity' : `${hoveredCell.count} ${hoveredCell.count === 1 ? 'activity' : 'activities'}`}
            </span>
            <span className="text-white/40">on</span>
            <span className="text-purple-300 font-medium">{hoveredCell.formattedDate}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHeatmap;
