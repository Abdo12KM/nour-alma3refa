# Setting Up Nour al-Ma'rifa API Keys

This document provides instructions for setting up the necessary API keys for Nour al-Ma'rifa.

## Google Gemini API Setup

The application uses Google's Gemini API for speech-to-text functionality. Follow these steps to set up your API key:

1. **Create a Google Cloud account** if you don't already have one.

2. **Enable the Gemini API** in your Google Cloud Console:

   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

3. **Configure your environment variables**:

   - Copy the `.env.local.example` file to `.env.local`
   - Replace `your_google_api_key_here` with your actual Gemini API key
   - Example: `GOOGLE_API_KEY=AIza...`

4. **Restart your development server** after setting up the API key:
   ```bash
   npm run dev
   ```

## Troubleshooting Speech Recognition

If you encounter issues with the speech recognition functionality:

1. **Check your API key**:

   - Verify that your API key is correctly set in the `.env.local` file
   - Ensure the API key has the necessary permissions

2. **Inspect network requests**:

   - Open browser developer tools (F12)
   - Go to the Network tab
   - Look for requests to the `/api/speech-to-text` endpoint
   - Check for error messages in the response

3. **Audio format issues**:

   - The Gemini API supports these audio formats: WAV, MP3, MP4, OGG, and WEBM
   - Make sure your browser is recording in one of these formats

4. **Review console logs**:
   - Check the browser console and server logs for detailed error messages
