import React from 'react';
import {
  Video,
  Mic,
  Timer,
  ArrowLeftRight,
  AlertTriangle,
  ShieldCheck,
  Lock,
  X,
} from 'lucide-react';

interface ProctorSetupProps {
  status: 'idle' | 'requesting' | 'active' | 'denied' | 'stopped';
  error: string | null;
  videoRef: React.Ref<HTMLVideoElement | null>;
  onGrant: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

/**
 * Consent + rules gate shown before a proctored quiz begins.
 * Requests camera + mic access and previews the self-view live.
 */
export const ProctorSetup: React.FC<ProctorSetupProps> = ({
  status,
  error,
  videoRef,
  onGrant,
  onCancel,
  title = 'Proctored Assessment — Enable Camera & Mic',
  subtitle = 'This quiz is AI-proctored. Your camera and microphone will monitor for cheating in real time.',
}) => {
  const idle = status === 'idle' || status === 'stopped';
  const requesting = status === 'requesting';
  const denied = status === 'denied';

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-md">{subtitle}</p>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Cancel assessment"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Live camera preview / permission state */}
      <div className="flex items-center gap-4">
        <div className="relative w-36 h-27 rounded-xl overflow-hidden bg-slate-900 shrink-0">
          {status === 'active' || requesting ? (
            <video ref={videoRef} muted playsInline autoPlay className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-500">
              <Video className="w-6 h-6" />
              <span className="text-[9px] font-bold uppercase tracking-wide">
                {denied ? 'Permission blocked' : 'Preview'}
              </span>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 flex-1">
          <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Camera access to track your movement & face
          </p>
          <p className="flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Mic access to detect talking with someone else
          </p>
        </div>
      </div>

      {/* Rules */}
      <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-start gap-2">
          <Timer className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong>30 seconds per question.</strong> Timer runs out → question is locked and you move to the next one.
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-start gap-2">
          <ArrowLeftRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong>No going back.</strong> Once you answer and hit Next, the answer is submitted and cannot be changed or reopened.
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong>Camera/Mic warnings: max 3.</strong> Face not visible, camera off, or sustained voice = warning. 3 warnings = auto-submit.
          </span>
        </div>
        <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-start gap-2">
          <Lock className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Tab switching: 0 tolerance.</strong> Leaving the tab/window instantly auto-submits your answer sheet.
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-800 dark:text-red-300 flex items-start gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onGrant}
          disabled={requesting}
          className="flex-1 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-wait cursor-pointer flex items-center justify-center gap-2"
        >
          <Video className="w-4 h-4" />
          <span>{requesting ? 'Requesting camera & mic...' : idle ? 'Allow Camera & Mic & Start' : 'Retry Permission'}</span>
        </button>
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
        You cannot start this assessment without granting camera & microphone access.
      </p>
    </div>
  );
};