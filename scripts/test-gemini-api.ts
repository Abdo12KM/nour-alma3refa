// Test script for Gemini API configuration
// Run this with: pnpm tsx scripts/test-gemini-api.ts

import dotenv from 'dotenv';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testGeminiAPI() {
  console.log('Testing Gemini API configuration...');
  
  // Check if API key is set
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('❌ GOOGLE_API_KEY is not set in .env.local');
    console.log('Please create a .env.local file with your API key. See .env.local.example for guidance.');
    return;
  }
  
  console.log('✅ GOOGLE_API_KEY is set');
  
  try {
    // Simple text generation test
    console.log('Testing text generation...');
    const result = await generateText({
      model: google('gemini-1.5-flash'),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Say hello in Arabic' }
          ]
        }
      ]
    });
    
    console.log('✅ Text generation successful');
    console.log('Result:', result.text);
    
    // Optional: Test with audio if a test file is available
    const testAudioPath = path.join(process.cwd(), 'public', 'audio', 'test-audio.wav');
    if (fs.existsSync(testAudioPath)) {
      console.log('Test audio file found. Testing speech-to-text...');
      
      // Read test audio file
      const audioBuffer = fs.readFileSync(testAudioPath);
      const audioBase64 = audioBuffer.toString('base64');
      
      // Test speech recognition
      const speechResult = await generateText({
        model: google('gemini-1.5-flash'),
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Transcribe this audio' },
              {
                type: 'file',
                data: audioBase64,
                mimeType: 'audio/wav'
              }
            ]
          }
        ]
      });
      
      console.log('✅ Speech-to-text successful');
      console.log('Transcription:', speechResult.text);
    } else {
      console.log('ℹ️ No test audio file found at', testAudioPath);
      console.log('Skipping speech-to-text test.');
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

testGeminiAPI().catch(console.error);
