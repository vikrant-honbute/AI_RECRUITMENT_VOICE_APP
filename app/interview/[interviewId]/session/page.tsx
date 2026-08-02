import type { Metadata } from "next";
import InterviewShell from "@/components/interview/interview-shell";
import LiveInterview from "@/components/interview/live-interview";
import { getInterviewPlaceholder } from "@/lib/interview-placeholder";

export const metadata: Metadata = {
  title: "Interview starting | Sift",
};

export default async function InterviewSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ interviewId: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { interviewId } = await params;
  const { name } = await searchParams;
  const interview = getInterviewPlaceholder(interviewId);
  const candidateName = name?.trim() || "there";

  return (
    <InterviewShell>
      <LiveInterview interview={interview} candidateName={candidateName} />
    </InterviewShell>
  );
}
