import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

// Define audio files to generate
const profileAudio = {
  "edit-name": "هل تريد تعديل اسمك؟",
  "edit-pin": "هل تريد تعديل الرقم السري؟",
  "toggle-pin-visibility": "هل تريد تغيير ظهور الرقم السري؟",
  "speak-profile-info": "هل تريد سماع معلومات ملفك الشخصي؟",
  "confirm-save-name": "هل أنت متأكد من حفظ الاسم الجديد؟",
  "confirm-save-pin": "هل أنت متأكد من حفظ الرقم السري الجديد؟",
  "record-name-instruction": "سجل اسمك الجديد بصوت واضح",
  "record-pin-instruction": "سجل الرقم السري الجديد بصوت واضح، أربعة أرقام فقط",
};

// Endpoint to generate profile audio files
export async function GET() {
  try {
    // Only for development environment
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "This endpoint is only available in development" },
        { status: 403 }
      );
    }
    
    // Get the public directory path
    const publicDir = path.join(process.cwd(), "public");
    const audioDir = path.join(publicDir, "audio");
    
    // Make sure the audio directory exists
    if (!fs.existsSync(audioDir)) {
      await mkdir(audioDir, { recursive: true });
    }
    
    // List of audio files that were generated
    const generatedFiles = [];
    
    // Generate each audio file if it doesn't exist
    for (const [key, text] of Object.entries(profileAudio)) {
      const audioPath = path.join(audioDir, `${key}.wav`);
      
      // Skip if the file already exists
      if (fs.existsSync(audioPath)) {
        generatedFiles.push(`${key}.wav (existed)`);
        continue;
      }
      
      // Make the TTS API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/text-to-speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate audio for ${key}`);
      }
      
      // Save the audio file
      const audioBlob = await response.blob();
      const audioBuffer = Buffer.from(await audioBlob.arrayBuffer());
      await writeFile(audioPath, audioBuffer);
      
      generatedFiles.push(`${key}.wav (new)`);
    }
    
    return NextResponse.json({
      message: "Audio files generated successfully",
      files: generatedFiles,
    });
  } catch (error) {
    console.error("Error generating audio files:", error);
    return NextResponse.json(
      { error: "Failed to generate audio files" },
      { status: 500 }
    );
  }
} 