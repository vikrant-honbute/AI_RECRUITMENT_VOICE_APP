"use client";

import { Bot } from "lucide-react";

const BAR_COUNT = 5;

export default function VoiceAgentCard({
  speaking,
  level,
  label,
  sublabel,
}: {
  speaking: boolean;
  level: number;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="voice-agent" role="status" aria-live="polite">
      <div className={`voice-agent-avatar${speaking ? " speaking" : ""}`}>
        <span className="voice-agent-pulse" aria-hidden="true" />
        <span className="voice-agent-core" aria-hidden="true">
          <Bot />
        </span>
        <span className="voice-agent-name" aria-hidden="true">
          AI
        </span>
      </div>

      <div className="voice-agent-copy">
        <strong>{label}</strong>
        <span>{sublabel}</span>
      </div>

      <div className="voice-agent-waveform" aria-hidden="true">
        {Array.from({ length: BAR_COUNT }, (_, index) => {
          const boost = (index + 1) / BAR_COUNT;
          const scale = speaking ? Math.max(0.25, level * 1.6 * boost) : 0.12;
          return <i key={index} style={{ transform: `scaleY(${scale})` }} />;
        })}
      </div>
    </div>
  );
}
