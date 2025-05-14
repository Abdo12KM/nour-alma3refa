# Troubleshooting Guide - Microphone Functionality in Nour al-Ma'rifa

This guide helps resolve common issues with speech recognition in the application.

## Common Error Messages and Solutions

### "Error: API error response: {}"

This error typically appears when the Gemini API call fails. Here's how to fix it:

1. **API Key Configuration**:

   - Ensure the `GOOGLE_API_KEY` is set correctly in your `.env.local` file
   - Check that your API key is active and has the necessary permissions
   - Try running the test script: `pnpm test:api`

2. **Audio Format Issues**:

   - The Gemini API requires specific audio formats
   - The application uses `audio/ogg; codecs=opus` which is normally supported
   - Test with shorter audio recordings first (1-2 seconds)

3. **Network Issues**:
   - Ensure you have a stable internet connection
   - Check if you're behind a firewall or VPN that might block the API call

### "Error: Missing API credentials"

This indicates that the application cannot find the Google API key.

1. **Environment Variables**:
   - Make sure you've created a `.env.local` file in the project root
   - Add `GOOGLE_API_KEY=your_key_here` to the file
   - Restart the development server after adding the key

### "Error: Failed to access microphone"

This happens when the browser cannot access your microphone.

1. **Browser Permissions**:

   - Check that you've allowed microphone access in your browser
   - Try a different browser to rule out browser-specific issues

2. **Hardware Issues**:
   - Test your microphone in another application
   - Make sure your microphone is properly connected and working

## Advanced Troubleshooting

### Checking Browser Console

1. Open your browser's developer tools (F12)
2. Go to the Console tab
3. Look for errors related to the Gemini API or microphone access

### Server-side Logs

1. Check the terminal running the Next.js server
2. Look for errors related to the API calls
3. The server logs will show detailed error information

### Testing API Access Directly

Run the included test script to validate your API configuration:

```bash
pnpm test:api
```

This script will verify if your Gemini API key is working correctly.

## Still Having Issues?

If you continue to experience problems, try:

1. Clearing browser cache and cookies
2. Using an incognito/private browsing window
3. Testing on a different device
4. Verifying that your Google API key has access to the Gemini API
