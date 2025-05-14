# Nour al-Ma'rifa (نور المعرفة) - Light of Knowledge

A Progressive Web App (PWA) aimed at addressing foundational illiteracy in Egypt through an innovative, voice-centric, and gamified learning experience for illiterate and semi-literate Egyptian adults.

## Project Vision

Nour al-Ma'rifa addresses the challenge of foundational illiteracy in Egypt by offering an accessible, effective, and empowering way to learn basic Arabic literacy (letters and numbers). By using intuitive design, localized AI tools, and audio interaction, we make the first steps into literacy and digital interaction as easy and encouraging as possible.

## Key Features

- **Voice-First Interaction**: Uses clear audio prompts in Egyptian Arabic for navigation, lessons, instructions, and feedback.
- **AI-Powered Personalization**: Generates culturally relevant examples and processes user voice inputs for feedback.
- **Accessible UI/UX**: Large icons, high contrast colors, minimal text, and simple navigation.
- **Gamification**: Points, badges, and progress tracking to boost motivation.
- **Dual Authentication System**:
  - Text-based registration and login with name, PIN, and unique ID
  - Voice-based registration and login for users who cannot read
  - Simple PIN-based security with unique numeric IDs for each user

## Core Learning Modules

- **Arabic Letters**: Learn to recognize and pronounce Arabic letters (أ, ب, ت, etc.)
- **Numbers**: Learn basic numerals (٠-٩) with visual and audio support
- **Words**: Learn common Arabic words and phrases

## Navigation Improvements

- **Direct Navigation**: In addition to audio-guided navigation, the app now includes direct navigation buttons for improved user experience and accessibility.
- **Module Selection Page**: A dedicated learning modules selection page allows users to choose between Letters, Numbers, and Words.
- **Temporary Guest Access**: For testing purposes, a temporary guest login button is provided on the home page (to be removed before production).

## Technology Stack

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **AI/ML**: Google Gemini API (Speech-to-Text, Text Generation)
- **TTS**: EGTTS V0.1 for Egyptian Arabic text-to-speech
- **Deployment**: Vercel (Frontend/Backend), Neon (Database)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Google API key for Gemini API (see [API_SETUP.md](./API_SETUP.md) for details)
4. Run the development server:
   ```bash
   pnpm dev
   ```
5. Using the temporary Guest Login:
   - For quick access to learning modules without registration, use the "Guest Login" button
   - This will take you to the learning selection page with modules for Arabic letters, numbers, and words
   - *Note: This button is intended for development/testing and will be removed in production*

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components
- `lib/` - Utility functions and shared logic
- `lib/db/` - Database schemas and query functions
- `public/` - Static assets and PWA manifest

## Screenshots

(Coming soon)

## License

MIT

## Acknowledgements

- The EGTTS V0.1 model for Egyptian Arabic text-to-speech
- Google Gemini API for AI capabilities
- Next.js, Tailwind CSS, and Shadcn UI for development frameworks
