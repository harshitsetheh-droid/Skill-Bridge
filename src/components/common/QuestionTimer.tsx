import React from 'react';
import { Timer } from 'lucide-react';

interface QuestionTimerProps {
  seconds: number;
  progress: number;
  totalSeconds?: number;
}

export const QuestionTimer: React.FC<QuestionTimerProps> = ({ seconds, progress, totalSeconds = 30 }) => {
  const danger = seconds <= 5;
  const warn = seconds <= 10 && !danger;
  const color = danger ? '#dc2626' : warn ? '#d97706' : '#4f46e5';
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${
        danger
          ? 'bg-red-50 border-red-200 text-red-700'
          : warn
          ? 'bg-amber-50 border-amber-200 text-amber-700'
          : 'bg-indigo-50 border-indigo-200 text-indigo-700'
      }`}
      title={`${totalSeconds} seconds per question. Answer before the timer runs out.`}
    >
      <Timer className="w-3.5 h-3.5" />
      <svg width="18" height="18" viewBox="0 0 36 36" className="-rotate-90">
        <circle cx="18" cy="18" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="tabular-nums w-7 text-center">{seconds}s</span>
    </div>
  );
};