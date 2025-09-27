-- Add download_file column to orders table
-- Run this in your phpMyAdmin SQL tab

ALTER TABLE orders ADD COLUMN download_file VARCHAR(500) NULL DEFAULT NULL COMMENT 'Download link for completed orders';

-- Add index for better performance
ALTER TABLE orders ADD INDEX idx_download_file (download_file);

-- Update existing completed orders to have NULL download_file (optional)
-- UPDATE orders SET download_file = NULL WHERE status = 'completed' AND download_file IS NULL;
