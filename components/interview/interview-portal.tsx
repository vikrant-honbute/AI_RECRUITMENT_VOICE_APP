import { Clock3, ListChecks, Mic2, Video } from "lucide-react";
import type { InterviewDetails } from "@/lib/interview-placeholder";
import JoinInterviewForm from "@/components/interview/join-interview-form";

export default function InterviewPortal({ interview }: { interview: InterviewDetails }) {
  const details = [
    { icon: Clock3, label: "Duration", value: `${interview.durationMinutes} minutes` },
    { icon: ListChecks, label: "Questions", value: `${interview.questionCount} voice questions` },
    { icon: Mic2, label: "Format", value: `${interview.format} · speak out loud` },
    { icon: Video, label: "Check", value: "Mic & camera ready" },
  ];

  return (
    <div className="interview-card">
      <p className="auth-eyebrow">AI Voice Interview</p>
      <h1>{interview.jobTitle}</h1>
      <p className="interview-company">
        {interview.company} · {interview.roleLevel}
      </p>

      <ul className="interview-details" aria-label="Interview details">
        {details.map(({ icon: Icon, label, value }) => (
          <li className="interview-detail" key={label}>
            <span className="interview-detail-icon" aria-hidden="true">
              <Icon />
            </span>
            <span className="interview-detail-copy">
              <strong>{label}</strong>
              <span>{value}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="interview-blurb">{interview.description}</p>

      <JoinInterviewForm interviewId={interview.id} />
    </div>
  );
}
