-- Fix database issues for admin panel
-- Run this in your phpMyAdmin SQL tab

-- 1. Fix orders table status column (make it larger)
ALTER TABLE orders MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending';

-- 2. Fix captcha_sessions table - add missing session_id column
ALTER TABLE captcha_sessions ADD COLUMN IF NOT EXISTS session_id VARCHAR(255) NOT NULL DEFAULT '';

-- 3. Update existing captcha_sessions records to have session_id
UPDATE captcha_sessions SET session_id = CONCAT('session_', id) WHERE session_id = '';

-- 4. Make session_id unique
ALTER TABLE captcha_sessions ADD UNIQUE KEY unique_session_id (session_id);

-- 5. Add missing columns to orders table for better admin management
ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- 6. Add indexes for better performance
ALTER TABLE orders ADD INDEX IF NOT EXISTS idx_status (status);
ALTER TABLE orders ADD INDEX IF NOT EXISTS idx_user_id (user_id);
ALTER TABLE orders ADD INDEX IF NOT EXISTS idx_created_at (created_at);

-- 7. Fix any existing orders with invalid status
UPDATE orders SET status = 'pending' WHERE status NOT IN ('pending', 'processing', 'completed', 'cancelled');

-- 8. Add admin panel specific settings
INSERT INTO website_settings (setting_key, setting_value, setting_type, description, category, is_public) VALUES 
('admin_panel_title', 'A2Z Gaming Admin Panel', 'text', 'Title for the admin panel', 'Admin', FALSE),
('admin_panel_logo', 'A2Z Admin', 'text', 'Logo text for admin panel', 'Admin', FALSE),
('items_per_page', '10', 'number', 'Number of items per page in admin tables', 'Admin', FALSE)
ON DUPLICATE KEY UPDATE 
setting_value = VALUES(setting_value), setting_type = VALUES(setting_type), description = VALUES(description), category = VALUES(category), is_public = VALUES(is_public);
