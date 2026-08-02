import { saveAnswer } from "@/lib/interview-session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const answer = typeof body?.answer === "string" ? body.answer.trim() : "";
  const questionIndex = Number(body?.questionIndex);

  if (!sessionId || !question || !answer || !Number.isInteger(questionIndex)) {
    return Response.json(
      { error: "sessionId, question, answer and questionIndex are required" },
      { status: 400 },
    );
  }

  try {
    await saveAnswer({ sessionId, questionIndex, question, answer });
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown save error";
    return Response.json({ error: message }, { status: 500 });
  }
}
