-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create opinions table
CREATE TABLE opinions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  nickname TEXT NOT NULL,
  temp_user_id TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opinion_id UUID REFERENCES opinions(id) ON DELETE CASCADE,
  temp_user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(opinion_id, temp_user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_opinions_created_at ON opinions(created_at DESC);
CREATE INDEX idx_opinions_likes ON opinions(likes DESC);
CREATE INDEX idx_likes_opinion_id ON likes(opinion_id);

-- Create function to increment likes
CREATE OR REPLACE FUNCTION increment_likes(opinion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE opinions
  SET likes = likes + 1
  WHERE id = opinion_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement likes
CREATE OR REPLACE FUNCTION decrement_likes(opinion_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE opinions
  SET likes = GREATEST(likes - 1, 0)
  WHERE id = opinion_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE opinions ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies for opinions table
CREATE POLICY "Anyone can read opinions"
  ON opinions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert opinions"
  ON opinions FOR INSERT
  WITH CHECK (true);

-- Create policies for likes table
CREATE POLICY "Anyone can read likes"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert likes"
  ON likes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete their own likes"
  ON likes FOR DELETE
  USING (true);

-- Enable Realtime for opinions table (optional)
-- This allows real-time updates when new opinions are added
-- You'll need to enable Realtime in your Supabase dashboard for this to work
