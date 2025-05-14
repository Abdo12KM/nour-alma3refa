import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(request: NextRequest) {
  try {
    // Get form data from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const action = formData.get('action') as string || 'transcript'; // Default to transcript
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    console.log(`Processing audio: type=${audioFile.type}, size=${audioFile.size}, action=${action}`);

    // Convert the audio file to a buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    
    // Create base64 representation of the audio
    const audioBase64 = buffer.toString('base64');
    
    // Create prompt based on the action
    let prompt;
    if (action === 'name') {
      prompt = "Transcribe this audio of someone saying their name in Arabic. Return ONLY the name, no additional text.";
    } else if (action === 'userId') {
      prompt = "Transcribe this audio of someone saying a numeric user ID in Arabic. Return ONLY the numeric digits, no additional text.";
    } else if (action === 'pin') {
      prompt = "Transcribe this audio of someone saying a 4-digit PIN in Arabic. Return ONLY the 4 digits, no additional text.";
    } else {
      // Default transcript
      prompt = "Transcribe this audio in Arabic.";
    }
    
    try {
      // Use the AI SDK to generate a transcription
      const result = await generateText({
        model: google('gemini-1.5-flash'),
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'file',
                data: audioBase64,
                mimeType: audioFile.type
              }
            ]
          }
        ]
      });
      
      const responseText = result.text;
      console.log(`Transcription result: ${responseText}`);
      
      // Process the response based on action
      let processedText = responseText.trim();
      
      if (action === 'userId') {
        // Extract only digits from the response
        processedText = processedText.replace(/\D/g, '');
      } else if (action === 'pin') {
        // Ensure we have a 4-digit PIN
        processedText = processedText.replace(/\D/g, '');
        if (processedText.length !== 4) {
          return NextResponse.json({ 
            error: 'Invalid PIN format', 
            transcript: responseText 
          }, { status: 400 });
        }
      }
      
      return NextResponse.json({ 
        text: processedText,
        transcript: responseText 
      });
    } catch (apiError: any) {
      console.error('AI API error details:', apiError);
      return NextResponse.json({ error: 'Speech recognition API error', details: apiError.message }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Speech-to-text error:', error);
    return NextResponse.json({ error: 'Speech recognition failed' }, { status: 500 });
  }
} 