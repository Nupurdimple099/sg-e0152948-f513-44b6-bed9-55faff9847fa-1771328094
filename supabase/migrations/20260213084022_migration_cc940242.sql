-- Create practice_history table
CREATE TABLE IF NOT EXISTS practice_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_type TEXT NOT NULL CHECK (module_type IN ('reading', 'writing', 'listening', 'speaking')),
  test_type TEXT,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration TEXT,
  word_count INTEGER,
  band_score NUMERIC(3,1),
  is_evaluated BOOLEAN DEFAULT false,
  user_answer TEXT,
  evaluation_data JSONB,
  test_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_practice_history_user_id ON practice_history(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_history_module_type ON practice_history(module_type);
CREATE INDEX IF NOT EXISTS idx_practice_history_completed_at ON practice_history(completed_at DESC);

-- Enable RLS
ALTER TABLE practice_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own practice history"
  ON practice_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own practice history"
  ON practice_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own practice history"
  ON practice_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own practice history"
  ON practice_history FOR DELETE
  USING (auth.uid() = user_id);