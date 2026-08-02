export type InterviewDetails = {
  id: string;
  jobTitle: string;
  company: string;
  roleLevel: string;
  durationMinutes: number;
  questionCount: number;
  format: string;
  description: string;
};

export function getInterviewPlaceholder(interviewId: string): InterviewDetails {
  return {
    id: interviewId,
    jobTitle: "Senior Software Engineer",
    company: "Sift",
    roleLevel: "Full-time",
    durationMinutes: 15,
    questionCount: 6,
    format: "Voice",
    description:
      "You'll answer a few questions out loud and an AI recruiter scores your responses. No prep, downloads, or sign-in needed.",
  };
}
