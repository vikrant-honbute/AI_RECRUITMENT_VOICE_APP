"use client";

import { MicOff, VideoOff } from "lucide-react";

export default function CandidateTile({
  videoRef,
  name,
  isMuted,
  isCameraOff,
  isListening,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  name: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isListening: boolean;
}) {
  return (
    <div className={`candidate-tile${isCameraOff ? " camera-off" : ""}`}>
      <video
        ref={videoRef}
        className="candidate-video"
        autoPlay
        playsInline
        muted
        aria-label={`${name}'s camera feed`}
      />
      {isCameraOff && (
        <span className="candidate-tile-off" aria-hidden="true">
          <VideoOff />
        </span>
      )}
      <div className="candidate-tile-meta">
        <span className="candidate-tile-name">{name}</span>
        {isMuted ? (
          <span className="candidate-tile-mute" title="Microphone muted">
            <MicOff aria-hidden="true" />
          </span>
        ) : null}
        {isListening && <span className="candidate-tile-listening">Listening…</span>}
      </div>
    </div>
  );
}
