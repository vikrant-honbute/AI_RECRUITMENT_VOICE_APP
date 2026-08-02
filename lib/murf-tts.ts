const MURF_STREAM_URL = "https://global.api.murf.ai/v1/speech/stream";
const MAX_TEXT_LENGTH = 3000;

export function getMurfVoiceId() {
  return process.env.MURF_VOICE_ID || "Gordon";
}

export async function synthesizeMurfSpeech(text: string): Promise<Response> {
  const apiKey = process.env.MURF_API_KEY;

  if (!apiKey) {
    throw new Error("MURF_API_KEY is not configured.");
  }

  return fetch(MURF_STREAM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      text: text.slice(0, MAX_TEXT_LENGTH),
      voiceId: getMurfVoiceId(),
      model: "falcon-2",
      locale: "en-US",
      format: "MP3",
      sampleRate: 24000,
      channelType: "MONO",
    }),
  });
}
