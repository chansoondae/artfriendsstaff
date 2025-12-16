-- Add comments table for opinions
-- Run this in Supabase SQL Editor to add comments feature

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opinion_id UUID REFERENCES opinions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  nickname TEXT NOT NULL,
  temp_user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_comments_opinion_id ON comments(opinion_id);
CREATE INDEX idx_comments_created_at ON comments(created_at ASC);

-- Enable Row Level Security (RLS)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments table
CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert comments"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Optional: Enable Realtime for comments table
-- You'll need to enable Realtime in your Supabase dashboard for this to work
