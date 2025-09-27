-- Fix Orders Table Schema - Make Optional Fields Nullable
-- Run this in your MySQL database to fix the order submission error

-- Make optional fields nullable in orders table
ALTER TABLE orders MODIFY COLUMN company VARCHAR(255) NULL;
ALTER TABLE orders MODIFY COLUMN telegram_id VARCHAR(100) NULL;
ALTER TABLE orders MODIFY COLUMN whatsapp_number VARCHAR(20) NULL;
ALTER TABLE orders MODIFY COLUMN additional_requirements TEXT NULL;
ALTER TABLE orders MODIFY COLUMN game_logo VARCHAR(500) NULL;
ALTER TABLE orders MODIFY COLUMN transaction_screenshot VARCHAR(500) NULL;

-- Set default values for required fields that might be missing
ALTER TABLE orders MODIFY COLUMN game_type VARCHAR(100) NOT NULL DEFAULT 'YONO SLOT';
ALTER TABLE orders MODIFY COLUMN target_platform VARCHAR(100) NOT NULL DEFAULT 'Web & Mobile';
ALTER TABLE orders MODIFY COLUMN budget VARCHAR(50) NOT NULL DEFAULT '1,30,000 INR';
ALTER TABLE orders MODIFY COLUMN timeline VARCHAR(50) NOT NULL DEFAULT '30-45 days';

-- Verify the changes
DESCRIBE orders;
