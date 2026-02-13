-- Add user_id column to practice_history table if it doesn't exist
ALTER TABLE practice_history 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_practice_history_user_id ON practice_history(user_id);

-- Update RLS policies to use user_id
DROP POLICY IF EXISTS "Users can view their own practice history" ON practice_history;
DROP POLICY IF EXISTS "Users can insert their own practice history" ON practice_history;
DROP POLICY IF EXISTS "Users can update their own practice history" ON practice_history;
DROP POLICY IF EXISTS "Users can delete their own practice history" ON practice_history;

-- Create new policies with user_id
CREATE POLICY "Users can view their own practice history"
  ON practice_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own practice history"
  ON practice_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own practice history"
  ON practice_history
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own practice history"
  ON practice_history
  FOR DELETE
  USING (auth.uid() = user_id);