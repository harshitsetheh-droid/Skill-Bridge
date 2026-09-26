import React from 'react';

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  accentColor?: string; // hex or tailwind-compatible color
  label?: string;
  sublabel?: string;
  showPercentSymbol?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 10,
  accentColor = '#4F46E5', // Default Indigo
  label,
  sublabel,
  showPercentSymbol = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, value));
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg] transition-all duration-700 ease-out">
        {/* Track background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={accentColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
        <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
          {label ?? clampedValue}
          {showPercentSymbol && !label && <span className="text-xs font-semibold text-slate-500 ml-0.5">%</span>}
        </span>
        {sublabel && (
          <span className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-wider leading-tight max-w-[85%]">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
