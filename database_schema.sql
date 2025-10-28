-- Block Blast High Scores Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create the high_scores table
CREATE TABLE IF NOT EXISTS high_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL DEFAULT 'Anonymous',
  score integer NOT NULL DEFAULT 0,
  blocks_placed integer NOT NULL DEFAULT 0,
  lines_cleared integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE high_scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view high scores (public leaderboard)
CREATE POLICY "Anyone can view high scores"
  ON high_scores
  FOR SELECT
  USING (true);

-- Allow anyone to insert their own scores
CREATE POLICY "Anyone can insert high scores"
  ON high_scores
  FOR INSERT
  WITH CHECK (true);

-- Create index for efficient leaderboard queries
CREATE INDEX IF NOT EXISTS high_scores_score_idx ON high_scores(score DESC);
