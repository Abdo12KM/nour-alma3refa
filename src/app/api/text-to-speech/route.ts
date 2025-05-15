import { NextRequest, NextResponse } from "next/server";
import * as textToSpeech from "@google-cloud/text-to-speech";
import { z } from "zod";

// Schema to validate the request body
const ttsSchema = z.object({
  text: z.string().min(1, "Text is required"),
  type: z.enum(["name", "pin", "general"]).default("general"),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const validatedData = ttsSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: validatedData.error.format(),
        },
        { status: 400 }
      );
    }

    const { text, type } = validatedData.data;

    // Create a client
    const client = new textToSpeech.TextToSpeechClient();

    // Generate speech
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: "ar-XA",
        name: "ar-XA-Chirp3-HD-Algenib",
      },
      audioConfig: {
        audioEncoding: "LINEAR16" as const,
        sampleRateHertz: 24000,
      },
    });

    // Create response with audio content
    const audioContent = response.audioContent as Uint8Array;

    return new NextResponse(Buffer.from(audioContent), {
      headers: {
        "Content-Type": "audio/wav", // Changed from audio/mpeg to audio/wav for LINEAR16
        "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
      },
    });
  } catch (error) {
    console.error("Error in TTS API:", error);
    return NextResponse.json(
      { success: false, error: "Text-to-speech generation failed" },
      { status: 500 }
    );
  }
}
