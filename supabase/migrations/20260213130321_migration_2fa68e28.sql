-- Create listening_tests table
CREATE TABLE IF NOT EXISTS listening_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  transcript_text TEXT NOT NULL,
  questions_json JSONB NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5')),
  test_type TEXT NOT NULL DEFAULT 'Academic',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE listening_tests ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view tests)
CREATE POLICY "Anyone can view listening tests"
  ON listening_tests
  FOR SELECT
  USING (true);

-- Create policy for authenticated users to insert tests (admin functionality)
CREATE POLICY "Authenticated users can insert listening tests"
  ON listening_tests
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_listening_tests_difficulty ON listening_tests(difficulty);
CREATE INDEX IF NOT EXISTS idx_listening_tests_created_at ON listening_tests(created_at DESC);

-- Insert sample listening test
INSERT INTO listening_tests (
  test_title,
  audio_url,
  transcript_text,
  questions_json,
  difficulty,
  test_type
) VALUES (
  'Urban Development and City Planning',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'Narrator: You will hear a lecture about urban development and city planning. First, you have some time to look at questions 1 to 5.

Professor Mitchell: Good morning, everyone. Today''s lecture focuses on the fascinating evolution of urban development and how city planning has transformed over the centuries. Let''s begin by examining the ancient cities of Mesopotamia, which date back to approximately 3500 BCE. These early urban centers were remarkably sophisticated for their time, featuring organized street layouts and designated areas for commerce and residential purposes.

Moving forward to the Roman Empire, we see significant advancements in urban planning. The Romans introduced the grid system, which is still used in many modern cities today. They also pioneered infrastructure development, including aqueducts for water supply, sewage systems, and paved roads. The city of Pompeii, preserved by volcanic ash, provides us with invaluable insights into Roman urban life and planning principles.

Now, let''s fast forward to the Industrial Revolution in the 18th and 19th centuries. This period brought about dramatic changes in urban landscapes. Cities grew rapidly as people migrated from rural areas seeking employment in factories. However, this rapid urbanization led to numerous challenges, including overcrowding, poor sanitation, and pollution. These problems eventually led to the emergence of modern urban planning as a distinct profession.

In the 20th century, several influential urban planning movements emerged. The Garden City movement, pioneered by Ebenezer Howard in 1898, proposed creating self-contained communities surrounded by greenbelts. This concept aimed to combine the benefits of both urban and rural living. Another significant development was Le Corbusier''s Radiant City concept, which emphasized high-rise buildings and efficient transportation systems.

Today, sustainable urban development has become the primary focus of city planners worldwide. This approach considers environmental impact, social equity, and economic viability. Key principles include mixed-use development, public transportation infrastructure, green spaces, and energy-efficient buildings. Cities like Copenhagen, Singapore, and Vancouver are leading examples of successful sustainable urban planning.

The challenges facing modern cities are numerous and complex. Climate change requires cities to implement adaptive strategies such as flood management systems and urban heat island mitigation. Population growth demands efficient land use and affordable housing solutions. Additionally, the COVID-19 pandemic has highlighted the need for flexible urban spaces that can accommodate changing social needs.

Looking ahead, smart city technology promises to revolutionize urban planning. Internet of Things sensors can monitor traffic patterns, energy consumption, and air quality in real-time, enabling data-driven decision-making. Autonomous vehicles may reshape transportation infrastructure, potentially reducing the need for parking spaces and allowing for more pedestrian-friendly designs.

However, it''s crucial to remember that successful urban planning must prioritize human needs above technological innovation. Cities should be designed to foster community interaction, cultural expression, and equal access to opportunities for all residents, regardless of their socioeconomic background.

Narrator: That is the end of Section 1. Now turn to Section 2.',
  '{
    "sections": [
      {
        "section_number": 1,
        "title": "Urban Development Lecture",
        "instructions": "Questions 1-5: Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
        "questions": [
          {
            "question_number": 1,
            "question_text": "Ancient Mesopotamian cities date back to approximately _______.",
            "question_type": "gap_fill",
            "correct_answer": "3500 BCE",
            "points": 1
          },
          {
            "question_number": 2,
            "question_text": "Romans introduced the _______ system for city layouts.",
            "question_type": "gap_fill",
            "correct_answer": "grid",
            "points": 1
          },
          {
            "question_number": 3,
            "question_text": "The city of _______ provides insights into Roman urban planning.",
            "question_type": "gap_fill",
            "correct_answer": "Pompeii",
            "points": 1
          },
          {
            "question_number": 4,
            "question_text": "The Garden City movement was pioneered by Ebenezer Howard in _______.",
            "question_type": "gap_fill",
            "correct_answer": "1898",
            "points": 1
          },
          {
            "question_number": 5,
            "question_text": "Modern sustainable cities focus on environmental impact, social equity, and _______ viability.",
            "question_type": "gap_fill",
            "correct_answer": "economic",
            "points": 1
          }
        ]
      },
      {
        "section_number": 2,
        "title": "Multiple Choice Questions",
        "instructions": "Questions 6-10: Choose the correct letter, A, B, C, or D.",
        "questions": [
          {
            "question_number": 6,
            "question_text": "What was a major challenge during the Industrial Revolution urbanization?",
            "question_type": "multiple_choice",
            "options": [
              "Lack of employment opportunities",
              "Poor sanitation and overcrowding",
              "Insufficient transportation",
              "Limited housing construction"
            ],
            "correct_answer": "B",
            "points": 1
          },
          {
            "question_number": 7,
            "question_text": "Which of the following is NOT mentioned as a principle of sustainable urban development?",
            "question_type": "multiple_choice",
            "options": [
              "Mixed-use development",
              "Public transportation infrastructure",
              "Private vehicle promotion",
              "Green spaces"
            ],
            "correct_answer": "C",
            "points": 1
          },
          {
            "question_number": 8,
            "question_text": "According to the lecture, what do smart city technologies enable?",
            "question_type": "multiple_choice",
            "options": [
              "Increased population density",
              "Data-driven decision-making",
              "Reduced construction costs",
              "Faster building permits"
            ],
            "correct_answer": "B",
            "points": 1
          },
          {
            "question_number": 9,
            "question_text": "Which cities are mentioned as examples of successful sustainable urban planning?",
            "question_type": "multiple_choice",
            "options": [
              "London, Paris, and Tokyo",
              "New York, Los Angeles, and Chicago",
              "Copenhagen, Singapore, and Vancouver",
              "Berlin, Amsterdam, and Stockholm"
            ],
            "correct_answer": "C",
            "points": 1
          },
          {
            "question_number": 10,
            "question_text": "What does the lecturer emphasize should be prioritized in urban planning?",
            "question_type": "multiple_choice",
            "options": [
              "Technological innovation",
              "Economic growth",
              "Human needs",
              "Environmental protection"
            ],
            "correct_answer": "C",
            "points": 1
          }
        ]
      }
    ]
  }',
  '6.5',
  'Academic'
);