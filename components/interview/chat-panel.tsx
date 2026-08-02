"use client";

import { useEffect, useRef } from "react";
import { Check, Mic, PencilLine, Square } from "lucide-react";
import type { ChatMessage, InterviewPhase } from "@/hooks/use-interview-session";

export default function ChatPanel({
  messages,
  interimText,
  phase,
  draftAnswer,
  isSttSupported,
  isMicMuted,
  onDraftChange,
  onConfirm,
  onReRecord,
  onFinishListening,
}: {
  messages: ChatMessage[];
  interimText: string;
  phase: InterviewPhase;
  draftAnswer: string;
  isSttSupported: boolean;
  isMicMuted: boolean;
  onDraftChange: (value: string) => void;
  onConfirm: () => void;
  onReRecord: () => void;
  onFinishListening: () => void;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, interimText, phase]);

  const isListening = phase === "listening";
  const isReviewing = phase === "reviewing";

  return (
    <div className="chat-panel" aria-label="Interview transcript">
      <div className="chat-panel-header">
        <span className="chat-panel-title">Live transcript</span>
        {isListening && isMicMuted && <span className="chat-panel-status muted">Mic muted</span>}
        {isListening && !isMicMuted && <span className="chat-panel-status listening">Listening…</span>}
        {phase === "thinking" && <span className="chat-panel-status thinking">Interviewer is thinking…</span>}
        {phase === "speaking" && <span className="chat-panel-status speaking">Interviewer is speaking</span>}
      </div>

      <div className="chat-messages">
        {messages.map((message) => {
          if (message.role === "system") {
            return (
              <p className="chat-system-note" key={message.id}>
                {message.text}
              </p>
            );
          }

          if (message.status === "typing") {
            return (
              <div className="chat-bubble-row ai" key={message.id}>
                <span className="chat-typing-dots" aria-label="Interviewer is typing">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            );
          }

          return (
            <div
              className={`chat-bubble-row ${message.role === "ai" ? "ai" : "user"}`}
              key={message.id}
            >
              <div className="chat-bubble">{message.text}</div>
            </div>
          );
        })}

        {isListening && (
          <div className="chat-bubble-row user">
            <div className="chat-bubble live">
              {interimText || "Listening…"}
              <span className="chat-recording-dot" aria-hidden="true" />
            </div>
          </div>
        )}

        {isReviewing && (
          <div className="chat-answer-review">
            <p className="chat-review-label">
              {isSttSupported ? "Fix any mis-transcription, then confirm your answer." : "Type your answer, then confirm."}
            </p>
            <textarea
              className="chat-answer-input"
              value={draftAnswer}
              onChange={(event) => onDraftChange(event.target.value)}
              rows={4}
              autoFocus
              placeholder="Your answer…"
              aria-label="Your answer"
            />
            <div className="chat-review-actions">
              {isSttSupported && (
                <button type="button" className="chat-action-button" onClick={onReRecord}>
                  <Mic aria-hidden="true" />
                  Re-record
                </button>
              )}
              <button
                type="button"
                className="chat-action-button primary"
                onClick={onConfirm}
                disabled={!draftAnswer.trim()}
              >
                <Check aria-hidden="true" />
                Confirm answer
              </button>
            </div>
          </div>
        )}

        {isListening && isSttSupported && (
          <button type="button" className="chat-stop-button" onClick={onFinishListening}>
            <Square aria-hidden="true" />
            Done answering
          </button>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-panel-footer">
        {isReviewing && <PencilLine aria-hidden="true" />}
        <span>Answers are saved as you go. You can edit any answer before confirming.</span>
      </div>
    </div>
  );
}
