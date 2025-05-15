import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Google AI client with proper settings
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("file") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

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