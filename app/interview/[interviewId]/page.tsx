import type { Metadata } from "next";
import InterviewShell from "@/components/interview/interview-shell";
import InterviewPortal from "@/components/interview/interview-portal";
import { getInterviewPlaceholder } from "@/lib/interview-placeholder";

export const metadata: Metadata = {
  title: "Join your interview | Sift",
};

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;
  const interview = getInterviewPlaceholder(interviewId);

  return (
    <InterviewShell>
      <InterviewPortal interview={interview} />
    </InterviewShell>
  );
}
