"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { InterviewDetails } from "@/lib/interview-placeholder";
import { MAX_INTERVIEW_QUESTIONS } from "@/lib/interview-constants";

export type InterviewPhase =
  | "idle"
  | "connecting"
  | "speaking"
  | "listening"
  | "reviewing"
  | "thinking"
  | "completed"
  | "ended"
  | "permission-denied"
  | "error";

export type ChatMessage = {
  id: string;
  role: "ai" | "user" | "system";
  text: string;
  status: "typing" | "interim" | "final" | "editing";
  questionIndex?: number;
};

type QaPair = { question: string; answer: string };

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

const SILENCE_TIMEOUT_MS = 2000;
const MAX_LISTENING_MS = 90000;

function getRecognitionConstructor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") {
    return null;
  }
  const candidates = [
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition,
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "function") {
      return candidate as new () => SpeechRecognitionLike;
    }
  }
  return null;
}

export function useInterviewSession(interview: InterviewDetails, candidateName: string) {
  const [phase, setPhase] = useState<InterviewPhase>("idle");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [interimText, setInterimText] = useState("");
  const [draftAnswer, setDraftAnswer] = useState("");
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const listenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSpeechAtRef = useRef(0);
  const listeningRef = useRef(false);
  const startedRef = useRef(false);
  const endedRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);
  const answeredCountRef = useRef(0);
  const qaHistoryRef = useRef<QaPair[]>([]);
  const currentQuestionRef = useRef<string>("");
  const draftAnswerRef = useRef("");

  const isSttSupported = useMemo(() => getRecognitionConstructor() !== null, []);

  useEffect(() => {
    draftAnswerRef.current = draftAnswer;
  }, [draftAnswer]);

  const pushMessage = useCallback((message: ChatMessage) => {
    setChatMessages((previous) => [...previous, message]);
  }, []);

  const updateMessage = useCallback((id: string, patch: Partial<ChatMessage>) => {
    setChatMessages((previous) =>
      previous.map((message) => (message.id === id ? { ...message, ...patch } : message)),
    );
  }, []);

  const upsertInterim = useCallback((text: string) => {
    setChatMessages((previous) => {
      if (previous.length && previous[previous.length - 1].id === "interim") {
        return [...previous.slice(0, -1), { id: "interim", role: "user", text, status: "interim" }];
      }
      return [...previous, { id: "interim", role: "user", text, status: "interim" }];
    });
  }, []);

  const pushSystemNote = useCallback(
    (text: string) => {
      pushMessage({ id: crypto.randomUUID(), role: "system", text, status: "final" });
    },
    [pushMessage],
  );

  const stopMediaTracks = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearInterval(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
    listeningRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  const endCall = useCallback(
    async (completed: boolean) => {
      if (endedRef.current) {
        return;
      }
      endedRef.current = true;
      setAgentSpeaking(false);
      stopListening();
      stopMediaTracks();
      setAudioLevel(0);
      await audioContextRef.current?.close().catch(() => undefined);
      audioContextRef.current = null;

      const id = sessionIdRef.current;
      if (id) {
        try {
          await fetch("/api/interview/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: id, endedEarly: !completed }),
          });
        } catch {
          // best-effort persistence; the session stays in_progress
        }
      }
      setPhase(completed ? "completed" : "ended");
    },
    [stopListening, stopMediaTracks],
  );

  const getAudioContext = useCallback((): { context: AudioContext; analyser: AnalyserNode } => {
    if (!audioContextRef.current) {
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.6;
      audioContextRef.current = context;
      analyserRef.current = analyser;
    }
    return { context: audioContextRef.current, analyser: analyserRef.current as AnalyserNode };
  }, []);

  const playTts = useCallback(
    async (text: string): Promise<void> => {
      const response = await fetch("/api/interview/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error(`TTS request failed with status ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const { context, analyser } = getAudioContext();
      if (context.state === "suspended") {
        await context.resume();
      }

      const audioBuffer = await context.decodeAudioData(buffer);
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyser);
      analyser.connect(context.destination);

      const frequencyData = new Uint8Array(analyser.frequencyBinCount);
      setAgentSpeaking(true);

      const levelLoop = () => {
        if (analyserRef.current && !endedRef.current) {
          analyserRef.current.getByteFrequencyData(frequencyData);
          let sum = 0;
          for (let index = 0; index < frequencyData.length; index += 1) {
            sum += frequencyData[index];
          }
          setAudioLevel(sum / (frequencyData.length * 255));
          requestAnimationFrame(levelLoop);
        }
      };
      levelLoop();

      await new Promise<void>((resolve) => {
        source.onended = () => resolve();
        source.start();
      });

      setAudioLevel(0);
      setAgentSpeaking(false);
    },
    [getAudioContext],
  );

  const playAiLine = useCallback(
    async (text: string) => {
      setPhase("speaking");
      try {
        await playTts(text);
      } catch {
        pushSystemNote("Audio unavailable — read the message in chat.");
      }
    },
    [playTts, pushSystemNote],
  );

  const speakClosing = useCallback(async () => {
    const closing = `Thank you, ${candidateName}! That's the end of the interview. We'll review your responses and be in touch soon. Best of luck!`;
    const bubbleId = crypto.randomUUID();
    pushMessage({ id: bubbleId, role: "ai", text: closing, status: "typing" });
    setPhase("speaking");

    await playAiLine(closing);
    updateMessage(bubbleId, { status: "final" });

    await endCall(true);
  }, [candidateName, endCall, playAiLine, pushMessage, updateMessage]);

  const finishListening = useCallback(() => {
    const finalText = draftAnswerRef.current.trim();
    stopListening();
    setInterimText("");
    setChatMessages((previous) => previous.filter((message) => message.id !== "interim"));
    if (finalText) {
      pushMessage({ id: crypto.randomUUID(), role: "user", text: finalText, status: "final" });
    }
    setDraftAnswer(finalText);
    setPhase("reviewing");
  }, [pushMessage, stopListening]);

  const beginListening = useCallback(() => {
    const Recognition = getRecognitionConstructor();

    if (!Recognition) {
      setDraftAnswer("");
      setPhase("reviewing");
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let accumulated = "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let index = event.results.length - 1; index >= 0; index -= 1) {
        const result = event.results[index];
        if (result.isFinal) {
          accumulated += `${result[0].transcript} `;
        } else if (index === event.results.length - 1) {
          interim = result[0].transcript;
        }
      }
      lastSpeechAtRef.current = Date.now();
      const combined = `${accumulated}${interim}`.trim();
      setInterimText(interim.trim());
      setDraftAnswer(accumulated.trim());
      upsertInterim(combined);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        stopListening();
        setInterimText("");
        setPhase("reviewing");
      }
    };

    recognition.onend = () => {
      listeningRef.current = false;
    };

    recognitionRef.current = recognition;
    listeningRef.current = true;
    lastSpeechAtRef.current = Date.now();
    setInterimText("");
    setDraftAnswer("");
    setPhase("listening");
    recognition.start();

    silenceTimerRef.current = setInterval(() => {
      if (!listeningRef.current) {
        return;
      }
      const heardNothingFor = Date.now() - lastSpeechAtRef.current;
      const hasSpeech = draftAnswerRef.current.trim().length > 0;
      if (hasSpeech && heardNothingFor > SILENCE_TIMEOUT_MS) {
        finishListening();
      }
    }, 500);

    listenTimeoutRef.current = setTimeout(() => {
      if (listeningRef.current) {
        finishListening();
      }
    }, MAX_LISTENING_MS);
  }, [finishListening, upsertInterim, stopListening]);

  const askNextQuestion = useCallback(async () => {
    setDraftAnswer("");
    setInterimText("");

    if (answeredCountRef.current >= MAX_INTERVIEW_QUESTIONS) {
      await speakClosing();
      return;
    }

    const typingId = crypto.randomUUID();
    pushMessage({ id: typingId, role: "ai", text: "", status: "typing" });
    setPhase("thinking");

    try {
      const response = await fetch("/api/interview/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: interview.jobTitle,
          description: interview.description,
          qaHistory: qaHistoryRef.current,
        }),
      });
      if (!response.ok) {
        throw new Error(`Question request failed with status ${response.status}`);
      }
      const result = (await response.json()) as { question?: string; done?: boolean };

      if (result.done || !result.question) {
        setChatMessages((previous) => previous.filter((message) => message.id !== typingId));
        await speakClosing();
        return;
      }

      const question = result.question;
      updateMessage(typingId, { text: question, status: "final" });
      currentQuestionRef.current = question;

      await playAiLine(question);
      beginListening();
    } catch (error) {
      updateMessage(typingId, {
        role: "system",
        text: "I couldn't prepare the next question. Please try again.",
        status: "final",
      });
      setPhase("error");
      setErrorMessage(error instanceof Error ? error.message : "Question generation failed");
    }
  }, [interview.jobTitle, interview.description, beginListening, playAiLine, pushMessage, speakClosing, updateMessage]);

  const confirmAnswer = useCallback(async () => {
    const answer = draftAnswer.trim();
    if (!answer || !sessionIdRef.current) {
      return;
    }

    const question = currentQuestionRef.current;
    const index = answeredCountRef.current;
    qaHistoryRef.current = [...qaHistoryRef.current, { question, answer }];
    answeredCountRef.current = index + 1;

    try {
      await fetch("/api/interview/save-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current, questionIndex: index, question, answer }),
      });
    } catch {
      pushSystemNote("Answer could not be saved. Please check your connection.");
    }

    await askNextQuestion();
  }, [askNextQuestion, draftAnswer, pushSystemNote]);

  const startInterview = useCallback(async () => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;
    setErrorMessage("");
    getAudioContext();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setPhase("permission-denied");
      startedRef.current = false;
      return;
    }

    try {
      const response = await fetch("/api/interview/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: interview.id,
          candidateName,
          jobTitle: interview.jobTitle,
          company: interview.company,
        }),
      });
      if (!response.ok) {
        throw new Error(`Session request failed with status ${response.status}`);
      }
      const result = (await response.json()) as { sessionId: string };
      sessionIdRef.current = result.sessionId;
      setSessionId(result.sessionId);
    } catch {
      setPhase("error");
      setErrorMessage("Could not start the interview session.");
      stopMediaTracks();
      startedRef.current = false;
      return;
    }

    const greeting = `Hi ${candidateName}! I'm the AI recruiter at ${interview.company}, and I'll be walking you through your ${interview.jobTitle} interview. I'll ask you up to ${MAX_INTERVIEW_QUESTIONS} questions, so take your time. To start — tell me a little about yourself, and what drew you to this role.`;
    const bubbleId = crypto.randomUUID();
    pushMessage({ id: bubbleId, role: "ai", text: greeting, status: "typing" });
    setPhase("speaking");

    await playAiLine(greeting);
    updateMessage(bubbleId, { status: "final" });

    beginListening();
  }, [interview.id, interview.jobTitle, interview.company, candidateName, beginListening, getAudioContext, playAiLine, pushMessage, stopMediaTracks, updateMessage]);

  const toggleMic = useCallback(() => {
    const audioTrack = mediaStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicMuted(!audioTrack.enabled);
    }
  }, []);

  const toggleCamera = useCallback(() => {
    const videoTrack = mediaStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOff(!videoTrack.enabled);
    }
  }, []);

  const requestRetry = useCallback(() => {
    startedRef.current = false;
    setPhase("idle");
  }, []);

  useEffect(() => {
    if (phase === "idle" || phase === "completed" || phase === "ended" || phase === "permission-denied") {
      return;
    }
    const interval = setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    return () => {
      endedRef.current = true;
      stopListening();
      stopMediaTracks();
      void audioContextRef.current?.close().catch(() => undefined);
    };
  }, [stopListening, stopMediaTracks]);

  return {
    phase,
    chatMessages,
    interimText,
    draftAnswer,
    setDraftAnswer,
    isMicMuted,
    isCameraOff,
    elapsedSeconds,
    agentSpeaking,
    audioLevel,
    errorMessage,
    sessionId,
    videoRef,
    isSttSupported,
    startInterview,
    confirmAnswer,
    beginListening,
    finishListening,
    endCall,
    toggleMic,
    toggleCamera,
    requestRetry,
  };
}
