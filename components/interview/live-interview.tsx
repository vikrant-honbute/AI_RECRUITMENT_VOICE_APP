"use client";

import Link from "next/link";
import { ArrowRight, Camera, Check, Mic, MonitorUp, RefreshCcw } from "lucide-react";
import type { InterviewDetails } from "@/lib/interview-placeholder";
import { useInterviewSession } from "@/hooks/use-interview-session";
import VoiceAgentCard from "@/components/interview/voice-agent-card";
import CandidateTile from "@/components/interview/candidate-tile";
import CallControls from "@/components/interview/call-controls";
import ChatPanel from "@/components/interview/chat-panel";

function formatElapsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

export default function LiveInterview({
  interview,
  candidateName,
}: {
  interview: InterviewDetails;
  candidateName: string;
}) {
  const session = useInterviewSession(interview, candidateName);

  const isIdle = session.phase === "idle";
  const isPermissionDenied = session.phase === "permission-denied";
  const isError = session.phase === "error";
  const isCompleted = session.phase === "completed";
  const isEnded = session.phase === "ended";
  const inCall = !isIdle && !isPermissionDenied && !isError && !isCompleted && !isEnded;

  return (
    <div className="call-room">
      <section className="call-stage" aria-label="Interview stage">
        <div className="call-stage-topbar">
          <div>
            <p className="auth-eyebrow">AI Voice Interview</p>
            <h2>
              {interview.jobTitle}
              <span className="call-stage-company"> · {interview.company}</span>
            </h2>
          </div>
          <span className="call-stage-timer" aria-live="off">
            {formatElapsed(session.elapsedSeconds)}
          </span>
        </div>

        {inCall && (
          <div className="call-tiles">
            <VoiceAgentCard
              speaking={session.agentSpeaking}
              level={session.audioLevel}
              label="AI Recruiter"
              sublabel={`Interviewer · ${interview.company}`}
            />
            <CandidateTile
              videoRef={session.videoRef}
              name={candidateName}
              isMuted={session.isMicMuted}
              isCameraOff={session.isCameraOff}
              isListening={session.phase === "listening"}
            />
          </div>
        )}

        {inCall && (
          <CallControls
            isMicMuted={session.isMicMuted}
            isCameraOff={session.isCameraOff}
            elapsedSeconds={session.elapsedSeconds}
            onToggleMic={session.toggleMic}
            onToggleCamera={session.toggleCamera}
            onEndCall={() => session.endCall(false)}
          />
        )}

        {isIdle && (
          <div className="call-state-card">
            <p className="auth-eyebrow">Ready when you are</p>
            <h3>Start the interview</h3>
            <p className="call-state-blurb">
              You&apos;ll need camera and microphone access. The AI recruiter will ask you up to 6
              questions — speak your answers out loud.
            </p>
            <ul className="call-check-list">
              <li><span className="call-check-icon"><Mic /></span>Microphone</li>
              <li><span className="call-check-icon"><Camera /></span>Camera</li>
              <li><span className="call-check-icon"><MonitorUp /></span>Quiet space</li>
            </ul>
            <button
              type="button"
              className="call-primary-button"
              onClick={() => void session.startInterview()}
            >
              Start interview <ArrowRight aria-hidden="true" />
            </button>
          </div>
        )}

        {isPermissionDenied && (
          <div className="call-state-card">
            <p className="auth-eyebrow">Camera &amp; mic blocked</p>
            <h3>We can&apos;t start without them</h3>
            <p className="call-state-blurb">
              Allow camera and microphone access for this site in your browser settings, then try
              again. You can still answer by typing if audio isn&apos;t available.
            </p>
            <button
              type="button"
              className="call-primary-button"
              onClick={session.requestRetry}
            >
              <RefreshCcw aria-hidden="true" /> Try again
            </button>
          </div>
        )}

        {isError && (
          <div className="call-state-card">
            <p className="auth-eyebrow">Something went wrong</p>
            <h3>We couldn&apos;t continue the interview</h3>
            <p className="call-state-blurb">{session.errorMessage}</p>
            <button
              type="button"
              className="call-primary-button"
              onClick={session.requestRetry}
            >
              <RefreshCcw aria-hidden="true" /> Start over
            </button>
          </div>
        )}

        {(isCompleted || isEnded) && (
          <div className="call-state-card">
            <span className="call-done-icon" aria-hidden="true">
              <Check />
            </span>
            <p className="auth-eyebrow">{isCompleted ? "Interview complete" : "Interview ended"}</p>
            <h3>{isCompleted ? "Thanks for joining!" : "You ended the interview."}</h3>
            <p className="call-state-blurb">
              {isCompleted
                ? "Your answers were recorded and saved. The recruiter will review them and get back to you."
                : "Your answers so far were saved. The recruiter can review the partial transcript."}
            </p>
            <Link href={`/interview/${interview.id}`} className="call-primary-link">
              Back to interview details
            </Link>
          </div>
        )}
      </section>

      {inCall && (
        <ChatPanel
          messages={session.chatMessages}
          interimText={session.interimText}
          phase={session.phase}
          draftAnswer={session.draftAnswer}
          isSttSupported={session.isSttSupported}
          onDraftChange={session.setDraftAnswer}
          onConfirm={() => void session.confirmAnswer()}
          onReRecord={session.beginListening}
          onFinishListening={session.finishListening}
        />
      )}
    </div>
  );
}
