"use client";

import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";

function formatElapsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

export default function CallControls({
  isMicMuted,
  isCameraOff,
  elapsedSeconds,
  onToggleMic,
  onToggleCamera,
  onEndCall,
}: {
  isMicMuted: boolean;
  isCameraOff: boolean;
  elapsedSeconds: number;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
}) {
  return (
    <div className="call-controls">
      <button
        type="button"
        className={`call-control-button${isMicMuted ? " off" : ""}`}
        aria-label={isMicMuted ? "Unmute microphone" : "Mute microphone"}
        aria-pressed={isMicMuted}
        onClick={onToggleMic}
      >
        {isMicMuted ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}
      </button>
      <button
        type="button"
        className={`call-control-button${isCameraOff ? " off" : ""}`}
        aria-label={isCameraOff ? "Turn camera on" : "Turn camera off"}
        aria-pressed={isCameraOff}
        onClick={onToggleCamera}
      >
        {isCameraOff ? <VideoOff aria-hidden="true" /> : <Video aria-hidden="true" />}
      </button>
      <button
        type="button"
        className="call-control-button end"
        aria-label="End interview"
        onClick={onEndCall}
      >
        <PhoneOff aria-hidden="true" />
      </button>
      <span className="call-timer" aria-live="off">
        {formatElapsed(elapsedSeconds)}
      </span>
    </div>
  );
}
