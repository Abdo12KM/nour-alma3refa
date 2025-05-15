import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(request: NextRequest) {
  try {
    // Check if Google API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error(
        "GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set"
      );
      return NextResponse.json(
        {
          error: "Missing API credentials",
          message: "Google API key is not configured",
        },
        { status: 500 }
      );
    }

    // Get form data from the request
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const action = (formData.get("action") as string) || "transcript"; // Default to transcript

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    if (typeof audioFile.arrayBuffer !== "function") {
      console.error("Invalid audio file object received");
      return NextResponse.json(
        {
          error: "Invalid audio file",
          message: "The audio file is not in the expected format",
        },
        { status: 400 }
      );
    }

    // Convert the audio file to a buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      console.error("Empty audio file received");
      return NextResponse.json(
        {
          error: "Empty audio file",
          message: "The audio recording is empty",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(arrayBuffer);

    // Create base64 representation of the audio
    const audioBase64 = buffer.toString("base64");

    // Create prompt based on the action
    let prompt;
    if (action === "name") {
      prompt =
        "Transcribe this audio of someone saying their name in Egyptian Arabic. Return ONLY the name itself, with no additional text, interpretations, or punctuation. The person is most likely speaking in Egyptian dialect, so account for any dialect-specific pronunciations. If you hear honorifics like 'doctor' or 'engineer' before the name, do not include them.";
    } else if (action === "userId") {
      prompt = `Transcribe this audio of someone saying their user ID in Egyptian Arabic. The ID consists only of digits. You must return ONLY the numerical digits.

                Key instructions:
                - The speaker may say digits individually or as a complete number
                - The ID is between 1-99999 (1 to 5 digits)
                - Account for Egyptian dialect pronunciations of numbers
                - Return ONLY the digits with no Arabic text or explanations

                Common patterns:
                - Individual digits: "واحد, اثنين, تلاتة, تمنية" → 1238
                - Complete number: "ثلاثة عشر" → 13
                - Complete number: "سبعة" → 7
                - Egyptian dialect: "مية واحد وخمسين" → 151
                - Mixed dialect: "ثلاثة و سبعين" → 73
                - Colloquial: "تلاتة وسبعين" → 73

                Return ONLY the numeric digits, nothing else.`;
    } else if (action === "pin") {
      prompt =
        "Transcribe this audio of someone saying a 4-digit PIN in Egyptian Arabic. The PIN consists of exactly 4 digits. Return ONLY the 4 numeric digits, with no additional text, spaces, or punctuation. The person may say each digit individually (e.g., 'واحد, اثنين, ثلاثة, أربعة' for 1234) or may group them (e.g., 'واحد واربعين' for 41, followed by other digits). Account for Egyptian dialect pronunciations. ALWAYS return exactly 4 digits.";
    } else {
      // Default transcript
      prompt =
        "Transcribe this audio in Egyptian Arabic. Preserve the exact words spoken, accounting for Egyptian dialect pronunciations and colloquialisms. Return the transcription in Arabic script. Do not translate to Modern Standard Arabic or any other language.";
    }
    try {
      // Log the request details for debugging
      console.log(`Making speech-to-text request with action: ${action}`);
      console.log(`Audio MIME type: ${audioFile.type}`);
      console.log(`Audio file size: ${audioFile.size} bytes`);

      // Validate audio format
      const supportedFormats = [
        "audio/wav",
        "audio/mpeg",
        "audio/mp4",
        "audio/ogg",
        "audio/webm",
      ];
      if (!supportedFormats.some((format) => audioFile.type.includes(format))) {
        console.warn(`Potentially unsupported audio format: ${audioFile.type}`);
      }

      // Use the AI SDK to generate a transcription
      const result = await generateText({
        model: google("gemini-2.0-flash"),
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "file",
                data: audioBase64,
                mimeType: audioFile.type,
              },
            ],
          },
        ],
      });

      const responseText = result.text;
      console.log(`Transcription result: ${responseText}`);

      // Process the response based on action
      let processedText = responseText.trim();

      if (action === "userId") {
        // Extract only digits from the response
        processedText = processedText.replace(/\D/g, "");

        // Validate the number is within range (1-99999)
        const num = parseInt(processedText, 10);
        if (isNaN(num) || num < 1 || num > 99999) {
          return NextResponse.json(
            {
              error: "Invalid user ID format",
              transcript: responseText,
              message: "رقم المستخدم يجب أن يكون بين 1 و 99999",
            },
            { status: 400 }
          );
        }
      } else if (action === "pin") {
        // Ensure we have a 4-digit PIN
        processedText = processedText.replace(/\D/g, "");
        if (processedText.length !== 4) {
          return NextResponse.json(
            {
              error: "Invalid PIN format",
              transcript: responseText,
            },
            { status: 400 }
          );
        }
      }

      return NextResponse.json({
        text: processedText,
        transcript: responseText,
      });
    } catch (apiError: any) {
      console.error("AI API error details:", apiError);

      // Extract more detailed error information if possible
      let errorDetails = apiError.message || "Unknown error";
      let errorCode = 500;

      if (apiError.status) {
        errorCode = apiError.status;
      }

      if (apiError.response) {
        try {
          // Try to extract more details from the response if available
          const responseBody = await apiError.response.json();
          errorDetails = responseBody.error || errorDetails;
          console.error("API response error details:", responseBody);
        } catch (e) {
          console.error("Could not parse error response:", e);
        }
      }

      return NextResponse.json(
        {
          error: "Speech recognition API error",
          details: errorDetails,
          message: "Failed to process audio with Gemini API",
        },
        { status: errorCode }
      );
    }
  } catch (error) {
    console.error("Speech-to-text error:", error);

    // Provide more detailed error information
    let errorMessage = "Speech recognition failed";
    let errorDetails = "";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || "";
    }

    return NextResponse.json(
      {
        error: "Speech recognition failed",
        message: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
