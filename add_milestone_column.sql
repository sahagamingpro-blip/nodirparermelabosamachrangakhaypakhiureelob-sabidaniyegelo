-- Add milestone column to orders table if it doesn't exist
-- Run this script in your MySQL database

-- Check if milestone column exists, if not add it
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS milestone TEXT 
COMMENT 'Project milestone updates and progress notes';

-- Verify the column was added
DESCRIBE orders;
