import { GoogleGenAI } from "@google/genai";
import { MAX_INTERVIEW_QUESTIONS } from "@/lib/interview-constants";

export type QaHistoryItem = {
  question: string;
  answer: string;
};

export type InterviewQuestionResult = {
  question: string;
  done: boolean;
};

export type InterviewSummary = {
  score: number;
  recommendation: string;
  strengths: string[];
  weaknesses: string[];
  notes: string;
};

const GEMINI_MODEL = "gemini-2.5-flash";

function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

function parseJson(text: string): unknown {
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {
      // fall through to plain parse
    }
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function generateNextQuestion(input: {
  jobTitle: string;
  description: string;
  qaHistory: QaHistoryItem[];
}): Promise<InterviewQuestionResult> {
  const { jobTitle, description, qaHistory } = input;

  if (qaHistory.length >= MAX_INTERVIEW_QUESTIONS) {
    return { question: "", done: true };
  }

  const client = getClient();
  if (!client) {
    return {
      question: buildFallbackQuestion(jobTitle, description, qaHistory.length),
      done: qaHistory.length + 1 >= MAX_INTERVIEW_QUESTIONS,
    };
  }

  const historyBlock = qaHistory.length
    ? qaHistory.map((item) => `Q: ${item.question}\nA: ${item.answer}`).join("\n\n")
    : "(No answers yet — this is the opening question.)";

  const prompt = `Job title: ${jobTitle}
Job description: ${description}
Question answered so far: ${qaHistory.length} of ${MAX_INTERVIEW_QUESTIONS}

Conversation so far:
${historyBlock}

Ask the next interview question. Rules:
- Ask exactly ONE question. No preamble, no numbering.
- Do not repeat previous questions. Build on the candidate's earlier answers when useful.
- The question must be answerable out loud in under 2 minutes.
- Keep a natural, conversational interviewer tone.
- If the candidate has already answered ${MAX_INTERVIEW_QUESTIONS} questions, or their answers clearly wrap up the interview, return done: true.

Respond only with JSON in this exact shape:
{"question": "<the question text>", "done": <true or false>}`;

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });

    const raw = response.text?.trim() || "{}";
    const parsed = parseJson(raw) as Partial<InterviewQuestionResult> | null;

    if (parsed && typeof parsed.question === "string" && parsed.question.trim()) {
      return {
        question: parsed.question.trim(),
        done: Boolean(parsed.done) || qaHistory.length + 1 >= MAX_INTERVIEW_QUESTIONS,
      };
    }
  } catch {
    // fall back to rule-based generation
  }

  return {
    question: buildFallbackQuestion(jobTitle, description, qaHistory.length),
    done: qaHistory.length + 1 >= MAX_INTERVIEW_QUESTIONS,
  };
}

const FALLBACK_QUESTION_TEMPLATES = [
  "Let's start with the basics — what makes you a great fit for the {role} role?",
  "Could you walk me through a recent project where you had to solve a difficult technical problem?",
  "Tell me about a time you worked closely with others to ship something important. What was your contribution?",
  "What does a typical day look like for you when you're deep in work?",
  "Where do you see yourself growing in the next couple of years?",
  "Is there anything about your background we haven't covered that you'd like to highlight for the {role} position?",
];

function buildFallbackQuestion(jobTitle: string, description: string, answeredCount: number): string {
  const role = jobTitle.trim() || "this role";
  if (answeredCount === 0 && description.trim()) {
    return `Let's start with the basics — what makes you a great fit for the ${role} role?`;
  }
  const template = FALLBACK_QUESTION_TEMPLATES[answeredCount % FALLBACK_QUESTION_TEMPLATES.length];
  return template.replace("{role}", role);
}

export async function generateSummary(input: {
  jobTitle: string;
  company: string;
  candidateName: string;
  qaHistory: QaHistoryItem[];
}): Promise<InterviewSummary> {
  const { jobTitle, company, candidateName, qaHistory } = input;

  const client = getClient();
  if (!client) {
    return {
      score: 0,
      recommendation: "no_evidence",
      strengths: [],
      weaknesses: [],
      notes: "No summary generated: GEMINI_API_KEY is not configured.",
    };
  }
  if (qaHistory.length === 0) {
    return {
      score: 0,
      recommendation: "no_evidence",
      strengths: [],
      weaknesses: [],
      notes: "No summary generated: the candidate did not answer any questions.",
    };
  }

  const transcript = qaHistory.map((item) => `Q: ${item.question}\nA: ${item.answer}`).join("\n\n");

  const prompt = `You are a recruiting analyst. Evaluate this AI voice interview for a recruiter.

Role: ${jobTitle} at ${company}
Candidate: ${candidateName}

Transcript:
${transcript}

Produce a structured evaluation to help the recruiter decide whether to advance this candidate.

Rules:
- Base everything strictly on the transcript. Do not invent information.
- Score 0-100 overall fit.
- recommendation must be one of: strong_yes, yes, maybe, no, strong_no.
- Strengths and weaknesses: 2-4 concise bullets each.
- notes: 2-3 sentences explaining the verdict.

Respond only with JSON in this exact shape:
{"score": <0-100>, "recommendation": "<strong_yes|yes|maybe|no|strong_no>", "strengths": ["..."], "weaknesses": ["..."], "notes": "..."}`;

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    });

    const raw = response.text?.trim() || "{}";
    const parsed = parseJson(raw) as Partial<InterviewSummary> | null;

    if (parsed && typeof parsed.score === "number") {
      return {
        score: Math.max(0, Math.min(100, parsed.score)),
        recommendation: parsed.recommendation || "maybe",
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        notes: parsed.notes || "",
      };
    }
  } catch {
    // fall through to the no-evidence summary
  }

  return {
    score: 0,
    recommendation: "no_evidence",
    strengths: [],
    weaknesses: [],
    notes: "Summary could not be generated for this session.",
  };
}
