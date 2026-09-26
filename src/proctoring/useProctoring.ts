import { useCallback, useEffect, useRef, useState } from 'react';
import type { Ref } from 'react';

export type ProctorViolationType =
  | 'tab'
  | 'camera-off'
  | 'face-occluded'
  | 'look-away'
  | 'voice'
  | 'multiple';

export interface ProctorViolation {
  type: ProctorViolationType;
  message: string;
  at: number;
}

export type ProctorStatus = 'idle' | 'requesting' | 'active' | 'denied' | 'stopped';
export type FaceState = 'searching' | 'visible' | 'lost';

export interface UseProctoringOptions {
  maxWarnings?: number;
  onViolationLimitReached?: () => void;
  speechThreshold?: number;
  speechPersistMs?: number;
  faceCheckMs?: number;
  faceOcclusionMs?: number;
  lookAwayMs?: number;
  gazeOffset?: number;
  cameraCheckMs?: number;
  audioCheckMs?: number;
}

export interface UseProctoringResult {
  status: ProctorStatus;
  videoRef: Ref<HTMLVideoElement | null>;
  warnings: ProctorViolation[];
  warningCount: number;
  tabViolations: number;
  lastViolation: ProctorViolation | null;
  error: string | null;
  autoSubmitted: boolean;
  faceState: FaceState;
  micLevel: number;
  start: () => Promise<boolean>;
  stop: () => void;
}

/**
 * Anti-cheat proctoring engine for AI question flows.
 *
 * Enforcement rules:
 *  - Camera + mic are required (getUserMedia) and shown as a live self-view.
 *  - The camera/mic stay ON for the whole quiz. Face presence, head movement
 *    (looking away off-screen / to the side) and sustained voice are tracked
 *    continuously and accumulate up to `maxWarnings` (default 3).
 *  - Tab / window switch is a 0-tolerance violation: the answer sheet is auto-submitted.
 *  - Once the violation limit is reached (or a tab switch occurs) `onViolationLimitReached`
 *    fires so the parent can auto-submit the answersheet.
 */
export const useProctoring = (options: UseProctoringOptions = {}): UseProctoringResult => {
  const {
    maxWarnings = 3,
    onViolationLimitReached,
    speechThreshold = 0.02,
    speechPersistMs = 1500,
    faceCheckMs = 500,
    faceOcclusionMs = 3500,
    lookAwayMs = 4000,
    gazeOffset = 0.3,
    cameraCheckMs = 1000,
    audioCheckMs = 250,
  } = options;

  const videoNodeRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const videoRef = useCallback((node: HTMLVideoElement | null) => {
    videoNodeRef.current = node;
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      node.play().catch(() => {});
    }
  }, []);

  const [status, setStatus] = useState<ProctorStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<ProctorViolation[]>([]);
  const [tabViolations, setTabViolations] = useState(0);
  const [lastViolation, setLastViolation] = useState<ProctorViolation | null>(null);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [faceState, setFaceState] = useState<FaceState>('searching');
  const [micLevel, setMicLevel] = useState(0);

  const warningsRef = useRef<ProctorViolation[]>([]);
  const tabRef = useRef(0);
  const onLimitRef = useRef(onViolationLimitReached);
  const firedRef = useRef(false);
  const activeRef = useRef(false);
  const mountedRef = useRef(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micDataRef = useRef<Uint8Array | null>(null);
  const freqDataRef = useRef<Uint8Array | null>(null);
  const speechStreakRef = useRef(0);
  const noiseFloorRef = useRef(1);
  const micWarmupRef = useRef(800);

  const faceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceCentroidRef = useRef<{ x: number; y: number; locked: boolean }>({ x: 0, y: 0, locked: false });
  const faceLostStreakRef = useRef(0);
  const lookAwayStreakRef = useRef(0);
  const micLevelSmoothRef = useRef(0);
  const faceStateRef = useRef<FaceState>('searching');

  const intervalIdsRef = useRef<number[]>([]);
  const lastTabEventRef = useRef(0);

  useEffect(() => {
    onLimitRef.current = onViolationLimitReached;
  }, [onViolationLimitReached]);

  const clearIntervals = useCallback(() => {
    intervalIdsRef.current.forEach((id) => window.clearInterval(id));
    intervalIdsRef.current = [];
  }, []);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    micDataRef.current = null;
    freqDataRef.current = null;
    speechStreakRef.current = 0;
    noiseFloorRef.current = 1;
    micWarmupRef.current = 800;
    faceLostStreakRef.current = 0;
    lookAwayStreakRef.current = 0;
    faceCentroidRef.current = { x: 0, y: 0, locked: false };
    micLevelSmoothRef.current = 0;
  }, []);

  const addInterval = useCallback((fn: () => void, ms: number) => {
    const id = window.setInterval(fn, ms);
    intervalIdsRef.current.push(id);
  }, []);

  const fatal = useCallback(
    (reason: 'TAB_SWITCH' | 'MAX_VIOLATIONS') => {
      if (firedRef.current || !activeRef.current) return;
      firedRef.current = true;
      activeRef.current = false;
      clearIntervals();
      let type: ProctorViolationType = 'multiple';
      let message = 'Maximum proctoring warnings exceeded. Answer sheet auto-submitted.';
      if (reason === 'TAB_SWITCH') {
        type = 'tab';
        message = 'Tab/window switch detected. Answer sheet auto-submitted.';
      }
      setStatus('stopped');
      setAutoSubmitted(true);
      const v: ProctorViolation = { type, message, at: Date.now() };
      setLastViolation(v);
      setWarnings((prev) => [...prev, v]);
      warningsRef.current = [...warningsRef.current, v];
      stopTracks();
      onLimitRef.current?.();
    },
    [clearIntervals, stopTracks]
  );

  const addWarning = useCallback(
    (type: ProctorViolationType, message: string) => {
      if (!activeRef.current || firedRef.current) return;
      const v: ProctorViolation = { type, message, at: Date.now() };
      warningsRef.current = [...warningsRef.current, v];
      setWarnings(warningsRef.current);
      setLastViolation(v);
      if (warningsRef.current.length >= maxWarnings) {
        fatal('MAX_VIOLATIONS');
      }
    },
    [maxWarnings, fatal]
  );

  const addTabViolation = useCallback(() => {
    if (!activeRef.current || firedRef.current) return;
    const now = Date.now();
    if (now - lastTabEventRef.current < 700) return;
    lastTabEventRef.current = now;
    tabRef.current += 1;
    setTabViolations(tabRef.current);
    fatal('TAB_SWITCH');
  }, [fatal]);

  const handleVisibility = useCallback(() => {
    if (document.hidden) addTabViolation();
  }, [addTabViolation]);

  const handleBlur = useCallback(() => {
    if (activeRef.current && !document.hasFocus()) addTabViolation();
  }, [addTabViolation]);

  const checkCamera = useCallback(() => {
    if (!activeRef.current || firedRef.current) return;
    const track = streamRef.current?.getVideoTracks()[0];
    const video = videoNodeRef.current;
    if (!track || track.readyState === 'ended' || track.muted || (video && video.paused)) {
      addWarning('camera-off', 'Camera stream interrupted or disconnected. Please keep your camera on.');
    }
  }, [addWarning]);

  const setFace = useCallback((s: FaceState) => {
    if (faceStateRef.current !== s) {
      faceStateRef.current = s;
      setFaceState(s);
    }
  }, []);

  const checkVoice = useCallback(() => {
    if (!activeRef.current || firedRef.current) return;
    const analyser = analyserRef.current;
    const data = micDataRef.current;
    const freq = freqDataRef.current;
    if (!analyser || !data || !freq) return;

    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / data.length);

    analyser.getByteFrequencyData(freq);
    let fEnergy = 0;
    for (let i = 8; i < 80; i++) fEnergy += freq[i] / 255;
    fEnergy /= 72;

    const level = Math.max(rms, fEnergy * 0.5);
    micLevelSmoothRef.current = Math.max(level, micLevelSmoothRef.current * 0.8);
    const shown = Math.min(1, micLevelSmoothRef.current * 6);
    if (Math.abs(shown - micLevel) > 0.03) setMicLevel(shown);

    const threshold = Math.max(speechThreshold, noiseFloorRef.current * 2.5, 0.015);
    const voiceLike = rms > threshold || (rms > threshold * 0.5 && fEnergy > 0.12);
    if (voiceLike) {
      speechStreakRef.current += audioCheckMs;
      if (speechStreakRef.current >= speechPersistMs) {
        speechStreakRef.current = 0;
        addWarning('voice', 'Sustained voice detected — talking is not allowed during the test.');
      }
    } else {
      speechStreakRef.current = 0;
      if (micWarmupRef.current > 0) {
        micWarmupRef.current -= audioCheckMs;
      } else {
        noiseFloorRef.current = Math.min(noiseFloorRef.current, rms);
      }
    }
  }, [speechThreshold, audioCheckMs, speechPersistMs, addWarning, micLevel]);

  const checkFace = useCallback(() => {
    if (!activeRef.current || firedRef.current) return;
    const video = videoNodeRef.current;
    if (!video || video.readyState < 2 || video.videoWidth === 0) return;
    if (!faceCanvasRef.current) {
      faceCanvasRef.current = document.createElement('canvas');
    }
    const canvas = faceCanvasRef.current;
    const W = 32;
    const H = 24;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, W, H);
    let px: Uint8ClampedArray;
    try {
      px = ctx.getImageData(0, 0, W, H).data;
    } catch {
      return;
    }

    // Skin-tone segmentation (YCrCb-style heuristic) to locate the face region.
    let skin = 0;
    let sumX = 0;
    let sumY = 0;
    let minX = W;
    let maxX = -1;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const r = px[i];
        const g = px[i + 1];
        const b = px[i + 2];
        const mx = Math.max(r, g, b);
        const mn = Math.min(r, g, b);
        if (r > 95 && g > 40 && b > 20 && mx - mn > 15 && Math.abs(r - g) > 15 && r > g && r > b) {
          skin++;
          sumX += x;
          sumY += y;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
      }
    }

    const ratio = skin / (W * H);
    const faceVisible = ratio >= 0.008;

    if (faceVisible) {
      const cx = sumX / skin / W - 0.5;
      const cy = sumY / skin / H - 0.5;
      faceCentroidRef.current = { x: cx, y: cy, locked: true };
      faceLostStreakRef.current = 0;
      setFace('visible');
      // Head turned to the side / person moved to the edge of the frame.
      const bw = (maxX - minX + 1) / W;
      const off = Math.hypot(cx, cy * 0.7);
      if (off > gazeOffset || bw < 0.14) {
        lookAwayStreakRef.current += faceCheckMs;
      } else {
        lookAwayStreakRef.current = 0;
      }
    } else {
      setFace(faceCentroidRef.current.locked ? 'lost' : 'searching');
      lookAwayStreakRef.current = 0;
      faceLostStreakRef.current += faceCheckMs;
      if (faceCentroidRef.current.locked && faceLostStreakRef.current >= faceOcclusionMs) {
        faceLostStreakRef.current = 0;
        addWarning('face-occluded', 'Your face left the camera view — please keep facing the screen.');
      }
    }

    if (lookAwayStreakRef.current >= lookAwayMs) {
      lookAwayStreakRef.current = 0;
      addWarning('look-away', 'You looked away from the screen for too long.');
    }
  }, [faceCheckMs, faceOcclusionMs, lookAwayMs, gazeOffset, addWarning, setFace]);

  const stop = useCallback(() => {
    firedRef.current = false;
    activeRef.current = false;
    clearIntervals();
    stopTracks();
    setFace('searching');
    setMicLevel(0);
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('blur', handleBlur);
    setStatus('stopped');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearIntervals, stopTracks, handleVisibility, handleBlur, setFace]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearIntervals();
      stopTracks();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(async (): Promise<boolean> => {
    if (activeRef.current) return true;
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera & microphone are not supported in this browser.');
      setStatus('denied');
      return false;
    }

    setStatus('requesting');
    setError(null);
    firedRef.current = false;
    warningsRef.current = [];
    tabRef.current = 0;
    setWarnings([]);
    setTabViolations(0);
    setLastViolation(null);
    setAutoSubmitted(false);
    setFace('searching');
    setMicLevel(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true,
      });
      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return false;
      }
      streamRef.current = stream;
      const video = videoNodeRef.current;
      if (video) {
        video.srcObject = stream;
        try {
          await video.play();
        } catch {
          // autoplay is allowed because start() is triggered by a user gesture
        }
      }

      try {
        const AudioCtx: typeof AudioContext =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioCtx();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.5;
        source.connect(analyser);
        // The context starts suspended in Chrome — resume it so the analyser
        // actually receives mic samples (otherwise voice RMS reads as silence).
        await audioCtx.resume();
        audioCtxRef.current = audioCtx;
        analyserRef.current = analyser;
        micDataRef.current = new Uint8Array(analyser.fftSize);
        freqDataRef.current = new Uint8Array(analyser.frequencyBinCount);
      } catch {
        // audio monitoring unavailable on this browser — camera rules still apply
      }

      activeRef.current = true;
      setStatus('active');

      addInterval(checkCamera, cameraCheckMs);
      addInterval(checkFace, faceCheckMs);
      addInterval(checkVoice, audioCheckMs);

      document.addEventListener('visibilitychange', handleVisibility);
      window.addEventListener('blur', handleBlur);
      return true;
    } catch (err) {
      const e = err as DOMException;
      setError(
        e && e.name === 'NotAllowedError'
          ? 'Camera & microphone permission denied. Proctored quizzes require both to be enabled. Please allow access and try again.'
          : 'Could not access camera & microphone. Please check your hardware/permissions and try again.'
      );
      setStatus('denied');
      return false;
    }
  }, [
    addInterval,
    checkCamera,
    checkFace,
    checkVoice,
    handleVisibility,
    handleBlur,
    setFace,
    cameraCheckMs,
    audioCheckMs,
    faceCheckMs,
  ]);

  return {
    status,
    videoRef,
    warnings,
    warningCount: warnings.length,
    tabViolations,
    lastViolation,
    error,
    autoSubmitted,
    faceState,
    micLevel,
    start,
    stop,
  };
};