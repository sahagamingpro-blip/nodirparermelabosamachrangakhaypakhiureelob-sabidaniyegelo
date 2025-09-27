-- A2Z Game Developer - MySQL Database Schema
-- Database: sahawebtech_yono_developer
-- Host: 103.124.172.12

-- Set timezone to IST (Indian Standard Time)
SET time_zone = '+05:30';

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);

-- Create sessions table for express-session
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
    expires INT(11) UNSIGNED NOT NULL,
    data MEDIUMTEXT COLLATE utf8mb4_bin,
    PRIMARY KEY (session_id)
);

-- Create orders table for complete order management
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id INT NOT NULL,
    -- Contact Information
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    -- Requirements
    game_type VARCHAR(100) NOT NULL,
    target_platform VARCHAR(100) NOT NULL,
    budget VARCHAR(50) NOT NULL,
    timeline VARCHAR(50) NOT NULL,
    -- Game Details
    game_name VARCHAR(255) NOT NULL,
    game_logo VARCHAR(500),
    game_support_email VARCHAR(255) NOT NULL,
    telegram_id VARCHAR(100) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    additional_requirements TEXT,
    -- Order Status
    status ENUM('pending', 'payment_verified', 'in_development', 'testing', 'completed', 'cancelled') DEFAULT 'pending',
    milestone TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    usdt_amount DECIMAL(10, 4) NOT NULL,
    -- Payment Information
    transaction_id VARCHAR(255),
    transaction_screenshot VARCHAR(500),
    terms_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) COMMENT='Game development orders with complete form data and IST timezone';

-- Create captcha_sessions table for captcha verification
CREATE TABLE IF NOT EXISTS captcha_sessions (
    id VARCHAR(36) PRIMARY KEY,
    captcha_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    INDEX idx_expires (expires_at)
) COMMENT='Captcha sessions with IST timezone';

-- Insert sample admin user (optional)
-- Password: admin123 (hashed)
INSERT IGNORE INTO users (username, password, full_name, email, phone, date_of_birth) 
VALUES (
    'admin',
    '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQj',
    'Admin User',
    'admin@a2z.dog',
    '+919800100100',
    '01-01-1990'
);

-- Clean up expired captcha sessions (run this periodically)
-- DELETE FROM captcha_sessions WHERE expires_at < NOW() OR used = TRUE;
