import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rate-limit";

// Initialize the Google AI client with proper settings
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);

// Set up rate limiter for this API: 15 requests per minute
const detectLetterRateLimiter = rateLimiter({
  limit: 15,
  windowInSeconds: 60,
});

export async function POST(req: NextRequest) {
  try {
    // Check rate limit first
    const rateLimitResult = await detectLetterRateLimiter(req);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const formData = await req.formData();
    const imageFile = formData.get("file") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Convert the file to a byte array
    const imageBytes = await imageFile.arrayBuffer();

    // Prepare the image data for Gemini
    const imageData = {
      inlineData: {
        data: Buffer.from(imageBytes).toString("base64"),
        mimeType: imageFile.type,
      },
    };

    // Prompt for Arabic letter detection
    const prompt = `You are an Arabic handwriting recognition expert. 
    Look at this image and identify which Arabic letter is written.
    The possible letters are: أ (alef), ب (beh), ت (teh), ث (theh), ج (jeem).
    Return ONLY the romanized name (alef, beh, teh, theh, or jeem) without any additional text.
    If you can't identify the letter or if it's not one of these letters, return "unknown".`;

    // Generate content
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text().trim().toLowerCase();

    // Validate the response is one of the expected values
    const validResponses = ["alef", "beh", "teh", "theh", "jeem", "unknown"];
    const prediction = validResponses.includes(text) ? text : "unknown";

    return NextResponse.json({ prediction });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
