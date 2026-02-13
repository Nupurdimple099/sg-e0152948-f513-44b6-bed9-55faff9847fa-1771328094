# IELTS Practice App - Complete AI Integration Implementation Plan

## Executive Summary

This document outlines the complete implementation plan for transforming the IELTS Practice app into a fully AI-powered dynamic test generation platform. The plan covers all four modules (Reading, Writing, Listening, Speaking) with detailed technical specifications, cost estimates, and phased rollout strategy.

---

## Table of Contents

1. [Current Status](#current-status)
2. [Architecture Overview](#architecture-overview)
3. [Module-by-Module Implementation](#module-by-module-implementation)
4. [Technical Requirements](#technical-requirements)
5. [Database Schema Updates](#database-schema-updates)
6. [API Integration Details](#api-integration-details)
7. [Cost Analysis](#cost-analysis)
8. [Implementation Phases](#implementation-phases)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Plan](#deployment-plan)
11. [Future Enhancements](#future-enhancements)

---

## Current Status

### ✅ Completed Components

1. **Writing Module** - ✅ COMPLETE
   - AI-powered Task 1 and Task 2 generation
   - OpenAI GPT-4o-mini integration
   - Chart type selection (6 types for Task 1)
   - Difficulty level selection (Band 5.5-8.0)
   - Custom topic support
   - Model answers with examiner feedback
   - Auto-save to practice history

2. **Practice History Dashboard** - ✅ COMPLETE
   - View all past attempts
   - Filter by module, sort, and search
   - Detailed view modal with full feedback
   - Delete functionality
   - Statistics dashboard
   - Mobile responsive

3. **Authentication & Database** - ✅ COMPLETE
   - Supabase Auth integration
   - User profiles
   - Practice history table with RLS
   - Secure data storage

### 🚧 To Be Implemented

1. **Reading Module** - 📊 PLANNED
   - AI-generated passages (700-800 words)
   - 13 questions per test (True/False/Not Given, Matching, Gap Fill)
   - Cambridge-standard topics and vocabulary
   - Auto-scoring system

2. **Listening Module** - 📊 PLANNED
   - AI-generated scripts (4 sections, 40 questions)
   - Text-to-Speech audio generation
   - Audio storage in Supabase
   - Real-time player integration
   - Auto-scoring system

3. **Speaking Module** - 📊 PLANNED
   - AI examiner simulation (3 parts)
   - Speech-to-Text user input
   - Adaptive follow-up questions
   - Real-time evaluation
   - Band score calculation

---

## Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Reading  │  │ Writing  │  │Listening │  │ Speaking │   │
│  │  Page    │  │  Page    │  │  Page    │  │  Page    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │           │
└───────┼─────────────┼─────────────┼─────────────┼───────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Routes (Next.js API)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Generate │  │ Generate │  │ Generate │  │ Generate │   │
│  │ Reading  │  │ Writing  │  │Listening │  │ Speaking │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │           │
└───────┼─────────────┼─────────────┼─────────────┼───────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ OpenAI/  │  │ElevenLabs│  │ Whisper  │  │ Supabase │   │
│  │  Gemini  │  │   TTS    │  │   STT    │  │ Storage  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Database                        │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐      │
│  │   profiles   │  │  practice_  │  │   audio_     │      │
│  │              │  │  history    │  │   files      │      │
│  └──────────────┘  └─────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**Test Generation Flow:**
```
User Request → Frontend → API Route → AI Service → Parse Response 
→ Save to DB (optional) → Return to Frontend → Display Test
```

**Audio Generation Flow (Listening):**
```
User Request → API → Generate Script (AI) → Convert to Audio (TTS) 
→ Upload to Supabase Storage → Save URL to DB → Return to Frontend 
→ Play Audio
```

**Speech Evaluation Flow (Speaking):**
```
User Speech → Record Audio → Send to API → Transcribe (STT) 
→ Evaluate (AI) → Calculate Band Score → Save to DB 
→ Return Feedback
```

---

## Module-by-Module Implementation

### 1. Reading Module 📖

#### Overview
Generate dynamic IELTS Academic Reading passages with 13 questions following Cambridge standards.

#### Features to Implement

**Test Generation:**
- ✅ 700-800 word academic passages
- ✅ 13 questions total (mix of types)
- ✅ Question types:
  - True/False/Not Given (4-5 questions)
  - Matching Headings (4-5 questions)
  - Gap Fill/Summary Completion (4 questions)
- ✅ Difficulty levels: Band 5.5 to 8.0
- ✅ Topic selection (Science, History, Environment, Technology, etc.)

**Scoring System:**
- ✅ Automatic answer checking
- ✅ Partial credit for gap fill answers
- ✅ Case-insensitive comparison
- ✅ Band score conversion table (13 questions → Band 5.5-8.0)

**User Interface:**
- ✅ Passage display with line numbers
- ✅ Question panel (scrollable)
- ✅ Answer input fields
- ✅ Submit button with confirmation
- ✅ Results modal with correct answers
- ✅ Time tracking (suggested: 20 minutes)

#### Technical Implementation

**API Endpoint:** `/api/generate-reading-test`

**Request Format:**
```typescript
{
  topic?: string;           // "Climate Change", "Ancient History", etc.
  difficulty: "5.5" | "6.0" | "6.5" | "7.0" | "7.5" | "8.0";
}
```

**Response Format:**
```typescript
{
  passage: {
    title: string;
    content: string;        // 700-800 words
    wordCount: number;
  };
  questions: [
    {
      type: "true-false-not-given" | "matching-headings" | "gap-fill";
      instructions: string;
      items: [
        {
          id: string;
          question: string;
          options?: string[];  // For matching headings
          answer: string;
        }
      ];
    }
  ];
  bandScore: string;
  examinerNotes: string;
}
```

**AI System Prompt:**
```
You are a certified IELTS examiner with 15 years of experience creating 
Cambridge-standard Academic Reading tests.

Topic: [user specified or choose academic topic]
Difficulty: Band [5.5-8.0]

Generate:
1. Academic passage (700-800 words) with:
   - Clear introduction and conclusion
   - Well-structured paragraphs (3-5)
   - Academic vocabulary appropriate to difficulty level
   - Complex sentence structures for higher bands
   - Factual, objective tone

2. 13 questions distributed as:
   - 4-5 True/False/Not Given questions
   - 4-5 Matching Headings questions (provide 8-10 heading options)
   - 4 Gap Fill/Summary Completion questions

3. Answer key with explanations
4. Band score criteria explanation

Return strict JSON format (no markdown).
```

**Scoring Logic:**
```typescript
const scoringTable = {
  13: 8.0, 12: 7.5, 11: 7.0, 10: 6.5,
  9: 6.5,  8: 6.0,  7: 6.0,  6: 5.5,
  5: 5.5,  4: 5.0,  3: 5.0,  2: 4.5,
  1: 4.5,  0: 4.0
};

function calculateBandScore(correctAnswers: number): number {
  return scoringTable[correctAnswers] || 4.0;
}
```

**Database Schema:**
```sql
-- Already exists in practice_history, no changes needed
-- Stores in test_data JSONB column
```

**Implementation Steps:**
1. Create `/api/generate-reading-test` endpoint
2. Implement AI prompt with proper JSON structure
3. Build frontend UI for passage and questions
4. Add answer input fields with proper types
5. Implement scoring logic
6. Add results modal with feedback
7. Integrate with practice history
8. Test with various topics and difficulty levels

**Estimated Time:** 16-20 hours
**Estimated Cost per Test:** $0.0015-0.002 (150-200 tokens input, 1500-2000 tokens output)

---

### 2. Listening Module 🎧

#### Overview
Generate IELTS Listening tests with 4 sections, convert to audio, and provide interactive player.

#### Features to Implement

**Test Generation:**
- ✅ 4 sections following Cambridge structure:
  - Section 1: Social conversation (Form completion, Multiple choice)
  - Section 2: Monologue (Matching, Plan/Map labeling)
  - Section 3: Academic discussion (Multiple choice, Matching)
  - Section 4: Academic lecture (Note completion, Summary)
- ✅ 40 questions total (10 per section)
- ✅ Natural dialogue and monologue scripts
- ✅ Difficulty levels: Band 5.5 to 8.0

**Audio Generation:**
- ✅ Text-to-Speech conversion via ElevenLabs API
- ✅ Multiple voices for different speakers
- ✅ Natural pacing and intonation
- ✅ Background sounds (optional)
- ✅ Upload to Supabase Storage

**Scoring System:**
- ✅ Automatic answer checking
- ✅ Case-insensitive, spelling-tolerant
- ✅ Band score conversion (40 questions → Band 5.5-8.0)

**User Interface:**
- ✅ Audio player with progress bar
- ✅ Play, pause, replay controls
- ✅ Volume control
- ✅ Question booklet view
- ✅ Answer input fields
- ✅ Timer (30 minutes total)
- ✅ Results modal with transcript and answers

#### Technical Implementation

**API Endpoint 1:** `/api/generate-listening-test`

**Request Format:**
```typescript
{
  difficulty: "5.5" | "6.0" | "6.5" | "7.0" | "7.5" | "8.0";
}
```

**Response Format:**
```typescript
{
  sections: [
    {
      sectionNumber: 1 | 2 | 3 | 4;
      type: "conversation" | "monologue" | "discussion" | "lecture";
      script: string;           // Full dialogue/monologue
      speakers: string[];       // ["Speaker 1", "Speaker 2"]
      questions: [
        {
          questionNumber: number;
          type: "form-completion" | "multiple-choice" | "matching" | "labeling";
          question: string;
          options?: string[];   // For multiple choice
          answer: string;
        }
      ];
    }
  ];
  audioUrl: string;              // Supabase Storage URL
  bandScore: string;
  examinerNotes: string;
}
```

**API Endpoint 2:** `/api/generate-listening-audio`

**Request Format:**
```typescript
{
  sections: [
    {
      script: string;
      speakers: string[];
    }
  ];
}
```

**Response Format:**
```typescript
{
  audioUrl: string;              // Supabase Storage URL
  duration: number;              // In seconds
}
```

**AI System Prompt:**
```
You are a certified IELTS examiner creating a Listening test.

Difficulty: Band [5.5-8.0]

Generate 4 sections:

Section 1 (Conversation - Social):
- 2 speakers discussing everyday situation
- Natural, informal language
- 10 questions (form completion, multiple choice)

Section 2 (Monologue - General):
- 1 speaker on general interest topic
- Clear, structured presentation
- 10 questions (matching, labeling)

Section 3 (Discussion - Academic):
- 2-3 speakers discussing academic topic
- More complex vocabulary
- 10 questions (multiple choice, matching)

Section 4 (Lecture - Academic):
- 1 speaker on academic subject
- Dense information, complex structures
- 10 questions (note completion, summary)

For each section:
- Write natural, realistic dialogue/monologue
- Include contextual clues for answers
- Provide clear answer key
- Match vocabulary to difficulty level

Return strict JSON format.
```

**ElevenLabs Integration:**
```typescript
import { ElevenLabsClient } from "elevenlabs";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

async function generateAudio(script: string, voiceId: string) {
  const audio = await elevenlabs.generate({
    voice: voiceId,
    text: script,
    model_id: "eleven_multilingual_v2"
  });
  
  return audio;  // Returns audio buffer
}
```

**Supabase Storage Upload:**
```typescript
async function uploadAudio(audioBuffer: Buffer, testId: string) {
  const fileName = `listening-tests/${testId}.mp3`;
  
  const { data, error } = await supabase.storage
    .from('audio-files')
    .upload(fileName, audioBuffer, {
      contentType: 'audio/mpeg',
      upsert: false
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('audio-files')
    .getPublicUrl(fileName);
  
  return publicUrl;
}
```

**Scoring Logic:**
```typescript
const listeningScoreTable = {
  40: 9.0, 39: 8.5, 38: 8.5, 37: 8.0, 36: 8.0,
  35: 7.5, 34: 7.5, 33: 7.0, 32: 7.0, 31: 6.5,
  30: 6.5, 29: 6.5, 28: 6.0, 27: 6.0, 26: 6.0,
  25: 5.5, 24: 5.5, 23: 5.5, 22: 5.5, 21: 5.0,
  20: 5.0, 19: 5.0, 18: 5.0, 17: 4.5, 16: 4.5,
  // ... continues
};
```

**Database Schema Updates:**
```sql
-- Create audio_files table to track generated audio
CREATE TABLE audio_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES practice_history(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  duration INTEGER,  -- In seconds
  file_size INTEGER, -- In bytes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own audio files
CREATE POLICY "Users can view own audio" ON audio_files
  FOR SELECT USING (
    test_id IN (SELECT id FROM practice_history WHERE user_id = auth.uid())
  );
```

**Implementation Steps:**
1. Set up Supabase Storage bucket for audio files
2. Create `/api/generate-listening-test` endpoint
3. Implement AI script generation
4. Integrate ElevenLabs API for TTS
5. Build audio upload to Supabase Storage
6. Create frontend player component
7. Build question booklet UI
8. Implement answer checking and scoring
9. Add results modal with transcript
10. Test audio quality and timing

**Estimated Time:** 24-32 hours
**Estimated Cost per Test:** 
- AI generation: $0.003-0.004
- TTS (ElevenLabs): $0.24-0.36 (30 minutes audio at standard pricing)
- Total: ~$0.25-0.37 per test

**Cost Optimization Options:**
- Use Google Cloud TTS (cheaper: ~$0.016 per test)
- Use browser-native Web Speech API (free but lower quality)
- Cache popular tests to avoid regeneration

---

### 3. Speaking Module 💬

#### Overview
Create interactive AI examiner for IELTS Speaking test with real-time voice interaction.

#### Features to Implement

**Test Structure:**
- ✅ Part 1: Introduction and interview (4-5 minutes)
  - Personal questions about familiar topics
  - 10-12 questions
- ✅ Part 2: Individual long turn (3-4 minutes)
  - Topic card with 1-minute preparation
  - 2-minute monologue
- ✅ Part 3: Two-way discussion (4-5 minutes)
  - Abstract questions related to Part 2 topic
  - 4-5 questions

**AI Examiner:**
- ✅ Natural conversational flow
- ✅ Adaptive follow-up questions
- ✅ Realistic examiner persona
- ✅ Proper timing and pacing

**Speech Recognition:**
- ✅ Real-time recording
- ✅ Whisper API transcription
- ✅ Pronunciation analysis
- ✅ Fluency detection

**Evaluation:**
- ✅ Fluency and Coherence
- ✅ Lexical Resource
- ✅ Grammatical Range and Accuracy
- ✅ Pronunciation
- ✅ Band score calculation (4 criteria average)

**User Interface:**
- ✅ Microphone permission request
- ✅ Recording indicator
- ✅ Real-time transcription display
- ✅ Timer for each part
- ✅ Preparation timer for Part 2
- ✅ AI examiner responses (text + optional TTS)
- ✅ Results modal with detailed feedback

#### Technical Implementation

**API Endpoint 1:** `/api/generate-speaking-test`

**Request Format:**
```typescript
{
  difficulty: "5.5" | "6.0" | "6.5" | "7.0" | "7.5" | "8.0";
}
```

**Response Format:**
```typescript
{
  part1: {
    questions: string[];      // 10-12 questions
  };
  part2: {
    topicCard: {
      topic: string;
      points: string[];       // 3-4 bullet points
    };
    followUpQuestions: string[];  // 1-2 questions
  };
  part3: {
    questions: string[];      // 4-5 abstract questions
  };
  examinerPersona: {
    name: string;
    greeting: string;
  };
}
```

**API Endpoint 2:** `/api/transcribe-speech`

**Request Format:**
```typescript
{
  audioData: string;         // Base64 encoded audio
  format: "webm" | "mp3";
}
```

**Response Format:**
```typescript
{
  transcript: string;
  confidence: number;        // 0-1
  duration: number;          // In seconds
}
```

**API Endpoint 3:** `/api/evaluate-speaking`

**Request Format:**
```typescript
{
  part1Responses: string[];
  part2Response: string;
  part3Responses: string[];
  difficulty: string;
}
```

**Response Format:**
```typescript
{
  scores: {
    fluencyCoherence: number;       // 5.5-9.0
    lexicalResource: number;        // 5.5-9.0
    grammaticalRange: number;       // 5.5-9.0
    pronunciation: number;          // 5.5-9.0
  };
  overallBandScore: number;         // Average of 4 scores
  feedback: {
    strengths: string[];
    improvements: string[];
    detailedComments: string;
  };
}
```

**AI System Prompts:**

**Question Generation:**
```
You are a certified IELTS examiner creating Speaking test questions.

Difficulty: Band [5.5-8.0]

Part 1 Questions (10-12):
- Familiar topics: Work/Study, Home, Family, Hobbies
- Simple, direct questions
- Personal and familiar
Example: "Do you work or study?", "What do you like about your hometown?"

Part 2 Topic Card:
- Clear topic with 3-4 bullet points
- 2-minute talk requirement
- Follow-up questions
Example:
  "Describe a place you like to visit
  You should say:
  - Where it is
  - When you go there
  - What you do there
  - And explain why you like this place"

Part 3 Questions (4-5):
- Abstract, analytical questions
- Related to Part 2 topic
- Require extended responses
Example: "How has tourism changed in your country?", 
         "What are the benefits and drawbacks of tourism?"

Return strict JSON format.
```

**Evaluation Prompt:**
```
You are a certified IELTS examiner evaluating a Speaking test.

Candidate responses:
Part 1: [responses]
Part 2: [response]
Part 3: [responses]

Target difficulty: Band [5.5-8.0]

Evaluate using IELTS criteria:

1. Fluency and Coherence (5.5-9.0):
   - Speech rate and pauses
   - Logical sequencing
   - Coherence and cohesion
   - Use of discourse markers

2. Lexical Resource (5.5-9.0):
   - Vocabulary range
   - Appropriate word choice
   - Collocation and idioms
   - Paraphrasing ability

3. Grammatical Range and Accuracy (5.5-9.0):
   - Sentence complexity
   - Tense usage
   - Error frequency and severity
   - Flexibility in structures

4. Pronunciation (5.5-9.0):
   - Individual sounds
   - Word stress
   - Sentence stress and intonation
   - Clarity and intelligibility

Provide:
- Band score for each criterion (must be 0.5 increments: 5.5, 6.0, 6.5, etc.)
- Overall band (average of 4 criteria, rounded to nearest 0.5)
- Detailed feedback with specific examples
- 3-4 strengths
- 3-4 areas for improvement

Return strict JSON format.
```

**Whisper API Integration:**
```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function transcribeAudio(audioBuffer: Buffer) {
  const transcription = await openai.audio.transcriptions.create({
    file: audioBuffer,
    model: "whisper-1",
    language: "en",
    response_format: "verbose_json"  // Includes confidence, timestamps
  });
  
  return {
    transcript: transcription.text,
    confidence: transcription.confidence || 0,
    duration: transcription.duration || 0
  };
}
```

**Frontend Audio Recording:**
```typescript
import { useCallback, useRef, useState } from "react";

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) return;

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        resolve(blob);
      };

      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    });
  }, []);

  return { isRecording, startRecording, stopRecording };
}
```

**Implementation Steps:**
1. Create question generation API endpoint
2. Build AI examiner conversation flow
3. Implement audio recording frontend
4. Integrate Whisper API for transcription
5. Create evaluation AI endpoint
6. Build speaking test UI with 3 parts
7. Add timer and preparation controls
8. Implement real-time transcription display
9. Create results modal with 4-criteria feedback
10. Integrate with practice history
11. Test with various accents and speech patterns

**Estimated Time:** 32-40 hours (most complex module)
**Estimated Cost per Test:**
- Question generation: $0.001-0.002
- Transcription (Whisper): $0.006 per minute × 12 minutes = $0.072
- Evaluation: $0.003-0.004
- Total: ~$0.08-0.09 per test

**Cost Optimization:**
- Use browser-native Web Speech API for transcription (free, less accurate)
- Batch transcription requests
- Cache common question sets

---

## Technical Requirements

### Environment Variables

**Required API Keys:**
```bash
# AI Generation
OPENAI_API_KEY=sk-...                    # For all AI generation
# OR
GEMINI_API_KEY=...                       # Alternative to OpenAI

# Text-to-Speech (Listening Module)
ELEVENLABS_API_KEY=...                   # Premium TTS
# OR
GOOGLE_CLOUD_TTS_KEY=...                 # Budget option

# Database & Storage
NEXT_PUBLIC_SUPABASE_URL=https://...     # Already configured
NEXT_PUBLIC_SUPABASE_ANON_KEY=...        # Already configured
SUPABASE_SERVICE_ROLE_KEY=...            # For server-side operations

# Optional
SENTRY_DSN=...                           # Error tracking
ANALYTICS_ID=...                         # Usage analytics
```

### Package Dependencies

**New Dependencies to Install:**
```json
{
  "dependencies": {
    "openai": "^4.0.0",              // OpenAI SDK
    "elevenlabs": "^0.5.0",          // ElevenLabs SDK (optional)
    "@google-cloud/text-to-speech": "^5.0.0",  // Google TTS (optional)
    "react-audio-player": "^0.17.0", // Audio player component
    "wavesurfer.js": "^7.0.0",       // Audio waveform visualization
    "recordrtc": "^5.6.2"            // Audio recording
  },
  "devDependencies": {
    "@types/recordrtc": "^5.6.0"
  }
}
```

### Browser Requirements

**Minimum Browser Versions:**
- Chrome 87+ (for WebRTC and MediaRecorder)
- Firefox 88+
- Safari 14.1+
- Edge 87+

**Required Browser APIs:**
- MediaRecorder API (audio recording)
- Web Audio API (audio processing)
- MediaDevices.getUserMedia (microphone access)
- Fetch API (file uploads)

---

## Database Schema Updates

### New Tables

**1. Audio Files Table** (Already included in Listening section)
```sql
CREATE TABLE audio_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES practice_history(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  duration INTEGER,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**2. Speaking Evaluations Table** (Detailed scoring)
```sql
CREATE TABLE speaking_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES practice_history(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fluency_coherence NUMERIC(2,1),
  lexical_resource NUMERIC(2,1),
  grammatical_range NUMERIC(2,1),
  pronunciation NUMERIC(2,1),
  overall_band NUMERIC(2,1),
  strengths TEXT[],
  improvements TEXT[],
  detailed_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE speaking_evaluations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own evaluations
CREATE POLICY "Users can view own evaluations" ON speaking_evaluations
  FOR SELECT USING (user_id = auth.uid());

-- Policy: Users can insert their own evaluations
CREATE POLICY "Users can insert own evaluations" ON speaking_evaluations
  FOR INSERT WITH CHECK (user_id = auth.uid());
```

**3. Test Cache Table** (Optional - for frequently used tests)
```sql
CREATE TABLE test_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_type TEXT NOT NULL,
  test_type TEXT,
  difficulty TEXT,
  topic TEXT,
  test_data JSONB NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_test_cache_lookup 
  ON test_cache(module_type, test_type, difficulty, topic);

-- No RLS needed - cache is shared across users
```

### Storage Buckets

**Create Storage Buckets in Supabase:**
```sql
-- Audio files bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-files', 'audio-files', true);

-- User recordings bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-recordings', 'user-recordings', false);

-- Policy: Anyone can read audio-files
CREATE POLICY "Public audio files" ON storage.objects
  FOR SELECT USING (bucket_id = 'audio-files');

-- Policy: Authenticated users can upload audio
CREATE POLICY "Authenticated upload audio" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'audio-files' AND 
    auth.role() = 'authenticated'
  );

-- Policy: Users can read their own recordings
CREATE POLICY "Users read own recordings" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-recordings' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can upload their own recordings
CREATE POLICY "Users upload own recordings" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-recordings' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## API Integration Details

### OpenAI Configuration

**Model Selection Guidelines:**

| Use Case | Recommended Model | Cost | Speed | Quality |
|----------|------------------|------|-------|---------|
| Reading Generation | GPT-4o-mini | $ | Fast | High |
| Writing Generation | GPT-4o-mini | $ | Fast | High |
| Listening Scripts | GPT-4o-mini | $ | Fast | High |
| Speaking Questions | GPT-4o-mini | $ | Fast | High |
| Speaking Evaluation | GPT-4o | $$$ | Medium | Highest |
| Transcription | Whisper-1 | $ | Fast | High |

**Token Budgets:**
```typescript
const TOKEN_LIMITS = {
  reading: { input: 1000, output: 2500 },
  writing_task1: { input: 800, output: 1500 },
  writing_task2: { input: 800, output: 2000 },
  listening: { input: 1000, output: 4000 },
  speaking_questions: { input: 500, output: 1500 },
  speaking_evaluation: { input: 3000, output: 1500 },
};
```

**Rate Limiting:**
```typescript
// Implement rate limiting to avoid API throttling
import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  maxConcurrent: 5,     // 5 concurrent requests
  minTime: 200          // 200ms between requests
});

export const rateLimitedOpenAI = {
  chat: limiter.wrap(openai.chat.completions.create),
  transcribe: limiter.wrap(openai.audio.transcriptions.create)
};
```

### ElevenLabs Configuration

**Voice Selection:**
```typescript
const VOICE_PROFILES = {
  examiner: "21m00Tcm4TlvDq8ikWAM",      // Rachel (professional)
  speaker1: "EXAVITQu4vr4xnSDxMaL",      // Bella (friendly)
  speaker2: "ErXwobaYiN019PkySvjV",      // Antoni (casual)
  narrator: "MF3mGyEYCl7XYWbV9V6O",      // Elli (clear)
};

const VOICE_SETTINGS = {
  stability: 0.5,        // 0-1 (lower = more expressive)
  similarity_boost: 0.75, // 0-1 (higher = more similar to training)
  style: 0,              // 0-1 (higher = more exaggerated)
  use_speaker_boost: true
};
```

**Audio Quality Settings:**
```typescript
const AUDIO_CONFIG = {
  output_format: "mp3_44100_128",  // Good quality, reasonable size
  optimize_streaming_latency: 0,   // 0-4 (0 = best quality)
  model_id: "eleven_multilingual_v2"
};
```

---

## Cost Analysis

### Per-Test Cost Breakdown

| Module | AI Generation | TTS/STT | Storage | Total per Test |
|--------|--------------|---------|---------|----------------|
| Reading | $0.0015 | - | - | **$0.0015** |
| Writing Task 1 | $0.0010 | - | - | **$0.0010** |
| Writing Task 2 | $0.0010 | - | - | **$0.0010** |
| Listening | $0.0035 | $0.24-0.36 | $0.001 | **$0.25-0.37** |
| Speaking | $0.0020 | $0.072 | $0.002 | **$0.08** |

**Total Cost per Complete IELTS Test Set:** ~$0.33-0.45

### Monthly Cost Estimates

**Scenario 1: Small MVP (100 active users)**
- 50 tests/day × 30 days = 1,500 tests/month
- Average cost per test: $0.10 (mix of modules)
- **Total: $150/month**

**Scenario 2: Growing Platform (1,000 active users)**
- 500 tests/day × 30 days = 15,000 tests/month
- Average cost per test: $0.10
- **Total: $1,500/month**

**Scenario 3: Scale (10,000 active users)**
- 5,000 tests/day × 30 days = 150,000 tests/month
- Average cost per test: $0.08 (bulk discounts)
- **Total: $12,000/month**

### Cost Optimization Strategies

**1. Caching Popular Tests**
```typescript
// Cache frequently requested test configurations
const cacheKey = `${module}-${difficulty}-${topic}`;
const cached = await getCachedTest(cacheKey);
if (cached && cached.usageCount > 10) {
  return cached.testData;
}
```

**2. Tiered Pricing Model**
- Free tier: 5 tests/month (pre-generated)
- Basic: $9.99/month (50 tests)
- Pro: $24.99/month (unlimited tests)

**3. Alternative APIs**
- Google Cloud TTS: ~$0.016 per test (vs ElevenLabs $0.24)
- Gemini Flash: Similar quality to GPT-4o-mini, lower cost
- Browser Web Speech API: Free but lower quality

**4. Smart Test Reuse**
```typescript
// Reuse test structures, only regenerate content
const template = await getTestTemplate(difficulty);
const newTest = await customizeTemplate(template, topic);
```

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2) ✅ COMPLETE

**Deliverables:**
- ✅ Writing Task 1 & 2 generation
- ✅ Practice History dashboard
- ✅ Basic authentication
- ✅ Database schema

**Status:** 100% Complete

---

### Phase 2: Reading Module (Weeks 3-4)

**Week 3: Core Implementation**
- Day 1-2: Create API endpoint for reading generation
- Day 3-4: Implement AI prompt and response parsing
- Day 5: Build passage display UI
- Day 6-7: Create question input interface

**Week 4: Scoring & Polish**
- Day 8-9: Implement auto-scoring logic
- Day 10-11: Build results modal with feedback
- Day 12: Integrate with practice history
- Day 13-14: Testing and bug fixes

**Key Metrics:**
- Test generation success rate: >95%
- Average generation time: <5 seconds
- Scoring accuracy: >98%

---

### Phase 3: Listening Module (Weeks 5-7)

**Week 5: Audio Infrastructure**
- Day 1-2: Set up Supabase Storage buckets
- Day 3-4: Integrate ElevenLabs API
- Day 5: Test audio upload/download
- Day 6-7: Build audio player component

**Week 6: Test Generation**
- Day 8-9: Create listening script generation API
- Day 10-11: Implement audio conversion pipeline
- Day 12-13: Build question booklet UI
- Day 14: Test audio quality

**Week 7: Scoring & Integration**
- Day 15-16: Implement auto-scoring
- Day 17-18: Build results with transcript
- Day 19-20: Integrate with practice history
- Day 21: Testing and optimization

**Key Metrics:**
- Audio generation time: <60 seconds
- Audio quality: >4.0/5.0 user rating
- Storage cost per test: <$0.01
- Playback success rate: >99%

---

### Phase 4: Speaking Module (Weeks 8-11)

**Week 8: Recording Infrastructure**
- Day 1-2: Implement browser audio recording
- Day 3-4: Test microphone permissions flow
- Day 5-6: Build recording UI components
- Day 7: Test audio quality across browsers

**Week 9: Transcription & AI Flow**
- Day 8-9: Integrate Whisper API
- Day 10-11: Create speaking test structure
- Day 12-13: Implement AI examiner conversation
- Day 14: Test transcription accuracy

**Week 10: Evaluation System**
- Day 15-16: Build evaluation AI prompt
- Day 17-18: Implement 4-criteria scoring
- Day 19-20: Create detailed feedback system
- Day 21: Test evaluation consistency

**Week 11: UI & Polish**
- Day 22-23: Build 3-part test interface
- Day 24-25: Add timers and preparation tools
- Day 26-27: Create results modal
- Day 28: Integration and testing

**Key Metrics:**
- Recording success rate: >95%
- Transcription accuracy: >90%
- Evaluation consistency: ±0.5 band score
- User experience score: >4.0/5.0

---

### Phase 5: Optimization & Scale (Weeks 12-13)

**Performance Optimization:**
- Implement test caching system
- Optimize API response times
- Reduce bundle size
- Improve loading states

**Cost Optimization:**
- Implement smart test reuse
- Add usage analytics
- Optimize AI token usage
- Implement rate limiting

**Quality Assurance:**
- Cross-browser testing
- Mobile responsiveness
- Accessibility audit
- Security review

**Documentation:**
- API documentation
- User guides
- Admin dashboard docs
- Troubleshooting guides

---

## Testing Strategy

### Unit Tests

**API Endpoints:**
```typescript
describe("Generate Reading Test API", () => {
  it("should generate a valid reading test", async () => {
    const response = await fetch("/api/generate-reading-test", {
      method: "POST",
      body: JSON.stringify({ difficulty: "6.5" })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.passage.wordCount).toBeGreaterThan(700);
    expect(data.questions).toHaveLength(13);
  });

  it("should handle invalid difficulty levels", async () => {
    const response = await fetch("/api/generate-reading-test", {
      method: "POST",
      body: JSON.stringify({ difficulty: "10.0" })
    });
    
    expect(response.status).toBe(400);
  });
});
```

**Scoring Logic:**
```typescript
describe("Reading Score Calculator", () => {
  it("should correctly map scores to band levels", () => {
    expect(calculateBandScore(13)).toBe(8.0);
    expect(calculateBandScore(10)).toBe(6.5);
    expect(calculateBandScore(7)).toBe(6.0);
  });

  it("should handle edge cases", () => {
    expect(calculateBandScore(0)).toBe(4.0);
    expect(calculateBandScore(-1)).toBe(4.0);
  });
});
```

### Integration Tests

**End-to-End Test Generation:**
```typescript
describe("Complete Test Generation Flow", () => {
  it("should generate and save a reading test", async () => {
    // 1. Generate test
    const test = await generateReadingTest({ difficulty: "6.5" });
    
    // 2. User completes test
    const userAnswers = mockUserAnswers();
    
    // 3. Score test
    const score = calculateScore(test.questions, userAnswers);
    
    // 4. Save to database
    const saved = await savePracticeAttempt({
      module_type: "reading",
      test_data: test,
      score: score
    });
    
    expect(saved.id).toBeDefined();
  });
});
```

### User Acceptance Testing

**Test Scenarios:**

1. **Reading Module:**
   - User generates test with custom topic
   - User answers all questions
   - User submits and sees results
   - User views in practice history

2. **Listening Module:**
   - User generates test
   - Audio loads and plays smoothly
   - User answers while listening
   - User can replay sections
   - User submits and sees transcript

3. **Speaking Module:**
   - User grants microphone permission
   - User records Part 1 responses
   - User sees real-time transcription
   - User completes all 3 parts
   - User receives detailed evaluation

4. **Cross-Module:**
   - User switches between modules
   - History shows all attempts
   - Filters work correctly
   - Mobile experience is smooth

---

## Deployment Plan

### Pre-Deployment Checklist

**Environment Setup:**
- ✅ All API keys configured in Vercel
- ✅ Supabase Storage buckets created
- ✅ Database migrations applied
- ✅ RLS policies enabled
- ✅ Environment variables documented

**Code Quality:**
- ✅ All TypeScript errors resolved
- ✅ ESLint warnings addressed
- ✅ Unit tests passing
- ✅ Integration tests passing
- ✅ Build succeeds locally

**Performance:**
- ✅ Bundle size optimized
- ✅ Images compressed
- ✅ Lazy loading implemented
- ✅ API response times <2s

**Security:**
- ✅ API keys not exposed in frontend
- ✅ RLS policies tested
- ✅ Input validation on all endpoints
- ✅ Rate limiting configured

### Deployment Stages

**Stage 1: Beta (Internal Testing)**
- Deploy to staging environment
- Invite 10-20 beta testers
- Monitor error logs and usage
- Gather feedback
- Fix critical bugs

**Stage 2: Soft Launch (Limited Users)**
- Deploy to production
- Enable for 100-500 users
- Monitor costs and performance
- A/B test UI variations
- Optimize based on usage patterns

**Stage 3: Public Launch**
- Remove user limits
- Enable all features
- Launch marketing campaign
- Monitor scale and costs
- Provide customer support

**Stage 4: Continuous Improvement**
- Weekly bug fix releases
- Monthly feature updates
- Quarterly major improvements
- Ongoing cost optimization

---

## Future Enhancements

### Short-term (3-6 months)

**1. Advanced Features:**
- PDF export of practice history
- Study plans and recommendations
- Progress tracking graphs
- Achievement badges and streaks
- Social sharing of band scores

**2. Content Expansion:**
- General Training test types
- UKVI IELTS variants
- Practice materials library
- Video tutorials
- Study tips and strategies

**3. Performance Improvements:**
- Server-side rendering for SEO
- Progressive Web App (PWA)
- Offline mode for certain features
- Faster test generation (caching)

### Medium-term (6-12 months)

**1. Mobile Apps:**
- Native iOS app (React Native)
- Native Android app (React Native)
- Push notifications
- Offline practice tests

**2. Collaboration Features:**
- Study groups
- Peer review of writing
- Live speaking practice with others
- Teacher dashboard

**3. AI Enhancements:**
- Personalized difficulty adjustment
- Adaptive learning paths
- Custom vocabulary building
- Pronunciation coaching

### Long-term (12+ months)

**1. Marketplace:**
- Premium test packs
- Expert teacher feedback
- 1-on-1 tutoring booking
- Certified practice tests

**2. Analytics Platform:**
- Detailed performance analytics
- Weakness identification
- Competitor comparison
- Predicted band scores

**3. Internationalization:**
- Multi-language support
- Localized content
- Regional exam differences
- Currency support

---

## Risk Mitigation

### Technical Risks

**Risk 1: API Costs Exceed Budget**
- **Mitigation:** Implement strict rate limiting, caching, tiered pricing
- **Contingency:** Switch to cheaper alternatives (Gemini, Google TTS)

**Risk 2: Audio Generation Takes Too Long**
- **Mitigation:** Pre-generate popular tests, use faster TTS
- **Contingency:** Queue system for audio generation

**Risk 3: Speech Recognition Inaccuracy**
- **Mitigation:** Use highest quality Whisper model, allow manual correction
- **Contingency:** Provide transcript editing before submission

**Risk 4: AI-Generated Content Quality Issues**
- **Mitigation:** Extensive prompt engineering, human review of samples
- **Contingency:** Manual content creation for critical tests

### Business Risks

**Risk 1: Low User Adoption**
- **Mitigation:** Free tier, referral program, content marketing
- **Contingency:** Pivot to B2B (schools, institutes)

**Risk 2: Competitor Copies Features**
- **Mitigation:** Fast iteration, unique features, community building
- **Contingency:** Focus on superior UX and customer support

**Risk 3: Regulatory Changes**
- **Mitigation:** Monitor IELTS guidelines, maintain authenticity
- **Contingency:** Rebrand as "IELTS-style practice" if needed

---

## Success Metrics

### Technical KPIs

- **Uptime:** >99.5%
- **API Response Time:** <2s average
- **Test Generation Success Rate:** >95%
- **Audio Playback Success Rate:** >99%
- **Transcription Accuracy:** >90%

### Business KPIs

- **Monthly Active Users (MAU):** Target 1,000 in 3 months
- **Conversion Rate (Free to Paid):** Target 10%
- **Average Tests per User:** Target 15/month
- **User Retention (30-day):** Target 40%
- **Customer Satisfaction (NPS):** Target >50

### Quality KPIs

- **Test Quality Rating:** Target >4.0/5.0
- **Bug Report Rate:** <1% of sessions
- **Support Ticket Resolution:** <24 hours
- **Cambridge Standard Compliance:** >95% accuracy

---

## Conclusion

This implementation plan provides a comprehensive roadmap for building a complete AI-powered IELTS practice platform. The phased approach allows for incremental delivery, continuous feedback, and cost management.

**Key Success Factors:**
1. Start with Writing (already complete) ✅
2. Add Reading next (simplest remaining module)
3. Implement Listening (moderate complexity)
4. Finally add Speaking (most complex)
5. Optimize and scale throughout

**Timeline Summary:**
- Phase 1 (Writing): ✅ Complete
- Phase 2 (Reading): 2 weeks
- Phase 3 (Listening): 3 weeks
- Phase 4 (Speaking): 4 weeks
- Phase 5 (Optimization): 2 weeks
- **Total: 11 weeks from now** (Writing already done)

**Budget Summary:**
- Development time: ~400 hours
- API costs: $150-1,500/month (depending on scale)
- Infrastructure: $50-200/month (Vercel, Supabase)
- **Total monthly operational cost: $200-1,700**

The platform is designed to be cost-effective, scalable, and maintainable while providing exceptional value to IELTS candidates worldwide.

---

*Last Updated: February 13, 2026*
*Version: 1.0*
*Author: Softgen AI Assistant*