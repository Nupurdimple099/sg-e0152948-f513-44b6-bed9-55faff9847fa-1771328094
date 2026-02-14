-- Add image_url and prompt_text columns to ielts_papers table
ALTER TABLE ielts_papers
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS prompt_text TEXT;

-- Add comments for documentation
COMMENT ON COLUMN ielts_papers.image_url IS 'URL to chart/graph image for Academic Writing Task 1';
COMMENT ON COLUMN ielts_papers.prompt_text IS 'Letter prompt text for General Writing Task 1';