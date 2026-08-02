"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserRound } from "lucide-react";

export default function JoinInterviewForm({ interviewId }: { interviewId: string }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = fullName.trim();

    if (!trimmed) {
      setError("Enter your full name to start the interview.");
      return;
    }

    setError(null);
    router.push(`/interview/${interviewId}/session?name=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form className="interview-form" onSubmit={handleSubmit} noValidate>
      <div className="interview-field">
        <label htmlFor="full-name">Full name</label>
        <div className="interview-input-wrap">
          <UserRound aria-hidden="true" />
          <input
            id="full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="e.g. Jordan Smith"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "full-name-error" : undefined}
          />
        </div>
        {error && (
          <p className="interview-field-error" id="full-name-error" role="alert">
            {error}
          </p>
        )}
      </div>
      <button className="interview-button" type="submit">
        Start interview
      </button>
    </form>
  );
}
