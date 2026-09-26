import React from 'react';
import { Check, AlertCircle, X, Sparkles } from 'lucide-react';

export type SkillPillVariant = 
  | 'verified' 
  | 'warning' 
  | 'risk' 
  | 'solid' 
  | 'outline' 
  | 'indigo' 
  | 'navy' 
  | 'teal' 
  | 'neutral';

interface SkillPillProps {
  name: string;
  variant?: SkillPillVariant;
  size?: 'sm' | 'md' | 'lg';
  onRemove?: () => void;
  onClick?: () => void;
  showIcon?: boolean;
  score?: number;
  className?: string;
}

export const SkillPill: React.FC<SkillPillProps> = ({
  name,
  variant = 'neutral',
  size = 'md',
  onRemove,
  onClick,
  showIcon = true,
  score,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs font-medium',
    lg: 'px-3.5 py-1.5 text-sm font-medium',
  }[size];

  const variantClasses: Record<SkillPillVariant, string> = {
    verified: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100/70',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100/70',
    risk: 'bg-red-50 text-red-700 border border-red-200/80 hover:bg-red-100/70',
    solid: 'bg-slate-900 text-white border border-slate-900 hover:bg-slate-800',
    outline: 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400 hover:bg-slate-50',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100',
    navy: 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100',
    teal: 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/70',
  };

  return (
    <span
      id={`skill-pill-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors duration-150 select-none ${sizeClasses} ${variantClasses[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {showIcon && variant === 'verified' && <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />}
      {showIcon && variant === 'warning' && <AlertCircle className="w-3 h-3 text-amber-500 stroke-[2.5]" />}
      {showIcon && variant === 'risk' && <AlertCircle className="w-3 h-3 text-red-500 stroke-[2.5]" />}
      
      <span>{name}</span>

      {score !== undefined && (
        <span className="text-[10px] font-semibold opacity-75">
          {score}%
        </span>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 transition-colors"
          aria-label={`Remove ${name}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
