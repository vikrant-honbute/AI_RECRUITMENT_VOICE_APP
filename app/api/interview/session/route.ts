import { createSession } from "@/lib/interview-session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const interviewId = typeof body?.interviewId === "string" ? body.interviewId.trim() : "";
  const candidateName = typeof body?.candidateName === "string" ? body.candidateName.trim() : "";
  const jobTitle = typeof body?.jobTitle === "string" ? body.jobTitle.trim() : "";
  const company = typeof body?.company === "string" ? body.company.trim() : "";

  if (!interviewId || !candidateName || !jobTitle) {
    return Response.json(
      { error: "interviewId, candidateName and jobTitle are required" },
      { status: 400 },
    );
  }

  try {
    const session = await createSession({ interviewId, candidateName, jobTitle, company });
    return Response.json({ sessionId: session.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown session error";
    return Response.json({ error: message }, { status: 500 });
  }
}
