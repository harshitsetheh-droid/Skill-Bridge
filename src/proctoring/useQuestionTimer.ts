import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseQuestionTimerOptions {
  totalSeconds?: number;
  running?: boolean;
  onExpire?: () => void;
}

export interface UseQuestionTimerResult {
  timeLeft: number;
  seconds: number;
  progress: number;
  reset: () => void;
}

/**
 * Per-question countdown. While `running` is true the timer ticks down from
 * `totalSeconds`; when it reaches 0, `onExpire` fires exactly once until the
 * timer is reset (call `reset()` when moving to the next question).
 */
export const useQuestionTimer = (options: UseQuestionTimerOptions = {}): UseQuestionTimerResult => {
  const { totalSeconds = 30, running = true, onExpire } = options;

  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  const expireCbRef = useRef(onExpire);
  const runningRef = useRef(running);
  const totalRef = useRef(totalSeconds);
  const expireFiredRef = useRef(false);

  useEffect(() => {
    expireCbRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    totalRef.current = totalSeconds;
  }, [totalSeconds]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0) return 0;
        const next = Math.max(0, t - 0.25);
        if (next <= 0 && !expireFiredRef.current) {
          expireFiredRef.current = true;
          expireCbRef.current?.();
        }
        return next;
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [running]);

  const reset = useCallback(() => {
    expireFiredRef.current = false;
    setTimeLeft(totalRef.current);
  }, []);

  return {
    timeLeft,
    seconds: Math.ceil(timeLeft),
    progress: Math.max(0, Math.min(100, (timeLeft / (totalRef.current || 30)) * 100)),
    reset,
  };
};