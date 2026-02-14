-- Add test_title column to ielts_papers table for easier querying
ALTER TABLE ielts_papers 
ADD COLUMN IF NOT EXISTS test_title TEXT;

-- Create index on test_title for better query performance
CREATE INDEX IF NOT EXISTS idx_ielts_papers_test_title ON ielts_papers(test_title);