import { generateNextQuestion, type QaHistoryItem } from "@/lib/gemini";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const jobTitle = typeof body?.jobTitle === "string" ? body.jobTitle.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const qaHistory: QaHistoryItem[] = Array.isArray(body?.qaHistory) ? body.qaHistory : [];

  if (!jobTitle) {
    return Response.json({ error: "jobTitle is required" }, { status: 400 });
  }
  if (!qaHistory.every((item) => typeof item.question === "string" && typeof item.answer === "string")) {
    return Response.json({ error: "qaHistory items must have question and answer strings" }, { status: 400 });
  }

  try {
    const result = await generateNextQuestion({ jobTitle, description, qaHistory });
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown question generation error";
    return Response.json({ error: message }, { status: 500 });
  }
}
