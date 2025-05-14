# Development Prompts for Nour al-Ma'rifa

This document outlines a structured sequence of prompts to incrementally build the Nour al-Ma'rifa project. Each prompt is designed to implement a specific feature or component, ensuring that each step is testable before moving to the next.

## Project Setup

### 1. Base Project Structure
```
Create a Next.js project with App Router, TypeScript, Tailwind CSS, and shadcn/ui. 
Configure the project with:
- A clean, organized folder structure
- Essential components from shadcn (Button, Card, Progress)
- High-contrast theme for accessibility
- Proper TypeScript configuration
```

### 2. Database Configuration
```
Set up Drizzle ORM with PostgreSQL for the project. Create:
- Connection utility
- User schema with fields for:
  - id (primary key)
  - name
  - pin (4-digit numeric PIN)
  - points (for gamification)
  - progress (JSON for tracking completed lessons)
- Migration script
```

## Authentication System

### 3. Text-Based Registration
```
Create a text-based registration page with:
- Input field for user name
- PIN creation interface (4-digit numeric)
- Clear visual feedback and validation
- Large, accessible submit button
- Voice guidance via EGTTS
- Store user data in the database
- Display unique user ID for future login
```

### 4. Voice-Based Registration
```
Create a voice-based registration flow that:
- Records user's name using microphone
- Provides clear audio instructions and feedback
- Offers PIN creation interface
- Processes speech using Gemini API
- Stores user data in the database
- Clearly displays the user's unique ID number for future login
```

### 5. Text-Based Login
```
Create a text-based login page that:
- Asks for user ID (numeric)
- Requests 4-digit PIN
- Validates credentials against database
- Provides audio feedback on success/failure
- Uses localStorage to maintain session
```

### 6. Voice-Based Login
```
Create a voice-based login flow that:
- Records user speaking their ID number
- Processes speech to extract the numeric ID
- Requests PIN input via touchscreen
- Validates credentials against database
- Provides clear audio feedback
- Maintains session state
```

## Core Navigation

### 7. Main Menu
```
Design a voice-guided main menu with:
- Large, icon-based buttons for:
  - Start Lesson (Letters)
  - Start Lesson (Numbers)
  - View Progress
- Audio instructions in Egyptian Arabic via EGTTS
- High contrast, accessible design
- Session persistence check
```

## Learning Modules

### 8. Letter Lesson Framework
```
Create a reusable letter lesson component that:
- Displays a single Arabic letter (e.g., أ) in large format
- Includes audio pronunciation via EGTTS
- Shows example words with images
- Provides navigation to next/previous letters
- Prepares for integration with pronunciation practice
```

### 9. Pronunciation Practice
```
Add pronunciation practice to the letter lesson:
- Microphone recording button
- Audio capture using MediaRecorder API
- Integration with Gemini Speech-to-Text
- Comparison logic for pronunciation accuracy
- Audio feedback on correctness
- Points award on successful pronunciation
```

### 10. Letter Identification Quiz
```
Create a letter identification quiz that:
- Shows 3 learned letters
- Provides audio instruction to select a specific letter
- Checks selection against target
- Gives audio feedback
- Awards points for correct answers
- Updates progress in database
```

### 11. Number Lesson Framework
```
Create a number lesson component similar to letters:
- Displays Arabic numeral (٠-٥) in large format
- Includes audio pronunciation
- Shows visual counting examples
- Navigation between numbers
- Consistent UI with letter lessons
```

### 12. Number Identification Quiz
```
Add a number quiz similar to letter quiz:
- Shows 3 learned numbers
- Audio instruction to select a specific number
- Selection verification
- Audio feedback
- Points and progress tracking
```

## Gamification

### 13. Progress Tracking System
```
Implement a progress tracking system:
- Database updates on lesson/quiz completion
- Store completed items in user progress field
- Award points for achievements
- Create progress visualization page
- Audio summary of accomplishments
```

## Utility Services

### 14. EGTTS Integration
```
Set up the EGTTS integration:
- API client for Egyptian TTS
- Caching mechanism for frequent phrases
- Error handling with fallbacks
- Audio playback utilities
- Queue system for sequential announcements
```

### 15. Gemini API Integration
```
Implement Gemini API integration for:
- Speech-to-text processing
- Example word generation
- Pronunciation assessment
- Secure API key management
- Error handling and retries
```

## PWA Features

### 16. PWA Configuration
```
Set up Progressive Web App features:
- Web manifest with icons and metadata
- Basic service worker for static asset caching
- Install prompts
- Testing on mobile devices
```

## Final Integration

### 17. Complete User Journey
```
Connect all components into a cohesive flow:
- Registration (text/voice) → Login (text/voice) → Menu → Lessons → Quizzes → Progress
- Ensure data persistence throughout
- Test voice guidance continuity
- Verify points accumulation
- Confirm progress tracking
```

## Additional Prompts for Future Expansion

### 18. Handwriting Recognition
```
Add handwriting practice using:
- Camera capture for written letters
- Gemini Vision API for assessment
- Feedback on penmanship
- Guided practice exercises
```

### 19. Word Building
```
Create word building exercises:
- Combine learned letters into simple words
- Drag and drop interface
- Audio guidance and feedback
- Real-world application examples
```

### 20. Offline Functionality
```
Enhance offline capabilities:
- Complete lesson content caching
- IndexedDB for local progress
- Sync mechanism when online
- Offline-first architecture
```

---

## Development Plan

### Day 1 Focus
- Complete project setup and database configuration
- Build the PIN-based authentication system with dual text/voice paths
- Create the main menu with basic navigation

### Day 2 Focus
- Implement letter and number lessons
- Add pronunciation practice features
- Set up gamification elements
- Configure basic PWA features

Each prompt should be executed sequentially, testing functionality before moving to the next step to ensure a stable, incrementally built application. 