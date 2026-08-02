import Link from "next/link";
import { ArrowUpRight, Clock3, MessagesSquare } from "lucide-react";
import { formatSessionSummary, listSessions, type SessionWithResponses } from "@/lib/interview-session";

export const dynamic = "force-dynamic";

const RECOMMENDATION_LABELS: Record<string, string> = {
  strong_yes: "Strong yes",
  yes: "Yes",
  maybe: "Maybe",
  no: "No",
  strong_no: "Strong no",
  no_evidence: "No evidence",
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  interrupted: "Interrupted",
  in_progress: "In progress",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDuration(startedAt: Date, endedAt: Date | null): string {
  if (!endedAt) {
    return "—";
  }
  const minutes = Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);
  return `${minutes} min`;
}

function scoreClass(score: number | null): string {
  if (score === null) {
    return "";
  }
  if (score >= 70) {
    return "high";
  }
  if (score >= 45) {
    return "mid";
  }
  return "low";
}

function SessionCard({ session }: { session: SessionWithResponses }) {
  const summary = formatSessionSummary(session.summary);
  const recommendation = session.recommendation ? RECOMMENDATION_LABELS[session.recommendation] ?? session.recommendation : null;

  return (
    <article className="ai-session-card">
      <header className="ai-session-head">
        <div className="ai-session-candidate">
          <span className="list-avatar">{session.candidateName.charAt(0).toUpperCase()}</span>
          <div>
            <strong>{session.candidateName}</strong>
            <small>{session.jobTitle} · {session.company}</small>
          </div>
        </div>
        <div className="ai-session-chips">
          <span className={`ai-status-chip ${session.status}`}>{STATUS_LABELS[session.status] ?? session.status}</span>
          {recommendation && <span className={`ai-recommendation-chip ${session.recommendation ?? ""}`}>{recommendation}</span>}
        </div>
      </header>

      <dl className="ai-session-meta">
        <div><dt>Date</dt><dd>{formatDate(session.startedAt)}</dd></div>
        <div><dt>Duration</dt><dd>{formatDuration(session.startedAt, session.endedAt)}</dd></div>
        <div>
          <dt>AI score</dt>
          <dd className={`ai-score ${scoreClass(summary?.score ?? null)}`}>
            {summary?.score != null ? `${summary.score}/100` : "—"}
          </dd>
        </div>
        <div><dt>Questions answered</dt><dd>{session.responses.length}</dd></div>
      </dl>

      {summary ? (
        <div className="ai-summary">
          <p className="ai-summary-notes">{summary.notes}</p>
          <div className="ai-summary-grid">
            <div>
              <strong>Strengths</strong>
              <ul>
                {summary.strengths.length ? summary.strengths.map((item) => <li key={item}>{item}</li>) : <li>None noted</li>}
              </ul>
            </div>
            <div>
              <strong>Areas to probe</strong>
              <ul>
                {summary.weaknesses.length ? summary.weaknesses.map((item) => <li key={item}>{item}</li>) : <li>None noted</li>}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p className="ai-summary-notes">No summary available for this session.</p>
      )}

      <details className="ai-transcript">
        <summary>
          <MessagesSquare aria-hidden="true" />
          View transcript
        </summary>
        <ol className="ai-transcript-list">
          {session.responses.map((response) => (
            <li key={response.id}>
              <p><strong>Q{response.questionIndex + 1}.</strong> {response.question}</p>
              <p className="ai-transcript-answer">{response.answer}</p>
            </li>
          ))}
        </ol>
      </details>
    </article>
  );
}

export default async function InterviewsPage() {
  const sessions = await listSessions();

  return (
    <div className="dashboard-overview">
      <section className="dashboard-welcome">
        <div>
          <p className="dashboard-eyebrow">Recruiter review</p>
          <h2>AI interview results</h2>
          <p className="dashboard-intro">
            Every completed AI voice interview lands here with a transcript and evaluation.
          </p>
        </div>
        <Link href="/dashboard" className="dashboard-text-link">
          Back to overview <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>

      {sessions.length === 0 ? (
        <section className="dashboard-panel ai-empty-state">
          <span className="ai-empty-icon" aria-hidden="true">
            <Clock3 />
          </span>
          <h3>No interviews yet</h3>
          <p>Share an interview link with a candidate — completed sessions will appear here automatically.</p>
        </section>
      ) : (
        <section className="ai-session-list" aria-label="Completed interview sessions">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </section>
      )}
    </div>
  );
}
