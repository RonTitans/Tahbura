-- Manual Database Setup for Hebrew Inspection Tracker
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/yqairdihpyxcvsafmxsc/sql/new

-- First, run the schema
\i F:\ClaudeCode\work\inspection-tracker\database\schema-updated.sql

-- Then, run the seed data
\i F:\ClaudeCode\work\inspection-tracker\database\seed-hebrew-data.sql

-- Verification queries
SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';
SELECT COUNT(*) as inspection_count FROM inspections;
SELECT name_hebrew FROM buildings LIMIT 5;