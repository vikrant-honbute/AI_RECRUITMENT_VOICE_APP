import { generateSummary } from "@/lib/gemini";
import { completeSession, getSession, getSessionResponses } from "@/lib/interview-session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
  const endedEarly = Boolean(body?.endedEarly);

  if (!sessionId) {
    return Response.json({ error: "sessionId is required" }, { status: 400 });
  }

  try {
    const session = await getSession(sessionId);
    if (!session) {
      return Response.json({ error: "session not found" }, { status: 404 });
    }

    let summary = null;

    if (!endedEarly) {
      const responses = await getSessionResponses(sessionId);
      if (responses.length > 0) {
        summary = await generateSummary({
          jobTitle: session.jobTitle,
          company: session.company,
          candidateName: session.candidateName,
          qaHistory: responses.map((response) => ({
            question: response.question,
            answer: response.answer,
          })),
        });
      }
    }

    await completeSession({ sessionId, summary, endedEarly });

    return Response.json({ ok: true, summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown completion error";
    return Response.json({ error: message }, { status: 500 });
  }
}
