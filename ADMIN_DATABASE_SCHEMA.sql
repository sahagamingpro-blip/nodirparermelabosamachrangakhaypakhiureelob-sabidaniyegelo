-- =====================================================
-- Admin Panel Database Schema
-- =====================================================

-- Set timezone to IST (Indian Standard Time)
SET time_zone = '+05:30';

-- =====================================================
-- 1. ADMIN USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- =====================================================
-- 2. ADMIN SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_sessions (
    session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
    expires INT(11) UNSIGNED NOT NULL,
    data MEDIUMTEXT COLLATE utf8mb4_bin,
    PRIMARY KEY (session_id)
);

-- =====================================================
-- 3. WEBSITE SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS website_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type ENUM('text', 'number', 'boolean', 'json', 'image') DEFAULT 'text',
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_key (setting_key)
);

-- =====================================================
-- 4. INSERT DEFAULT ADMIN USER
-- =====================================================
-- Default admin credentials: admin / admin123
-- Password is hashed using MD5: admin123 = 0192023a7bbd73250516f069df18b500
INSERT INTO admin_users (username, password, full_name, email, role) VALUES 
('admin', '0192023a7bbd73250516f069df18b500', 'System Administrator', 'admin@a2z.dog', 'super_admin')
ON DUPLICATE KEY UPDATE 
password = VALUES(password);

-- =====================================================
-- 5. INSERT DEFAULT WEBSITE SETTINGS
-- =====================================================
INSERT INTO website_settings (setting_key, setting_value, setting_type, description, category, is_public) VALUES 
-- General Settings
('site_title', 'A2Z Game Developer', 'text', 'Website title', 'general', TRUE),
('site_slogan', 'Professional Game Development Services', 'text', 'Website slogan/tagline', 'general', TRUE),
('site_logo', '/assets/logo.png', 'image', 'Website logo path', 'general', TRUE),
('contact_email', 'contact@a2z.dog', 'text', 'Contact email address', 'general', TRUE),
('telegram_link', 'https://t.me/a2zgamedev', 'text', 'Telegram channel link', 'general', TRUE),

-- Game Settings
('game_name', 'YONO SLOT', 'text', 'Main game product name', 'game', TRUE),
('game_price_inr', '130000', 'number', 'Game price in INR', 'game', TRUE),
('game_description', 'Complete casino slot game package with full source code', 'text', 'Game description', 'game', TRUE),

-- Payment Settings
('usdt_rate_inr', '89', 'number', 'USDT to INR conversion rate', 'payment', FALSE),
('usdt_address', 'TRC20_USDT_ADDRESS_HERE', 'text', 'USDT TRC20 wallet address', 'payment', FALSE),
('usdt_qr_code', '/assets/usdt_qr.png', 'image', 'USDT QR code image path', 'payment', FALSE),

-- Admin Settings
('admin_panel_title', 'A2Z Admin Panel', 'text', 'Admin panel title', 'admin', FALSE),
('items_per_page', '10', 'number', 'Items per page in admin lists', 'admin', FALSE),
('session_timeout', '3600', 'number', 'Admin session timeout in seconds', 'admin', FALSE)

ON DUPLICATE KEY UPDATE 
setting_value = VALUES(setting_value),
updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- 6. VERIFICATION QUERIES
-- =====================================================
-- Check admin_users table structure
-- DESCRIBE admin_users;

-- Check website_settings table structure  
-- DESCRIBE website_settings;

-- Check admin sessions table structure
-- DESCRIBE admin_sessions;

-- View default admin user
-- SELECT id, username, full_name, email, role, is_active, created_at FROM admin_users WHERE username = 'admin';

-- View all website settings
-- SELECT setting_key, setting_value, setting_type, category FROM website_settings ORDER BY category, setting_key;

-- =====================================================
-- 7. SAMPLE QUERIES FOR TESTING
-- =====================================================
-- Update website settings
-- UPDATE website_settings SET setting_value = 'New Site Title' WHERE setting_key = 'site_title';

-- Get public settings (for frontend)
-- SELECT setting_key, setting_value, setting_type FROM website_settings WHERE is_public = TRUE;

-- Get settings by category
-- SELECT * FROM website_settings WHERE category = 'game';

-- Admin login verification
-- SELECT id, username, password, full_name, email, role, is_active FROM admin_users WHERE username = 'admin' AND is_active = TRUE;
