-- Migration: Remove category column from opinions table
-- Run this in Supabase SQL Editor to update existing database

-- Drop category index if it exists
DROP INDEX IF EXISTS idx_opinions_category;

-- Remove category column from opinions table
ALTER TABLE opinions DROP COLUMN IF EXISTS category;

-- Verify the change
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'opinions';
