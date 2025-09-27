-- Create website_settings table if not exists
-- Run this in your phpMyAdmin SQL tab

CREATE TABLE IF NOT EXISTS website_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('text', 'number', 'url', 'image', 'boolean') DEFAULT 'text',
    description TEXT,
    category VARCHAR(100) DEFAULT 'General',
    is_public BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key),
    INDEX idx_category (category),
    INDEX idx_is_public (is_public)
);

-- Insert default USDT settings
INSERT INTO website_settings (setting_key, setting_value, setting_type, description, category, is_public) VALUES 
('usdt_address', 'TRC20_USDT_ADDRESS_HERE', 'text', 'USDT TRC20 wallet address for payments', 'Payment', TRUE),
('usdt_qr_code_path', '/assets/usdt_qr.png', 'image', 'Path to the USDT QR code image', 'Payment', TRUE),
('game_price_inr', '130000', 'number', 'Price of the game in INR', 'Game', TRUE),
('usdt_rate_inr', '89', 'number', 'USDT to INR conversion rate', 'Payment', TRUE)
ON DUPLICATE KEY UPDATE 
setting_value = VALUES(setting_value), 
setting_type = VALUES(setting_type), 
description = VALUES(description), 
category = VALUES(category), 
is_public = VALUES(is_public);
