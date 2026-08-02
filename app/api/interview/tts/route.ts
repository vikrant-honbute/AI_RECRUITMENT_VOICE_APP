import { synthesizeMurfSpeech } from "@/lib/murf-tts";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return Response.json({ error: "text is required" }, { status: 400 });
  }
  if (text.length > 3000) {
    return Response.json({ error: "text is too long" }, { status: 400 });
  }

  try {
    const murfResponse = await synthesizeMurfSpeech(text);

    if (!murfResponse.ok) {
      const detail = await murfResponse.text().catch(() => "");
      return Response.json(
        { error: "TTS provider returned an error", detail },
        { status: 502 },
      );
    }

    const audio = await murfResponse.arrayBuffer();

    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audio.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown TTS error";
    return Response.json({ error: message }, { status: 500 });
  }
}
