-- Create ielts_papers table
CREATE TABLE IF NOT EXISTS ielts_papers (
  test_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('listening', 'reading', 'writing', 'speaking')),
  exam_type TEXT NOT NULL CHECK (exam_type IN ('academic', 'general')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  content_json JSONB NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ielts_papers_category ON ielts_papers(category);
CREATE INDEX IF NOT EXISTS idx_ielts_papers_exam_type ON ielts_papers(exam_type);
CREATE INDEX IF NOT EXISTS idx_ielts_papers_difficulty ON ielts_papers(difficulty);
CREATE INDEX IF NOT EXISTS idx_ielts_papers_created_at ON ielts_papers(created_at DESC);

-- Enable RLS
ALTER TABLE ielts_papers ENABLE ROW LEVEL SECURITY;

-- Create policies - all users can view papers, authenticated users can insert
CREATE POLICY "Anyone can view IELTS papers" ON ielts_papers
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert IELTS papers" ON ielts_papers
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Add comment to table
COMMENT ON TABLE ielts_papers IS 'Stores IELTS practice test papers with questions, answers, and audio';
COMMENT ON COLUMN ielts_papers.content_json IS 'Contains test text, questions, correct answers, and metadata';
COMMENT ON COLUMN ielts_papers.audio_url IS 'URL to audio file for listening tests only';