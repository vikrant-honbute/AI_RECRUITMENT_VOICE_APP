import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { interviewResponses, interviewSessions } from "@/lib/db/schema";
import type { InterviewSummary } from "@/lib/gemini";

export type SessionRecord = typeof interviewSessions.$inferSelect;
export type ResponseRecord = typeof interviewResponses.$inferSelect;

export async function createSession(input: {
  interviewId: string;
  candidateName: string;
  jobTitle: string;
  company: string;
}): Promise<SessionRecord> {
  const db = getDb();
  const [row] = await db
    .insert(interviewSessions)
    .values({
      interviewId: input.interviewId,
      candidateName: input.candidateName,
      jobTitle: input.jobTitle,
      company: input.company,
      status: "in_progress",
    })
    .returning();
  return row;
}

export async function saveAnswer(input: {
  sessionId: string;
  questionIndex: number;
  question: string;
  answer: string;
}): Promise<void> {
  const db = getDb();

  await db
    .delete(interviewResponses)
    .where(
      and(
        eq(interviewResponses.sessionId, input.sessionId),
        eq(interviewResponses.questionIndex, input.questionIndex),
      ),
    );

  await db.insert(interviewResponses).values({
    sessionId: input.sessionId,
    questionIndex: input.questionIndex,
    question: input.question,
    answer: input.answer,
  });
}

export async function getSession(sessionId: string): Promise<SessionRecord | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(interviewSessions)
    .where(eq(interviewSessions.id, sessionId));
  return row ?? null;
}

export async function getSessionResponses(sessionId: string): Promise<ResponseRecord[]> {
  const db = getDb();
  return db
    .select()
    .from(interviewResponses)
    .where(eq(interviewResponses.sessionId, sessionId))
    .orderBy(asc(interviewResponses.questionIndex));
}

export async function completeSession(input: {
  sessionId: string;
  summary: InterviewSummary | null;
  endedEarly: boolean;
}): Promise<void> {
  const db = getDb();
  await db
    .update(interviewSessions)
    .set({
      status: input.endedEarly ? "interrupted" : "completed",
      endedAt: new Date(),
      score: input.summary ? input.summary.score : null,
      recommendation: input.summary ? input.summary.recommendation : null,
      summary: input.summary ? (input.summary as unknown as object) : null,
    })
    .where(eq(interviewSessions.id, input.sessionId));
}

export type SessionWithResponses = SessionRecord & { responses: ResponseRecord[] };

export async function listSessions(): Promise<SessionWithResponses[]> {
  const db = getDb();
  const sessions = await db
    .select()
    .from(interviewSessions)
    .orderBy(desc(interviewSessions.startedAt));

  if (sessions.length === 0) {
    return [];
  }

  const responses = await db
    .select()
    .from(interviewResponses)
    .where(inArray(
      interviewResponses.sessionId,
      sessions.map((session) => session.id),
    ))
    .orderBy(asc(interviewResponses.createdAt));

  const bySession = new Map<string, ResponseRecord[]>();
  for (const response of responses) {
    const list = bySession.get(response.sessionId) ?? [];
    list.push(response);
    bySession.set(response.sessionId, list);
  }

  return sessions.map((session) => ({
    ...session,
    responses: bySession.get(session.id) ?? [],
  }));
}

export function formatSessionSummary(raw: unknown): InterviewSummary | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const value = raw as Partial<InterviewSummary>;
  if (typeof value.score !== "number") {
    return null;
  }
  return {
    score: value.score,
    recommendation: typeof value.recommendation === "string" ? value.recommendation : "maybe",
    strengths: Array.isArray(value.strengths) ? value.strengths : [],
    weaknesses: Array.isArray(value.weaknesses) ? value.weaknesses : [],
    notes: typeof value.notes === "string" ? value.notes : "",
  };
}
