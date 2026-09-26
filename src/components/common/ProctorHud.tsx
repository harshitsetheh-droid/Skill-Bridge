import React from 'react';
import {
  Video,
  VideoOff,
  Mic,
  Eye,
  EyeOff,
  AlertTriangle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import type { ProctorViolation } from '../../proctoring/useProctoring';

interface ProctorHudProps {
  videoRef: React.Ref<HTMLVideoElement | null>;
  status: 'idle' | 'requesting' | 'active' | 'denied' | 'stopped';
  warningCount: number;
  maxWarnings?: number;
  tabViolations?: number;
  lastViolation?: ProctorViolation | null;
  faceState?: 'searching' | 'visible' | 'lost';
  micLevel?: number;
}

/**
 * Live anti-cheat HUD shown while a proctored quiz is running:
 * minimized self-view camera + violation counters + last violation alert.
 */
export const ProctorHud: React.FC<ProctorHudProps> = ({
  videoRef,
  status,
  warningCount,
  maxWarnings = 3,
  tabViolations = 0,
  lastViolation,
  faceState = 'searching',
  micLevel = 0,
}) => {
  const live = status === 'active';

  const faceChip = {
    searching: {
      cls: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      icon: <Eye className="w-3 h-3" />,
      text: 'Face: detecting…',
    },
    visible: {
      cls: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: <Eye className="w-3 h-3" />,
      text: 'Face: focused',
    },
    lost: {
      cls: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse',
      icon: <EyeOff className="w-3 h-3" />,
      text: 'Face: away!',
    },
  }[faceState];

  return (
    <div className="flex flex-wrap items-stretch gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xs">
      {/* Camera self-view */}
      <div className="relative w-24 h-18 rounded-xl overflow-hidden bg-slate-900 shrink-0">
        {live ? (
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-500">
            <VideoOff className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-wide">
              {status === 'denied' ? 'Blocked' : status === 'requesting' ? 'Starting...' : 'Off'}
            </span>
          </div>
        )}
        <span
          className={`absolute top-1 right-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide ${
            live ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-white animate-pulse' : 'bg-slate-400'}`}
          />
          {live ? 'LIVE' : 'OFF'}
        </span>
      </div>

      {/* Status chips */}
      <div className="flex-1 min-w-[140px] space-y-1.5">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700 dark:text-slate-200 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Video className="w-3 h-3" /> Camera
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ${
              micLevel > 0.35
                ? 'bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                : micLevel > 0.12
                ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            }`}
          >
            <Mic className="w-3 h-3" /> Mic
            <span className="inline-block w-8 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <span
                className={`block h-full rounded-full transition-all ${
                  micLevel > 0.35 ? 'bg-red-500' : micLevel > 0.12 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.round(Math.min(1, micLevel) * 100)}%` }}
              />
            </span>
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ${
              tabViolations > 0
                ? 'bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Zap className="w-3 h-3" /> Tab switch: {tabViolations} (max 0)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Face tracking chip */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${faceChip.cls}`}
          >
            {faceChip.icon}
            {faceChip.text}
          </span>
          {/* Warnings progress */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
              warningCount >= maxWarnings
                ? 'bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                : warningCount > 0
                ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>
              Warnings: {warningCount}/{maxWarnings}
            </span>
          </div>
        </div>

        {lastViolation && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800 px-2.5 py-1.5 text-[10px] font-semibold text-red-800 dark:text-red-300 animate-fade-in flex items-start gap-1.5">
            <ShieldCheck className="w-3 h-3 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <span>{lastViolation.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};